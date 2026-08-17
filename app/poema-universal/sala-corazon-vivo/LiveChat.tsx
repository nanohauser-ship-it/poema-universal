"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import {
  createClient,
  type RealtimeChannel,
} from "@supabase/supabase-js";

import styles from "./LiveChat.module.css";

type ChatMessage = {
  id: string;
  room_id: string;
  user_name: string;
  user_place: string | null;
  text: string;
  created_at: string;
};

type LiveChatProps = {
  roomId?: string;

  onMessage?: (
    message: string,
  ) => void;
};

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(
        supabaseUrl,
        supabaseAnonKey,
      )
    : null;

const STORAGE_NAME =
  "poema-universal-chat-name";

const STORAGE_PLACE =
  "poema-universal-chat-place";

export default function LiveChat({
  roomId = "sala-corazon-vivo",
  onMessage,
}: LiveChatProps) {
  const [messages, setMessages] =
    useState<ChatMessage[]>([]);

  const [name, setName] =
    useState("");

  const [place, setPlace] =
    useState("");

  const [text, setText] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState("");

  const [connected, setConnected] =
    useState(false);

  const scrollRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  useEffect(() => {
    setName(
      localStorage.getItem(
        STORAGE_NAME,
      ) ?? "",
    );

    setPlace(
      localStorage.getItem(
        STORAGE_PLACE,
      ) ?? "",
    );
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);

      setError(
        "Supabase no está configurado.",
      );

      return;
    }

    let mounted = true;

    let channel:
      | RealtimeChannel
      | null = null;

    async function loadMessages() {
      const {
        data,
        error: readError,
      } = await supabase!
        .from("live_chat_messages")
        .select("*")
        .eq(
          "room_id",
          roomId,
        )
        .order(
          "created_at",
          {
            ascending: true,
          },
        )
        .limit(100);

      if (!mounted) return;

      if (readError) {
        setError(
          readError.message,
        );

        setLoading(false);

        return;
      }

      setMessages(
        (data ?? []) as ChatMessage[],
      );

      setLoading(false);
    }

    void loadMessages();

    channel = supabase
      .channel(
        `live-chat:${roomId}`,
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table:
            "live_chat_messages",
          filter:
            `room_id=eq.${roomId}`,
        },
        (payload) => {
          const incoming =
            payload.new as ChatMessage;

          setMessages(
            (current) => {
              if (
                current.some(
                  (item) =>
                    item.id ===
                    incoming.id,
                )
              ) {
                return current;
              }

              return [
                ...current,
                incoming,
              ].slice(-100);
            },
          );

          onMessage?.(
            incoming.text,
          );
        },
      )
      .subscribe((status) => {
        setConnected(
          status === "SUBSCRIBED",
        );
      });

    return () => {
      mounted = false;

      if (
        channel &&
        supabase
      ) {
        void supabase.removeChannel(
          channel,
        );
      }
    };
  }, [
    roomId,
    onMessage,
  ]);

  useEffect(() => {
    const element =
      scrollRef.current;

    if (!element) return;

    element.scrollTo({
      top:
        element.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function sendMessage(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const cleanName =
      name.trim();

    const cleanPlace =
      place.trim();

    const cleanText =
      text.trim();

    if (!cleanName) {
      setError(
        "Escribe tu nombre.",
      );

      return;
    }

    if (!cleanText) {
      return;
    }

    if (!supabase) {
      setError(
        "Supabase no está configurado.",
      );

      return;
    }

    setSending(true);
    setError("");

    localStorage.setItem(
      STORAGE_NAME,
      cleanName,
    );

    localStorage.setItem(
      STORAGE_PLACE,
      cleanPlace,
    );

    const {
      error: insertError,
    } = await supabase
      .from(
        "live_chat_messages",
      )
      .insert({
        room_id: roomId,
        user_name:
          cleanName.slice(
            0,
            60,
          ),
        user_place:
          cleanPlace
            ? cleanPlace.slice(
                0,
                80,
              )
            : null,
        text:
          cleanText.slice(
            0,
            500,
          ),
      });

    if (insertError) {
      setError(
        insertError.message,
      );

      setSending(false);

      return;
    }

    setText("");
    setSending(false);
  }

  return (
    <section
      className={styles.chat}
    >
      <header
        className={styles.header}
      >
        <div>
          <span>
            EN TIEMPO REAL
          </span>

          <h2>
            Chat Vivo
          </h2>
        </div>

        <div
          className={
            connected
              ? styles.statusOn
              : styles.statusOff
          }
        >
          ●{" "}
          {connected
            ? "CONECTADO"
            : "CONECTANDO"}
        </div>
      </header>

      <div
        ref={scrollRef}
        className={
          styles.messages
        }
      >
        {loading && (
          <div
            className={
              styles.empty
            }
          >
            Abriendo la sala…
          </div>
        )}

        {!loading &&
          messages.length === 0 &&
          !error && (
            <div
              className={
                styles.empty
              }
            >
              Aún no hay voces.
              Puedes ser la primera.
            </div>
          )}

        {messages.map(
          (message) => (
            <article
              key={message.id}
              className={
                styles.message
              }
            >
              <header>
                <strong>
                  {message.user_name}
                </strong>

                {message.user_place && (
                  <span>
                    {
                      message.user_place
                    }
                  </span>
                )}

                <time>
                  {new Date(
                    message.created_at,
                  ).toLocaleTimeString(
                    "es-ES",
                    {
                      hour:
                        "2-digit",
                      minute:
                        "2-digit",
                    },
                  )}
                </time>
              </header>

              <p>
                {message.text}
              </p>
            </article>
          ),
        )}
      </div>

      <form
        className={styles.form}
        onSubmit={sendMessage}
      >
        <div
          className={
            styles.identity
          }
        >
          <input
            value={name}
            maxLength={60}
            onChange={(event) =>
              setName(
                event.target.value,
              )
            }
            placeholder="Tu nombre"
            aria-label="Tu nombre"
          />

          <input
            value={place}
            maxLength={80}
            onChange={(event) =>
              setPlace(
                event.target.value,
              )
            }
            placeholder="Lugar · opcional"
            aria-label="Lugar"
          />
        </div>

        <div
          className={
            styles.composer
          }
        >
          <textarea
            value={text}
            maxLength={500}
            onChange={(event) =>
              setText(
                event.target.value,
              )
            }
            placeholder="Escribe algo para la sala…"
            aria-label="Mensaje"
          />

          <button
            type="submit"
            disabled={
              sending ||
              !text.trim()
            }
          >
            {sending
              ? "ENVIANDO…"
              : "ENVIAR"}
          </button>
        </div>

        <footer>
          <span>
            {text.length}/500
          </span>

          <span>
            Los mensajes alimentan
            al Organismo Vivo.
          </span>
        </footer>

        {error && (
          <p
            className={
              styles.error
            }
          >
            {error}
          </p>
        )}
      </form>
    </section>
  );
}
