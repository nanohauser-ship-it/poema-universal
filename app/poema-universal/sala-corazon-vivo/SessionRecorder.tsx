"use client";

import {
  useRef,
  useState,
} from "react";

import styles from "./SessionRecorder.module.css";

export default function SessionRecorder() {
  const [recording, setRecording] =
    useState(false);

  const [url, setUrl] =
    useState("");

  const [error, setError] =
    useState("");

  const recorderRef =
    useRef<MediaRecorder | null>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  const chunksRef =
    useRef<Blob[]>([]);

  async function startRecording() {
    setError("");

    try {
      if (
        !navigator.mediaDevices
          ?.getDisplayMedia
      ) {
        setError(
          "Este navegador no permite grabar la experiencia.",
        );

        return;
      }

      const stream =
        await navigator.mediaDevices
          .getDisplayMedia({
            video: {
              displaySurface: "browser",
              frameRate: {
                ideal: 24,
                max: 24,
              },
            },
            audio: true,

            preferCurrentTab: true,
            selfBrowserSurface: "include",

            monitorTypeSurfaces: "exclude",
            surfaceSwitching: "exclude",
          } as DisplayMediaStreamOptions);

      streamRef.current =
        stream;

      chunksRef.current = [];

      const mimeTypes = [
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm",
      ];

      const mimeType =
        mimeTypes.find(
          (type) =>
            MediaRecorder
              .isTypeSupported(type),
        );

      const recorder =
        new MediaRecorder(
          stream,
          mimeType
            ? {
                mimeType,
                videoBitsPerSecond:
                  4_500_000,
              }
            : undefined,
        );

      recorderRef.current =
        recorder;

      recorder.ondataavailable = (
        event,
      ) => {
        if (
          event.data &&
          event.data.size > 0
        ) {
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

        if (url) {
          URL.revokeObjectURL(
            url,
          );
        }

        const nextUrl =
          URL.createObjectURL(
            blob,
          );

        setUrl(nextUrl);
        setRecording(false);

        stream
          .getTracks()
          .forEach(
            (track) =>
              track.stop(),
          );

        streamRef.current =
          null;
      };

      recorder.onerror = () => {
        setError(
          "Se produjo un problema mientras se grababa la sesión.",
        );

        setRecording(false);
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
      console.warn(
        "Grabación cancelada:",
        err,
      );

      const exception =
        err as DOMException;

      if (
        exception?.name ===
          "NotAllowedError" ||
        exception?.name ===
          "AbortError"
      ) {
        setError(
          "Permiso de grabación cancelado. Pulsa de nuevo y selecciona la pestaña de la Sala.",
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
    const recorder =
      recorderRef.current;

    if (
      recorder &&
      recorder.state !==
        "inactive"
    ) {
      recorder.stop();
    }
  }

  return (
    <section
      className={
        styles.recorder
      }
    >
      <div>
        <span>
          REGISTRO · ARCHIVO
        </span>

        <h3>
          Grabación maestra
        </h3>
      </div>

      {!recording ? (
        <button
          type="button"
          onClick={
            startRecording
          }
        >
          ● GRABAR EXPERIENCIA
        </button>
      ) : (
        <button
          type="button"
          onClick={
            stopRecording
          }
        >
          ■ DETENER
        </button>
      )}

      {url && !recording && (
        <a
          href={url}
          download="poema-universal-sesion.webm"
        >
          ↓ GUARDAR VÍDEO
        </a>
      )}

      {error && (
        <p
          style={{
            gridColumn:
              "1 / -1",
            margin: "2px 0 0",
            fontSize: "10px",
            lineHeight: 1.45,
            color:
              "rgba(220,130,105,.85)",
          }}
        >
          {error}
        </p>
      )}
    </section>
  );
}
