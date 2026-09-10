"use client";

import {
  useRef,
  useState,
} from "react";

import {
  usePathname,
} from "next/navigation";

export default function GlobalRecorder() {
  const pathname =
    usePathname();

  const [
    recording,
    setRecording,
  ] = useState(false);

  const [
    url,
    setUrl,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const recorderRef =
    useRef<MediaRecorder | null>(
      null,
    );

  const chunksRef =
    useRef<Blob[]>([]);

  async function startRecording() {
    setError("");

    try {
      if (url) {
        URL.revokeObjectURL(
          url,
        );

        setUrl("");
      }

      const stream =
        await navigator
          .mediaDevices
          .getDisplayMedia({
            video: {
              frameRate: {
                ideal: 24,
                max: 24,
              },
            },

            audio: true,

            preferCurrentTab:
              true,

            selfBrowserSurface:
              "include",
          } as any);

      chunksRef.current =
        [];

      const preferred =
        [
          "video/webm;codecs=vp9,opus",
          "video/webm;codecs=vp8,opus",
          "video/webm",
        ].find(
          (type) =>
            MediaRecorder
              .isTypeSupported(
                type,
              ),
        );

      const recorder =
        new MediaRecorder(
          stream,

          preferred
            ? {
                mimeType:
                  preferred,

                videoBitsPerSecond:
                  4_500_000,
              }
            : undefined,
        );

      recorderRef.current =
        recorder;

      recorder.ondataavailable =
        (event) => {
          if (
            event.data.size
          ) {
            chunksRef.current.push(
              event.data,
            );
          }
        };

      recorder.onstop =
        () => {
          const blob =
            new Blob(
              chunksRef.current,
              {
                type:
                  recorder.mimeType ||
                  "video/webm",
              },
            );

          setUrl(
            URL.createObjectURL(
              blob,
            ),
          );

          setRecording(
            false,
          );

          stream
            .getTracks()
            .forEach(
              (track) =>
                track.stop(),
            );
        };

      const videoTrack =
        stream
          .getVideoTracks()[0];

      if (videoTrack) {
        videoTrack.onended =
          () => {
            if (
              recorder.state !==
              "inactive"
            ) {
              recorder.stop();
            }
          };
      }

      recorder.start(
        1000,
      );

      setRecording(
        true,
      );
    } catch (err) {
      const exception =
        err as DOMException;

      if (
        exception?.name ===
          "NotAllowedError" ||
        exception?.name ===
          "AbortError"
      ) {
        setError(
          "Grabación cancelada.",
        );
      } else {
        setError(
          "No se pudo iniciar la grabación.",
        );
      }

      setRecording(
        false,
      );
    }
  }

  function stopRecording() {
    if (
      recorderRef.current &&
      recorderRef.current
        .state !==
        "inactive"
    ) {
      recorderRef.current.stop();
    }
  }

  const room =
    pathname === "/"
      ? "portada"
      : pathname
          .replace(
            /^\/poema-universal\/?/,
            "",
          )
          .replace(
            /\//g,
            "-",
          ) ||
        "inicio";

  return (
    <div
      style={{
        position: "fixed",
        right: 14,
        bottom: 14,
        zIndex: 999999,
        display: "flex",
        alignItems: "center",
        gap: 6,
        opacity: 0.42,
        transition:
          "opacity 180ms ease",
      }}
      onMouseEnter={(
        event,
      ) => {
        event.currentTarget
          .style.opacity =
          "0.95";
      }}
      onMouseLeave={(
        event,
      ) => {
        event.currentTarget
          .style.opacity =
          "0.42";
      }}
    >
      {!recording &&
      !url && (
        <button
          type="button"
          onClick={
            startRecording
          }
          title="Grabar experiencia"
          aria-label="Grabar experiencia"
          style={{
            ...circleStyle,

            color:
              "#c99a4f",
          }}
        >
          ●
        </button>
      )}

      {recording && (
        <button
          type="button"
          onClick={
            stopRecording
          }
          title="Detener grabación"
          aria-label="Detener grabación"
          style={{
            ...circleStyle,

            color:
              "#db715f",
          }}
        >
          ■
        </button>
      )}

      {url &&
        !recording && (
          <>
            <a
              href={url}
              download={
                `poema-universal-${room}.webm`
              }
              title="Guardar vídeo"
              aria-label="Guardar vídeo"
              style={{
                ...circleStyle,

                display:
                  "grid",

                placeItems:
                  "center",

                textDecoration:
                  "none",

                color:
                  "#d4ad68",
              }}
            >
              ↓
            </a>

            <button
              type="button"
              onClick={() => {
                URL.revokeObjectURL(
                  url,
                );

                setUrl("");
              }}
              title="Descartar"
              aria-label="Descartar"
              style={{
                ...smallStyle,

                color:
                  "rgba(235,220,195,.42)",
              }}
            >
              ×
            </button>
          </>
        )}

      {error && (
        <span
          style={{
            maxWidth: 145,
            padding:
              "5px 8px",
            borderRadius: 6,
            background:
              "rgba(5,4,3,.88)",
            color:
              "#c97f70",
            fontSize: 8,
            lineHeight: 1.35,
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

const circleStyle = {
  width: 34,
  height: 34,

  border:
    "1px solid rgba(211,168,91,.22)",

  borderRadius:
    "50%",

  background:
    "rgba(4,3,2,.78)",

  backdropFilter:
    "blur(9px)",

  boxShadow:
    "0 6px 22px rgba(0,0,0,.24)",

  cursor:
    "pointer",

  fontSize: 11,

  padding: 0,
};

const smallStyle = {
  width: 22,
  height: 22,

  border:
    "1px solid rgba(220,205,180,.09)",

  borderRadius:
    "50%",

  background:
    "rgba(4,3,2,.72)",

  cursor:
    "pointer",

  fontSize: 10,

  padding: 0,
};
