"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import styles from "./sala-corazon-vivo.module.css";

import {
  supabaseBrowser,
} from "../../../lib/supabaseClient";

import {
  DIRECTOR_CHANNEL,
  type DirectorCommand,
} from "../director/director-channel";
import BsoPlayer from "./BsoPlayer";
import BroadcastConsole from "./BroadcastConsole";
import LiveCameraPanel from "./LiveCameraPanel";
import VisualStage from "./VisualStage";
import UniversalArchiveStage from "./UniversalArchiveStage";
import CompanionPanel from "./CompanionPanel";
import ReadingRecorder from "./ReadingRecorder";

import EphemeralMessageStage from "./EphemeralMessageStage";
import {
  useLiveSession,
} from "./LiveSessionProvider";
import {
  calculateHeartState,
  decideAutonomy,
  expressSoul,
  interpretRoom,
  storeMemory,
  type SoulExpression,
} from "./organismo";

type WallMessage = {
  id: string;
  name: string;
  place: string;
  text: string;
};

const marqueeSeed = [
  "SÍGUENOS EN INSTAGRAM · @POEMAUNIVERSAL2026",
  "SÍGUENOS EN INSTAGRAM · @POEMAUNIVERSAL2026",
  "SÍGUENOS EN INSTAGRAM · @POEMAUNIVERSAL2026",
];

const filmScenes = [
  {
    id: 1,
    eyebrow: "ESCENA 01",
    title: "La carretera",
    description:
      "Noche. El coche avanza hacia algo que todavía no conocemos.",
  },
  {
    id: 2,
    eyebrow: "ESCENA 02",
    title: "María",
    description:
      "La presencia de María entra en la imagen mientras la lectura continúa.",
  },
  {
    id: 3,
    eyebrow: "ESCENA 03",
    title: "El Árbol Blanco",
    description:
      "La imagen permanece. El árbol escucha la voz antes de que ocurra nada.",
  },
  {
    id: 4,
    eyebrow: "ESCENA 04",
    title: "El fuego",
    description:
      "La luz se transforma. La película espera el siguiente fragmento.",
  },
];

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}


const SIGNAL_STOPWORDS = new Set([
  "para",
  "como",
  "pero",
  "porque",
  "desde",
  "hasta",
  "este",
  "esta",
  "esto",
  "estos",
  "estas",
  "aquí",
  "alli",
  "allí",
  "algo",
  "todo",
  "toda",
  "todos",
  "todas",
  "unos",
  "unas",
  "sobre",
  "entre",
  "cuando",
  "donde",
  "quien",
  "cada",
  "mucho",
  "mucha",
  "muy",
  "también",
  "solo",
  "sólo",
  "ella",
  "ellos",
  "ellas",
  "nosotros",
  "vosotros",
  "tiene",
  "tienen",
  "hacer",
  "hace",
  "esta",
  "está",
  "están",
]);

function extractSignalWords(
  text: string,
) {
  return (
    text
      .toLocaleLowerCase("es")
      .match(/\p{L}{4,}/gu) ?? []
  )
    .filter(
      (word) =>
        !SIGNAL_STOPWORDS.has(word),
    )
    .slice(0, 4);
}

export default function SalaCorazonVivo() {
  const {
    setVoiceLevel: setSessionVoiceLevel,
    setVoiceActive: setSessionVoiceActive,
    setArtisticPulse,
    setEmotionalState,
    setOrganismIntensity,
    setSceneIndex: setSessionSceneIndex,
    setSceneTitle,
    setGuestActive,
    setCurrentExpression,
    setDominantWords,
  } = useLiveSession();
  const [pulse, setPulse] = useState(68);

  const [
    audiencePresence,
    setAudiencePresence,
  ] = useState(0);

  const [directorBlackout, setDirectorBlackout] =
    useState(false);

  const [directorCommandLabel, setDirectorCommandLabel] =
    useState("");

  useEffect(() => {
    let mounted = true;

    async function loadDirectorState() {
      const {
        data,
        error,
      } =
        await supabaseBrowser
          .from(
            "director_sessions",
          )
          .select(
            "room_id, blackout, scene, updated_at",
          )
          .eq(
            "room_id",
            "sala-corazon-vivo",
          )
          .single();

      if (
        !mounted ||
        error ||
        !data
      ) {
        return;
      }

      setDirectorBlackout(
        Boolean(
          data.blackout,
        ),
      );
    }

    void loadDirectorState();

    const channel =
      supabaseBrowser
        .channel(
          "director-sala-corazon-vivo",
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table:
              "director_sessions",
            filter:
              "room_id=eq.sala-corazon-vivo",
          },
          (payload) => {
            const next =
              payload.new as {
                blackout?: boolean;
                scene?: string;
              };

            if (
              typeof next.blackout ===
              "boolean"
            ) {
              setDirectorBlackout(
                next.blackout,
              );

              setDirectorCommandLabel(
                next.blackout
                  ? "NEGRO"
                  : "SALIR DE NEGRO",
              );

              window.setTimeout(
                () => {
                  setDirectorCommandLabel(
                    "",
                  );
                },
                1800,
              );
            }
          },
        )
        .subscribe();

    return () => {
      mounted = false;

      void supabaseBrowser
        .removeChannel(
          channel,
        );
    };
  }, []);




  /*
   * BroadcastChannel queda únicamente como
   * heartbeat local PING/PONG.
   *
   * Las órdenes artísticas reales llegan
   * por Supabase Realtime.
   */
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

    channel.postMessage({
      type: "SALA_READY",
      timestamp: Date.now(),
    });

    channel.onmessage = (
      event: MessageEvent<DirectorCommand>,
    ) => {
      const command =
        event.data;

      if (
        !command ||
        typeof command !== "object"
      ) {
        return;
      }

      if (
        command.type !== "PING"
      ) {
        return;
      }

      channel.postMessage({
        type: "PONG",
        timestamp: Date.now(),
      });
    };

    return () => {
      channel.close();
    };
  }, []);


  /*
   * Director remoto.
   *
   * Escucha órdenes persistidas por la API
   * privada del Director.
   */
  useEffect(() => {
    let labelTimer:
      ReturnType<typeof setTimeout> | null =
        null;

    const showCommand = (
      label: string,
    ) => {
      setDirectorCommandLabel(
        label,
      );

      if (labelTimer) {
        clearTimeout(
          labelTimer,
        );
      }

      labelTimer =
        setTimeout(() => {
          setDirectorCommandLabel(
            "",
          );
        }, 1800);
    };

    const channel =
      supabaseBrowser
        .channel(
          "director-commands:sala-corazon-vivo",
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table:
              "director_commands",
            filter:
              "room_id=eq.sala-corazon-vivo",
          },
          (change) => {
            const row =
              change.new as {
                id: number;
                room_id: string;
                command_type: string;
                payload:
                  | Record<
                      string,
                      unknown
                    >
                  | null;
                created_at: string;
              };

            const data =
              row.payload &&
              typeof row.payload ===
                "object" &&
              !Array.isArray(
                row.payload,
              )
                ? row.payload
                : {};

            const parsedTimestamp =
              Date.parse(
                row.created_at,
              );

            const timestamp =
              typeof data.timestamp ===
              "number"
                ? data.timestamp
                : Number.isFinite(
                      parsedTimestamp,
                    )
                  ? parsedTimestamp
                  : Date.now();

            let command:
              DirectorCommand | null =
                null;

            if (
              row.command_type ===
                "SCENE" &&
              typeof data.scene ===
                "string"
            ) {
              command = {
                type: "SCENE",
                scene:
                  data.scene,
                timestamp,
              };
            }

            if (
              row.command_type ===
                "BLACKOUT" &&
              typeof data.active ===
                "boolean"
            ) {
              command = {
                type: "BLACKOUT",
                active:
                  data.active,
                timestamp,
              };
            }

            if (
              row.command_type ===
              "SILENCE"
            ) {
              command = {
                type: "SILENCE",
                timestamp,
              };
            }

            if (
              row.command_type ===
                "CAMERA" &&
              typeof data.active ===
                "boolean"
            ) {
              command = {
                type: "CAMERA",
                active:
                  data.active,
                timestamp,
              };
            }

            if (
              row.command_type ===
                "VIDEO" &&
              typeof data.active ===
                "boolean"
            ) {
              command = {
                type: "VIDEO",
                active:
                  data.active,
                timestamp,
              };
            }

            if (
              row.command_type ===
                "PROJECT_MESSAGE" &&
              typeof data.messageId ===
                "string" &&
              typeof data.text ===
                "string" &&
              typeof data.author ===
                "string"
            ) {
              command = {
                type:
                  "PROJECT_MESSAGE",
                messageId:
                  data.messageId,
                text:
                  data.text,
                author:
                  data.author,
                place:
                  typeof data.place ===
                    "string"
                    ? data.place
                    : null,
                timestamp,
              };
            }

            if (!command) {
              return;
            }

            if (
              command.type ===
              "BLACKOUT"
            ) {
              setDirectorBlackout(
                command.active,
              );

              showCommand(
                command.active
                  ? "NEGRO"
                  : "SALIR DE NEGRO",
              );
            }

            if (
              command.type ===
              "SCENE"
            ) {
              showCommand(
                command.scene,
              );
            }

            if (
              command.type ===
              "SILENCE"
            ) {
              showCommand(
                "SILENCIO",
              );
            }

            if (
              command.type ===
              "VIDEO"
            ) {
              showCommand(
                "CAMPO VISUAL · VÍDEO",
              );
            }

            if (
              command.type ===
              "CAMERA"
            ) {
              showCommand(
                command.active
                  ? "CÁMARA ON"
                  : "CÁMARA OFF",
              );
            }

            if (
              command.type ===
              "PROJECT_MESSAGE"
            ) {
              showCommand(
                `VOZ · ${command.author}`,
              );
            }

            /*
             * Un único bus interno para
             * los componentes de la Sala.
             */
            window.dispatchEvent(
              new CustomEvent(
                "poema-director-command",
                {
                  detail:
                    command,
                },
              ),
            );
          },
        )
        .subscribe();

    return () => {
      if (labelTimer) {
        clearTimeout(
          labelTimer,
        );
      }

      void supabaseBrowser
        .removeChannel(
          channel,
        );
    };
  }, []);


  const [voiceActive, setVoiceActive] =
    useState(false);

  const [voiceLevel, setVoiceLevel] =
    useState(0);

  const [soulExpression, setSoulExpression] =
    useState<SoulExpression | null>(null);

  const [words, setWords] =
    useState<string[]>([]);


  const [wallMessages, setWallMessages] =
    useState<WallMessage[]>([]);





  const [sceneIndex, setSceneIndex] =
    useState(2);

  const [lastEvent, setLastEvent] =
    useState("Organismo preparado.");

  const activeScene =
    filmScenes[sceneIndex];

  const heartVoice =
    Math.max(
      0,
      Math.min(1, voiceLevel),
    );

  const heartPresence =
    Math.max(
      0,
      Math.min(
        1,
        Math.log2(
          Math.max(
            1,
            audiencePresence,
          ),
        ) / 5,
      ),
    );

  const heartImpulse =
    Math.max(
      0,
      Math.min(
        1,
        (pulse - 68) / 31,
      ),
    );

  const heartEnergy =
    Math.max(
      0,
      Math.min(
        1,
        heartVoice * 0.72 +
          heartPresence * 0.18 +
          heartImpulse * 0.10,
      ),
    );

  const heartPulse =
    Math.round(
      68 + heartEnergy * 28,
    );

  const heartGlow =
    0.28 + heartEnergy * 0.72;

  const heartScale =
    1 + heartEnergy * 0.16;

  const heartBeatSeconds =
    Math.max(
      0.62,
      1.15 - heartEnergy * 0.48,
    );

  useEffect(() => {
    if (pulse <= 68) {
      return;
    }

    const timer =
      window.setTimeout(
        () => {
          setPulse(
            (value) =>
              Math.max(
                68,
                value - 1,
              ),
          );
        },
        1200,
      );

    return () => {
      window.clearTimeout(
        timer,
      );
    };
  }, [pulse]);

  const organismInput = useMemo(
    () => ({
      voiceLevel,
      voiceActive,
      pulse,
      presenceCount: audiencePresence,
      sceneTitle: activeScene.title,
      depositedWords: words,
      audienceMessages:
        wallMessages.map(
          (message) => message.text,
        ),
      guestActive: false,
    }),
    [
      voiceLevel,
      voiceActive,
      pulse,
      audiencePresence,
      activeScene.title,
      words,
      wallMessages,
    ],
  );

  const organismHeart = useMemo(
    () =>
      calculateHeartState(
        organismInput,
      ),
    [organismInput],
  );

  const organismMind = useMemo(
    () =>
      interpretRoom(
        organismInput,
        organismHeart,
      ),
    [
      organismInput,
      organismHeart,
    ],
  );

  useEffect(() => {
    setSessionVoiceLevel(
      voiceLevel,
    );

    setSessionVoiceActive(
      voiceActive,
    );

    setArtisticPulse(
      organismHeart.artisticPulse,
    );

    setEmotionalState(
      organismMind.emotionalState,
    );

    setOrganismIntensity(
      organismMind.intensity,
    );

    setSessionSceneIndex(
      sceneIndex,
    );

    setSceneTitle(
      activeScene.title,
    );

    setGuestActive(
      false,
    );

    setCurrentExpression(
      soulExpression,
    );

    setDominantWords(
      organismMind.dominantWords,
    );
  }, [
    voiceLevel,
    voiceActive,
    organismHeart.artisticPulse,
    organismMind.emotionalState,
    organismMind.intensity,
    sceneIndex,
    activeScene.title,
    soulExpression,
    organismMind.dominantWords,
    setSessionVoiceLevel,
    setSessionVoiceActive,
    setArtisticPulse,
    setEmotionalState,
    setOrganismIntensity,
    setSessionSceneIndex,
    setSceneTitle,
    setGuestActive,
    setCurrentExpression,
    setDominantWords,
  ]);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null =
      null;

    function scheduleDecision() {
      const decision =
        decideAutonomy(
          organismMind,
          {
            voiceActive,
            guestActive:
              false,
          },
        );

      const beatMilliseconds =
        60000 /
        Math.max(
          45,
          organismHeart.artisticPulse,
        );

      const delay =
        beatMilliseconds *
        decision.beatsUntilNextDecision;

      timer = setTimeout(() => {
        if (cancelled) {
          return;
        }

        if (decision.speak) {
          const expression =
            expressSoul(
              organismMind,
            );

          setSoulExpression(
            expression,
          );

          storeMemory(
            organismMind,
            expression,
          );

          if (
            expression.type ===
            "silence"
          ) {
            setLastEvent(
              "El organismo ha elegido guardar silencio.",
            );
          } else {
            setLastEvent(
              expression.author
                ? `${expression.author}: ${expression.text}`
                : expression.text,
            );
          }
        }

        scheduleDecision();
      }, delay);
    }

    scheduleDecision();

    return () => {
      cancelled = true;

      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [
    organismMind,
    organismHeart.artisticPulse,
    voiceActive,
  ]);


  function letOrganismSpeak() {
    const expression =
      expressSoul(organismMind);

    setSoulExpression(
      expression,
    );

    storeMemory(
      organismMind,
      expression,
    );

    if (
      expression.type !== "silence"
    ) {
      setLastEvent(
        expression.author
          ? `${expression.author}: ${expression.text}`
          : expression.text,
      );

      setPulse(
        Math.max(
          pulse,
          organismHeart.artisticPulse,
        ),
      );
    } else {
      setLastEvent(
        "El organismo ha elegido guardar silencio.",
      );
    }
  }


  function triggerPulse() {
    setPulse((value) =>
      Math.min(99, value + 1),
    );

    setLastEvent(
      "Una presencia ha enviado un latido.",
    );
  }


  function previousScene() {
    setSceneIndex((current) =>
      Math.max(0, current - 1),
    );

    setLastEvent(
      "Película: escena anterior.",
    );
  }

  function nextScene() {
    setSceneIndex((current) =>
      Math.min(
        filmScenes.length - 1,
        current + 1,
      ),
    );

    setLastEvent(
      "Película: siguiente escena.",
    );
  }

  return (
    <main className={`${styles.page} ${styles.corazonFinal}`}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>
            POEMA UNIVERSAL · PROGRAMA EN VIVO
          </p>
          <h1>
            Sala del Corazón Vivo
          </h1>
        </div>

        <div className={styles.liveStatus}>
          <span
            className={styles.liveDot}
          />
          EN VIVO
        </div>
      </header>

      <section
        className={styles.marquee}
        aria-label="Cartel vivo"
      >
        <div
          className={styles.marqueeTrack}
        >
          {[...marqueeSeed, ...marqueeSeed].map(
            (message, index) => (
              <span
                key={`${message}-${index}`}
              >
                {message}
                <i>✦</i>
              </span>
            ),
          )}
        </div>
      </section>

      <section className={styles.mainGrid}>

        {/* =======================================================
            DÍPTICO VIVO
            La persona que lee y el mundo que nace de su lectura
        ======================================================= */}

        <section className={styles.liveExperience}>

          {/* LECTURA EN VIVO */}
          <section className={`${styles.panel} ${styles.readerPanel}`}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.sectionEyebrow}>
                  PRESENCIA
                </span>

                <h2>Tu voz también forma parte.</h2>
              </div>

              <span className={styles.smallLiveBadge}>
                ● EN VIVO
              </span>
            </div>

            <div className={styles.videoStage}>
              <LiveCameraPanel
                guestName={null}
                guestPlace={null}
                onSpeakingChange={setVoiceActive}
                onVoiceLevel={setVoiceLevel}
              />
            </div>

            <div className={styles.hostMeta}>
              <span>LECTURA EN VIVO</span>

              <strong>
                Sala del Corazón Vivo
              </strong>

              <small>
                leer · escuchar · permanecer
              </small>
            </div>

            <div className={styles.actionGrid}>
              

              

              
            </div>
          </section>



          {/* ACOMPAÑAMIENTO */}
          <div className={styles.companionColumn}>
            <CompanionPanel />
          </div>

          {/* GRABACIÓN */}
          <div className={styles.readingRecorderSlot}>
            <ReadingRecorder />
          </div>


        </section>

      </section>

      {/* DIRECCIÓN · SALIDA MASTER */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999990,
          pointerEvents: "none",
          background: "#000",
          opacity:
            directorBlackout
              ? 1
              : 0,
          transition:
            "opacity 1.6s cubic-bezier(.4,0,.2,1)",
        }}
      />

      {directorCommandLabel && (
        <div
          style={{
            position: "fixed",
            zIndex: 999991,
            left: "50%",
            top: "28px",
            transform:
              "translateX(-50%)",
            padding:
              "9px 15px",
            border:
              "1px solid rgba(216,179,107,.34)",
            borderRadius:
              "999px",
            background:
              "rgba(5,4,3,.90)",
            color:
              "#ddb663",
            fontSize:
              "9px",
            letterSpacing:
              ".14em",
            pointerEvents:
              "none",
            boxShadow:
              "0 10px 35px rgba(0,0,0,.45)",
          }}
        >
          DIRECTOR · {directorCommandLabel}
        </div>
      )}

      <footer className={styles.footer}>
        <span>
          POEMA UNIVERSAL · EDICIÓN
          FUNDACIONAL 2026
        </span>

        <span>
          V1 · CORAZÓN VIVO
        </span>
      </footer>

      </main>
  );
}
