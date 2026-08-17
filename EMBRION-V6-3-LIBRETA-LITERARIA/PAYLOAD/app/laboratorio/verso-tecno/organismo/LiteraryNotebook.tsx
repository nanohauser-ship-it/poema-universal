"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import type { SymbolicImpulse } from "@/lib/embrion/symbolic-engine";
import type { ArchivedWord } from "./WordArchive";
import styles from "../organismo-v47.module.css";

const NOTEBOOK_STORAGE = "embrion-libreta-literaria-v1";

type NotebookPage = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  updatedAt: number;
};

export type NotebookInsertion = {
  id: number;
  text: string;
  source: string;
};

type Props = {
  entries: ArchivedWord[];
  nucleus: string;
  activeImpulse: SymbolicImpulse | null;
  insertion: NotebookInsertion | null;
};

type KindFilter = "todas" | ArchivedWord["kind"];

const KIND_LABELS: Array<{ value: KindFilter; label: string }> = [
  { value: "todas", label: "TODAS" },
  { value: "palabra", label: "PALABRAS" },
  { value: "símbolo", label: "SÍMBOLOS" },
  { value: "imagen", label: "IMÁGENES" },
  { value: "materia", label: "MATERIAS" },
  { value: "verbo", label: "VERBOS" },
  { value: "tensión", label: "TENSIONES" },
];

function makePage(index: number): NotebookPage {
  const now = Date.now();
  return {
    id: `page-${now}-${index}`,
    title: `Página ${String(index).padStart(2, "0")}`,
    body: "",
    createdAt: now,
    updatedAt: now,
  };
}

function sanitizeFilename(value: string): string {
  const base = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_ ]+/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
  return base || "pagina-embrion";
}

function countWords(value: string): number {
  return value.trim() ? value.trim().split(/\s+/u).length : 0;
}

function boundaryInsertion(body: string, start: number, end: number, value: string) {
  const left = body.slice(0, start);
  const right = body.slice(end);
  const needsLeft = Boolean(left) && !/[\s\n(\[«“'—-]$/u.test(left);
  const needsRight = Boolean(right) && !/^[\s\n.,;:!?…\])»”'—-]/u.test(right);
  const insertion = `${needsLeft ? " " : ""}${value}${needsRight ? " " : ""}`;
  return {
    text: `${left}${insertion}${right}`,
    caret: left.length + insertion.length,
  };
}

export default function LiteraryNotebook({ entries, nucleus, activeImpulse, insertion }: Props) {
  const [pages, setPages] = useState<NotebookPage[]>([makePage(1)]);
  const [activePageId, setActivePageId] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [saveState, setSaveState] = useState("PREPARANDO ARCHIVO");
  const [filter, setFilter] = useState<KindFilter>("todas");
  const [query, setQuery] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const lastInsertionRef = useRef<number>(0);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(NOTEBOOK_STORAGE);
      if (stored) {
        const parsed = JSON.parse(stored) as {
          pages?: NotebookPage[];
          activePageId?: string;
        };
        if (Array.isArray(parsed.pages) && parsed.pages.length) {
          setPages(parsed.pages);
          setActivePageId(
            parsed.pages.some((page) => page.id === parsed.activePageId)
              ? String(parsed.activePageId)
              : parsed.pages[0].id,
          );
        } else {
          const first = makePage(1);
          setPages([first]);
          setActivePageId(first.id);
        }
      } else {
        const first = makePage(1);
        setPages([first]);
        setActivePageId(first.id);
      }
    } catch {
      const first = makePage(1);
      setPages([first]);
      setActivePageId(first.id);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !activePageId) return;
    setSaveState("ESCRIBIENDO");
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(
          NOTEBOOK_STORAGE,
          JSON.stringify({ pages, activePageId }),
        );
        setSaveState("AUTOGUARDADO LOCAL");
      } catch {
        setSaveState("MEMORIA LOCAL LLENA · EXPORTA TU TEXTO");
      }
    }, 320);
    return () => window.clearTimeout(timer);
  }, [pages, activePageId, hydrated]);

  const activePage = useMemo(
    () => pages.find((page) => page.id === activePageId) ?? pages[0],
    [pages, activePageId],
  );

  const normalizedQuery = query.trim().toLocaleLowerCase("es");
  const lexicon = useMemo(() => {
    const seen = new Set<string>();
    return entries
      .slice()
      .reverse()
      .filter((entry) => {
        if (filter !== "todas" && entry.kind !== filter) return false;
        if (
          normalizedQuery &&
          ![
            entry.value,
            entry.kind,
            entry.habitat,
            entry.nucleus,
            entry.evidence,
            ...entry.sourceLabels,
          ]
            .join(" ")
            .toLocaleLowerCase("es")
            .includes(normalizedQuery)
        ) {
          return false;
        }
        const key = `${entry.kind}:${entry.value.toLocaleLowerCase("es")}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }, [entries, filter, normalizedQuery]);

  function patchActivePage(patch: Partial<NotebookPage>) {
    if (!activePage) return;
    setPages((current) =>
      current.map((page) =>
        page.id === activePage.id
          ? { ...page, ...patch, updatedAt: Date.now() }
          : page,
      ),
    );
  }

  function insertText(value: string) {
    if (!activePage || !value.trim()) return;
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? activePage.body.length;
    const end = textarea?.selectionEnd ?? activePage.body.length;
    const next = boundaryInsertion(activePage.body, start, end, value.trim());
    patchActivePage({ body: next.text });
    window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(next.caret, next.caret);
    });
  }

  useEffect(() => {
    if (!insertion || insertion.id === lastInsertionRef.current) return;
    lastInsertionRef.current = insertion.id;
    insertText(insertion.text);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insertion]);

  function addPage() {
    const next = makePage(pages.length + 1);
    setPages((current) => [...current, next]);
    setActivePageId(next.id);
    window.requestAnimationFrame(() => textareaRef.current?.focus());
  }

  function exportCurrentPage() {
    if (!activePage) return;
    const title = activePage.title.trim() || "Página sin título";
    const text = `${title}\n\n${activePage.body}`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${sanitizeFilename(title)}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <section className={styles.literaryNotebook} aria-label="Libreta de escritura de Embrión">
      <header className={styles.notebookHeader}>
        <div>
          <span>LIBRETA DE ESCRITURA</span>
          <h2>Escribir dentro del campo simbólico</h2>
          <p>
            Embrión ofrece materia. La frase sigue siendo tuya.
          </p>
        </div>
        <div className={styles.notebookStatus}>
          <span>{saveState}</span>
          <strong>{countWords(activePage?.body ?? "")} PALABRAS</strong>
          <small>{(activePage?.body.length ?? 0).toLocaleString("es-ES")} CARACTERES</small>
        </div>
      </header>

      <section className={styles.notebookLexicon} aria-label="Espejo de la membrana">
        <header>
          <div>
            <span>ESPEJO DE LA MEMBRANA</span>
            <small>
              {nucleus ? `GRAVEDAD ACTIVA · ${nucleus.toLocaleUpperCase("es")}` : "SIN NÚCLEO ACTIVO"}
              {activeImpulse ? ` · ÚLTIMO IMPULSO · ${activeImpulse.value}` : ""}
            </small>
          </div>
          <label>
            <span>BUSCAR</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="filtrar formas…"
            />
          </label>
        </header>

        <nav className={styles.notebookFilters} aria-label="Filtrar formas de la membrana">
          {KIND_LABELS.map((item) => (
            <button
              key={item.value}
              type="button"
              className={filter === item.value ? styles.notebookFilterActive : undefined}
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className={styles.notebookLexiconField}>
          {lexicon.length ? (
            lexicon.map((entry) => (
              <button
                key={`${entry.kind}:${entry.id}`}
                type="button"
                data-kind={entry.kind}
                data-active={entry.value.toLocaleLowerCase("es") === nucleus.toLocaleLowerCase("es") ? "true" : "false"}
                title={`Insertar «${entry.value}» · ${entry.evidence} · ${entry.sourceLabels.join(" · ")}`}
                onClick={() => insertText(entry.value)}
              >
                <i />
                <span>{entry.value}</span>
                {entry.appearances > 1 ? <small>×{entry.appearances}</small> : null}
              </button>
            ))
          ) : (
            <p>La membrana todavía no contiene formas para este filtro.</p>
          )}
        </div>
        <footer>
          <span>{lexicon.length} FORMAS VISIBLES</span>
          <small>TOCA UNA FORMA PARA DEPOSITARLA EN EL PUNTO EXACTO DEL CURSOR</small>
        </footer>
      </section>

      <div className={styles.notebookBody}>
        <aside className={styles.notebookPages}>
          <header>
            <span>PÁGINAS</span>
            <button type="button" onClick={addPage}>＋</button>
          </header>
          <div>
            {pages.map((page, index) => (
              <button
                key={page.id}
                type="button"
                className={page.id === activePage?.id ? styles.notebookPageActive : undefined}
                onClick={() => setActivePageId(page.id)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{page.title || "Sin título"}</strong>
                <small>{countWords(page.body)} p.</small>
              </button>
            ))}
          </div>
          <button type="button" className={styles.notebookNewPage} onClick={addPage}>
            NUEVA PÁGINA ＋
          </button>
        </aside>

        <article className={styles.notebookSheet}>
          <div className={styles.notebookSheetMeta}>
            <span>EMBRIÓN · CUADERNO DE OBRA</span>
            <small>
              {activePage
                ? new Date(activePage.updatedAt).toLocaleString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </small>
          </div>

          <input
            className={styles.notebookTitleInput}
            value={activePage?.title ?? ""}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              patchActivePage({ title: event.target.value.slice(0, 140) })
            }
            placeholder="Título de la página"
            aria-label="Título de la página"
          />

          <textarea
            ref={textareaRef}
            className={styles.notebookTextarea}
            value={activePage?.body ?? ""}
            onChange={(event) => patchActivePage({ body: event.target.value })}
            placeholder="Escribe aquí. Las palabras de la membrana permanecen a la vista; ninguna de ellas entrará en tu texto salvo que tú la elijas."
            spellCheck
            aria-label="Texto literario"
          />

          <footer className={styles.notebookSheetFooter}>
            <div>
              <span>ARCHIVO LOCAL</span>
              <small>LA LIBRETA NO ALIMENTA AL ORGANISMO AUTOMÁTICAMENTE</small>
            </div>
            <button type="button" onClick={exportCurrentPage} disabled={!activePage}>
              EXPORTAR PÁGINA .TXT ↗
            </button>
          </footer>
        </article>
      </div>
    </section>
  );
}
