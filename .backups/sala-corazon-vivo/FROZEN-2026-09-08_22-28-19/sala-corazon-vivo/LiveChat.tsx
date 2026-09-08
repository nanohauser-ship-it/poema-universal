"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import {
  supabaseBrowser as supabase,
} from "../../../lib/supabaseClient";

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
  onMessage?: (message: string) => void;
  onPresenceChange?: (count: number) => void;
};

const STORAGE_NAME =
  "poema-universal-chat-name";

const STORAGE_PLACE =
  "poema-universal-chat-place";

const STORAGE_VISITOR =
  "poema-universal-visitor-id";

function getVisitorId() {
  const stored =
    localStorage.getItem(
      STORAGE_VISITOR,
    );

  if (stored) return stored;

  const id =
    crypto.randomUUID();

  localStorage.setItem(
    STORAGE_VISITOR,
    id,
  );

  return id;
}

export default function LiveChat({
  roomId = "sala-corazon-vivo",
  onMessage,
  onPresenceChange,
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

  const [
    presenceCount,
    setPresenceCount,
  ] = useState(0);

  const scrollRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const onMessageRef =
    useRef(onMessage);

  const onPresenceChangeRef =
    useRef(onPresenceChange);

  useEffect(() => {
    onMessageRef.current =
      onMessage;
  }, [onMessage]);

  useEffect(() => {
    onPresenceChangeRef.current =
      onPresenceChange;
  }, [onPresenceChange]);

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
    let active = true;

    const visitorId =
      getVisitorId();

    async function loadMessages() {
      const {
        data,
        error: readError,
      } = await supabase
        .from(
          "live_chat_messages",
        )
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
        .limit(80);

      if (!active) return;

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

    const channel =
      supabase.channel(
        `live-room:${roomId}`,
        {
          config: {
            presence: {
              key: visitorId,
            },
          },
        },
      );

    channel.on(
      "presence",
      {
        event: "sync",
      },
      () => {
        const state =
          channel.presenceState();

        const count =
          Object.keys(state).length;

        setPresenceCount(count);

        onPresenceChangeRef.current?.(
          count,
        );
      },
    );

    channel.on(
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
            ].slice(-80);
          },
        );

        onMessageRef.current?.(
          incoming.text,
        );
      },
    );

    channel.subscribe(
      async (status) => {
        if (
          status !==
          "SUBSCRIBED"
        ) {
          return;
        }

        await channel.track({
          online_at:
            new Date()
              .toISOString(),
        });
      },
    );

    return () => {
      active = false;

      void supabase
        .removeChannel(
          channel,
        );
    };
  }, [roomId]);

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

    if (!cleanText) return;

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
      aria-label="Chat vivo"
    >
      {presenceCount > 0 && (
        <p
          className={
            styles.presence
          }
        >
          {presenceCount}{" "}
          {presenceCount === 1
            ? "presente"
            : "presentes"}
        </p>
      )}

      <div
        ref={scrollRef}
        className={
          styles.messages
        }
      >
        {loading && (
          <p
            className={
              styles.empty
            }
          >
            Abriendo…
          </p>
        )}

        {!loading &&
          messages.length === 0 &&
          !error && (
            <p
              className={
                styles.empty
              }
            >
              Aún no hay voces.
            </p>
          )}

        {messages.map(
          (message) => (
            <article
              key={message.id}
              className={
                styles.message
              }
            >
              <div
                className={
                  styles.meta
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
            autoComplete="name"
            onChange={(event) =>
              setName(
                event.target.value,
              )
            }
            placeholder="Nombre"
            aria-label="Nombre"
          />

          <input
            value={place}
            maxLength={80}
            onChange={(event) =>
              setPlace(
                event.target.value,
              )
            }
            placeholder="Lugar"
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
            rows={2}
            onChange={(event) =>
              setText(
                event.target.value,
              )
            }
            placeholder="Escribe algo…"
            aria-label="Mensaje"
          />

          <button
            type="submit"
            aria-label="Enviar mensaje"
            disabled={
              sending ||
              !text.trim()
            }
          >
            {sending
              ? "·"
              : "↑"}
          </button>
        </div>

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
