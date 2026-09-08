"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

type Track = {
  id: string;
  name: string;
  url: string;
};

type BsoPlayerProps = {
  sceneTitle: string;
  sceneIndex: number;
  voiceActive?: boolean;
  onLifeEvent?: (message: string) => void;
};

function cleanName(name: string) {
  return name
    .replace(/\.[^/.]+$/, "")
    .replace(/^\d+[\s._-]*/, "")
    .replace(/[_-]+/g, " ")
    .trim();
}

export default function BsoPlayer({
  sceneTitle,
  sceneIndex,
  voiceActive = false,
  onLifeEvent,
}: BsoPlayerProps) {
  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  const fadeRef =
    useRef<number | null>(null);

  const urlsRef =
    useRef<string[]>([]);

  const pendingPlayRef =
    useRef(false);

  const voiceRestoreTimerRef =
    useRef<number | null>(null);

  const voiceDuckedRef =
    useRef(false);

  const [tracks, setTracks] =
    useState<Track[]>([]);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [playing, setPlaying] =
    useState(false);

  const [volume, setVolume] =
    useState(0.56);

  const [restoreVolume, setRestoreVolume] =
    useState(0.56);

  const [autoSync, setAutoSync] =
    useState(true);

  const [autoVoiceDuck, setAutoVoiceDuck] =
    useState(true);

  const [assignments, setAssignments] =
    useState<Record<string, number>>({});

  const currentTrack =
    tracks[currentIndex] ?? null;

  const assignedIndex =
    assignments[sceneTitle];

  useEffect(() => {
    return () => {
      urlsRef.current.forEach((url) =>
        URL.revokeObjectURL(url),
      );

      if (fadeRef.current) {
        cancelAnimationFrame(
          fadeRef.current,
        );
      }

      if (
        voiceRestoreTimerRef.current
      ) {
        window.clearTimeout(
          voiceRestoreTimerRef.current,
        );
      }
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !currentTrack) {
      return;
    }

    audio.src = currentTrack.url;
    audio.load();

    if (pendingPlayRef.current) {
      pendingPlayRef.current = false;

      window.setTimeout(async () => {
        try {
          audio.volume = Math.max(0, Math.min(1, 0));

          await audio.play();

          setPlaying(true);

          fadeTo(volume, 1000);
        } catch {
          setPlaying(false);
        }
      }, 80);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (
      !autoSync ||
      tracks.length === 0
    ) {
      return;
    }

    const target =
      assignments[sceneTitle] ??
      Math.min(
        sceneIndex,
        tracks.length - 1,
      );

    if (
      target >= 0 &&
      target < tracks.length &&
      target !== currentIndex
    ) {
      changeTrackAlive(
        target,
        `La escena «${sceneTitle}» ha llamado a su música.`,
      );
    }
  }, [
    sceneTitle,
    sceneIndex,
    autoSync,
    tracks.length,
    assignments,
  ]);

  useEffect(() => {
    if (!autoVoiceDuck) {
      return;
    }

    const audio =
      audioRef.current;

    if (
      !audio ||
      !currentTrack ||
      !playing
    ) {
      return;
    }

    if (
      voiceRestoreTimerRef.current
    ) {
      window.clearTimeout(
        voiceRestoreTimerRef.current,
      );

      voiceRestoreTimerRef.current =
        null;
    }

    if (voiceActive) {
      if (!voiceDuckedRef.current) {
        if (audio.volume > 0.24) {
          setRestoreVolume(
            audio.volume,
          );
        }

        voiceDuckedRef.current =
          true;

        fadeTo(0.18, 480);

        onLifeEvent?.(
          "La BSO baja para escuchar la voz.",
        );
      }

      return;
    }

    if (voiceDuckedRef.current) {
      voiceRestoreTimerRef.current =
        window.setTimeout(() => {
          voiceDuckedRef.current =
            false;

          fadeTo(
            restoreVolume || volume,
            1100,
          );

          onLifeEvent?.(
            "La música vuelve después del silencio.",
          );
        }, 1800);
    }

    return () => {
      if (
        voiceRestoreTimerRef.current
      ) {
        window.clearTimeout(
          voiceRestoreTimerRef.current,
        );

        voiceRestoreTimerRef.current =
          null;
      }
    };
  }, [
    voiceActive,
    autoVoiceDuck,
    playing,
    currentTrack?.id,
  ]);


  function loadTracks(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const files =
      Array.from(
        event.target.files ?? [],
      );

    if (!files.length) {
      return;
    }

    const incoming =
      files
        .filter((file) =>
          file.type.startsWith("audio/"),
        )
        .map((file, index) => {
          const url =
            URL.createObjectURL(file);

          urlsRef.current.push(url);

          return {
            id: `${Date.now()}-${index}-${file.name}`,
            name:
              cleanName(file.name) ||
              file.name,
            url,
          };
        });

    setTracks((previous) => [
      ...previous,
      ...incoming,
    ]);

    onLifeEvent?.(
      `${incoming.length} piezas han entrado en la BSO.`,
    );

    event.target.value = "";
  }

  function fadeTo(
    target: number,
    duration = 800,
    done?: () => void,
  ) {
    const audio = audioRef.current;

    if (!audio) {
      done?.();
      return;
    }

    if (fadeRef.current) {
      cancelAnimationFrame(
        fadeRef.current,
      );
    }

    const startVolume =
      audio.volume;

    const safeTarget =
      Math.max(
        0,
        Math.min(1, target),
      );

    const started =
      performance.now();

    const frame = (
      now: number,
    ) => {
      const progress =
        Math.min(
          1,
          (now - started) / duration,
        );

      const eased =
        1 -
        Math.pow(
          1 - progress,
          3,
        );

      const calculatedVolume =
        startVolume +
        (safeTarget - startVolume) *
          eased;

      audio.volume = Math.max(
        0,
        Math.min(1, calculatedVolume),
      );

      if (progress < 1) {
        fadeRef.current =
          requestAnimationFrame(frame);
      } else {
        done?.();
      }
    };

    fadeRef.current =
      requestAnimationFrame(frame);
  }

  async function togglePlay() {
    const audio =
      audioRef.current;

    if (!audio || !currentTrack) {
      return;
    }

    if (audio.paused) {
      try {
        await audio.play();
        setPlaying(true);

        onLifeEvent?.(
          `La BSO vuelve a respirar: ${currentTrack.name}.`,
        );
      } catch {
        setPlaying(false);
      }
    } else {
      audio.pause();
      setPlaying(false);

      onLifeEvent?.(
        "La BSO ha quedado en pausa.",
      );
    }
  }

  function changeTrackAlive(
    index: number,
    lifeMessage?: string,
  ) {
    if (
      index < 0 ||
      index >= tracks.length
    ) {
      return;
    }

    const audio =
      audioRef.current;

    if (!audio) {
      setCurrentIndex(index);
      return;
    }

    const wasPlaying =
      !audio.paused || playing;

    if (!wasPlaying) {
      setCurrentIndex(index);

      onLifeEvent?.(
        lifeMessage ??
          `Preparada: ${tracks[index].name}.`,
      );

      return;
    }

    fadeTo(0, 650, () => {
      pendingPlayRef.current =
        true;

      setCurrentIndex(index);

      onLifeEvent?.(
        lifeMessage ??
          `Entra ${tracks[index].name}.`,
      );
    });
  }

  function previousTrack() {
    if (!tracks.length) return;

    const next =
      currentIndex <= 0
        ? tracks.length - 1
        : currentIndex - 1;

    changeTrackAlive(
      next,
      `La BSO regresa a ${tracks[next].name}.`,
    );
  }

  function nextTrack() {
    if (!tracks.length) return;

    const next =
      currentIndex >=
      tracks.length - 1
        ? 0
        : currentIndex + 1;

    changeTrackAlive(
      next,
      `La BSO avanza hacia ${tracks[next].name}.`,
    );
  }

  function duckMusic() {
    const audio =
      audioRef.current;

    if (!audio) return;

    if (audio.volume > 0.25) {
      setRestoreVolume(
        audio.volume,
      );
    }

    fadeTo(0.18, 650);

    onLifeEvent?.(
      "La música baja para escuchar la voz.",
    );
  }

  function restoreMusicNow() {
    fadeTo(
      restoreVolume || volume,
      1000,
    );

    onLifeEvent?.(
      "La atmósfera sonora vuelve a crecer.",
    );
  }

  function silenceMusic() {
    const audio =
      audioRef.current;

    if (!audio) return;

    if (audio.volume > 0.05) {
      setRestoreVolume(
        audio.volume,
      );
    }

    fadeTo(0, 700);

    onLifeEvent?.(
      "Silencio. La sala queda suspendida.",
    );
  }

  function setMasterVolume(
    next: number,
  ) {
    setVolume(next);
    setRestoreVolume(next);

    if (audioRef.current) {
      audioRef.current.volume =
        Math.max(0, Math.min(1, next));
    }
  }

  function bindScene() {
    if (!currentTrack) return;

    setAssignments(
      (previous) => ({
        ...previous,
        [sceneTitle]:
          currentIndex,
      }),
    );

    onLifeEvent?.(
      `«${currentTrack.name}» queda vinculada a «${sceneTitle}».`,
    );
  }

  return (
    <section
      style={{
        marginTop: "12px",
        padding: "18px",
        border:
          "1px solid rgba(190,145,55,.25)",
        borderRadius: "14px",
        background:
          "linear-gradient(135deg,rgba(25,18,8,.78),rgba(5,5,4,.96))",
      }}
    >
      <audio
        ref={audioRef}
        onPlay={() =>
          setPlaying(true)
        }
        onPause={() =>
          setPlaying(false)
        }
        onEnded={nextTrack}
      />

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          gap: "18px",
          alignItems:
            "flex-start",
        }}
      >
        <div>
          <div
            style={{
              color: "#b99445",
              fontSize: "9px",
              letterSpacing: ".22em",
            }}
          >
            BSO · DIRECCIÓN SONORA
          </div>

          <div
            style={{
              marginTop: "5px",
              fontFamily:
                "Georgia,serif",
              fontSize: "17px",
              color: "#eee3cf",
            }}
          >
            Banda sonora de la sesión
          </div>

          <div
            style={{
              marginTop: "5px",
              color:
                "rgba(235,220,185,.5)",
              fontSize: "10px",
            }}
          >
            Escena {sceneIndex + 1} ·{" "}
            {sceneTitle}
          </div>
        </div>

        <label
          style={{
            border:
              "1px solid rgba(205,164,75,.45)",
            borderRadius: "8px",
            padding: "9px 12px",
            color: "#dbb969",
            cursor: "pointer",
            fontSize: "10px",
          }}
        >
          + Cargar canciones

          <input
            type="file"
            multiple
            accept="audio/*"
            onChange={loadTracks}
            style={{
              display: "none",
            }}
          />
        </label>
      </div>

      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          marginTop: "15px",
          paddingTop: "12px",
          borderTop:
            "1px solid rgba(190,145,55,.12)",
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            color:
              "rgba(235,220,185,.56)",
            fontSize: "10px",
          }}
        >
          <input
            type="checkbox"
            checked={autoSync}
            onChange={(event) =>
              setAutoSync(
                event.target.checked,
              )
            }
          />

          Sincronizar con escenas
        </label>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            color:
              "rgba(235,220,185,.56)",
            fontSize: "10px",
          }}
        >
          <input
            type="checkbox"
            checked={autoVoiceDuck}
            onChange={(event) =>
              setAutoVoiceDuck(
                event.target.checked,
              )
            }
          />

          La voz dirige la BSO
        </label>

        {assignedIndex !==
          undefined && (
          <span
            style={{
              color: "#b99445",
              fontSize: "9px",
            }}
          >
            vinculada a pista{" "}
            {assignedIndex + 1}
          </span>
        )}
      </div>

      {tracks.length === 0 ? (
        <div
          style={{
            marginTop: "14px",
            padding: "22px",
            textAlign: "center",
            border:
              "1px dashed rgba(190,145,55,.2)",
            borderRadius: "10px",
            color:
              "rgba(235,220,185,.42)",
            fontSize: "11px",
          }}
        >
          La sesión espera su música.
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "auto 1fr auto",
              gap: "12px",
              alignItems: "center",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "6px",
              }}
            >
              <button
                type="button"
                onClick={previousTrack}
                style={buttonStyle}
              >
                ←
              </button>

              <button
                type="button"
                onClick={togglePlay}
                style={{
                  ...buttonStyle,
                  minWidth: "68px",
                  color: "#e0bd6d",
                }}
              >
                {playing
                  ? "Pausa"
                  : "Play"}
              </button>

              <button
                type="button"
                onClick={nextTrack}
                style={buttonStyle}
              >
                →
              </button>
            </div>

            <div
              style={{
                minWidth: 0,
              }}
            >
              <div
                style={{
                  color: "#eadfca",
                  fontFamily:
                    "Georgia,serif",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow:
                    "ellipsis",
                  fontSize: "12px",
                }}
              >
                {currentTrack?.name}
              </div>

              <div
                style={{
                  marginTop: "3px",
                  color:
                    "rgba(235,220,185,.36)",
                  fontSize: "9px",
                }}
              >
                Pista {currentIndex + 1} /{" "}
                {tracks.length}
              </div>
            </div>

            <input
              aria-label="Volumen"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(event) =>
                setMasterVolume(
                  Number(
                    event.target.value,
                  ),
                )
              }
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4,1fr)",
              gap: "7px",
              marginTop: "13px",
            }}
          >
            <button
              type="button"
              onClick={duckMusic}
              style={buttonStyle}
            >
              Música baja
            </button>

            <button
              type="button"
              onClick={
                restoreMusicNow
              }
              style={buttonStyle}
            >
              Recuperar BSO
            </button>

            <button
              type="button"
              onClick={silenceMusic}
              style={buttonStyle}
            >
              Silencio
            </button>

            <button
              type="button"
              onClick={bindScene}
              style={{
                ...buttonStyle,
                color: "#dfbd71",
              }}
            >
              Vincular a escena
            </button>
          </div>

          <div
            style={{
              marginTop: "14px",
            }}
          >
            {tracks.map(
              (track, index) => (
                <button
                  key={track.id}
                  type="button"
                  onClick={() =>
                    changeTrackAlive(
                      index,
                    )
                  }
                  style={{
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns:
                      "34px 1fr auto",
                    gap: "8px",
                    padding: "8px 5px",
                    border: 0,
                    borderTop:
                      "1px solid rgba(190,145,55,.08)",
                    background:
                      index ===
                      currentIndex
                        ? "rgba(190,145,55,.05)"
                        : "transparent",
                    color:
                      index ===
                      currentIndex
                        ? "#dfbd71"
                        : "rgba(235,220,185,.58)",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "10px",
                  }}
                >
                  <span>
                    {String(
                      index + 1,
                    ).padStart(
                      2,
                      "0",
                    )}
                  </span>

                  <span>
                    {track.name}
                  </span>

                  <span>
                    {assignments[
                      sceneTitle
                    ] === index
                      ? "ESCENA"
                      : ""}
                  </span>
                </button>
              ),
            )}
          </div>
        </>
      )}
    </section>
  );
}

const buttonStyle = {
  border:
    "1px solid rgba(190,145,55,.24)",
  background:
    "rgba(190,145,55,.045)",
  color:
    "rgba(235,220,185,.67)",
  borderRadius: "7px",
  padding: "8px 9px",
  cursor: "pointer",
  fontSize: "9px",
};
