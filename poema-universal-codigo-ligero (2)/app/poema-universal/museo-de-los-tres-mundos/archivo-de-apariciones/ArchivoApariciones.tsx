"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  CSSProperties,
  PointerEvent,
  WheelEvent,
} from "react";

import type {
  MuseumPhoto,
  MuseumWorkId,
} from "./data";

import styles from "./archivo-apariciones.module.css";

type FilterId =
  | "all"
  | MuseumWorkId;

type Props = {
  photos: MuseumPhoto[];
};

const FILTERS: {
  id: FilterId;
  label: string;
}[] = [
  {
    id: "all",
    label: "Todas",
  },
  {
    id: "no-desaparezcamos",
    label:
      "No dejes que desaparezcamos",
  },
  {
    id: "jerarquia-hambre",
    label:
      "La Jerarquía del Hambre",
  },
  {
    id: "memorias-bielka",
    label:
      "Memorias de Bielka",
  },
];

function circularOffset(
  index: number,
  activeIndex: number,
  total: number
) {
  let offset =
    index - activeIndex;

  if (
    offset > total / 2
  ) {
    offset -= total;
  }

  if (
    offset < -total / 2
  ) {
    offset += total;
  }

  return offset;
}

export default function
ArchivoApariciones({
  photos,
}: Props) {
  const [
    filter,
    setFilter,
  ] = useState<FilterId>(
    "all"
  );

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);

  const [
    expandedId,
    setExpandedId,
  ] = useState<
    string | null
  >(null);

  const [
    autoplay,
    setAutoplay,
  ] = useState(false);

  const pointerStart =
    useRef<number | null>(
      null
    );

  const wheelLocked =
    useRef(false);

  const filteredPhotos =
    useMemo(
      () =>
        filter === "all"
          ? photos
          : photos.filter(
              (photo) =>
                photo.work ===
                filter
            ),
      [
        photos,
        filter,
      ]
    );

  const activePhoto =
    filteredPhotos[
      activeIndex
    ] ??
    filteredPhotos[0];

  useEffect(() => {
    setActiveIndex(0);
    setExpandedId(null);
  }, [filter]);

  useEffect(() => {
    if (
      !autoplay ||
      expandedId ||
      filteredPhotos.length < 2
    ) {
      return;
    }

    const timer =
      window.setInterval(
        () => {
          setActiveIndex(
            (current) =>
              (
                current + 1
              ) %
              filteredPhotos.length
          );
        },
        3400
      );

    return () =>
      window.clearInterval(
        timer
      );
  }, [
    autoplay,
    expandedId,
    filteredPhotos.length,
  ]);

  useEffect(() => {
    function onKeyDown(
      event: KeyboardEvent
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        setExpandedId(
          null
        );
      }

      if (
        expandedId
      ) {
        return;
      }

      if (
        event.key ===
          "ArrowRight" ||
        event.key ===
          "ArrowDown"
      ) {
        setActiveIndex(
          (current) =>
            (
              current + 1
            ) %
            filteredPhotos.length
        );
      }

      if (
        event.key ===
          "ArrowLeft" ||
        event.key ===
          "ArrowUp"
      ) {
        setActiveIndex(
          (current) =>
            (
              current -
              1 +
              filteredPhotos.length
            ) %
            filteredPhotos.length
        );
      }
    }

    window.addEventListener(
      "keydown",
      onKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        onKeyDown
      );
  }, [
    expandedId,
    filteredPhotos.length,
  ]);

  function move(
    direction: -1 | 1
  ) {
    setActiveIndex(
      (current) =>
        (
          current +
          direction +
          filteredPhotos.length
        ) %
        filteredPhotos.length
    );
  }

  function handleWheel(
    event: WheelEvent<
      HTMLDivElement
    >
  ) {
    event.preventDefault();

    if (
      wheelLocked.current ||
      Math.abs(
        event.deltaY
      ) < 8
    ) {
      return;
    }

    wheelLocked.current =
      true;

    move(
      event.deltaY > 0
        ? 1
        : -1
    );

    window.setTimeout(
      () => {
        wheelLocked.current =
          false;
      },
      320
    );
  }

  function handlePointerDown(
    event: PointerEvent<
      HTMLDivElement
    >
  ) {
    pointerStart.current =
      event.clientX;

    event.currentTarget
      .setPointerCapture(
        event.pointerId
      );
  }

  function handlePointerUp(
    event: PointerEvent<
      HTMLDivElement
    >
  ) {
    if (
      pointerStart.current ===
      null
    ) {
      return;
    }

    const distance =
      event.clientX -
      pointerStart.current;

    pointerStart.current =
      null;

    if (
      Math.abs(distance) <
      45
    ) {
      return;
    }

    move(
      distance < 0
        ? 1
        : -1
    );
  }

  if (
    !activePhoto
  ) {
    return null;
  }

  const expandedPhoto =
    expandedId
      ? photos.find(
          (photo) =>
            photo.id ===
            expandedId
        ) ?? null
      : null;

  return (
    <section
      className={
        styles.archive
      }
    >
      <header
        className={
          styles.header
        }
      >
        <div>
          <p
            className={
              styles.eyebrow
            }
          >
            Museo de los
            Tres Mundos
          </p>

          <h1>
            Archivo de
            apariciones
          </h1>

          <p
            className={
              styles.introduction
            }
          >
            Fotografías,
            escenas y reliquias
            suspendidas entre
            las tres obras.
          </p>
        </div>

        <div
          className={
            styles.controls
          }
        >
          <div
            className={
              styles.filters
            }
          >
            {FILTERS.map(
              (item) => (
                <button
                  type="button"
                  key={item.id}
                  className={
                    filter ===
                    item.id
                      ? styles.filterActive
                      : ""
                  }
                  onClick={() =>
                    setFilter(
                      item.id
                    )
                  }
                >
                  {item.label}
                </button>
              )
            )}
          </div>

          <button
            type="button"
            className={
              autoplay
                ? styles.autoplayActive
                : styles.autoplay
            }
            onClick={() =>
              setAutoplay(
                (current) =>
                  !current
              )
            }
          >
            <span>
              {autoplay
                ? "●"
                : "○"}
            </span>

            Movimiento
            automático
          </button>
        </div>
      </header>

      <div
        className={
          styles.stage
        }
        onWheel={
          handleWheel
        }
        onPointerDown={
          handlePointerDown
        }
        onPointerUp={
          handlePointerUp
        }
      >
        <div
          className={
            styles.depthField
          }
        />

        {filteredPhotos.map(
          (
            photo,
            index
          ) => {
            const offset =
              circularOffset(
                index,
                activeIndex,
                filteredPhotos.length
              );

            const distance =
              Math.abs(
                offset
              );

            if (
              distance > 6
            ) {
              return null;
            }

            const translateX =
              offset * 94;

            const translateY =
              offset * -42;

            const translateZ =
              distance * -145;

            const scale =
              Math.max(
                0.62,
                1 -
                  distance *
                    0.065
              );

            const rotateY =
              offset * -4.6;

            const rotateZ =
              offset * -1.35;

            const cardStyle: CSSProperties =
              {
                zIndex:
                  20 -
                  distance,
                opacity:
                  Math.max(
                    0.2,
                    1 -
                      distance *
                        0.14
                  ),
                transform:
                  `translate3d(` +
                  `calc(-50% + ${translateX}px), ` +
                  `calc(-50% + ${translateY}px), ` +
                  `${translateZ}px) ` +
                  `rotateY(${rotateY}deg) ` +
                  `rotateZ(${rotateZ}deg) ` +
                  `scale(${scale})`,
                borderColor:
                  offset === 0
                    ? photo.accent
                    : undefined,
              };

            return (
              <button
                type="button"
                key={photo.id}
                className={[
                  styles.card,
                  offset === 0
                    ? styles.cardActive
                    : "",
                ].join(" ")}
                style={
                  cardStyle
                }
                onClick={() => {
                  if (
                    offset === 0
                  ) {
                    setExpandedId(
                      photo.id
                    );
                  } else {
                    setActiveIndex(
                      index
                    );
                  }
                }}
                aria-label={
                  offset === 0
                    ? `Abrir ${photo.title}`
                    : `Ir a ${photo.title}`
                }
              >
                <img
                  src={
                    photo.imageUrl
                  }
                  alt=""
                  draggable={
                    false
                  }
                />

                <span
                  className={
                    styles.cardShade
                  }
                />

                <span
                  className={
                    styles.cardNumber
                  }
                >
                  {
                    photo.number
                  }
                </span>

                <span
                  className={
                    styles.cardText
                  }
                >
                  <small>
                    {
                      photo.workTitle
                    }
                  </small>

                  <strong>
                    {
                      photo.title
                    }
                  </strong>

                  <em>
                    {
                      photo.subtitle
                    }
                  </em>
                </span>
              </button>
            );
          }
        )}

        <button
          type="button"
          className={
            styles.previous
          }
          onClick={() =>
            move(-1)
          }
          aria-label="Fotografía anterior"
        >
          ←
        </button>

        <button
          type="button"
          className={
            styles.next
          }
          onClick={() =>
            move(1)
          }
          aria-label="Fotografía siguiente"
        >
          →
        </button>

        <div
          className={
            styles.instructions
          }
        >
          Arrastra, desplaza
          la rueda o utiliza
          las flechas
        </div>
      </div>

      <footer
        className={
          styles.caption
        }
      >
        <div
          className={
            styles.counter
          }
        >
          <span>
            {String(
              activeIndex + 1
            ).padStart(
              2,
              "0"
            )}
          </span>

          <i />

          <span>
            {String(
              filteredPhotos.length
            ).padStart(
              2,
              "0"
            )}
          </span>
        </div>

        <div
          className={
            styles.activeInformation
          }
        >
          <small>
            {
              activePhoto.workTitle
            }
          </small>

          <h2>
            {
              activePhoto.title
            }
          </h2>

          <p>
            {
              activePhoto.description
            }
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setExpandedId(
              activePhoto.id
            )
          }
        >
          Abrir aparición
          <span>↗</span>
        </button>
      </footer>

      {expandedPhoto && (
        <div
          className={
            styles.modal
          }
          role="dialog"
          aria-modal="true"
          aria-label={
            expandedPhoto.title
          }
          onClick={() =>
            setExpandedId(
              null
            )
          }
        >
          <div
            className={
              styles.modalContent
            }
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className={
                styles.close
              }
              onClick={() =>
                setExpandedId(
                  null
                )
              }
              aria-label="Cerrar"
            >
              ×
            </button>

            <img
              src={
                expandedPhoto.imageUrl
              }
              alt={
                expandedPhoto.title
              }
            />

            <div
              className={
                styles.modalInformation
              }
            >
              <span>
                {
                  expandedPhoto.number
                }
              </span>

              <div>
                <small>
                  {
                    expandedPhoto.workTitle
                  }
                </small>

                <h2>
                  {
                    expandedPhoto.title
                  }
                </h2>

                <em>
                  {
                    expandedPhoto.subtitle
                  }
                </em>

                <p>
                  {
                    expandedPhoto.description
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
