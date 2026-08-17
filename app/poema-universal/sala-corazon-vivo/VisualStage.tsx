"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  DIRECTOR_CHANNEL,
  type DirectorCommand,
} from "../director/director-channel";

type VisualMode =
  | "video"
  | "image"
  | "youtube"
  | "screen"
  | "empty";

type MediaItem = {
  id: string;
  name: string;
  url: string;
};

type VisualStageProps = {
  onLifeEvent?: (
    message: string,
  ) => void;
};

function makeId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function youtubeIdFromUrl(
  value: string,
) {
  const input = value.trim();

  if (!input) return null;

  try {
    const url = new URL(input);

    if (
      url.hostname === "youtu.be"
    ) {
      return url.pathname
        .replace("/", "")
        .split("?")[0];
    }

    if (
      url.hostname.includes(
        "youtube.com",
      )
    ) {
      const fromQuery =
        url.searchParams.get("v");

      if (fromQuery) {
        return fromQuery;
      }

      const parts =
        url.pathname
          .split("/")
          .filter(Boolean);

      const specialIndex =
        parts.findIndex(
          (part) =>
            part === "shorts" ||
            part === "embed" ||
            part === "live",
        );

      if (
        specialIndex !== -1 &&
        parts[specialIndex + 1]
      ) {
        return parts[
          specialIndex + 1
        ];
      }
    }
  } catch {
    // También aceptamos directamente
    // un posible ID de YouTube.
  }

  if (
    /^[A-Za-z0-9_-]{11}$/.test(
      input,
    )
  ) {
    return input;
  }

  return null;
}

export default function VisualStage({
  onLifeEvent,
}: VisualStageProps) {
  const [mode, setMode] =
    useState<VisualMode>("video");

  const [videos, setVideos] =
    useState<MediaItem[]>([]);

  const [images, setImages] =
    useState<MediaItem[]>([]);

  const [videoIndex, setVideoIndex] =
    useState(0);

  const [imageIndex, setImageIndex] =
    useState(0);

  const [imageAuto, setImageAuto] =
    useState(false);

  const [imageSeconds, setImageSeconds] =
    useState(8);

  const [youtubeInput, setYoutubeInput] =
    useState("");

  const [youtubeId, setYoutubeId] =
    useState<string | null>(null);

  const [youtubeError, setYoutubeError] =
    useState("");

  const [
    screenStream,
    setScreenStream,
  ] =
    useState<MediaStream | null>(
      null,
    );

  const videoInputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

  const imageInputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

  const screenVideoRef =
    useRef<HTMLVideoElement | null>(
      null,
    );

  const objectUrlsRef =
    useRef<string[]>([]);

  const currentVideo =
    videos[videoIndex] ?? null;

  const currentImage =
    images[imageIndex] ?? null;

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

    channel.onmessage = (
      event: MessageEvent<DirectorCommand>,
    ) => {
      const command =
        event.data;

      if (
        command.type === "VIDEO" &&
        command.active
      ) {
        setMode("video");

        onLifeEvent?.(
          "Director · Campo Visual en modo vídeo.",
        );
      }
    };

    return () => {
      channel.close();
    };
  }, [onLifeEvent]);

  useEffect(() => {
    if (
      !imageAuto ||
      images.length < 2
    ) {
      return;
    }

    const timer =
      window.setInterval(() => {
        setImageIndex(
          (current) =>
            (current + 1) %
            images.length,
        );
      }, imageSeconds * 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [
    imageAuto,
    imageSeconds,
    images.length,
  ]);

  useEffect(() => {
    const element =
      screenVideoRef.current;

    if (!element) return;

    element.srcObject =
      screenStream;

    if (screenStream) {
      void element.play().catch(
        () => undefined,
      );
    }
  }, [screenStream]);

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach(
        (url) => {
          URL.revokeObjectURL(url);
        },
      );

      screenStream?.getTracks().forEach(
        (track) => {
          track.stop();
        },
      );
    };
  }, [screenStream]);

  function addVideos(
    event:
      ChangeEvent<HTMLInputElement>,
  ) {
    const files =
      Array.from(
        event.target.files ?? [],
      );

    if (!files.length) return;

    const added =
      files.map((file) => {
        const url =
          URL.createObjectURL(file);

        objectUrlsRef.current.push(
          url,
        );

        return {
          id: makeId(),
          name: file.name,
          url,
        };
      });

    setVideos((current) => [
      ...current,
      ...added,
    ]);

    setMode("video");

    onLifeEvent?.(
      `${added.length} vídeo${
        added.length === 1
          ? ""
          : "s"
      } incorporado${
        added.length === 1
          ? ""
          : "s"
      } al Campo Visual.`,
    );

    event.target.value = "";
  }

  function addImages(
    event:
      ChangeEvent<HTMLInputElement>,
  ) {
    const files =
      Array.from(
        event.target.files ?? [],
      );

    if (!files.length) return;

    const added =
      files.map((file) => {
        const url =
          URL.createObjectURL(file);

        objectUrlsRef.current.push(
          url,
        );

        return {
          id: makeId(),
          name: file.name,
          url,
        };
      });

    setImages((current) => [
      ...current,
      ...added,
    ]);

    setMode("image");

    onLifeEvent?.(
      `${added.length} imagen${
        added.length === 1
          ? ""
          : "es"
      } incorporada${
        added.length === 1
          ? ""
          : "s"
      } al Campo Visual.`,
    );

    event.target.value = "";
  }

  function previousVideo() {
    if (!videos.length) return;

    setVideoIndex(
      (current) =>
        (
          current -
          1 +
          videos.length
        ) % videos.length,
    );
  }

  function nextVideo() {
    if (!videos.length) return;

    setVideoIndex(
      (current) =>
        (current + 1) %
        videos.length,
    );
  }

  function previousImage() {
    if (!images.length) return;

    setImageIndex(
      (current) =>
        (
          current -
          1 +
          images.length
        ) % images.length,
    );
  }

  function nextImage() {
    if (!images.length) return;

    setImageIndex(
      (current) =>
        (current + 1) %
        images.length,
    );
  }

  function loadYoutube(
    event: FormEvent,
  ) {
    event.preventDefault();

    const id =
      youtubeIdFromUrl(
        youtubeInput,
      );

    if (!id) {
      setYoutubeError(
        "No reconozco esa URL de YouTube.",
      );
      return;
    }

    setYoutubeError("");
    setYoutubeId(id);
    setMode("youtube");

    onLifeEvent?.(
      "Un vídeo de YouTube ha entrado en el Campo Visual.",
    );
  }

  async function startScreenShare() {
    try {
      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices
          .getDisplayMedia
      ) {
        onLifeEvent?.(
          "Este navegador no permite compartir pantalla.",
        );
        return;
      }

      screenStream
        ?.getTracks()
        .forEach(
          (track) => track.stop(),
        );

      const stream =
        await navigator.mediaDevices
          .getDisplayMedia({
            video: {
              frameRate: {
                ideal: 30,
                max: 60,
              },
            },
            audio: true,
          });

      setScreenStream(stream);
      setMode("screen");

      const videoTrack =
        stream.getVideoTracks()[0];

      if (videoTrack) {
        videoTrack.onended = () => {
          setScreenStream(null);

          onLifeEvent?.(
            "La pantalla compartida ha salido del Campo Visual.",
          );
        };
      }

      onLifeEvent?.(
        "Una pantalla o pestaña ha entrado en el Campo Visual.",
      );
    } catch {
      onLifeEvent?.(
        "Compartir pantalla fue cancelado.",
      );
    }
  }

  function stopScreenShare() {
    screenStream
      ?.getTracks()
      .forEach(
        (track) => track.stop(),
      );

    setScreenStream(null);

    onLifeEvent?.(
      "La pantalla compartida ha sido retirada.",
    );
  }

  async function fullscreen() {
    const target =
      document.getElementById(
        "corazon-visual-stage",
      );

    if (
      target &&
      target.requestFullscreen
    ) {
      await target
        .requestFullscreen()
        .catch(
          () => undefined,
        );
    }
  }

  function modeLabel() {
    if (mode === "video") {
      return `${videos.length} VÍDEOS`;
    }

    if (mode === "image") {
      return `${images.length} IMÁGENES`;
    }

    if (mode === "youtube") {
      return youtubeId
        ? "YOUTUBE ACTIVO"
        : "YOUTUBE";
    }

    if (mode === "screen") {
      return screenStream
        ? "PANTALLA ACTIVA"
        : "SIN PANTALLA";
    }

    return "SIN IMAGEN";
  }

  return (
    <div
      style={{
        display: "grid",
        gap: "14px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <ModeButton
          active={mode === "video"}
          onClick={() =>
            setMode("video")
          }
        >
          ◉ VÍDEO
        </ModeButton>

        <ModeButton
          active={mode === "image"}
          onClick={() =>
            setMode("image")
          }
        >
          ◫ IMAGEN
        </ModeButton>

        <ModeButton
          active={
            mode === "youtube"
          }
          onClick={() =>
            setMode("youtube")
          }
        >
          ▶ YOUTUBE
        </ModeButton>

        <ModeButton
          active={mode === "screen"}
          onClick={() =>
            setMode("screen")
          }
        >
          ▣ PANTALLA
        </ModeButton>

        <ModeButton
          active={mode === "empty"}
          onClick={() =>
            setMode("empty")
          }
        >
          ○ VACÍO
        </ModeButton>

        <span
          style={{
            marginLeft: "auto",
            fontSize: "9px",
            letterSpacing: ".16em",
            color:
              "rgba(235,220,185,.38)",
          }}
        >
          {modeLabel()}
        </span>
      </div>

      <div
        id="corazon-visual-stage"
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: "390px",
          borderRadius: "14px",
          border:
            "1px solid rgba(190,145,55,.16)",
          background:
            "radial-gradient(circle at 50% 45%, rgba(120,88,38,.08), rgba(0,0,0,.96) 70%)",
          display: "grid",
          placeItems: "center",
        }}
      >
        {mode === "empty" && (
          <EmptyStage
            symbol="○"
            title="Campo en silencio"
            text="La imagen ha sido retirada."
          />
        )}

        {mode === "video" &&
          (currentVideo ? (
            <video
              key={currentVideo.id}
              src={currentVideo.url}
              controls
              playsInline
              style={mediaStyle}
            />
          ) : (
            <EmptyStage
              symbol="◉"
              title="Ningún vídeo cargado"
              text="Carga una pieza para comenzar."
            />
          ))}

        {mode === "image" &&
          (currentImage ? (
            <img
              key={currentImage.id}
              src={currentImage.url}
              alt={currentImage.name}
              style={{
                ...mediaStyle,
                animation:
                  "corazonImageArrival 1.4s ease both",
              }}
            />
          ) : (
            <EmptyStage
              symbol="◫"
              title="Ninguna imagen cargada"
              text="Carga fotografías, ilustraciones o láminas."
            />
          ))}

        {mode === "youtube" &&
          (youtubeId ? (
            <iframe
              key={youtubeId}
              src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
              title="YouTube · Campo Visual"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{
                width: "100%",
                aspectRatio: "16 / 9",
                minHeight: "390px",
                border: 0,
                background: "#000",
              }}
            />
          ) : (
            <EmptyStage
              symbol="▶"
              title="YouTube preparado"
              text="Pega una URL debajo para proyectarla."
            />
          ))}

        {mode === "screen" &&
          (screenStream ? (
            <video
              ref={screenVideoRef}
              autoPlay
              playsInline
              muted
              style={mediaStyle}
            />
          ) : (
            <EmptyStage
              symbol="▣"
              title="Comparte una pantalla"
              text="Puedes elegir una pestaña de Chrome, una ventana o tu pantalla completa."
            />
          ))}
      </div>

      {mode === "video" && (
        <>
          <div style={controlRowStyle}>
            <button
              type="button"
              style={buttonStyle}
              onClick={() =>
                videoInputRef.current?.click()
              }
            >
              + CARGAR VÍDEO
            </button>

            <button
              type="button"
              style={buttonStyle}
              onClick={previousVideo}
              disabled={!videos.length}
            >
              ← ANTERIOR
            </button>

            <button
              type="button"
              style={buttonStyle}
              onClick={nextVideo}
              disabled={!videos.length}
            >
              SIGUIENTE →
            </button>

            <button
              type="button"
              style={buttonStyle}
              onClick={fullscreen}
            >
              ⛶ PANTALLA
            </button>
          </div>

          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            multiple
            hidden
            onChange={addVideos}
          />

          {currentVideo && (
            <div style={mediaNameStyle}>
              {String(
                videoIndex + 1,
              ).padStart(2, "0")}
              {" · "}
              {currentVideo.name}
            </div>
          )}
        </>
      )}

      {mode === "image" && (
        <>
          <div style={controlRowStyle}>
            <button
              type="button"
              style={buttonStyle}
              onClick={() =>
                imageInputRef.current?.click()
              }
            >
              + CARGAR IMÁGENES
            </button>

            <button
              type="button"
              style={buttonStyle}
              onClick={previousImage}
              disabled={!images.length}
            >
              ← ANTERIOR
            </button>

            <button
              type="button"
              style={buttonStyle}
              onClick={nextImage}
              disabled={!images.length}
            >
              SIGUIENTE →
            </button>

            <button
              type="button"
              style={{
                ...buttonStyle,
                opacity:
                  imageAuto
                    ? 1
                    : 0.55,
              }}
              onClick={() =>
                setImageAuto(
                  (value) => !value,
                )
              }
              disabled={
                images.length < 2
              }
            >
              {imageAuto
                ? "Ⅱ DETENER"
                : "▶ AUTOMÁTICO"}
            </button>

            <button
              type="button"
              style={buttonStyle}
              onClick={fullscreen}
            >
              ⛶ PANTALLA
            </button>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span
              style={tinyLabelStyle}
            >
              CAMBIO
            </span>

            <input
              type="range"
              min="3"
              max="30"
              value={imageSeconds}
              onChange={(event) =>
                setImageSeconds(
                  Number(
                    event.target.value,
                  ),
                )
              }
            />

            <span
              style={{
                fontSize: "10px",
                color:
                  "rgba(235,220,185,.58)",
              }}
            >
              {imageSeconds}s
            </span>
          </div>

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={addImages}
          />
        </>
      )}

      {mode === "youtube" && (
        <form
          onSubmit={loadYoutube}
          style={{
            display: "grid",
            gap: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "8px",
            }}
          >
            <input
              value={youtubeInput}
              onChange={(event) => {
                setYoutubeInput(
                  event.target.value,
                );
                setYoutubeError("");
              }}
              placeholder="Pega aquí una URL de YouTube…"
              style={{
                flex: 1,
                minWidth: 0,
                border:
                  "1px solid rgba(190,145,55,.2)",
                background:
                  "rgba(0,0,0,.42)",
                color:
                  "rgba(235,220,185,.85)",
                borderRadius: "8px",
                padding: "10px 12px",
                outline: "none",
                fontSize: "10px",
              }}
            />

            <button
              type="submit"
              style={buttonStyle}
            >
              CARGAR
            </button>

            <button
              type="button"
              style={buttonStyle}
              onClick={fullscreen}
            >
              ⛶
            </button>
          </div>

          {youtubeError && (
            <span
              style={{
                color:
                  "rgba(220,150,110,.75)",
                fontSize: "9px",
              }}
            >
              {youtubeError}
            </span>
          )}
        </form>
      )}

      {mode === "screen" && (
        <div style={controlRowStyle}>
          {!screenStream ? (
            <button
              type="button"
              style={buttonStyle}
              onClick={
                startScreenShare
              }
            >
              ▣ COMPARTIR PANTALLA / PESTAÑA
            </button>
          ) : (
            <button
              type="button"
              style={buttonStyle}
              onClick={
                stopScreenShare
              }
            >
              ■ DEJAR DE COMPARTIR
            </button>
          )}

          <button
            type="button"
            style={buttonStyle}
            onClick={fullscreen}
          >
            ⛶ PANTALLA COMPLETA
          </button>
        </div>
      )}

      {mode === "empty" && (
        <div
          style={{
            minHeight: "34px",
            display: "flex",
            alignItems: "center",
            color:
              "rgba(235,220,185,.3)",
            fontSize: "9px",
            letterSpacing: ".14em",
          }}
        >
          EL CAMPO VISUAL HA ELEGIDO EL VACÍO
        </div>
      )}
</div>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...tabStyle,
        opacity:
          active
            ? 1
            : 0.42,
        background:
          active
            ? "rgba(190,145,55,.1)"
            : "rgba(190,145,55,.025)",
      }}
    >
      {children}
    </button>
  );
}

function EmptyStage({
  symbol,
  title,
  text,
}: {
  symbol: string;
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "60px 30px",
        color:
          "rgba(235,220,185,.45)",
      }}
    >
      <div
        style={{
          marginBottom: "16px",
          fontSize: "28px",
          color:
            "rgba(216,179,107,.45)",
        }}
      >
        {symbol}
      </div>

      <strong
        style={{
          display: "block",
          marginBottom: "7px",
          fontSize: "12px",
          fontWeight: 500,
          letterSpacing: ".08em",
        }}
      >
        {title}
      </strong>

      <span
        style={{
          fontSize: "10px",
          opacity: 0.65,
        }}
      >
        {text}
      </span>
    </div>
  );
}

const mediaStyle = {
  width: "100%",
  height: "100%",
  maxHeight: "620px",
  objectFit:
    "contain" as const,
  background: "#000",
};

const tabStyle = {
  border:
    "1px solid rgba(190,145,55,.25)",
  background:
    "rgba(190,145,55,.05)",
  color: "rgba(235,220,185,.82)",
  borderRadius: "8px",
  padding: "8px 13px",
  cursor: "pointer",
  fontSize: "9px",
  letterSpacing: ".12em",
};

const buttonStyle = {
  border:
    "1px solid rgba(190,145,55,.2)",
  background:
    "rgba(190,145,55,.04)",
  color: "rgba(235,220,185,.68)",
  borderRadius: "7px",
  padding: "8px 10px",
  cursor: "pointer",
  fontSize: "9px",
  letterSpacing: ".08em",
};

const controlRowStyle = {
  display: "flex",
  gap: "7px",
  flexWrap: "wrap" as const,
};

const mediaNameStyle = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap" as const,
  fontSize: "9px",
  letterSpacing: ".08em",
  color: "rgba(235,220,185,.42)",
};

const tinyLabelStyle = {
  fontSize: "9px",
  letterSpacing: ".14em",
  color:
    "rgba(235,220,185,.4)",
};

