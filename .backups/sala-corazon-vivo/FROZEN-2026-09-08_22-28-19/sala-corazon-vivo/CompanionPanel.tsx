"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";

import styles from "./CompanionPanel.module.css";
import MiniVideoPanel from "./MiniVideoPanel";

type CompanionMode =
  | "book"
  | "image"
  | "link";

type LinkKind =
  | "internal"
  | "youtube"
  | "vimeo"
  | "image"
  | "pdf"
  | "web";

type LinkPreview = {
  title: string;
  description: string;
  image: string;
  domain: string;
  url: string;
};

function normalizeUrl(value: string) {
  const trimmed = value.trim();

  if (!trimmed) return "";

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://")
  ) {
    return trimmed;
  }

  return `https://${trimmed}`;
}


function getLinkKind(
  value: string,
): LinkKind {
  const normalized =
    normalizeUrl(value);

  if (
    normalized.startsWith("/")
  ) {
    return "internal";
  }

  try {
    const url =
      new URL(normalized);

    const host =
      url.hostname
        .toLowerCase();

    if (
      host === "localhost" ||
      host === "127.0.0.1"
    ) {
      return "internal";
    }

    if (
      host === "youtu.be" ||
      host.includes(
        "youtube.com",
      )
    ) {
      return "youtube";
    }

    if (
      host.includes(
        "vimeo.com",
      )
    ) {
      return "vimeo";
    }

    if (
      /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(
        url.pathname,
      )
    ) {
      return "image";
    }

    if (
      /\.pdf$/i.test(
        url.pathname,
      )
    ) {
      return "pdf";
    }
  } catch {
    return "web";
  }

  return "web";
}

function getEmbedUrl(value: string) {
  const normalized =
    normalizeUrl(value);

  if (!normalized) return "";

  /*
   * Las rutas internas de
   * Poema Universal funcionan
   * directamente.
   */
  if (normalized.startsWith("/")) {
    return normalized;
  }

  try {
    const url =
      new URL(normalized);

    /*
     * YouTube
     */
    if (
      url.hostname === "youtu.be"
    ) {
      const id =
        url.pathname
          .replace("/", "")
          .split("/")[0];

      if (id) {
        return (
          "https://www.youtube.com/embed/" +
          id
        );
      }
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
        return normalized;
      }

      if (
        url.pathname.startsWith(
          "/shorts/",
        )
      ) {
        const id =
          url.pathname.split("/")[2];

        if (id) {
          return (
            "https://www.youtube.com/embed/" +
            id
          );
        }
      }

      const id =
        url.searchParams.get("v");

      if (id) {
        return (
          "https://www.youtube.com/embed/" +
          id
        );
      }
    }

    /*
     * Vimeo
     */
    if (
      url.hostname.includes(
        "vimeo.com",
      )
    ) {
      const parts =
        url.pathname
          .split("/")
          .filter(Boolean);

      const id =
        parts[parts.length - 1];

      if (
        id &&
        /^\d+$/.test(id)
      ) {
        return (
          "https://player.vimeo.com/video/" +
          id
        );
      }
    }
  } catch {
    return normalized;
  }

  /*
   * Para cualquier otra web
   * intentamos abrirla directamente.
   */
  return normalized;
}

export default function CompanionPanel() {
  const [mode, setMode] =
    useState<CompanionMode>(
      "link",
    );

  const [bookUrl, setBookUrl] =
    useState("");

  const [bookName, setBookName] =
    useState("");

  const [imageUrl, setImageUrl] =
    useState("");

  const [imageName, setImageName] =
    useState("");

  /*
   * IMPORTANTE:
   * ya no existe ningún enlace
   * predeterminado.
   */
  const [urlDraft, setUrlDraft] =
    useState("");

  const [activeUrl, setActiveUrl] =
    useState("");

  const [preview, setPreview] =
    useState<LinkPreview | null>(
      null,
    );

  const [
    previewLoading,
    setPreviewLoading,
  ] = useState(false);

  const [
    screenshotRevision,
    setScreenshotRevision,
  ] = useState(0);

  const [
    screenshotFailed,
    setScreenshotFailed,
  ] = useState(false);

  const linkKind = useMemo(
    () =>
      getLinkKind(activeUrl),
    [activeUrl],
  );

  const embedUrl = useMemo(
    () =>
      getEmbedUrl(activeUrl),
    [activeUrl],
  );

  const screenshotUrl =
    useMemo(() => {
      if (
        !activeUrl ||
        linkKind !== "web"
      ) {
        return "";
      }

      return (
        "/api/poema-universal/link-screenshot" +
        "?url=" +
        encodeURIComponent(
          normalizeUrl(
            activeUrl,
          ),
        ) +
        "&v=" +
        screenshotRevision
      );
    }, [
      activeUrl,
      linkKind,
      screenshotRevision,
    ]);

  useEffect(() => {
    setScreenshotFailed(
      false,
    );
  }, [
    activeUrl,
    linkKind,
  ]);

  useEffect(() => {
    if (
      !activeUrl ||
      linkKind !== "web"
    ) {
      setPreview(null);
      setPreviewLoading(false);
      return;
    }

    let cancelled = false;

    setPreviewLoading(true);
    setPreview(null);

    fetch(
      `/api/poema-universal/link-preview?url=${encodeURIComponent(
        normalizeUrl(
          activeUrl,
        ),
      )}`,
    )
      .then((response) =>
        response.json(),
      )
      .then((data) => {
        if (!cancelled) {
          setPreview(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPreview(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setPreviewLoading(
            false,
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    activeUrl,
    linkKind,
  ]);

  const linkTitle = useMemo(() => {
    if (!activeUrl) {
      return "";
    }

    if (
      activeUrl.startsWith("/")
    ) {
      return "Poema Universal";
    }

    try {
      return new URL(
        normalizeUrl(activeUrl),
      ).hostname.replace(
        /^www\./,
        "",
      );
    } catch {
      return "Enlace";
    }
  }, [activeUrl]);

  function openUrl() {
    const next =
      normalizeUrl(urlDraft);

    if (!next) return;

    setActiveUrl(next);
  }

  function clearUrl() {
    setUrlDraft("");
    setActiveUrl("");
  }

  function handleUrlKeyDown(
    event:
      KeyboardEvent<HTMLInputElement>,
  ) {
    if (
      event.key === "Enter"
    ) {
      openUrl();
    }
  }

  function handleBook(
    event:
      ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (bookUrl) {
      URL.revokeObjectURL(
        bookUrl,
      );
    }

    setBookUrl(
      URL.createObjectURL(file),
    );

    setBookName(file.name);
  }

  function handleImage(
    event:
      ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (imageUrl) {
      URL.revokeObjectURL(
        imageUrl,
      );
    }

    setImageUrl(
      URL.createObjectURL(file),
    );

    setImageName(file.name);
  }

  useEffect(() => {
    return () => {
      if (bookUrl) {
        URL.revokeObjectURL(
          bookUrl,
        );
      }
    };
  }, [bookUrl]);

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(
          imageUrl,
        );
      }
    };
  }, [imageUrl]);

  return (
    <section className={styles.panel}>
      <header className={styles.header}>
        <div>
          <span>
            ACOMPAÑAMIENTO
          </span>

          <h2>
            Algo que permanezca
            junto a tu voz.
          </h2>
        </div>

        <p>
          Un libro, una imagen
          o un lugar.
        </p>
      </header>

      <nav
        className={styles.tabs}
        aria-label="Tipo de acompañamiento"
      >
        <button
          type="button"
          data-active={
            mode === "book"
          }
          onClick={() =>
            setMode("book")
          }
        >
          <span>▤</span>
          Libro
        </button>

        <button
          type="button"
          data-active={
            mode === "image"
          }
          onClick={() =>
            setMode("image")
          }
        >
          <span>▧</span>
          Imagen
        </button>

        <button
          type="button"
          data-active={
            mode === "link"
          }
          onClick={() =>
            setMode("link")
          }
        >
          <span>↗</span>
          Enlace
        </button>
      </nav>

      {mode === "book" && (
        <div className={styles.content}>
          {!bookUrl ? (
            <label
              className={
                styles.emptyState
              }
            >
              <input
                type="file"
                accept="application/pdf"
                onChange={
                  handleBook
                }
              />

              <span
                className={
                  styles.symbol
                }
              >
                Ⅱ
              </span>

              <strong>
                Abrir un libro
              </strong>

              <small>
                PDF · una lectura
                que permanezca
                a tu lado.
              </small>
            </label>
          ) : (
            <>
              <div
                className={
                  styles.mediaTopbar
                }
              >
                <span>
                  {bookName}
                </span>

                <label>
                  Cambiar
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={
                      handleBook
                    }
                  />
                </label>
              </div>

              <iframe
                className={
                  styles.bookFrame
                }
                src={`${bookUrl}#toolbar=0&navpanes=0&view=FitH`}
                title={bookName}
              />
            </>
          )}
        </div>
      )}

      {mode === "image" && (
        <div className={styles.content}>
          {!imageUrl ? (
            <label
              className={
                styles.emptyState
              }
            >
              <input
                type="file"
                accept="image/*"
                onChange={
                  handleImage
                }
              />

              <span
                className={
                  styles.symbol
                }
              >
                ◇
              </span>

              <strong>
                Elegir una imagen
              </strong>

              <small>
                Fotografía · dibujo ·
                manuscrito · obra.
              </small>
            </label>
          ) : (
            <>
              <div
                className={
                  styles.mediaTopbar
                }
              >
                <span>
                  {imageName}
                </span>

                <label>
                  Cambiar
                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      handleImage
                    }
                  />
                </label>
              </div>

              <div
                className={
                  styles.imageStage
                }
              >
                <img
                  src={imageUrl}
                  alt=""
                />
              </div>
            </>
          )}
        </div>
      )}

      {mode === "link" && (
        <div className={styles.content}>
          <div
            className={
              styles.linkControls
            }
          >
            <input
              value={urlDraft}
              onChange={(event) =>
                setUrlDraft(
                  event.target.value,
                )
              }
              onKeyDown={
                handleUrlKeyDown
              }
              placeholder="Pega aquí cualquier enlace…"
              aria-label="URL de acompañamiento"
            />

            <button
              type="button"
              onClick={openUrl}
            >
              Abrir aquí
            </button>
          </div>

          <div
            className={
              styles.linkStage
            }
          >
            {embedUrl ? (
              <>
                <div
                  className={
                    styles.linkIdentity
                  }
                >
                  <div>
                    <span>
                      ENLACE
                    </span>

                    <strong>
                      {linkTitle}
                    </strong>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      pointerEvents:
                        "auto",
                    }}
                  >
                    <button
                      type="button"
                      onClick={
                        clearUrl
                      }
                      style={{
                        minHeight:
                          31,
                        border:
                          "1px solid rgba(232,223,210,.09)",
                        borderRadius:
                          7,
                        padding:
                          "0 10px",
                        background:
                          "rgba(0,0,0,.75)",
                        color:
                          "rgba(239,230,213,.55)",
                        cursor:
                          "pointer",
                      }}
                    >
                      Cerrar
                    </button>

                    <a
                      href={
                        normalizeUrl(
                          activeUrl,
                        )
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      Abrir fuera ↗
                    </a>
                  </div>
                </div>

                {linkKind ===
                  "web" ? (
                  <div
                    className={
                      styles.webCapture
                    }
                  >
                    {!screenshotFailed &&
                    screenshotUrl ? (
                      <img
                        key={
                          screenshotUrl
                        }
                        src={
                          screenshotUrl
                        }
                        alt=""
                        onError={() =>
                          setScreenshotFailed(
                            true,
                          )
                        }
                      />
                    ) : (
                      <div
                        className={
                          styles.webPreview
                        }
                      >
                        {preview?.image && (
                          <div
                            className={
                              styles.webPreviewImage
                            }
                          >
                            <img
                              src={
                                preview.image
                              }
                              alt=""
                            />
                          </div>
                        )}

                        <div
                          className={
                            styles.webPreviewText
                          }
                        >
                          <span>
                            {preview?.domain ||
                              linkTitle}
                          </span>

                          <h3>
                            {preview?.title ||
                              linkTitle}
                          </h3>

                          {preview?.description && (
                            <p>
                              {
                                preview.description
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div
                      className={
                        styles.webCaptureControls
                      }
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setScreenshotFailed(
                            false,
                          );

                          setScreenshotRevision(
                            (value) =>
                              value + 1,
                          );
                        }}
                      >
                        ↻ Actualizar
                      </button>

                      <a
                        href={
                          normalizeUrl(
                            activeUrl,
                          )
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        Abrir web ↗
                      </a>
                    </div>
                  </div>
                ) : linkKind ===
                    "image" ? (
                  <div
                    className={
                      styles.directImage
                    }
                  >
                    <img
                      src={
                        normalizeUrl(
                          activeUrl,
                        )
                      }
                      alt=""
                    />
                  </div>
                ) : (
                  <iframe
                    key={embedUrl}
                    src={embedUrl}
                    title={
                      linkTitle ||
                      "Acompañamiento"
                    }
                    allow="autoplay; fullscreen; encrypted-media; picture-in-picture; clipboard-read; clipboard-write"
                    allowFullScreen
                  />
                )}
              </>
            ) : (
              <div
                className={
                  styles.emptyState
                }
              >
                <span
                  className={
                    styles.symbol
                  }
                >
                  ↗
                </span>

                <strong>
                  Abre un lugar
                </strong>

                <small>
                  Pega arriba una web,
                  un vídeo, una obra
                  digital o una ruta
                  de Poema Universal.
                </small>
              </div>
            )}
          </div>

          <p className={styles.note}>
            Algunas páginas externas
            no permiten ser incrustadas.
            Si ocurre, utiliza
            «Abrir fuera».
          </p>
        </div>
      )}

      <MiniVideoPanel />
    </section>
  );
}
