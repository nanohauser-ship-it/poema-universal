"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import styles from "./BroadcastConsole.module.css";
import SessionRecorder from "./SessionRecorder";

type PlatformId =
  | "web"
  | "youtube"
  | "twitch"
  | "facebook"
  | "tiktok"
  | "instagram";

type Platform = {
  id: PlatformId;
  label: string;
  short: string;
  description: string;
};

const platforms: Platform[] = [
  {
    id: "web",
    label: "Poema Universal",
    short: "WEB",
    description: "Sala principal",
  },
  {
    id: "youtube",
    label: "YouTube Live",
    short: "YOUTUBE",
    description: "RTMP / Live",
  },
  {
    id: "twitch",
    label: "Twitch",
    short: "TWITCH",
    description: "RTMP",
  },
  {
    id: "facebook",
    label: "Facebook Live",
    short: "FACEBOOK",
    description: "RTMPS",
  },
  {
    id: "tiktok",
    label: "TikTok Live",
    short: "TIKTOK",
    description: "Según acceso",
  },
  {
    id: "instagram",
    label: "Instagram Live",
    short: "INSTAGRAM",
    description: "Salida futura",
  },
];

const STORAGE_KEY =
  "poema-universal-broadcast-console-v1";

function formatDuration(
  seconds: number,
) {
  const hours =
    Math.floor(seconds / 3600);

  const minutes =
    Math.floor(
      (seconds % 3600) / 60,
    );

  const secs =
    seconds % 60;

  return [
    hours,
    minutes,
    secs,
  ]
    .map((value) =>
      String(value).padStart(
        2,
        "0",
      ),
    )
    .join(":");
}

export default function BroadcastConsole() {
  const [armed, setArmed] =
    useState<PlatformId[]>([
      "web",
    ]);

  const [masterLive, setMasterLive] =
    useState(false);

  const [elapsed, setElapsed] =
    useState(0);

  const [expanded, setExpanded] =
    useState(true);

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          STORAGE_KEY,
        );

      if (!saved) return;

      const parsed =
        JSON.parse(saved);

      if (
        Array.isArray(
          parsed.armed,
        )
      ) {
        setArmed(
          parsed.armed,
        );
      }
    } catch {
      // Estado local opcional.
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        armed,
      }),
    );
  }, [armed]);

  useEffect(() => {
    if (!masterLive) {
      setElapsed(0);
      return;
    }

    const timer =
      window.setInterval(
        () => {
          setElapsed(
            (current) =>
              current + 1,
          );
        },
        1000,
      );

    return () => {
      window.clearInterval(
        timer,
      );
    };
  }, [masterLive]);

  const armedCount =
    useMemo(
      () => armed.length,
      [armed],
    );

  function togglePlatform(
    id: PlatformId,
  ) {
    if (id === "web") {
      return;
    }

    setArmed(
      (current) =>
        current.includes(id)
          ? current.filter(
              (item) =>
                item !== id,
            )
          : [
              ...current,
              id,
            ],
    );
  }

  return (
    <section
      className={styles.console}
    >
      <header
        className={styles.header}
      >
        <div
          className={
            styles.identity
          }
        >
          <span
            className={
              styles.eyebrow
            }
          >
            REALIZACIÓN · DISTRIBUCIÓN
          </span>

          <h2>
            Consola de Emisión
          </h2>

          <small>
            Una señal · múltiples salidas
          </small>
        </div>

        <div
          className={
            styles.headerRight
          }
        >
          <div
            className={
              masterLive
                ? styles.masterStatusLive
                : styles.masterStatus
            }
          >
            <i />

            {masterLive
              ? "EMISIÓN ACTIVA"
              : "PREPARADA"}
          </div>

          <button
            type="button"
            className={
              styles.collapseButton
            }
            onClick={() =>
              setExpanded(
                (value) => !value,
              )
            }
          >
            {expanded
              ? "−"
              : "+"}
          </button>
        </div>
      </header>

      {expanded && (
        <>
          <div
            className={
              styles.masterStrip
            }
          >
            <div
              className={
                styles.masterMetric
              }
            >
              <span>
                TIEMPO
              </span>

              <strong>
                {masterLive
                  ? formatDuration(
                      elapsed,
                    )
                  : "00:00:00"}
              </strong>
            </div>

            <div
              className={
                styles.masterMetric
              }
            >
              <span>
                SALIDAS ARMADAS
              </span>

              <strong>
                {armedCount}
              </strong>
            </div>

            <div
              className={
                styles.masterMetric
              }
            >
              <span>
                BITRATE
              </span>

              <strong>
                —
              </strong>
            </div>

            <div
              className={
                styles.masterMetric
              }
            >
              <span>
                AUDIENCIA TOTAL
              </span>

              <strong>
                —
              </strong>
            </div>

            <div
              className={
                styles.masterMetric
              }
            >
              <span>
                LATENCIA
              </span>

              <strong>
                —
              </strong>
            </div>

            <button
              type="button"
              className={
                masterLive
                  ? styles.stopButton
                  : styles.masterButton
              }
              onClick={() =>
                setMasterLive(
                  (value) => !value,
                )
              }
            >
              {masterLive
                ? "■ DETENER"
                : "● SIMULAR EMISIÓN"}
            </button>
          </div>

          <div
            className={
              styles.platformGrid
            }
          >
            {platforms.map(
              (platform) => {
                const isArmed =
                  armed.includes(
                    platform.id,
                  );

                const isWeb =
                  platform.id ===
                  "web";

                return (
                  <article
                    key={
                      platform.id
                    }
                    className={
                      isArmed
                        ? styles.platformActive
                        : styles.platform
                    }
                  >
                    <header>
                      <div
                        className={
                          styles.platformSignal
                        }
                      >
                        <i />

                        <span>
                          {
                            platform.short
                          }
                        </span>
                      </div>

                      <span
                        className={
                          isArmed
                            ? styles.ready
                            : styles.pending
                        }
                      >
                        {isWeb
                          ? "LOCAL"
                          : isArmed
                            ? "ARMADO"
                            : "OFF"}
                      </span>
                    </header>

                    <div
                      className={
                        styles.platformBody
                      }
                    >
                      <strong>
                        {
                          platform.label
                        }
                      </strong>

                      <small>
                        {
                          platform.description
                        }
                      </small>
                    </div>

                    <div
                      className={
                        styles.platformMetrics
                      }
                    >
                      <span>
                        <small>
                          VIEWERS
                        </small>

                        <strong>
                          —
                        </strong>
                      </span>

                      <span>
                        <small>
                          BITRATE
                        </small>

                        <strong>
                          —
                        </strong>
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={isWeb}
                      onClick={() =>
                        togglePlatform(
                          platform.id,
                        )
                      }
                    >
                      {isWeb
                        ? "SEÑAL MAESTRA"
                        : isArmed
                          ? "DESARMAR"
                          : "ARMAR SALIDA"}
                    </button>
                  </article>
                );
              },
            )}
          </div>

          <SessionRecorder />


          <footer
            className={
              styles.footer
            }
          >
            <span>
              ● SEÑAL MAESTRA ·
              POEMA UNIVERSAL
            </span>

            <span>
              V1 · CONSOLA LOCAL ·
              APIs DE STREAMING PENDIENTES
            </span>
          </footer>
        </>
      )}
    </section>
  );
}
