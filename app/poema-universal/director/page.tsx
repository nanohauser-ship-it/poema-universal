"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Link from "next/link";

import {
  supabaseBrowser,
} from "../../../lib/supabaseClient";

import {
  createDirectorChannel,
  type DirectorCommand,
  type DirectorResponse,
} from "./director-channel";

import styles from "./director.module.css";

type ChatMessage = {
  id: string;
  room_id: string;
  user_name: string;
  user_place: string | null;
  text: string;
  created_at: string;
};

const scenes = [
  "01 · APERTURA",
  "02 · LECTURA",
  "03 · MEMORIA",
  "04 · SILENCIO",
  "05 · PÚBLICO",
  "06 · FINAL",
];

export default function DirectorPage() {
  const channelRef =
    useRef<BroadcastChannel | null>(
      null,
    );

  const [connected, setConnected] =
    useState(false);

  const [activeScene, setActiveScene] =
    useState(0);

  const [lastResponse, setLastResponse] =
    useState(
      "Esperando a la Sala del Corazón Vivo.",
    );

  const [blackout, setBlackout] =
    useState(false);

  const [chatMessages, setChatMessages] =
    useState<ChatMessage[]>([]);

  const [chatError, setChatError] =
    useState("");

  useEffect(() => {
    const channel =
      createDirectorChannel();

    channelRef.current =
      channel;

    if (!channel) {
      setLastResponse(
        "BroadcastChannel no está disponible.",
      );

      return;
    }

    channel.onmessage = (
      event: MessageEvent<DirectorResponse>,
    ) => {
      const message =
        event.data;

      if (
        message.type === "SALA_READY" ||
        message.type === "PONG"
      ) {
        setConnected(true);

        setLastResponse(
          "Sala del Corazón Vivo conectada.",
        );
      }

      if (
        message.type === "ACK"
      ) {
        setConnected(true);

        setLastResponse(
          `Orden recibida: ${message.command}`,
        );
      }
    };

    send({
      type: "PING",
      timestamp: Date.now(),
    });

    const ping =
      window.setInterval(() => {
        send({
          type: "PING",
          timestamp: Date.now(),
        });
      }, 3000);

    return () => {
      window.clearInterval(
        ping,
      );

      channel.close();
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadChat() {
      const {
        data,
        error,
      } = await supabaseBrowser
        .from("live_chat_messages")
        .select(
          "id, room_id, user_name, user_place, text, created_at",
        )
        .eq(
          "room_id",
          "sala-corazon-vivo",
        )
        .order(
          "created_at",
          {
            ascending: false,
          },
        )
        .limit(24);

      if (!active) return;

      if (error) {
        setChatError(
          error.message,
        );
        return;
      }

      setChatMessages(
        ((data ?? []) as ChatMessage[]).reverse(),
      );
    }

    void loadChat();

    const channel =
      supabaseBrowser
        .channel(
          "director-live-chat:sala-corazon-vivo",
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table:
              "live_chat_messages",
            filter:
              "room_id=eq.sala-corazon-vivo",
          },
          (payload) => {
            const incoming =
              payload.new as ChatMessage;

            setChatMessages(
              (current) => {
                if (
                  current.some(
                    (message) =>
                      message.id ===
                      incoming.id,
                  )
                ) {
                  return current;
                }

                return [
                  ...current,
                  incoming,
                ].slice(-24);
              },
            );
          },
        )
        .subscribe();

    return () => {
      active = false;

      void supabaseBrowser
        .removeChannel(
          channel,
        );
    };
  }, []);

  async function send(
    command: DirectorCommand,
  ) {
    /*
     * PING sigue siendo local.
     * No genera filas ni ruido histórico.
     */
    if (
      command.type === "PING"
    ) {
      channelRef.current
        ?.postMessage(
          command,
        );

      return true;
    }

    const secret =
      window.sessionStorage
        .getItem(
          "poema-universal-admin-secret",
        );

    if (!secret) {
      setLastResponse(
        "No hay sesión administrativa activa.",
      );

      return false;
    }

    const {
      type,
      ...payload
    } = command;

    try {
      const response =
        await fetch(
          "/api/poema-universal/director/command",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              "x-admin-secret":
                secret,
            },

            body:
              JSON.stringify({
                roomId:
                  "sala-corazon-vivo",

                commandType:
                  type,

                payload,
              }),
          },
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "No se pudo emitir la orden.",
        );
      }

      setLastResponse(
        `Orden remota enviada · ${type}`,
      );

      return true;

    } catch (error) {
      console.error(
        error,
      );

      setLastResponse(
        `Error enviando ${type}.`,
      );

      return false;
    }
  }

  async function projectMessage(
    message: ChatMessage,
  ) {
    const ok =
      await send({
        type:
          "PROJECT_MESSAGE",

        messageId:
          message.id,

        text:
          message.text,

        author:
          message.user_name,

        place:
          message.user_place,

        timestamp:
          Date.now(),
      });

    if (!ok) {
      return;
    }

    setLastResponse(
      `Voz proyectada · ${message.user_name}`,
    );
  }

  function launchScene(
    index: number,
  ) {
    setActiveScene(index);

    send({
      type: "SCENE",
      scene: scenes[index],
      timestamp: Date.now(),
    });
  }

  function nextScene() {
    launchScene(
      Math.min(
        scenes.length - 1,
        activeScene + 1,
      ),
    );
  }

  function previousScene() {
    launchScene(
      Math.max(
        0,
        activeScene - 1,
      ),
    );
  }

  async function toggleBlackout() {
    const next =
      !blackout;

    const ok =
      await send({
        type: "BLACKOUT",
        active: next,
        timestamp:
          Date.now(),
      });

    if (!ok) {
      return;
    }

    setBlackout(
      next,
    );

    setLastResponse(
      next
        ? "NEGRO enviado por Realtime."
        : "Salida de negro enviada por Realtime.",
    );
  }

  return (
    <main
      className={styles.page}
    >
      <header
        className={styles.topbar}
      >
        <div>
          <span>
            POEMA UNIVERSAL · ESTUDIO PRIVADO
          </span>

          <h1>
            Consola del Director
          </h1>
        </div>

        <div
          className={
            connected
              ? styles.connected
              : styles.disconnected
          }
        >
          <i />

          {connected
            ? "SALA CONECTADA"
            : "ESPERANDO SALA"}
        </div>
      </header>

      <section
        className={styles.workspace}
      >
        <aside
          className={styles.scenes}
        >
          <header>
            <span>
              PARTITURA
            </span>

            <h2>
              Escenas
            </h2>
          </header>

          <div
            className={
              styles.sceneList
            }
          >
            {scenes.map(
              (scene, index) => (
                <button
                  key={scene}
                  type="button"
                  className={
                    index === activeScene
                      ? styles.sceneActive
                      : styles.scene
                  }
                  onClick={() =>
                    launchScene(
                      index,
                    )
                  }
                >
                  <span>
                    {String(
                      index + 1,
                    ).padStart(
                      2,
                      "0",
                    )}
                  </span>

                  <strong>
                    {scene.replace(
                      /^\d+\s·\s/,
                      "",
                    )}
                  </strong>
                </button>
              ),
            )}
          </div>

          <button
            type="button"
            className={
              styles.addScene
            }
          >
            + NUEVA ESCENA
          </button>
        </aside>

        <section
          className={styles.master}
        >
          <header
            className={
              styles.sectionHeader
            }
          >
            <div>
              <span>
                MONITOR MASTER
              </span>

              <h2>
                Sala del Corazón Vivo
              </h2>
            </div>

            <Link
              href="/poema-universal/sala-corazon-vivo"
              target="_blank"
            >
              ABRIR SALA ↗
            </Link>
          </header>

          <div
            className={
              styles.monitor
            }
          >
            <div
              className={
                styles.monitorHeart
              }
            >
              ◉
            </div>

            <span>
              ESCENA ACTUAL
            </span>

            <strong>
              {scenes[
                activeScene
              ]}
            </strong>

            <small>
              {lastResponse}
            </small>
          </div>

          <section
            className={
              styles.quickControls
            }
          >
            <button
              onClick={() =>
                send({
                  type: "CAMERA",
                  active: true,
                  timestamp:
                    Date.now(),
                })
              }
            >
              CÁMARA ON
            </button>

            <button
              onClick={() =>
                send({
                  type: "CAMERA",
                  active: false,
                  timestamp:
                    Date.now(),
                })
              }
            >
              CÁMARA OFF
            </button>

            <button
              onClick={() =>
                send({
                  type: "VIDEO",
                  active: true,
                  timestamp:
                    Date.now(),
                })
              }
            >
              VÍDEO
            </button>

            <button
              onClick={() =>
                send({
                  type: "SILENCE",
                  timestamp:
                    Date.now(),
                })
              }
            >
              SILENCIO
            </button>

            <button
              className={
                blackout
                  ? styles.blackoutActive
                  : undefined
              }
              onClick={
                toggleBlackout
              }
            >
              {blackout
                ? "SALIR DE NEGRO"
                : "NEGRO"}
            </button>
          </section>

          <section
            className={
              styles.transport
            }
          >
            <button
              onClick={
                previousScene
              }
            >
              ← ANTERIOR
            </button>

            <button
              className={
                styles.launch
              }
              onClick={() =>
                launchScene(
                  activeScene,
                )
              }
            >
              ● LANZAR ESCENA
            </button>

            <button
              onClick={
                nextScene
              }
            >
              SIGUIENTE →
            </button>
          </section>
        </section>

        <aside
          className={
            styles.rightRail
          }
        >
          <section>
            <span>
              ORGANISMO
            </span>

            <h2>
              Corazón Vivo
            </h2>

            <div
              className={
                styles.organism
              }
            >
              ♥
            </div>

            <small>
              Dirección disponible
            </small>
          </section>

          <section>
            <span>
              PRÓXIMOS MÓDULOS
            </span>

            <div
              className={
                styles.future
              }
            >
              <p>
                Campo visual
              </p>

              <p>
                Banda sonora
              </p>

              <p>
                Cámara
              </p>

              <p>
                Archivo Universal
              </p>

              <p>
                Chat y público
              </p>

              <p>
                Grabación maestra
              </p>
            </div>
          </section>
        </aside>
      </section>
    
      <section
        className={styles.liveVoices}
      >
        <header
          className={
            styles.liveVoicesHeader
          }
        >
          <span>
            PÚBLICO · EN TIEMPO REAL
          </span>

          <h2>
            Voces
          </h2>
        </header>

        {chatError && (
          <p
            className={
              styles.voiceError
            }
          >
            {chatError}
          </p>
        )}

        {!chatError &&
          chatMessages.length === 0 && (
            <p
              className={
                styles.voiceEmpty
              }
            >
              Aún no hay voces.
            </p>
          )}

        <div
          className={
            styles.voiceList
          }
        >
          {chatMessages
            .slice()
            .reverse()
            .map(
              (message) => (
                <article
                  key={
                    message.id
                  }
                  className={
                    styles.voice
                  }
                >
                  <div
                    className={
                      styles.voiceBody
                    }
                  >
                    <div
                      className={
                        styles.voiceMeta
                      }
                    >
                      <strong>
                        {
                          message.user_name
                        }
                      </strong>

                      {message.user_place && (
                        <span>
                          {" · "}
                          {
                            message.user_place
                          }
                        </span>
                      )}
                    </div>

                    <p>
                      {message.text}
                    </p>
                  </div>

                  <button
                    type="button"
                    className={
                      styles.projectVoice
                    }
                    onClick={() =>
                      projectMessage(
                        message,
                      )
                    }
                  >
                    PROYECTAR
                  </button>
                </article>
              ),
            )}
        </div>
      </section>

</main>
  );
}
