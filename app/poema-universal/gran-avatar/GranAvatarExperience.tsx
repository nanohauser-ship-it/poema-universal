"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { GRAN_AVATAR_BODY_MODE, GRAN_AVATAR_MEDIA, GRAN_AVATAR_MAX_MESSAGE_CHARS, GRAN_AVATAR_MAX_POEM_CHARS } from "./avatarConfig";
import AvatarBody, {
  type AvatarBodyHandle,
} from "./components/AvatarBody";
import {
  deleteAvatarPoem,
  listAvatarPoems,
  saveAvatarPoem,
} from "./lib/avatarArchiveStore";
import { primeAvatarVoice, silenceAvatarVoice } from "./lib/avatarVoiceSignal";
import { avatarPerformanceSignal, setAvatarPerformanceProfile } from "./lib/avatarPerformanceSignal";
import { createAvatarPlayback, type AvatarPlayback } from "./lib/avatarAudio";
import { splitVoiceText } from "./lib/avatarTimeline";
import { canPerform } from "./lib/avatarCapabilities";
import type {
  AvatarEmotion,
  AvatarTimelineEvent,
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
  synchronized: "Presencia audiovisual",
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
  const playbackRateRef = useRef(1);
  const [emotion, setEmotion] = useState<AvatarEmotion>("contemplative");
  const [cueTime, setCueTime] = useState("0");
  const [cueDuration, setCueDuration] = useState("2.4");
  const [cueAction, setCueAction] = useState<"silence" | AvatarEmotion>("silence");
  const [savingScore, setSavingScore] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [lifeState, setLifeState] =
    useState<AvatarLifeState>("sleeping");

  const avatarBodyRef = useRef<AvatarBodyHandle>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const playbackRef = useRef<AvatarPlayback | null>(null);
  const conversationAbortRef = useRef<AbortController | null>(null);
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
    playbackRef.current?.stop();
    playbackRef.current = null;
    avatarBodyRef.current?.interrupt();
    silenceAvatarVoice();
    avatarPerformanceSignal.silent = false;
    avatarPerformanceSignal.paused = false;
    setVoiceProgress(0);
    if (returnToIdle) setPresenceState("idle");
  }, []);

  useEffect(() => () => {
    conversationAbortRef.current?.abort();
    stopVoice(false);
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
  }, [stopVoice]);

  const playVoice = useCallback(async (text: string, mode: VoiceMode, score?: AvatarTimelineEvent[]) => {
    if (!text.trim()) return;
    conversationAbortRef.current?.abort();
    stopVoice(false);
    const session = voiceSessionRef.current;
    voiceModeRef.current = mode;
    primeAvatarVoice();
    setAvatarPerformanceProfile(text, mode, emotion);
    setPresenceState(mode);
    setNotice("Preparando la voz y sus pausas…");
    try {
      // Keep the remote body contract. Its service owns playback and timing.
      let localText = text;
      if (GRAN_AVATAR_BODY_MODE === "live") {
        const chunks = splitVoiceText(text);
        let completed = true;
        let completedChunks = 0;
        for (const chunk of chunks) {
          if (session !== voiceSessionRef.current) return;
          if (!(await avatarBodyRef.current?.speak(chunk, mode))) { completed = false; break; }
          completedChunks += 1;
        }
        if (session !== voiceSessionRef.current) return;
        if (completed) {
          setVoiceProgress(1);
          setPresenceState("idle");
          setNotice("La voz ha vuelto al silencio.");
          return;
        }
        // Preserve local fallback without repeating completed remote fragments.
        avatarBodyRef.current?.interrupt();
        localText = chunks.slice(completedChunks).join("\n\n");
        setNotice("La lectura continúa con la voz local.");
      }
      const playback = createAvatarPlayback({
        text: localText, purpose: mode, rate: playbackRateRef.current,
        score: localText === text ? score : undefined,
        onProgress: (value) => { if (session === voiceSessionRef.current) setVoiceProgress(value); },
        onReady: () => { if (session === voiceSessionRef.current) setNotice("La voz acompaña a la presencia."); },
        onEvent: (event) => {
          if (session !== voiceSessionRef.current) return;
          if (!canPerform(GRAN_AVATAR_BODY_MODE, event)) {
            // Unsupported anatomy is explicit; no misleading whole-image substitute.
            console.info(`Gran Avatar: ${event.action} requiere otro recurso corporal.`);
            return;
          }
          if (event.action === "emotion") avatarPerformanceSignal.emotion = event.emotion;
        },
      });
      playbackRef.current = playback;
      await playback.run();
      if (session !== voiceSessionRef.current) return;
      playbackRef.current = null;
      setVoiceProgress(1);
      setPresenceState("idle");
      setNotice("La voz ha vuelto al silencio.");
    } catch (error) {
      if (session !== voiceSessionRef.current) return;
      playbackRef.current = null;
      setPresenceState("error");
      setNotice(error instanceof Error ? error.message : "La voz no está disponible ahora.");
    }
  }, [emotion, stopVoice]);

  async function askAvatar(
    userText: string,
    poem: AvatarPoemRecord | null,
    history = messages,
  ) {
    const cleanText = userText.trim();
    if (!cleanText) return;
    stopVoice(false);
    conversationAbortRef.current?.abort();
    const controller = new AbortController();
    conversationAbortRef.current = controller;

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
          signal: controller.signal,
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

      const payload = (await response.json().catch(() => null)) as {
        reply?: string;
        error?: string;
      } | null;

      if (controller.signal.aborted) return;
      if (!response.ok || !payload?.reply) {
        // Service failures are recoverable UI states, not rendering exceptions.
        // The server retains the diagnostic without exposing provider details here.
        setPresenceState("error");
        setNotice(payload?.error ?? "La conversación no está disponible ahora. Puedes intentarlo de nuevo; el poema permanece intacto.");
        return;
      }

      setMessages((current) => [
        ...current,
        makeMessage("assistant", payload.reply ?? ""),
      ]);
      setNotice("La conversación permanece abierta.");
      await playVoice(payload.reply, "speaking");
    } catch (error) {
      if (controller.signal.aborted) return;
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

    conversationAbortRef.current?.abort();
    stopVoice(false);
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
      ...(existing?.score ? { score: existing.score } : {}),
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
    conversationAbortRef.current?.abort();
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

  async function updateScore(score: AvatarTimelineEvent[]) {
    if (!currentPoem || savingScore) return;
    const updated = { ...currentPoem, score, updatedAt: new Date().toISOString() };
    setSavingScore(true);
    try {
      await saveAvatarPoem(updated);
      setCurrentPoem((current) => current?.id === updated.id ? updated : current);
      await refreshArchive();
      setNotice("La dirección de lectura queda guardada con el poema.");
    } catch {
      setNotice("No se pudo guardar la dirección de lectura.");
    } finally { setSavingScore(false); }
  }

  async function addCue() {
    const time = Number(cueTime);
    const duration = Number(cueDuration);
    if (!currentPoem || !cueTime.trim() || !Number.isFinite(time) || time < 0 ||
        (cueAction === "silence" && (!cueDuration.trim() || !Number.isFinite(duration) || duration <= 0 || duration > 30))) {
      setNotice("Indica un momento válido y una pausa de hasta 30 segundos.");
      return;
    }
    const event: AvatarTimelineEvent = cueAction === "silence"
      ? { id: createId("cue"), time, action: "silence", duration }
      : { id: createId("cue"), time, action: "emotion", emotion: cueAction };
    await updateScore([...(currentPoem.score ?? []), event].sort((a, b) => a.time - b.time));
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
      stopVoice();
      conversationAbortRef.current?.abort();
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
    if (lifeState === "alive") { stopVoice(); return; }
    const playback = playbackRef.current;
    if (!playback) return;
    if (presenceState === "paused") {
      playback.resume();
      setPresenceState(voiceModeRef.current);
    } else {
      playback.pause();
      setPresenceState("paused");
    }
  }

  function cyclePlaybackRate() {
    const nextRate = playbackRate === 0.8 ? 1 : playbackRate === 1 ? 1.2 : 0.8;
    playbackRateRef.current = nextRate;
    setPlaybackRate(nextRate);
    playbackRef.current?.setRate(nextRate);
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
          {currentPoem && (
            <details className={styles.scoreEditor}>
              <summary>Dirigir la lectura</summary>
              <p>Marca una pausa o un cambio de intención. Los segundos corresponden a la voz, sin contar las pausas añadidas. Revisa las marcas si se genera una nueva versión del audio.</p>
              <label>Momento · segundos<input type="number" min="0" step="0.1" value={cueTime} onChange={(event) => setCueTime(event.target.value)} /></label>
              <label>Acción<select value={cueAction} onChange={(event) => setCueAction(event.target.value as typeof cueAction)}>
                <option value="silence">Guardar silencio</option>
                <option value="neutral">Volver a la serenidad</option>
                <option value="contemplative">Contemplar</option>
                <option value="tender">Acercarse con ternura</option>
                <option value="intense">Concentrar la intención</option>
              </select></label>
              {cueAction === "silence" && <label>Duración · segundos<input type="number" min="0.1" max="30" step="0.1" value={cueDuration} onChange={(event) => setCueDuration(event.target.value)} /></label>}
              <button type="button" disabled={savingScore || voiceActive} onClick={() => void addCue()}>Guardar marca</button>
              <ol>{currentPoem.score?.map((cue) => (
                <li key={cue.id}>
                  <span>{cue.time.toFixed(1)} s · {cue.action === "silence" ? `Silencio (${cue.duration} s)` : cue.action === "emotion" ? ({ neutral: "Serenidad", contemplative: "Contemplación", tender: "Ternura", intense: "Intensidad", silence: "Quietud" }[cue.emotion]) : "Gesto reservado"}</span>
                  <button type="button" disabled={savingScore || voiceActive} aria-label={`Retirar marca de ${cue.time} segundos`} onClick={() => void updateScore(currentPoem.score?.filter((item) => item.id !== cue.id) ?? [])}>×</button>
                </li>
              ))}</ol>
            </details>
          )}
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

          <details className={styles.avatarTelemetry}>
            <summary>Sobre esta presencia</summary>
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
                <dd>Lectura poética</dd>
              </div>
              <div>
                <dt>Idioma</dt>
                <dd>ES · primera voz</dd>
              </div>
            </dl>
          </details>

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

          <label className={styles.emotionControl}>
            <span>Intención</span>
            <select value={emotion} onChange={(event) => {
              const next = event.target.value as AvatarEmotion;
              setEmotion(next);
              avatarPerformanceSignal.emotion = next;
            }}>
              <option value="neutral">Serena</option>
              <option value="contemplative">Contemplativa</option>
              <option value="tender">Tierna</option>
              <option value="intense">Intensa</option>
              <option value="silence">Silencio corporal</option>
            </select>
          </label>
          <div className={styles.readingControls}>
            <button
              type="button"
              disabled={!currentPoem}
              onClick={() => {
                if (currentPoem) {
                  void playVoice(currentPoem.text, "reading", currentPoem.score);
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
              onClick={() => { conversationAbortRef.current?.abort(); stopVoice(); }}
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

          {presenceState === "error" && (
            <p className={styles.serviceNotice} role="alert">{notice}</p>
          )}

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
