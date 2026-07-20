"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import styles from "./PoemBook.module.css";

export type PoemEntry = {
  id: string;
  poetName: string;
  country: string;
  title: string;
  poem: string;
  originalLabel: string;
  translation?: string;
  translationLabel?: string;
};

type PoemBookProps = {
  poems: PoemEntry[];
  onActivePoemChange?: (
    poemId: string | null
  ) => void;
};

type ReadingVersion =
  | "original"
  | "translation";

function announcePoem(
  poem: PoemEntry
) {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(
      "poema-universal:poem-opened",
      {
        detail: {
          id: poem.id,
          title: poem.title,
        },
      }
    )
  );
}

export default function PoemBook({
  poems,
  onActivePoemChange,
}: PoemBookProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [readingVersion, setReadingVersion] =
    useState<ReadingVersion>("original");

  const pageRef =
    useRef<HTMLElement | null>(null);

  if (poems.length === 0) {
    return null;
  }

  const currentPoem =
    poems[currentIndex] ?? poems[0];

  if (!currentPoem) {
    return null;
  }

  const hasTranslation =
    Boolean(currentPoem.translation);

  const displayedPoem =
    readingVersion === "translation" &&
    currentPoem.translation
      ? currentPoem.translation
      : currentPoem.poem;

  useEffect(() => {
    pageRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    if (typeof window !== "undefined") {
      const detail = {
        id: currentPoem.id,
        poemId: currentPoem.id,
        title: currentPoem.title,
        poetName: currentPoem.poetName,
        index: currentIndex,
      };

      window.dispatchEvent(
        new CustomEvent(
          "poema-book-change",
          { detail }
        )
      );

      window.dispatchEvent(
        new CustomEvent(
          "poema-universal-poem-change",
          { detail }
        )
      );
    }
  }, [
    currentIndex,
    readingVersion,
    currentPoem,
  ]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    announcePoem(currentPoem);
  }, [
    isOpen,
    currentPoem.id,
    currentPoem.title,
  ]);


  useEffect(() => {
    if (
      typeof window === "undefined"
    ) {
      return;
    }

    const detail = isOpen
      ? {
          id: currentPoem.id,
          poemId: currentPoem.id,
          title: currentPoem.title,
          poetName:
            currentPoem.poetName,
          index: currentIndex,
          open: true,
        }
      : {
          id: "",
          poemId: "",
          title: "",
          poetName: "",
          index: currentIndex,
          open: false,
        };

    window.dispatchEvent(
      new CustomEvent(
        "poema-universal:active-poem",
        { detail }
      )
    );
  }, [
    isOpen,
    currentIndex,
    currentPoem.id,
    currentPoem.title,
    currentPoem.poetName,
  ]);

  useEffect(() => {
    onActivePoemChange?.(
      isOpen
        ? currentPoem.id
        : null
    );
  }, [
    isOpen,
    currentPoem.id,
    onActivePoemChange,
  ]);

  function previousPoem() {
    setReadingVersion("original");

    setCurrentIndex((index) =>
      index === 0
        ? poems.length - 1
        : index - 1
    );
  }

  function nextPoem() {
    setReadingVersion("original");

    setCurrentIndex((index) =>
      index === poems.length - 1
        ? 0
        : index + 1
    );
  }

  function continueReading() {
    pageRef.current?.scrollBy({
      top: 280,
      behavior: "smooth",
    });
  }

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          className={styles.trigger}
          onClick={() => setIsOpen(true)}
          aria-label="Abrir el Libro de las Sesenta Voces"
        >
          <span className={styles.symbol}>
            ◇
          </span>

          <span>Libro de las voces</span>

          <small>Abrir</small>
        </button>
      )}

      <aside
        className={`${styles.book} ${
          isOpen ? styles.open : ""
        }`}
        aria-label="Libro de las Sesenta Voces"
      >
        <div className={styles.spine}>
          POEMA UNIVERSAL
        </div>

        <div className={styles.content}>
          <header className={styles.header}>
            <div>
              <p className={styles.eyebrow}>
                Edición fundacional 2026
              </p>

              <h2>
                Libro de las Sesenta Voces
              </h2>
            </div>

            <button
              type="button"
              className={styles.close}
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar el libro"
            >
              ×
            </button>
          </header>

          <section className={styles.author}>
            <div>
              <span>Voz</span>

              <strong>
                {currentPoem.poetName}
              </strong>
            </div>

            <div>
              <span>Territorio</span>

              <strong>
                {currentPoem.country}
              </strong>
            </div>
          </section>

          <div
            className={`${styles.languageSwitch} ${
              !hasTranslation
                ? styles.languageSwitchSingle
                : ""
            }`}
            aria-label="Versión del poema"
          >
            <button
              type="button"
              className={`${styles.languageButton} ${
                readingVersion === "original"
                  ? styles.languageButtonActive
                  : ""
              }`}
              onClick={() =>
                setReadingVersion("original")
              }
            >
              {currentPoem.originalLabel}
            </button>

            {hasTranslation && (
              <button
                type="button"
                className={`${styles.languageButton} ${
                  readingVersion === "translation"
                    ? styles.languageButtonActive
                    : ""
                }`}
                onClick={() =>
                  setReadingVersion(
                    "translation"
                  )
                }
              >
                {currentPoem.translationLabel ??
                  "Traducción · Español"}
              </button>
            )}
          </div>

          <div className={styles.readingArea}>
            <article
              ref={pageRef}
              key={`${currentPoem.id}-${readingVersion}`}
              className={styles.page}
            >
              <p className={styles.number}>
                Poema{" "}
                {String(currentIndex + 1).padStart(
                  2,
                  "0"
                )}
              </p>

              <h3>{currentPoem.title}</h3>

              {readingVersion ===
                "translation" && (
                <p
                  className={
                    styles.translationNote
                  }
                >
                  Traducción poética al español
                </p>
              )}

              <div className={styles.poem}>
                {displayedPoem
                  .split("\n")
                  .map((line, lineIndex) => (
                    <p key={lineIndex}>
                      {line || "\u00A0"}
                    </p>
                  ))}
              </div>
            </article>

            <button
              type="button"
              className={styles.scrollButton}
              onClick={continueReading}
              aria-label="Continuar leyendo hacia abajo"
            >
              <span>↓</span>
              Seguir leyendo
            </button>
          </div>

          <footer className={styles.footer}>
            <button
              type="button"
              className={styles.previousButton}
              onClick={previousPoem}
              aria-label="Ir al poema anterior"
            >
              <span>←</span>
              Anterior
            </button>

            <span className={styles.poemCounter}>
              {String(currentIndex + 1).padStart(
                2,
                "0"
              )}
              {" / "}
              {String(poems.length).padStart(
                2,
                "0"
              )}
            </span>

            <button
              type="button"
              className={styles.nextButton}
              onClick={nextPoem}
              aria-label="Ir al siguiente poema"
            >
              Siguiente
              <span>→</span>
            </button>
          </footer>
        </div>
      </aside>
    </>
  );
}
