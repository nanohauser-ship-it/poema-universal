"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import styles from "./ReadingRecorder.module.css";

function formatTime(seconds: number) {
  const minutes =
    Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");

  const secs =
    Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");

  return `${minutes}:${secs}`;
}

export default function ReadingRecorder() {
  const [recording, setRecording] =
    useState(false);

  const [elapsed, setElapsed] =
    useState(0);

  const [videoUrl, setVideoUrl] =
    useState("");

  const [error, setError] =
    useState("");

  const [micStatus, setMicStatus] =
    useState("");

  const recorderRef =
    useRef<MediaRecorder | null>(
      null,
    );

  const displayStreamRef =
    useRef<MediaStream | null>(
      null,
    );

  const micStreamRef =
    useRef<MediaStream | null>(
      null,
    );

  const chunksRef =
    useRef<Blob[]>([]);

  const timerRef =
    useRef<
      ReturnType<typeof setInterval>
      | null
    >(null);

  const startedAtRef =
    useRef(0);

  function clearTimer() {
    if (timerRef.current) {
      clearInterval(
        timerRef.current,
      );

      timerRef.current = null;
    }
  }

  function stopStreams() {
    displayStreamRef.current
      ?.getTracks()
      .forEach(
        (track) => track.stop(),
      );

    micStreamRef.current
      ?.getTracks()
      .forEach(
        (track) => track.stop(),
      );

    displayStreamRef.current =
      null;

    micStreamRef.current =
      null;
  }

  function discard() {
    if (videoUrl) {
      URL.revokeObjectURL(
        videoUrl,
      );
    }

    setVideoUrl("");
    setElapsed(0);
    setMicStatus("");
  }

  async function startRecording() {
    setError("");
    setMicStatus("");

    if (
      !navigator.mediaDevices
        ?.getUserMedia ||
      !navigator.mediaDevices
        ?.getDisplayMedia ||
      !("MediaRecorder" in window)
    ) {
      setError(
        "Este navegador no permite realizar esta grabación.",
      );

      return;
    }

    try {
      discard();

      /*
       * 1 · MICRO DIRECTO
       *
       * Sin AudioContext.
       * Sin mezclador.
       * La pista física del micro
       * entra directamente en
       * MediaRecorder.
       */
      const microphone =
        await navigator.mediaDevices
          .getUserMedia({
            video: false,

            audio: {
              echoCancellation:
                true,

              noiseSuppression:
                true,

              autoGainControl:
                true,
            },
          });

      micStreamRef.current =
        microphone;

      const micTrack =
        microphone
          .getAudioTracks()[0];

      if (!micTrack) {
        throw new Error(
          "No existe pista de micrófono",
        );
      }

      micTrack.enabled = true;

      console.info(
        "[CORAZÓN VIVO · MICRO]",
        {
          label:
            micTrack.label,

          enabled:
            micTrack.enabled,

          muted:
            micTrack.muted,

          readyState:
            micTrack.readyState,

          settings:
            micTrack.getSettings(),
        },
      );

      setMicStatus(
        micTrack.muted
          ? "MICRÓFONO EN ESPERA"
          : "MICRÓFONO ACTIVO",
      );

      /*
       * 2 · CAPTURA VISUAL
       */
      const display =
        await navigator.mediaDevices
          .getDisplayMedia({
            video: {
              frameRate: {
                ideal: 30,
                max: 30,
              },
            },

            /*
             * De momento no pedimos
             * audio de pestaña.
             *
             * Primero garantizamos
             * que la voz funcione.
             */
            audio: false,

            preferCurrentTab:
              true,

            selfBrowserSurface:
              "include",
          } as DisplayMediaStreamOptions);

      displayStreamRef.current =
        display;

      /*
       * 3 · STREAM FINAL
       *
       * vídeo = pestaña
       * audio = micrófono real
       */
      const finalStream =
        new MediaStream();

      display
        .getVideoTracks()
        .forEach(
          (track) => {
            finalStream.addTrack(
              track,
            );
          },
        );

      finalStream.addTrack(
        micTrack,
      );

      console.info(
        "[CORAZÓN VIVO · STREAM FINAL]",
        {
          video:
            finalStream
              .getVideoTracks()
              .length,

          audio:
            finalStream
              .getAudioTracks()
              .length,

          audioTrack:
            finalStream
              .getAudioTracks()[0]
              ?.label,
        },
      );

      /*
       * 4 · RECORDER
       */
      const candidates = [
        "video/webm;codecs=vp8,opus",
        "video/webm;codecs=vp9,opus",
        "video/webm",
      ];

      const mimeType =
        candidates.find(
          (type) =>
            MediaRecorder
              .isTypeSupported(
                type,
              ),
        );

      const recorder =
        new MediaRecorder(
          finalStream,

          mimeType
            ? {
                mimeType,

                videoBitsPerSecond:
                  4_500_000,

                audioBitsPerSecond:
                  192_000,
              }
            : undefined,
        );

      recorderRef.current =
        recorder;

      chunksRef.current =
        [];

      recorder.ondataavailable =
        (event) => {
          if (
            event.data &&
            event.data.size > 0
          ) {
            chunksRef.current.push(
              event.data,
            );
          }
        };

      recorder.onerror =
        (event) => {
          console.error(
            "[CORAZÓN VIVO · MEDIARECORDER]",
            event,
          );
        };

      recorder.onstop = () => {
        clearTimer();

        const blob =
          new Blob(
            chunksRef.current,
            {
              type:
                recorder.mimeType ||
                "video/webm",
            },
          );

        console.info(
          "[CORAZÓN VIVO · RESULTADO]",
          {
            bytes:
              blob.size,

            mimeType:
              blob.type,
          },
        );

        if (
          blob.size > 0
        ) {
          setVideoUrl(
            URL.createObjectURL(
              blob,
            ),
          );
        }

        setRecording(false);
        setMicStatus("");

        stopStreams();
      };

      const screenTrack =
        display
          .getVideoTracks()[0];

      if (screenTrack) {
        screenTrack.onended =
          () => {
            if (
              recorder.state !==
              "inactive"
            ) {
              recorder.stop();
            }
          };
      }

      recorder.start(500);

      startedAtRef.current =
        Date.now();

      setElapsed(0);
      setRecording(true);

      timerRef.current =
        setInterval(
          () => {
            setElapsed(
              Math.floor(
                (
                  Date.now() -
                  startedAtRef.current
                ) / 1000,
              ),
            );
          },
          250,
        );
    } catch (reason) {
      console.error(
        "[CORAZÓN VIVO · GRABACIÓN]",
        reason,
      );

      clearTimer();
      stopStreams();

      setRecording(false);
      setMicStatus("");

      setError(
        "No fue posible iniciar la grabación. Comprueba que Chrome tenga permiso para usar el micrófono.",
      );
    }
  }

  function stopRecording() {
    const recorder =
      recorderRef.current;

    if (
      recorder &&
      recorder.state !==
        "inactive"
    ) {
      recorder.stop();
      return;
    }

    clearTimer();
    stopStreams();

    setRecording(false);
    setMicStatus("");
  }

  useEffect(() => {
    return () => {
      clearTimer();
      stopStreams();
    };
  }, []);

  return (
    <section
      className={
        styles.recorder
      }
      data-recording={
        recording
      }
    >
      <button
        type="button"
        className={
          styles.recordButton
        }
        onClick={
          recording
            ? stopRecording
            : startRecording
        }
      >
        <span
          className={
            styles.circle
          }
        >
          <i />
        </span>

        <strong>
          {recording
            ? "TERMINAR LECTURA"
            : "GRABAR LECTURA"}
        </strong>
      </button>

      <p
        className={
          styles.caption
        }
      >
        {recording
          ? `${formatTime(
              elapsed,
            )} · ${micStatus}`
          : "Tu voz y aquello que la acompaña quedarán juntos."}
      </p>

      {videoUrl &&
        !recording && (
          <div
            className={
              styles.result
            }
          >
            <div
              className={
                styles.resultHeader
              }
            >
              <span>
                LECTURA TERMINADA
              </span>

              <strong>
                {formatTime(
                  elapsed,
                )}
              </strong>
            </div>

            <video
              src={videoUrl}
              controls
              playsInline
              preload="metadata"
            />

            <div
              className={
                styles.actions
              }
            >
              <a
                href={videoUrl}
                download="poema-universal-lectura.webm"
              >
                Guardar vídeo
              </a>

              <button
                type="button"
                onClick={
                  discard
                }
              >
                Descartar
              </button>
            </div>
          </div>
        )}

      {error && (
        <p
          className={
            styles.error
          }
        >
          {error}
        </p>
      )}
    </section>
  );
}
