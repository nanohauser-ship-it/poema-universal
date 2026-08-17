"use client";

import { useMemo, useState } from "react";

import { literaryAtlas } from "@/lib/grafo-literario/atlas-registry";
import { atlasWorksMaster } from "@/lib/grafo-literario/atlas-works-master";

import styles from "../atlas.module.css";

type LibraryMode =
  | "authors"
  | "works"
  | "movements";

interface AtlasLibraryPanelProps {
  selectedAuthorId: string;
  onSelectAuthor: (id: string) => void;
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

export default function AtlasLibraryPanel({
  selectedAuthorId,
  onSelectAuthor,
}: AtlasLibraryPanelProps) {
  const [mode, setMode] =
    useState<LibraryMode>("authors");

  const [query, setQuery] = useState("");

  const [movementFilter, setMovementFilter] =
    useState<string | null>(null);

  const [selectedWorkId, setSelectedWorkId] =
    useState<string | null>(null);

  const visibleAuthors = useMemo(() => {
    const needle = normalize(query);

    return literaryAtlas.authors.filter((author) => {
      const matchesMovement =
        !movementFilter ||
        author.movement?.includes(movementFilter);

      if (!matchesMovement) {
        return false;
      }

      if (!needle) {
        return true;
      }

      const haystack = normalize(
        [
          author.name,
          author.country,
          ...author.language,
          ...(author.movement ?? []),
          ...author.concepts,
        ].join(" ")
      );

      return haystack.includes(needle);
    });
  }, [query, movementFilter]);

  const visibleWorks = useMemo(() => {
    const needle = normalize(query);

    if (!needle) {
      return atlasWorksMaster;
    }

    return atlasWorksMaster.filter((work) => {
      const author =
        literaryAtlas.authors.find(
          (item) => item.id === work.authorId
        );

      const haystack = normalize(
        [
          work.title,
          work.originalTitle ?? "",
          author?.name ?? "",
          work.language ?? "",
          work.yearLabel ?? "",
          work.type,
          ...(work.themes ?? []),
        ].join(" ")
      );

      return haystack.includes(needle);
    });
  }, [query]);

  const movements = useMemo(() => {
    const map = new Map<string, number>();

    for (const author of literaryAtlas.authors) {
      for (const movement of author.movement ?? []) {
        map.set(
          movement,
          (map.get(movement) ?? 0) + 1
        );
      }
    }

    const needle = normalize(query);

    return [...map.entries()]
      .filter(([movement]) =>
        !needle ||
        normalize(movement).includes(needle)
      )
      .sort((a, b) =>
        a[0].localeCompare(b[0], "es")
      );
  }, [query]);

  function openAuthors() {
    setMode("authors");
    setMovementFilter(null);
    setSelectedWorkId(null);
    setQuery("");
  }

  function openWorks() {
    setMode("works");
    setMovementFilter(null);
    setQuery("");
  }

  function openMovements() {
    setMode("movements");
    setMovementFilter(null);
    setSelectedWorkId(null);
    setQuery("");
  }

  return (
    <aside className={styles.libraryPanel}>
      <div className={styles.searchBox}>
        <span>⌕</span>

        <input
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          placeholder={
            mode === "authors"
              ? "Buscar autor, país, lengua…"
              : mode === "works"
              ? "Buscar obra, autor, tema…"
              : "Buscar movimiento…"
          }
        />
      </div>

      <div className={styles.libraryTabs}>
        <button
          type="button"
          className={
            mode === "authors"
              ? styles.libraryTabActive
              : ""
          }
          onClick={openAuthors}
        >
          Autores
        </button>

        <button
          type="button"
          className={
            mode === "works"
              ? styles.libraryTabActive
              : ""
          }
          onClick={openWorks}
        >
          Obras
        </button>

        <button
          type="button"
          className={
            mode === "movements"
              ? styles.libraryTabActive
              : ""
          }
          onClick={openMovements}
        >
          Movimientos
        </button>
      </div>

      {movementFilter && mode === "authors" && (
        <div
          style={{
            padding: "8px 12px",
            fontSize: "10px",
            opacity: 0.7,
          }}
        >
          Movimiento · {movementFilter}

          <button
            type="button"
            onClick={() =>
              setMovementFilter(null)
            }
            style={{
              marginLeft: "10px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
      )}

      <div className={styles.authorList}>
        {mode === "authors" &&
          visibleAuthors.map((author) => (
            <button
              type="button"
              key={author.id}
              className={`${styles.authorRow} ${
                author.id === selectedAuthorId
                  ? styles.authorRowActive
                  : ""
              }`}
              onClick={() => {
                setSelectedWorkId(null);
                onSelectAuthor(author.id);
              }}
            >
              <span className={styles.avatar}>
                {initials(author.name)}
              </span>

              <span>
                <strong>{author.name}</strong>

                <small>
                  {author.birth ?? "?"}–
                  {author.death ?? "·"} ·{" "}
                  {author.country}
                </small>
              </span>
            </button>
          ))}

        {mode === "works" &&
          visibleWorks.map((work) => {
            const author =
              literaryAtlas.authors.find(
                (item) =>
                  item.id === work.authorId
              );

            return (
              <button
                type="button"
                key={work.id}
                className={`${styles.authorRow} ${
                  selectedWorkId === work.id
                    ? styles.authorRowActive
                    : ""
                }`}
                onClick={() => {
                  setSelectedWorkId(work.id);
                  onSelectAuthor(work.authorId);
                }}
              >
                <span className={styles.avatar}>
                  ▣
                </span>

                <span>
                  <strong>{work.title}</strong>

                  <small>
                    {author?.name ??
                      "Autor desconocido"}

                    {work.yearLabel
                      ? ` · ${work.yearLabel}`
                      : ""}
                  </small>
                </span>
              </button>
            );
          })}

        {mode === "movements" &&
          movements.map(
            ([movement, count]) => (
              <button
                type="button"
                key={movement}
                className={styles.authorRow}
                onClick={() => {
                  setMovementFilter(movement);
                  setMode("authors");
                  setQuery("");
                }}
              >
                <span className={styles.avatar}>
                  ✦
                </span>

                <span>
                  <strong>{movement}</strong>

                  <small>
                    {count}{" "}
                    {count === 1
                      ? "autor"
                      : "autores"}
                  </small>
                </span>
              </button>
            )
          )}
      </div>

      <div className={styles.filters}>
        <p>
          {mode === "authors"
            ? `${visibleAuthors.length} autores`
            : mode === "works"
            ? `${visibleWorks.length} obras`
            : `${movements.length} movimientos`}
        </p>

        <div>
          {mode === "authors" &&
            [
              "Época",
              "Continente",
              "Lengua",
              "Movimiento",
              "Tema",
              "Estilo",
            ].map((label) => (
              <button
                type="button"
                key={label}
              >
                {label}
              </button>
            ))}
        </div>
      </div>
    </aside>
  );
}
