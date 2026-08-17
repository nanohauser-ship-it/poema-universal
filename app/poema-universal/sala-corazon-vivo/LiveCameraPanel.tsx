"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  DIRECTOR_CHANNEL,
  type DirectorCommand,
} from "../director/director-channel";

type DeviceOption = {
  deviceId: string;
  label: string;
};

type LiveCameraPanelProps = {
  guestName?: string | null;
  guestPlace?: string | null;
  onVoiceLevel?: (level: number) => void;
  onSpeakingChange?: (speaking: boolean) => void;
};

export default function LiveCameraPanel({
  guestName,
  guestPlace,
  onVoiceLevel,
  onSpeakingChange,
}: LiveCameraPanelProps) {
  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  const audioContextRef =
    useRef<AudioContext | null>(null);

  const analyserRef =
    useRef<AnalyserNode | null>(null);

  const animationRef =
    useRef<number | null>(null);

  const speakingRef =
    useRef(false);

  const [active, setActive] =
    useState(false);

  const [micMuted, setMicMuted] =
    useState(false);

  const [cameraOff, setCameraOff] =
    useState(false);

  const [voiceLevel, setVoiceLevel] =
    useState(0);

  const [error, setError] =
    useState("");

  const [cameras, setCameras] =
    useState<DeviceOption[]>([]);

  const [microphones, setMicrophones] =
    useState<DeviceOption[]>([]);

  const [selectedCamera, setSelectedCamera] =
    useState("");

  const [selectedMicrophone, setSelectedMicrophone] =
    useState("");

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("BroadcastChannel" in window)
    ) {
      return;
    }

    const channel =
      new BroadcastChannel(
        DIRECTOR_CHANNEL,
      );

    channel.onmessage = (
      event: MessageEvent<DirectorCommand>,
    ) => {
      const command =
        event.data;

      if (
        command.type !== "CAMERA"
      ) {
        return;
      }

      if (command.active) {
        void startCamera();
      } else {
        stopStream();
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  useEffect(() => {
    return () => {
      stopStream();

      if (animationRef.current) {
        cancelAnimationFrame(
          animationRef.current,
        );
      }

      audioContextRef.current?.close();
    };
  }, []);

  async function refreshDevices() {
    if (!navigator.mediaDevices) {
      return;
    }

    const devices =
      await navigator.mediaDevices.enumerateDevices();

    const cameraList = devices
      .filter(
        (device) =>
          device.kind === "videoinput",
      )
      .map((device, index) => ({
        deviceId: device.deviceId,
        label:
          device.label ||
          `Cámara ${index + 1}`,
      }));

    const micList = devices
      .filter(
        (device) =>
          device.kind === "audioinput",
      )
      .map((device, index) => ({
        deviceId: device.deviceId,
        label:
          device.label ||
          `Micrófono ${index + 1}`,
      }));

    setCameras(cameraList);
    setMicrophones(micList);

    if (
      !selectedCamera &&
      cameraList[0]
    ) {
      setSelectedCamera(
        cameraList[0].deviceId,
      );
    }

    if (
      !selectedMicrophone &&
      micList[0]
    ) {
      setSelectedMicrophone(
        micList[0].deviceId,
      );
    }
  }

  function stopStream() {
    streamRef.current
      ?.getTracks()
      .forEach((track) =>
        track.stop(),
      );

    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setActive(false);
  }

  async function startCamera() {
    setError("");

    if (
      !navigator.mediaDevices
        ?.getUserMedia
    ) {
      setError(
        "Este navegador no permite acceder a cámara y micrófono.",
      );
      return;
    }

    stopStream();

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: selectedCamera
              ? {
                  deviceId: {
                    exact:
                      selectedCamera,
                  },
                  width: {
                    ideal: 1280,
                  },
                  height: {
                    ideal: 720,
                  },
                }
              : {
                  width: {
                    ideal: 1280,
                  },
                  height: {
                    ideal: 720,
                  },
                },

            audio:
              selectedMicrophone
                ? {
                    deviceId: {
                      exact:
                        selectedMicrophone,
                    },
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                  }
                : {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                  },
          },
        );

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject =
          stream;

        await videoRef.current.play();
      }

      setActive(true);
      setMicMuted(false);
      setCameraOff(false);

      await refreshDevices();

      startVoiceMeter(stream);
    } catch (err) {
      console.error(err);

      setError(
        "No se pudo activar la cámara o el micrófono. Comprueba los permisos del navegador.",
      );
    }
  }

  function toggleMic() {
    const stream =
      streamRef.current;

    if (!stream) return;

    const next = !micMuted;

    stream
      .getAudioTracks()
      .forEach((track) => {
        track.enabled = !next;
      });

    setMicMuted(next);
  }

  function toggleCamera() {
    const stream =
      streamRef.current;

    if (!stream) return;

    const next =
      !cameraOff;

    stream
      .getVideoTracks()
      .forEach((track) => {
        track.enabled = !next;
      });

    setCameraOff(next);
  }

  async function changeCamera(
    deviceId: string,
  ) {
    setSelectedCamera(deviceId);

    if (!active) return;

    await restartWithDevices(
      deviceId,
      selectedMicrophone,
    );
  }

  async function changeMicrophone(
    deviceId: string,
  ) {
    setSelectedMicrophone(
      deviceId,
    );

    if (!active) return;

    await restartWithDevices(
      selectedCamera,
      deviceId,
    );
  }

  async function restartWithDevices(
    cameraId: string,
    microphoneId: string,
  ) {
    stopStream();

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: cameraId
              ? {
                  deviceId: {
                    exact: cameraId,
                  },
                  width: {
                    ideal: 1280,
                  },
                  height: {
                    ideal: 720,
                  },
                }
              : true,

            audio: microphoneId
              ? {
                  deviceId: {
                    exact:
                      microphoneId,
                  },
                  echoCancellation: true,
                  noiseSuppression: true,
                  autoGainControl: true,
                }
              : true,
          },
        );

      streamRef.current =
        stream;

      if (videoRef.current) {
        videoRef.current.srcObject =
          stream;

        await videoRef.current.play();
      }

      setActive(true);
      setMicMuted(false);
      setCameraOff(false);

      startVoiceMeter(stream);
    } catch (err) {
      console.error(err);

      setError(
        "No se pudo cambiar de dispositivo.",
      );
    }
  }

  function startVoiceMeter(
    stream: MediaStream,
  ) {
    if (animationRef.current) {
      cancelAnimationFrame(
        animationRef.current,
      );
    }

    audioContextRef.current?.close();

    const AudioContextClass =
      window.AudioContext ||
      (
        window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }
      ).webkitAudioContext;

    if (!AudioContextClass) {
      return;
    }

    const audioContext =
      new AudioContextClass();

    const source =
      audioContext.createMediaStreamSource(
        stream,
      );

    const analyser =
      audioContext.createAnalyser();

    analyser.fftSize = 512;
    analyser.smoothingTimeConstant =
      0.82;

    source.connect(analyser);

    audioContextRef.current =
      audioContext;

    analyserRef.current =
      analyser;

    const data =
      new Uint8Array(
        analyser.frequencyBinCount,
      );

    const tick = () => {
      analyser.getByteFrequencyData(
        data,
      );

      let sum = 0;

      for (
        let i = 0;
        i < data.length;
        i += 1
      ) {
        sum += data[i];
      }

      const average =
        sum / data.length;

      const normalized =
        Math.min(
          1,
          average / 85,
        );

      setVoiceLevel(normalized);

      onVoiceLevel?.(
        normalized,
      );

      let nextSpeaking =
        speakingRef.current;

      if (normalized >= 0.14) {
        nextSpeaking = true;
      } else if (normalized <= 0.07) {
        nextSpeaking = false;
      }

      if (
        nextSpeaking !==
        speakingRef.current
      ) {
        speakingRef.current =
          nextSpeaking;

        onSpeakingChange?.(
          nextSpeaking,
        );
      }

      animationRef.current =
        requestAnimationFrame(tick);
    };

    tick();
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "360px",
        borderRadius: "18px",
        overflow: "hidden",
        border:
          "1px solid rgba(225,185,106,.17)",
        background:
          "radial-gradient(circle at 45% 35%,rgba(180,120,48,.16),transparent 17rem),#080705",
      }}
    >
      <video
        ref={videoRef}
        muted
        playsInline
        autoPlay
        style={{
          width: "100%",
          height: "100%",
          minHeight: "360px",
          objectFit: "cover",
          display: active
            ? "block"
            : "none",
          transform:
            "scaleX(-1)",
        }}
      />

      {!active && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            background: "#000",
          }}
        >
          <video
            src="/poema-universal/sala-corazon-vivo/estudio-reposo.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center center",
              transform: "scale(1.01)",
              transformOrigin: "center",
              filter:
                "brightness(1.32) contrast(0.98) saturate(1.08)",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,.12), rgba(0,0,0,.22))",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform:
                  "translateX(-50%)",
                display: "grid",
                justifyItems: "center",
                gap: "8px",
                pointerEvents: "auto",
              }}
            >
              <span
                style={{
                  fontSize: "8px",
                  letterSpacing: ".18em",
                  color:
                    "rgba(235,220,185,.58)",
                }}
              >
                ESTUDIO EN REPOSO
              </span>

              <button
                type="button"
                onClick={startCamera}
                style={primaryButton}
              >
                Activar cámara + micro
              </button>

              {error && (
                <p
                  style={{
                    maxWidth: "320px",
                    margin: 0,
                    textAlign: "center",
                    color: "#c87968",
                    fontSize: "10px",
                  }}
                >
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {active && (
        <>
          <div
            style={{
              position: "absolute",
              left: "14px",
              top: "14px",
              display: "flex",
              gap: "7px",
              alignItems: "center",
              padding: "7px 9px",
              borderRadius: "999px",
              background:
                "rgba(5,5,4,.68)",
              backdropFilter:
                "blur(12px)",
              color: "#d8b36b",
              fontSize: "9px",
              letterSpacing: ".14em",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background:
                  micMuted
                    ? "#765d3a"
                    : "#c85d48",
                boxShadow:
                  micMuted
                    ? "none"
                    : "0 0 12px rgba(200,93,72,.65)",
              }}
            />

            EN VIVO
          </div>

          <div
            style={{
              position: "absolute",
              left: "14px",
              bottom: "14px",
              display: "flex",
              gap: "7px",
              alignItems: "center",
              padding: "9px",
              borderRadius: "12px",
              background:
                "rgba(5,5,4,.74)",
              backdropFilter:
                "blur(14px)",
            }}
          >
            <button
              type="button"
              onClick={toggleMic}
              style={smallButton}
            >
              {micMuted
                ? "Activar micro"
                : "Silenciar"}
            </button>

            <button
              type="button"
              onClick={toggleCamera}
              style={smallButton}
            >
              {cameraOff
                ? "Activar cámara"
                : "Apagar cámara"}
            </button>

            <button
              type="button"
              onClick={stopStream}
              style={{
                ...smallButton,
                color: "#c87b68",
              }}
            >
              Salir
            </button>
          </div>

          <div
            style={{
              position: "absolute",
              right: "14px",
              bottom: "14px",
              width: "190px",
              padding: "12px 13px",
              borderRadius: "12px",
              border:
                "1px solid rgba(220,178,95,.18)",
              background:
                "rgba(5,5,4,.82)",
              backdropFilter:
                "blur(14px)",
              boxShadow:
                "0 12px 30px rgba(0,0,0,.25)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                marginBottom: "9px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: micMuted
                      ? "rgba(235,220,185,.25)"
                      : voiceLevel > 0.12
                        ? "#e0b45c"
                        : "#8b7140",
                    boxShadow:
                      !micMuted &&
                      voiceLevel > 0.12
                        ? "0 0 12px rgba(224,180,92,.65)"
                        : "none",
                  }}
                />

                <span
                  style={{
                    fontSize: "8px",
                    color: "#c89d4d",
                    letterSpacing: ".16em",
                  }}
                >
                  VOZ EN DIRECTO
                </span>
              </div>

              <strong
                style={{
                  color: "#e9dec9",
                  fontFamily:
                    "Georgia, serif",
                  fontSize: "11px",
                  fontWeight: 400,
                }}
              >
                {micMuted
                  ? "—"
                  : `${Math.round(
                      voiceLevel * 100,
                    )}%`}
              </strong>
            </div>

            <div
              style={{
                position: "relative",
                height: "7px",
                overflow: "hidden",
                borderRadius: "999px",
                background:
                  "rgba(255,255,255,.07)",
                boxShadow:
                  "inset 0 0 0 1px rgba(255,255,255,.025)",
              }}
            >
              <div
                style={{
                  width: micMuted
                    ? "0%"
                    : `${Math.max(
                        2,
                        voiceLevel * 100,
                      )}%`,
                  height: "100%",
                  borderRadius: "inherit",
                  background:
                    voiceLevel > 0.65
                      ? "#f1c768"
                      : "#c89d4d",
                  boxShadow:
                    voiceLevel > 0.18
                      ? "0 0 12px rgba(216,179,107,.45)"
                      : "none",
                  transition:
                    "width 70ms linear",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                gap: "8px",
                marginTop: "8px",
              }}
            >
              <span
                style={{
                  color:
                    "rgba(235,220,185,.38)",
                  fontSize: "8px",
                  letterSpacing: ".08em",
                }}
              >
                {micMuted
                  ? "MICRÓFONO SILENCIADO"
                  : voiceLevel > 0.12
                    ? "ESCUCHANDO TU VOZ"
                    : "ESCUCHANDO"}
              </span>

              {!micMuted &&
                voiceLevel > 0.12 && (
                  <span
                    style={{
                      color: "#d8b36b",
                      fontSize: "8px",
                    }}
                  >
                    ●
                  </span>
                )}
            </div>
          </div>

          {guestName && (
            <div
              style={{
                position: "absolute",
                right: "14px",
                top: "14px",
                padding:
                  "10px 12px",
                borderRadius: "12px",
                border:
                  "1px solid rgba(220,178,95,.24)",
                background:
                  "rgba(5,5,4,.74)",
                color: "#e4d8c3",
                backdropFilter:
                  "blur(14px)",
              }}
            >
              <div
                style={{
                  color: "#b99445",
                  fontSize: "8px",
                  letterSpacing:
                    ".16em",
                }}
              >
                DIÁLOGO
              </div>

              <strong
                style={{
                  display: "block",
                  marginTop: "3px",
                  fontFamily:
                    "Georgia,serif",
                  fontSize: "12px",
                  fontWeight: 400,
                }}
              >
                {guestName}
              </strong>

              <small
                style={{
                  color:
                    "rgba(235,220,185,.45)",
                }}
              >
                {guestPlace}
              </small>
            </div>
          )}
        </>
      )}

      <div
        style={{
          position: "absolute",
          right: "14px",
          top: active
            ? "54px"
            : "14px",
          display: "grid",
          gap: "5px",
          width: "180px",
          opacity: active
            ? 1
            : 0,
          pointerEvents:
            active
              ? "auto"
              : "none",
        }}
      >
        {cameras.length > 1 && (
          <select
            value={selectedCamera}
            onChange={(event) =>
              changeCamera(
                event.target.value,
              )
            }
            style={selectStyle}
          >
            {cameras.map(
              (device) => (
                <option
                  key={
                    device.deviceId
                  }
                  value={
                    device.deviceId
                  }
                >
                  {device.label}
                </option>
              ),
            )}
          </select>
        )}

        {microphones.length >
          1 && (
          <select
            value={
              selectedMicrophone
            }
            onChange={(event) =>
              changeMicrophone(
                event.target.value,
              )
            }
            style={selectStyle}
          >
            {microphones.map(
              (device) => (
                <option
                  key={
                    device.deviceId
                  }
                  value={
                    device.deviceId
                  }
                >
                  {device.label}
                </option>
              ),
            )}
          </select>
        )}
      </div>
    </div>
  );
}

const primaryButton = {
  marginTop: "6px",
  border:
    "1px solid rgba(220,178,95,.38)",
  borderRadius: "10px",
  background: "#d8b36b",
  color: "#181208",
  padding: "10px 15px",
  cursor: "pointer",
  fontSize: "10px",
};

const smallButton = {
  border:
    "1px solid rgba(220,178,95,.2)",
  borderRadius: "8px",
  background:
    "rgba(216,179,107,.04)",
  color:
    "rgba(235,220,185,.72)",
  padding: "7px 9px",
  cursor: "pointer",
  fontSize: "9px",
};

const selectStyle = {
  width: "100%",
  border:
    "1px solid rgba(220,178,95,.18)",
  borderRadius: "7px",
  background:
    "rgba(5,5,4,.8)",
  color:
    "rgba(235,220,185,.72)",
  padding: "7px",
  fontSize: "9px",
};
