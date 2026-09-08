"use client";

import {
  useRef,
  useState,
} from "react";

import {
  usePathname,
} from "next/navigation";

export default function GlobalRecorder() {
  const pathname = usePathname();

  const [recording, setRecording] =
    useState(false);

  const [url, setUrl] =
    useState("");

  const [error, setError] =
    useState("");

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
        URL.revokeObjectURL(url);
        setUrl("");
      }

      const stream =
        await navigator.mediaDevices
          .getDisplayMedia({
            video: {
              frameRate: {
                ideal: 24,
                max: 24,
              },
            },

            audio: true,

            preferCurrentTab: true,
            selfBrowserSurface:
              "include",
          } as any);

      chunksRef.current = [];

      const preferred =
        [
          "video/webm;codecs=vp9,opus",
          "video/webm;codecs=vp8,opus",
          "video/webm",
        ].find((type) =>
          MediaRecorder
            .isTypeSupported(type),
        );

      const recorder =
        new MediaRecorder(
          stream,
          preferred
            ? {
                mimeType: preferred,
                videoBitsPerSecond:
                  4_500_000,
              }
            : undefined,
        );

      recorderRef.current =
        recorder;

      recorder.ondataavailable =
        (event) => {
          if (event.data.size) {
            chunksRef.current.push(
              event.data,
            );
          }
        };

      recorder.onstop = () => {
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
          URL.createObjectURL(blob),
        );

        setRecording(false);

        stream
          .getTracks()
          .forEach((track) =>
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

      recorder.start(1000);

      setRecording(true);
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

      setRecording(false);
    }
  }

  function stopRecording() {
    if (
      recorderRef.current &&
      recorderRef.current.state !==
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
          .replace(/\//g, "-") ||
        "inicio";

  return (
    <div
      style={{
        display: "grid",
        gap: 8,
      }}
    >
      {!recording ? (
        <button
          onClick={startRecording}
          style={buttonStyle}
        >
          ● GRABAR EXPERIENCIA
        </button>
      ) : (
        <button
          onClick={stopRecording}
          style={{
            ...buttonStyle,
            color: "#e78e76",
          }}
        >
          ■ DETENER
        </button>
      )}

      {url && !recording && (
        <a
          href={url}
          download={
            `poema-universal-${room}.webm`
          }
          style={{
            ...buttonStyle,
            display: "grid",
            placeItems: "center",
            textDecoration: "none",
          }}
        >
          ↓ GUARDAR VÍDEO
        </a>
      )}

      {error && (
        <small
          style={{
            color: "#d88a76",
          }}
        >
          {error}
        </small>
      )}
    </div>
  );
}

const buttonStyle = {
  minHeight: 42,
  border:
    "1px solid rgba(216,179,107,.24)",
  borderRadius: 7,
  background:
    "rgba(216,179,107,.06)",
  color: "#dfbd78",
  cursor: "pointer",
  fontSize: 10,
  letterSpacing: ".08em",
};
