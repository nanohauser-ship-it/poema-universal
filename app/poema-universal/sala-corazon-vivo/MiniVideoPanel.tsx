"use client";

import {
  useMemo,
  useState,
} from "react";

import styles from "./MiniVideoPanel.module.css";

function youtubeEmbedUrl(
  value: string,
) {
  const raw = value.trim();

  if (!raw) return "";

  try {
    const url = new URL(raw);

    if (
      url.hostname === "youtu.be"
    ) {
      const id =
        url.pathname
          .replace("/", "")
          .split("/")[0];

      return id
        ? `https://www.youtube.com/embed/${id}`
        : "";
    }

    if (
      url.hostname.includes(
        "youtube.com",
      )
    ) {
      if (
        url.pathname.startsWith(
          "/embed/",
        )
      ) {
        return raw;
      }

      if (
        url.pathname.startsWith(
          "/shorts/",
        )
      ) {
        const id =
          url.pathname
            .split("/")[2];

        return id
          ? `https://www.youtube.com/embed/${id}`
          : "";
      }

      const id =
        url.searchParams.get("v");

      return id
        ? `https://www.youtube.com/embed/${id}`
        : "";
    }
  } catch {
    return "";
  }

  return "";
}

export default function MiniVideoPanel() {
  const [open, setOpen] =
    useState(false);

  const [draft, setDraft] =
    useState("");

  const [videoUrl, setVideoUrl] =
    useState("");

  const embedUrl = useMemo(
    () =>
      youtubeEmbedUrl(
        videoUrl,
      ),
    [videoUrl],
  );

  function loadVideo() {
    const next = draft.trim();

    if (!next) return;

    setVideoUrl(next);
    setOpen(true);
  }

  return (
    <aside
      className={styles.shell}
      data-open={open}
    >
      <button
        type="button"
        className={styles.toggle}
        onClick={() =>
          setOpen(
            (current) =>
              !current,
          )
        }
      >
        <span>▻</span>

        Pantalla secundaria

        <i>
          {open ? "−" : "+"}
        </i>
      </button>

      {open && (
        <div
          className={styles.body}
        >
          <div
            className={
              styles.controls
            }
          >
            <input
              value={draft}
              onChange={(event) =>
                setDraft(
                  event.target.value,
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key ===
                  "Enter"
                ) {
                  loadVideo();
                }
              }}
              placeholder="Pega un enlace de YouTube"
              aria-label="Enlace de YouTube"
            />

            <button
              type="button"
              onClick={loadVideo}
            >
              Abrir
            </button>
          </div>

          <div
            className={
              styles.screen
            }
          >
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title="Pantalla secundaria"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div
                className={
                  styles.empty
                }
              >
                <span>▶</span>

                <strong>
                  Una segunda presencia
                </strong>

                <small>
                  vídeo · música · archivo
                </small>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
