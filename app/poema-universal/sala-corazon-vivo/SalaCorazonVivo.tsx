"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
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
import LiveChat from "./LiveChat";

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

type QueuePerson = {
  id: string;
  name: string;
  place: string;
  status: "waiting" | "invited";
};

const marqueeSeed = [
  "SÍGUENOS EN INSTAGRAM · @POEMAUNIVERSAL2026",
  "SÍGUENOS EN INSTAGRAM · @POEMAUNIVERSAL2026",
  "SÍGUENOS EN INSTAGRAM · @POEMAUNIVERSAL2026",
];

const initialWords = [
  "memoria",
  "madre",
  "regreso",
  "luz",
  "ternura",
  "casa",
  "dignidad",
  "agua",
];

const initialWall: WallMessage[] = [
  {
    id: "1",
    name: "Lucía",
    place: "México",
    text: "Hay algo profundamente humano en escuchar juntos.",
  },
  {
    id: "2",
    name: "Santiago",
    place: "Argentina",
    text: "La palabra casa acaba de cambiar para mí.",
  },
  {
    id: "3",
    name: "Marta",
    place: "Galicia",
    text: "Ese silencio después del verso fue precioso.",
  },
];

const initialQueue: QueuePerson[] = [
  {
    id: "q1",
    name: "Camila",
    place: "Santiago · Chile",
    status: "waiting",
  },
  {
    id: "q2",
    name: "Leonardo",
    place: "Quito · Ecuador",
    status: "waiting",
  },
  {
    id: "q3",
    name: "Patricia",
    place: "Ciudad de México",
    status: "waiting",
  },
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
        command.type === "PING"
      ) {
        channel.postMessage({
          type: "PONG",
          timestamp:
            Date.now(),
        });

        return;
      }

      if (
        command.type === "SCENE"
      ) {
        setLastEvent(
          `Director · ${command.scene}`,
        );
      }

      if (
        command.type === "BLACKOUT"
      ) {
        setDirectorBlackout(
          command.active,
        );

        setLastEvent(
          command.active
            ? "Director · Negro."
            : "Director · Regreso a sala.",
        );
      }

      if (
        command.type === "SILENCE"
      ) {
        setLastEvent(
          "Director · Silencio.",
        );
      }

      channel.postMessage({
        type: "ACK",
        command:
          command.type,
        timestamp:
          Date.now(),
      });
    };

    return () => {
      channel.close();
    };
  }, []);

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
        command.type === "PING"
      ) {
        channel.postMessage({
          type: "PONG",
          timestamp: Date.now(),
        });

        return;
      }

      if (
        command.type === "BLACKOUT"
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
        command.type === "SCENE"
      ) {
        showCommand(
          command.scene,
        );
      }

      if (
        command.type === "SILENCE"
      ) {
        showCommand(
          "SILENCIO",
        );
      }

      if (
        command.type === "VIDEO"
      ) {
        showCommand(
          "CAMPO VISUAL · VÍDEO",
        );
      }

      if (
        command.type === "CAMERA"
      ) {
        showCommand(
          command.active
            ? "CÁMARA ON"
            : "CÁMARA OFF",
        );
      }

      /*
       * Distribuimos también la orden
       * al resto de componentes de la Sala.
       */
      window.dispatchEvent(
        new CustomEvent(
          "poema-director-command",
          {
            detail: command,
          },
        ),
      );

      channel.postMessage({
        type: "ACK",
        command:
          command.type,
        timestamp:
          Date.now(),
      });
    };

    return () => {
      if (labelTimer) {
        clearTimeout(
          labelTimer,
        );
      }

      channel.close();
    };
  }, []);

  const [voiceActive, setVoiceActive] =
    useState(false);

  const [voiceLevel, setVoiceLevel] =
    useState(0);

  const [soulExpression, setSoulExpression] =
    useState<SoulExpression | null>(null);

  const [words, setWords] =
    useState<string[]>(initialWords);

  const [wordInput, setWordInput] =
    useState("");

  const [wallMessages, setWallMessages] =
    useState<WallMessage[]>(initialWall);

  const [wallInput, setWallInput] =
    useState("");

  const [queue, setQueue] =
    useState<QueuePerson[]>(initialQueue);

  const [showInvite, setShowInvite] =
    useState(false);

  const [guest, setGuest] =
    useState<QueuePerson | null>(null);

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

  const heartPulse =
    Math.round(
      68 + heartVoice * 28,
    );

  const heartGlow =
    0.28 + heartVoice * 0.72;

  const heartScale =
    1 + heartVoice * 0.16;

  const heartBeatSeconds =
    Math.max(
      0.62,
      1.15 - heartVoice * 0.48,
    );

  const organismInput = useMemo(
    () => ({
      voiceLevel,
      voiceActive,
      pulse,
      sceneTitle: activeScene.title,
      depositedWords: words,
      audienceMessages:
        wallMessages.map(
          (message) => message.text,
        ),
      guestActive: Boolean(guest),
    }),
    [
      voiceLevel,
      voiceActive,
      pulse,
      activeScene.title,
      words,
      wallMessages,
      guest,
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
      Boolean(guest),
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
    guest,
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
              Boolean(guest),
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
    guest,
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


  const waitingCount = useMemo(
    () =>
      queue.filter(
        (person) =>
          person.status === "waiting",
      ).length,
    [queue],
  );

  function triggerPulse() {
    setPulse((value) =>
      Math.min(99, value + 1),
    );

    setLastEvent(
      "Una presencia ha enviado un latido.",
    );
  }

  function depositWord(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const cleanWord = wordInput
      .trim()
      .replace(/\s+/g, " ");

    if (!cleanWord) return;

    setWords((current) => [
      cleanWord,
      ...current,
    ]);

    setPulse((value) =>
      Math.min(99, value + 2),
    );

    setWordInput("");

    setLastEvent(
      `Nueva palabra recibida: ${cleanWord}.`,
    );
  }

  function postWallMessage(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const cleanText =
      wallInput.trim();

    if (!cleanText) return;

    const newMessage: WallMessage = {
      id: uid("wall"),
      name: "Visitante",
      place: "Poema Universal",
      text: cleanText,
    };

    setWallMessages((current) => [
      newMessage,
      ...current,
    ]);

    setWallInput("");

    setLastEvent(
      "Una nueva voz ha entrado en el Muro Vivo.",
    );
  }

  function askForWord() {
    const alreadyWaiting =
      queue.some(
        (person) =>
          person.id === "local-user",
      );

    if (alreadyWaiting) {
      setLastEvent(
        "Ya estás en la cola para pedir la palabra.",
      );
      return;
    }

    setQueue((current) => [
      ...current,
      {
        id: "local-user",
        name: "Tú",
        place: "Presencia conectada",
        status: "waiting",
      },
    ]);

    setLastEvent(
      "Has pedido la palabra.",
    );
  }

  function invitePerson(
    person: QueuePerson,
  ) {
    setQueue((current) =>
      current.map((item) =>
        item.id === person.id
          ? {
              ...item,
              status: "invited",
            }
          : item,
      ),
    );

    setGuest({
      ...person,
      status: "invited",
    });

    setShowInvite(false);

    setPulse((value) =>
      Math.min(99, value + 3),
    );

    setLastEvent(
      `${person.name} ha sido invitado al diálogo.`,
    );
  }

  function closeDialogue() {
    if (!guest) return;

    setQueue((current) =>
      current.filter(
        (person) =>
          person.id !== guest.id,
      ),
    );

    setLastEvent(
      `El diálogo con ${guest.name} ha terminado.`,
    );

    setGuest(null);
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
    <main className={styles.page}>
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
                  PRESENCIA · VOZ · LECTURA
                </span>

                <h2>Lectura en vivo</h2>
              </div>

              <span className={styles.smallLiveBadge}>
                ● EN VIVO
              </span>
            </div>

            <div className={styles.videoStage}>
              <LiveCameraPanel
                guestName={guest?.name ?? null}
                guestPlace={guest?.place ?? null}
                onSpeakingChange={setVoiceActive}
                onVoiceLevel={setVoiceLevel}
              />
            </div>

            <div className={styles.hostMeta}>
              <span>SESIÓN ACTUAL</span>

              <strong>
                Sala del Corazón Vivo
              </strong>

              <small>
                presencia · voz · transmisión en directo
              </small>
            </div>

            <div className={styles.actionGrid}>
              <button
                type="button"
                onClick={triggerPulse}
              >
                <span>♥</span>

                <strong>Pulsar</strong>

                <small>
                  enviar un latido
                </small>
              </button>

              <button
                type="button"
                onClick={askForWord}
              >
                <span>✋</span>

                <strong>
                  Pedir la palabra
                </strong>

                <small>
                  entrar en la cola
                </small>
              </button>

              <button
                type="button"
                onClick={() => setShowInvite(true)}
              >
                <span>◌</span>

                <strong>
                  Invitar al diálogo
                </strong>

                <small>
                  subir una presencia
                </small>
              </button>
            </div>
          </section>


          {/* PUENTE VOZ → IMAGEN */}
          <div
            className={styles.voiceBridge}
            aria-hidden="true"
          >
            <span>VOZ → IMAGEN</span>
          </div>


          {/* CAMPO VISUAL UNIVERSAL */}
          <section
            className={`${styles.filmPanel} ${styles.storyPanel}`}
          >
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.sectionEyebrow}>
                  VÍDEO · IMAGEN · ARCHIVO
                </span>

                <h2>
                  Campo visual
                </h2>
              </div>

              <span className={styles.playingBadge}>
                ● DISPONIBLE
              </span>
            </div>

            <VisualStage
              onLifeEvent={(message) => {
                setLastEvent(message);

                setPulse((value) =>
                  Math.min(
                    99,
                    value + 1,
                  ),
                );
              }}
            />

            <div className={styles.bsoZone}>
              <BsoPlayer
                sceneTitle="Campo visual"
                sceneIndex={0}
                voiceActive={voiceActive}
                onLifeEvent={(message) => {
                  setLastEvent(message);

                  setPulse((value) =>
                    Math.min(
                      99,
                      value + 1,
                    ),
                  );
                }}
              />

              <BroadcastConsole />

            </div>
          </section>

          {/* CORAZÓN ENTRE AMBOS MUNDOS */}
          <section className={styles.heartRibbon}>
            <div
              className={styles.heartMini}
              aria-hidden="true"
              style={{
                "--heart-scale": heartScale,
                "--heart-glow": heartGlow,
                "--heart-beat": `${heartBeatSeconds}s`,
              } as React.CSSProperties}
            >
              <span className={styles.heartCore}>
                ♥
              </span>

              <span className={styles.heartWave} />
              <span className={styles.heartWaveSecond} />
            </div>

            <div className={styles.heartIdentity}>
              <span>
                CORAZÓN VIVO
              </span>

              <strong>
                {Math.max(pulse, heartPulse)}
              </strong>

              <small>
                pulso artístico
              </small>
            </div>

            <div className={styles.heartMessage}>
              <EphemeralMessageStage />
            </div>

            <span className={styles.heartEvent}>
              {lastEvent}
            </span>
          </section>
        </section>


        {/* =======================================================
            NÚCLEO UNIVERSAL · ARQUITECTURA V3
        ======================================================= */}

        <section className={styles.universalTool}>

          {/* ORGANISMO VIVO */}
          <section
            className={`${styles.panel} ${styles.universalOrganismPanel}`}
          >
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.sectionEyebrow}>
                  RITMO · MENTE · ALMA · MEMORIA
                </span>

                <h2>Organismo Vivo</h2>
              </div>

              <span className={styles.organismOnline}>
                ● ACTIVO
              </span>
            </div>

            <div
              className={styles.universalOrganismStage}
              style={{
                "--organism-intensity":
                  organismMind.intensity,
                "--organism-pulse":
                  organismHeart.artisticPulse,
              } as React.CSSProperties}
            >
              <div
                className={styles.universalOrganismGlow}
              />

              <video
                className={styles.universalOrganismVideo}
                src="/organismo/organismo-swing.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                aria-label="Organismo Vivo"
              />

              <button
                type="button"
                className={styles.universalNucleus}
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent(
                      "open-universal-archive"
                    )
                  );

                  setPulse((value) =>
                    Math.min(99, value + 2)
                  );

                  setLastEvent(
                    "El Núcleo Universal ha elegido abrir una presencia."
                  );
                }}
                aria-label="Tocar el Núcleo Universal"
              >
                <span
                  className={styles.universalNucleusLight}
                />

                <span
                  className={styles.universalNucleusLabel}
                >
                  TOCAR EL NÚCLEO
                </span>
              </button>
            </div>

            <div className={styles.organismCompactStatus}>
              <span>
                <small>ESTADO</small>
                <strong>
                  {organismMind.emotionalState.toUpperCase()}
                </strong>
              </span>

              <i />

              <span>
                <small>RITMO</small>
                <strong>
                  {organismHeart.artisticPulse}
                </strong>
              </span>

              <i />

              <span>
                <small>MENTE</small>
                <strong>
                  {organismMind.themes[0] ?? "escucha"}
                </strong>
              </span>

              <i />

              <span>
                <small>ALMA</small>
                <strong>
                  {soulExpression?.type ?? "contemplación"}
                </strong>
              </span>

              <i />

              <span>
                <small>MEMORIA</small>
                <strong>
                  {words.length + wallMessages.length}
                </strong>
              </span>
            </div>

            <div className={styles.organismWhisper}>
              {lastEvent}
            </div>
          </section>


          {/* ARCHIVO UNIVERSAL */}
          <section className={styles.universalArchiveV3}>
            <UniversalArchiveStage
              onLifeEvent={(message) => {
                setLastEvent(message);

                setPulse((value) =>
                  Math.min(
                    99,
                    value + 1,
                  ),
                );
              }}
            />
          </section>

        </section>


        {/* =======================================================
            HERRAMIENTAS SECUNDARIAS
        ======================================================= */}

        <section className={styles.secondaryTools}>


          {/* PEDIR LA PALABRA */}
          <section
            className={`${styles.panel} ${styles.compactDialogue}`}
          >
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.sectionEyebrow}>
                  DIÁLOGO
                </span>

                <h2>Pedir la palabra</h2>
              </div>

              <span className={styles.counter}>
                {waitingCount}
              </span>
            </div>

            <div className={styles.compactQueue}>
              {queue
                .slice(0, 3)
                .map((person) => (
                  <div
                    key={person.id}
                    className={styles.compactQueuePerson}
                  >
                    <div className={styles.avatar}>
                      {person.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <strong>
                        {person.name}
                      </strong>

                      <small>
                        {person.place}
                      </small>
                    </div>

                    <span>
                      {person.status === "invited"
                        ? "Invitado"
                        : "Espera"}
                    </span>
                  </div>
                ))}
            </div>

            <div className={styles.compactActions}>
              <button
                type="button"
                onClick={askForWord}
              >
                Pedir la palabra
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowInvite(true)
                }
              >
                Gestionar diálogo
              </button>
            </div>
          </section>


          {/* DEPÓSITO */}
          <section
            className={`${styles.panel} ${styles.compactDeposit}`}
          >
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.sectionEyebrow}>
                  MEMORIA COLECTIVA
                </span>

                <h2>Depositar una palabra</h2>
              </div>

              <span className={styles.counter}>
                {words.length}
              </span>
            </div>

            <div className={styles.compactWords}>
              {words
                .slice(0, 10)
                .map((word, index) => (
                  <span
                    key={`${word}-${index}`}
                  >
                    {word}
                  </span>
                ))}
            </div>

            <form
              className={styles.compactWordForm}
              onSubmit={depositWord}
            >
              <input
                id="word-input"
                value={wordInput}
                maxLength={32}
                onChange={(event) =>
                  setWordInput(
                    event.target.value
                  )
                }
                placeholder="ternura"
                aria-label="Depositar una palabra"
              />

              <button type="submit">
                Depositar
              </button>
            </form>
          </section>


          {/* CHAT VIVO */}
          <LiveChat
            roomId="sala-corazon-vivo"
            onMessage={(message) => {
              setWallMessages(
                (current) => [
                  ...current,
                  {
                    id: uid("chat"),
                    name: "Chat Vivo",
                    place: "Sala",
                    text: message,
                  },
                ].slice(-60),
              );

              setPulse((value) =>
                Math.min(
                  99,
                  value + 1,
                ),
              );

              setLastEvent(
                "Una nueva voz ha entrado en la Sala.",
              );
            }}
          />


        </section>

      </section>

      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99990,
          pointerEvents: "none",
          background: "#000",
          opacity:
            directorBlackout
              ? 1
              : 0,
          transition:
            "opacity 1.8s cubic-bezier(.4,0,.2,1)",
        }}
      />

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

      {showInvite && (
        <div
          className={styles.modalBackdrop}
          onMouseDown={() =>
            setShowInvite(false)
          }
        >
          <section
            className={styles.modal}
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <header>
              <div>
                <span
                  className={
                    styles.sectionEyebrow
                  }
                >
                  DIÁLOGO EN DIRECTO
                </span>
                <h2>
                  Invitar al escenario
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowInvite(false)
                }
                aria-label="Cerrar"
              >
                ×
              </button>
            </header>

            <p>
              Selecciona una presencia.
              En la fase de vídeo esta
              invitación habilitará su
              cámara y micrófono.
            </p>

            <div
              className={
                styles.inviteList
              }
            >
              {queue.map((person) => (
                <div
                  key={person.id}
                >
                  <div
                    className={
                      styles.avatar
                    }
                  >
                    {person.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <strong>
                      {person.name}
                    </strong>
                    <small>
                      {person.place}
                    </small>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      invitePerson(
                        person,
                      )
                    }
                  >
                    Invitar
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {guest && (
        <div
          className={styles.dialogueDock}
        >
          <div
            className={styles.avatar}
          >
            {guest.name
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <span>
              DIÁLOGO ACTIVO
            </span>
            <strong>
              {guest.name}
            </strong>
            <small>
              {guest.place}
            </small>
          </div>

          <button
            type="button"
            onClick={closeDialogue}
          >
            Finalizar
          </button>
        </div>
      )}
    </main>
  );
}
