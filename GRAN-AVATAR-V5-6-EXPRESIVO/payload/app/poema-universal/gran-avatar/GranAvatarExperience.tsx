"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { GRAN_AVATAR_MEDIA, GRAN_AVATAR_MAX_MESSAGE_CHARS, GRAN_AVATAR_MAX_POEM_CHARS } from "./avatarConfig";
import AvatarBody, {
  type AvatarBodyHandle,
} from "./components/AvatarBody";
import {
  deleteAvatarPoem,
  listAvatarPoems,
  saveAvatarPoem,
} from "./lib/avatarArchiveStore";
import {
  attachAvatarVoice,
  silenceAvatarVoice,
} from "./lib/avatarVoiceSignal";
import { setAvatarPerformanceProfile } from "./lib/avatarPerformanceSignal";
import {
  attachAvatarLipTimeline,
  buildApproximateVisemeTimeline,
  buildVisemeTimeline,
  silenceAvatarLipSync,
  type AvatarWordTiming,
} from "./lib/avatarLipSync";
import type {
  AvatarConversationMessage,
  AvatarLifeState,
  AvatarPoemRecord,
  AvatarPresenceState,
} from "./types";

import styles from "./gran-avatar.module.css";

type InputMode = "write" | "paste" | "file";
type VoiceMode = "reading" | "speaking";

const STATE_LABELS: Record<AvatarPresenceState, string> = {
  idle: "Presencia atenta",
  receiving: "Recibiendo el poema",
  thinking: "Leyendo en silencio",
  listening: "Escuchando",
  reading: "Dando voz al poema",
  speaking: "Respondiendo",
  paused: "Lectura suspendida",
  error: "La presencia espera",
};

const LIFE_LABELS: Record<AvatarLifeState, string> = {
  sleeping: "Película local",
  connecting: "Apareciendo",
  alive: "Organismo vivo",
  organism: "Presencia propia",
  cinematic: "Presencia cinematográfica",
  synchronized: "Voz y rostro sincronizados",
  unconfigured: "Vida preparada",
  error: "Umbral cerrado",
};

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function deriveTitle(text: string) {
  const firstLine = text
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);

  if (!firstLine) return "Poema sin título";
  return firstLine.length > 58
    ? `${firstLine.slice(0, 55).trim()}…`
    : firstLine;
}

function formatArchiveDate(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("es", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function splitVoiceText(text: string, maximum = 1_100) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);

  const chunks: string[] = [];

  for (const paragraph of paragraphs) {
    if (paragraph.length <= maximum) {
      chunks.push(paragraph);
      continue;
    }

    const sentences = paragraph.split(/(?<=[.!?…])\s+/);
    let current = "";

    for (const sentence of sentences) {
      if (sentence.length > maximum) {
        if (current) {
          chunks.push(current);
          current = "";
        }

        for (let start = 0; start < sentence.length; start += maximum) {
          chunks.push(sentence.slice(start, start + maximum));
        }
        continue;
      }

      const candidate = current
        ? `${current} ${sentence}`
        : sentence;

      if (candidate.length > maximum) {
        chunks.push(current);
        current = sentence;
      } else {
        current = candidate;
      }
    }

    if (current) chunks.push(current);
  }

  return chunks.length > 0 ? chunks : [text.trim()];
}

async function requestVoiceAlignment(
  blob: Blob,
  text: string,
): Promise<AvatarWordTiming[]> {
  try {
    const formData = new FormData();
    formData.append("audio", blob, "gran-avatar-voice.mp3");
    formData.append("text", text);

    const response = await fetch(
      "/api/poema-universal/gran-avatar/align",
      { method: "POST", body: formData },
    );

    if (!response.ok) return [];
    const payload = (await response.json()) as { words?: AvatarWordTiming[] };
    return Array.isArray(payload.words) ? payload.words : [];
  } catch (error) {
    console.warn("La alineación precisa no estuvo disponible.", error);
    return [];
  }
}

async function waitForAudioMetadata(audio: HTMLAudioElement) {
  if (audio.readyState >= 1 && Number.isFinite(audio.duration)) {
    return audio.duration;
  }

  return await new Promise<number>((resolve) => {
    const finish = () => {
      cleanup();
      resolve(Number.isFinite(audio.duration) ? audio.duration : 0);
    };
    const timeout = window.setTimeout(finish, 8_000);
    const cleanup = () => {
      window.clearTimeout(timeout);
      audio.removeEventListener("loadedmetadata", finish);
      audio.removeEventListener("durationchange", finish);
    };
    audio.addEventListener("loadedmetadata", finish, { once: true });
    audio.addEventListener("durationchange", finish, { once: true });
  });
}

function makeMessage(
  role: AvatarConversationMessage["role"],
  content: string,
): AvatarConversationMessage {
  return {
    id: createId(role),
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

export default function GranAvatarExperience() {
  const [inputMode, setInputMode] = useState<InputMode>("write");
  const [draftTitle, setDraftTitle] = useState("");
  const [draftText, setDraftText] = useState("");
  const [archive, setArchive] = useState<AvatarPoemRecord[]>([]);
  const [currentPoem, setCurrentPoem] =
    useState<AvatarPoemRecord | null>(null);
  const [presenceState, setPresenceState] =
    useState<AvatarPresenceState>("idle");
  const [messages, setMessages] = useState<
    AvatarConversationMessage[]
  >([
    makeMessage(
      "assistant",
      "Estoy aquí. Entrégame un poema o pregúntame por una obra, una voz o una forma literaria.",
    ),
  ]);
  const [messageDraft, setMessageDraft] = useState("");
  const [notice, setNotice] = useState(
    "El archivo permanece únicamente en este navegador.",
  );
  const [voiceProgress, setVoiceProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [lifeState, setLifeState] =
    useState<AvatarLifeState>("sleeping");

  const avatarBodyRef = useRef<AvatarBodyHandle>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const voiceSignalCleanupRef = useRef<(() => void) | null>(null);
  const lipSyncCleanupRef = useRef<(() => void) | null>(null);
  const voiceSessionRef = useRef(0);
  const voiceModeRef = useRef<VoiceMode>("reading");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordingPartsRef = useRef<Blob[]>([]);
  const conversationRef = useRef<HTMLDivElement>(null);

  const characterCount = draftText.length;
  const canLoadPoem =
    draftText.trim().length >= 3 &&
    characterCount <= GRAN_AVATAR_MAX_POEM_CHARS;

  const recentArchive = useMemo(() => archive.slice(0, 6), [archive]);

  const refreshArchive = useCallback(async () => {
    try {
      setArchive(await listAvatarPoems());
    } catch (error) {
      console.error(error);
      setNotice("No fue posible abrir la biblioteca local.");
    }
  }, []);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      void refreshArchive();
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [refreshArchive]);

  useEffect(() => {
    conversationRef.current?.scrollTo({
      top: conversationRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, presenceState]);

  const stopVoice = useCallback((returnToIdle = true) => {
    voiceSessionRef.current += 1;
    avatarBodyRef.current?.interrupt();
    voiceSignalCleanupRef.current?.();
    voiceSignalCleanupRef.current = null;
    lipSyncCleanupRef.current?.();
    lipSyncCleanupRef.current = null;
    silenceAvatarVoice();
    silenceAvatarLipSync();
    const audio = audioRef.current;

    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }

    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }

    setVoiceProgress(0);
    if (returnToIdle) setPresenceState("idle");
  }, []);

  useEffect(() => {
    return () => {
      stopVoice(false);
      mediaStreamRef.current
        ?.getTracks()
        .forEach((track) => track.stop());
    };
  }, [stopVoice]);

  const playVoice = useCallback(
    async (text: string, mode: VoiceMode) => {
      const cleanText = text.trim();
      if (!cleanText) return;

      stopVoice(false);
      const session = voiceSessionRef.current;
      const chunks = splitVoiceText(cleanText);
      voiceModeRef.current = mode;
      const performanceProfile = setAvatarPerformanceProfile(cleanText, mode);
      setPresenceState(mode);
      setNotice(
        mode === "reading"
          ? "La voz entra en modo de recitación contenida."
          : performanceProfile === "intense"
            ? "La presencia reconoce una reflexión de mayor intensidad."
            : "La presencia prepara una respuesta natural.",
      );

      try {
        for (let index = 0; index < chunks.length; index += 1) {
          if (session !== voiceSessionRef.current) return;

          const spokenLive = await avatarBodyRef.current?.speak(
            chunks[index],
            mode,
          );
          if (spokenLive) {
            setVoiceProgress((index + 1) / chunks.length);
            continue;
          }

          const response = await fetch(
            "/api/poema-universal/gran-avatar/voice",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                text: chunks[index],
                purpose: mode,
              }),
            },
          );

          if (!response.ok) {
            const payload = (await response.json().catch(() => null)) as
              | { error?: string }
              | null;
            throw new Error(
              payload?.error ?? "No fue posible crear la voz.",
            );
          }

          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          audioUrlRef.current = objectUrl;

          const audio = new Audio();
          audioRef.current = audio;
          audio.src = objectUrl;
          audio.playbackRate = playbackRate;
          audio.preload = "auto";

          setNotice(
            mode === "reading"
              ? "Alineando las palabras con el rostro…"
              : "Alineando la respuesta con el rostro…",
          );

          const alignmentPromise = requestVoiceAlignment(
            blob,
            chunks[index],
          );
          const durationPromise = waitForAudioMetadata(audio);
          audio.load();

          const [wordTimings, duration] = await Promise.all([
            alignmentPromise,
            durationPromise,
          ]);

          if (session !== voiceSessionRef.current) return;

          const lipCues = wordTimings.length > 0
            ? buildVisemeTimeline(wordTimings)
            : buildApproximateVisemeTimeline(chunks[index], duration);

          const detachVoiceSignal = await attachAvatarVoice(audio);
          const detachLipSync = attachAvatarLipTimeline(audio, lipCues);
          voiceSignalCleanupRef.current = detachVoiceSignal;
          lipSyncCleanupRef.current = detachLipSync;

          setNotice(
            wordTimings.length > 0
              ? "Sincronización labial activa · marcas de palabra."
              : "Sincronización labial activa · alineación aproximada.",
          );

          try {
            await new Promise<void>((resolve, reject) => {
              audio.ontimeupdate = () => {
                const localProgress = Number.isFinite(audio.duration)
                  ? audio.currentTime / audio.duration
                  : 0;
                setVoiceProgress(
                  (index + localProgress) / chunks.length,
                );
              };
              audio.onended = () => resolve();
              audio.onerror = () =>
                reject(new Error("La voz no pudo reproducirse."));
              void audio.play().catch(reject);
            });
          } finally {
            detachLipSync();
            detachVoiceSignal();
            if (lipSyncCleanupRef.current === detachLipSync) {
              lipSyncCleanupRef.current = null;
            }
            if (voiceSignalCleanupRef.current === detachVoiceSignal) {
              voiceSignalCleanupRef.current = null;
            }
            if (audioRef.current === audio) audioRef.current = null;
          }

          URL.revokeObjectURL(objectUrl);
          if (audioUrlRef.current === objectUrl) {
            audioUrlRef.current = null;
          }
        }

        if (session === voiceSessionRef.current) {
          setVoiceProgress(1);
          setPresenceState("idle");
          setNotice("La voz y el rostro han vuelto al silencio.");
        }
      } catch (error) {
        if (session !== voiceSessionRef.current) return;
        console.error(error);
        setPresenceState("error");
        setNotice(
          error instanceof Error
            ? error.message
            : "La voz no pudo atravesar la sala.",
        );
      }
    },
    [playbackRate, stopVoice],
  );

  async function askAvatar(
    userText: string,
    poem: AvatarPoemRecord | null,
    history = messages,
  ) {
    const cleanText = userText.trim();
    if (!cleanText) return;

    const userMessage = makeMessage("user", cleanText);
    const nextHistory = [...history, userMessage];
    setMessages(nextHistory);
    setPresenceState("thinking");
    setNotice("La presencia vuelve sobre las palabras.");

    try {
      const response = await fetch(
        "/api/poema-universal/gran-avatar/converse",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            poem: poem
              ? {
                  title: poem.title,
                  text: poem.text,
                  language: poem.language,
                }
              : null,
            messages: nextHistory.slice(-12).map((message) => ({
              role: message.role,
              content: message.content,
            })),
          }),
        },
      );

      const payload = (await response.json()) as {
        reply?: string;
        error?: string;
      };

      if (!response.ok || !payload.reply) {
        throw new Error(
          payload.error ?? "La presencia no encontró palabras.",
        );
      }

      setMessages((current) => [
        ...current,
        makeMessage("assistant", payload.reply ?? ""),
      ]);
      setNotice("La conversación permanece abierta.");
      await playVoice(payload.reply, "speaking");
    } catch (error) {
      console.error(error);
      setPresenceState("error");
      setNotice(
        error instanceof Error
          ? error.message
          : "La conversación se interrumpió.",
      );
    }
  }

  async function loadPoem() {
    const text = draftText.trim();
    if (!canLoadPoem || !text) return;

    setPresenceState("receiving");
    const now = new Date().toISOString();
    const existing = archive.find(
      (item) => item.text === text,
    );
    const poem: AvatarPoemRecord = {
      id: existing?.id ?? createId("poem"),
      title: draftTitle.trim() || deriveTitle(text),
      text,
      language: "es",
      ...(existing?.sourceName
        ? { sourceName: existing.sourceName }
        : {}),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    try {
      await saveAvatarPoem(poem);
      setCurrentPoem(poem);
      const opening = makeMessage(
        "assistant",
        `He recibido «${poem.title}». Lo leeré sin corregirlo y sin confundir su silencio con una carencia.`,
      );
      setMessages([opening]);
      await refreshArchive();
      setNotice("El poema ha entrado en la memoria local.");
      await askAvatar(
        "¿Qué has percibido primero al leer este poema?",
        poem,
        [opening],
      );
    } catch (error) {
      console.error(error);
      setPresenceState("error");
      setNotice("No fue posible guardar el poema.");
    }
  }

  async function selectArchivePoem(poem: AvatarPoemRecord) {
    stopVoice();
    setCurrentPoem(poem);
    setDraftTitle(poem.title);
    setDraftText(poem.text);
    setMessages([
      makeMessage(
        "assistant",
        `«${poem.title}» vuelve a estar entre nosotros. Puedes pedirme que lo lea o conversar sobre él.`,
      ),
    ]);
    setNotice("El poema ha regresado desde la biblioteca.");
  }

  async function removeArchivePoem(poem: AvatarPoemRecord) {
    const confirmed = window.confirm(
      `¿Retirar «${poem.title}» de la biblioteca local?`,
    );
    if (!confirmed) return;

    await deleteAvatarPoem(poem.id);
    if (currentPoem?.id === poem.id) setCurrentPoem(null);
    await refreshArchive();
    setNotice("El poema ha sido retirado del archivo local.");
  }

  async function handleFile(file: File | null) {
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !["txt", "md", "text"].includes(extension)) {
      setNotice(
        "Esta primera versión recibe archivos TXT y Markdown.",
      );
      return;
    }

    const text = await file.text();
    if (text.length > GRAN_AVATAR_MAX_POEM_CHARS) {
      setNotice(
        `El archivo supera los ${GRAN_AVATAR_MAX_POEM_CHARS.toLocaleString("es")} caracteres.`,
      );
      return;
    }

    setDraftText(text);
    setDraftTitle(deriveTitle(text));
    setInputMode("file");
    setNotice(`Archivo recibido: ${file.name}`);
  }

  async function submitMessage() {
    if (!messageDraft.trim()) return;
    const text = messageDraft.trim();
    setMessageDraft("");
    await askAvatar(text, currentPoem);
  }

  async function toggleRecording() {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      return;
    }

    if (
      !("MediaRecorder" in window) ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      setNotice(
        "Este navegador no permite grabar la voz.",
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      mediaStreamRef.current = stream;
      recordingPartsRef.current = [];

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingPartsRef.current.push(event.data);
        }
      };
      recorder.onstop = async () => {
        setIsRecording(false);
        stream.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;

        const blob = new Blob(recordingPartsRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        if (blob.size === 0) {
          setPresenceState("idle");
          return;
        }

        setPresenceState("thinking");
        setNotice("La voz está atravesando la sala.");

        try {
          const data = new FormData();
          data.append("audio", blob, "voz.webm");
          const response = await fetch(
            "/api/poema-universal/gran-avatar/transcribe",
            { method: "POST", body: data },
          );
          const payload = (await response.json()) as {
            text?: string;
            error?: string;
          };
          if (!response.ok || !payload.text) {
            throw new Error(
              payload.error ?? "No pude reconocer la voz.",
            );
          }
          await askAvatar(payload.text, currentPoem);
        } catch (error) {
          setPresenceState("error");
          setNotice(
            error instanceof Error
              ? error.message
              : "No pude reconocer la voz.",
          );
        }
      };

      recorder.start();
      setIsRecording(true);
      setPresenceState("listening");
      setNotice("Habla. La presencia está escuchando.");
    } catch (error) {
      console.error(error);
      setPresenceState("error");
      setNotice("El permiso del micrófono no fue concedido.");
    }
  }

  function togglePause() {
    const audio = audioRef.current;
    if (!audio || !audio.src) {
      if (lifeState === "alive" && voiceActive) {
        avatarBodyRef.current?.interrupt();
        voiceSessionRef.current += 1;
        setVoiceProgress(0);
        setPresenceState("idle");
        setNotice("La voz ha sido interrumpida.");
      }
      return;
    }

    if (audio.paused) {
      audio.playbackRate = playbackRate;
      void audio.play();
      setPresenceState(voiceModeRef.current);
    } else {
      audio.pause();
      setPresenceState("paused");
    }
  }

  function cyclePlaybackRate() {
    const nextRate =
      playbackRate === 0.8 ? 1 : playbackRate === 1 ? 1.2 : 0.8;
    setPlaybackRate(nextRate);
    if (audioRef.current) audioRef.current.playbackRate = nextRate;
  }

  const voiceActive = ["reading", "speaking", "paused"].includes(
    presenceState,
  );

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/poema-universal" className={styles.wordmark}>
          <span>Poema</span>
          <span>Universal</span>
        </Link>

        <nav className={styles.headerNavigation} aria-label="El Gran Avatar">
          <a href="#avatar">Avatar vivo</a>
          <a href="#biblioteca">Biblioteca</a>
          <Link href="/poema-universal/presencias">Autores</Link>
          <Link href="/poema-universal#mundo">Mapa de voces</Link>
          <Link href="/poema-universal#manifiesto">Acerca de</Link>
        </nav>

        <div className={styles.sessionState}>
          <i aria-hidden="true" />
          Archivo local · privado
        </div>
      </header>

      <div className={styles.experienceGrid}>
        <aside className={styles.poemPanel} aria-labelledby="load-poem-title">
          <div className={styles.panelHeading}>
            <p>Umbral de entrada</p>
            <h1 id="load-poem-title">Carga tu poema</h1>
          </div>

          <div className={styles.inputModes} aria-label="Forma de entrada">
            {(
              [
                ["write", "Escribe"],
                ["paste", "Pega texto"],
                ["file", "Sube archivo"],
              ] as const
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                className={inputMode === mode ? styles.activeMode : ""}
                onClick={() => {
                  setInputMode(mode);
                  if (mode === "file") fileInputRef.current?.click();
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <label className={styles.titleField}>
            <span>Título</span>
            <input
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              placeholder="Sin título"
              maxLength={120}
            />
          </label>

          <label className={styles.poemField}>
            <span className={styles.visuallyHidden}>Texto del poema</span>
            <textarea
              value={draftText}
              onChange={(event) => setDraftText(event.target.value)}
              placeholder={
                inputMode === "paste"
                  ? "Pega aquí el poema…"
                  : "Escribe aquí…"
              }
              maxLength={GRAN_AVATAR_MAX_POEM_CHARS}
            />
          </label>

          <input
            ref={fileInputRef}
            className={styles.hiddenInput}
            type="file"
            accept=".txt,.md,.text,text/plain,text/markdown"
            onChange={(event) => {
              void handleFile(event.target.files?.[0] ?? null);
              event.currentTarget.value = "";
            }}
          />

          <div className={styles.poemActions}>
            <span>
              {characterCount.toLocaleString("es")} /{" "}
              {GRAN_AVATAR_MAX_POEM_CHARS.toLocaleString("es")}
            </span>
            <button
              type="button"
              disabled={!canLoadPoem}
              onClick={() => void loadPoem()}
            >
              Cargar poema
            </button>
          </div>

          <section id="biblioteca" className={styles.library}>
            <div className={styles.libraryHeading}>
              <h2>Biblioteca reciente</h2>
              <span>{archive.length.toString().padStart(2, "0")}</span>
            </div>

            {recentArchive.length > 0 ? (
              <ol>
                {recentArchive.map((poem) => (
                  <li key={poem.id}>
                    <button
                      type="button"
                      className={styles.libraryPoem}
                      onClick={() => void selectArchivePoem(poem)}
                    >
                      <strong>{poem.title}</strong>
                      <span>{formatArchiveDate(poem.updatedAt)}</span>
                    </button>
                    <button
                      type="button"
                      className={styles.removePoem}
                      aria-label={`Retirar ${poem.title}`}
                      title="Retirar del archivo local"
                      onClick={() => void removeArchivePoem(poem)}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ol>
            ) : (
              <p className={styles.emptyLibrary}>
                Todavía no hay poemas guardados.
              </p>
            )}
          </section>
        </aside>

        <section id="avatar" className={styles.avatarStage}>
          <div className={styles.avatarIdentity}>
            <i aria-hidden="true" />
            <div>
              <p>El Gran Avatar</p>
              <span>{STATE_LABELS[presenceState]}</span>
            </div>
          </div>

          <AvatarBody
            ref={avatarBodyRef}
            media={GRAN_AVATAR_MEDIA}
            state={presenceState}
            onLifeStateChange={setLifeState}
          />

          <div className={styles.avatarTelemetry} aria-label="Estado del avatar">
            <dl>
              <div>
                <dt>Vida</dt>
                <dd>{LIFE_LABELS[lifeState]}</dd>
              </div>
              <div>
                <dt>Memoria</dt>
                <dd>{archive.length} poemas</dd>
              </div>
              <div>
                <dt>Voz</dt>
                <dd>TTS · visemas</dd>
              </div>
              <div>
                <dt>Idioma</dt>
                <dd>ES · primera voz</dd>
              </div>
            </dl>
          </div>

          <blockquote className={styles.avatarMotto}>
            La poesía no se lee.
            <em>Se habita.</em>
          </blockquote>

          <div className={styles.currentReading}>
            <span>
              {currentPoem ? "Poema presente" : "La mesa espera"}
            </span>
            <strong>
              {currentPoem?.title ?? "Entrega una voz al silencio"}
            </strong>
            <div aria-hidden="true">
              <i style={{ width: `${voiceProgress * 100}%` }} />
            </div>
          </div>

          <div className={styles.readingControls}>
            <button
              type="button"
              disabled={!currentPoem}
              onClick={() => {
                if (currentPoem) {
                  void playVoice(currentPoem.text, "reading");
                }
              }}
            >
              Reproducir poema
            </button>
            <button
              type="button"
              disabled={!voiceActive}
              onClick={togglePause}
            >
              {lifeState === "alive"
                ? "Interrumpir"
                : presenceState === "paused"
                  ? "Continuar"
                  : "Pausar"}
            </button>
            <button
              type="button"
              disabled={lifeState === "alive"}
              title={
                lifeState === "alive"
                  ? "La presencia viva conserva su ritmo humano."
                  : "Cambiar ritmo de lectura"
              }
              onClick={cyclePlaybackRate}
            >
              Ritmo · {playbackRate.toFixed(1)}×
            </button>
            <button
              type="button"
              disabled={!voiceActive}
              onClick={() => stopVoice()}
            >
              Detener
            </button>
          </div>
        </section>

        <aside className={styles.conversationPanel} aria-labelledby="conversation-title">
          <div className={styles.panelHeading}>
            <p>La presencia escucha</p>
            <h2 id="conversation-title">Conversa con el avatar</h2>
          </div>

          <div
            ref={conversationRef}
            className={styles.conversation}
            aria-live="polite"
          >
            {messages.map((message) => (
              <article
                key={message.id}
                className={
                  message.role === "assistant"
                    ? styles.avatarMessage
                    : styles.userMessage
                }
              >
                <span>
                  {message.role === "assistant" ? "Avatar" : "Tú"}
                </span>
                <p>{message.content}</p>
                {message.role === "assistant" && (
                  <button
                    type="button"
                    onClick={() =>
                      void playVoice(message.content, "speaking")
                    }
                  >
                    Dar voz
                  </button>
                )}
              </article>
            ))}

            {presenceState === "thinking" && (
              <p className={styles.thinking}>
                <i />
                <i />
                <i />
                <span className={styles.visuallyHidden}>Pensando</span>
              </p>
            )}
          </div>

          <div className={styles.messageComposer}>
            <label>
              <span className={styles.visuallyHidden}>
                Mensaje para el Gran Avatar
              </span>
              <textarea
                value={messageDraft}
                onChange={(event) => setMessageDraft(event.target.value)}
                placeholder={
                  currentPoem
                    ? "Habla sobre el poema…"
                    : "Pregunta por literatura…"
                }
                maxLength={GRAN_AVATAR_MAX_MESSAGE_CHARS}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey &&
                    messageDraft.trim()
                  ) {
                    event.preventDefault();
                    void submitMessage();
                  }
                }}
              />
            </label>
            <button
              type="button"
              disabled={!messageDraft.trim()}
              onClick={() => void submitMessage()}
            >
              Enviar
            </button>
          </div>

          <div className={styles.voiceConversation}>
            <button
              type="button"
              className={isRecording ? styles.recording : ""}
              aria-pressed={isRecording}
              onClick={() => void toggleRecording()}
            >
              <span aria-hidden="true">◉</span>
              {isRecording ? "Terminar escucha" : "Hablar al avatar"}
            </button>
          </div>

          <div className={styles.presencePrinciples}>
            <h3>El avatar vive aquí</h3>
            <ul>
              <li>
                <strong>Observa</strong>
                <span>No corrige antes de escuchar.</span>
              </li>
              <li>
                <strong>Responde</strong>
                <span>No sustituye la voz del poeta.</span>
              </li>
              <li>
                <strong>Recuerda</strong>
                <span>Solo en este navegador.</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <footer className={styles.footer}>
        <div>
          <i aria-hidden="true" />
          El Gran Avatar · {STATE_LABELS[presenceState]}
        </div>
        <p aria-live="polite">{notice}</p>
        <Link href="/poema-universal">Volver a Poema Universal</Link>
      </footer>
    </main>
  );
}
