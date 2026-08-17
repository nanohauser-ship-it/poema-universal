"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import type { SymbolicImpulse } from "@/lib/embrion/symbolic-engine";
import type { ArchivedWord } from "./WordArchive";
import styles from "../organismo-v47.module.css";

// EMBRIÓN V6.3.1 · MÁRGENES VIVOS
const NOTEBOOK_STORAGE = "embrion-libreta-literaria-v1";

type NotebookPage = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  updatedAt: number;
};

type RecentSediment = {
  id: number;
  value: string;
  source: string;
  kind: ArchivedWord["kind"] | "impulso" | "montaje";
  touchedAt: number;
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
  const [recentSediments, setRecentSediments] = useState<RecentSediment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const lastInsertionRef = useRef<number>(0);
  const selectionRef = useRef({ start: 0, end: 0 });

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(NOTEBOOK_STORAGE);
      if (stored) {
        const parsed = JSON.parse(stored) as {
          pages?: NotebookPage[];
          activePageId?: string;
          recentSediments?: RecentSediment[];
        };
        if (Array.isArray(parsed.pages) && parsed.pages.length) {
          setPages(parsed.pages);
          setActivePageId(
            parsed.pages.some((page) => page.id === parsed.activePageId)
              ? String(parsed.activePageId)
              : parsed.pages[0].id,
          );
          if (Array.isArray(parsed.recentSediments)) {
            setRecentSediments(parsed.recentSediments.slice(0, 7));
          }
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
          JSON.stringify({ pages, activePageId, recentSediments }),
        );
        setSaveState("AUTOGUARDADO LOCAL");
      } catch {
        setSaveState("MEMORIA LOCAL LLENA · EXPORTA TU TEXTO");
      }
    }, 320);
    return () => window.clearTimeout(timer);
  }, [pages, activePageId, recentSediments, hydrated]);

  const activePage = useMemo(
    () => pages.find((page) => page.id === activePageId) ?? pages[0],
    [pages, activePageId],
  );

  useEffect(() => {
    const end = activePage?.body.length ?? 0;
    selectionRef.current = { start: end, end };
  // Deliberately reset only when the writer changes page.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePageId]);

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

  function rememberSelection() {
    const textarea = textareaRef.current;
    if (!textarea) return;
    selectionRef.current = {
      start: textarea.selectionStart ?? 0,
      end: textarea.selectionEnd ?? textarea.selectionStart ?? 0,
    };
  }

  function rememberSediment(
    value: string,
    source: string,
    kind: RecentSediment["kind"] = "impulso",
  ) {
    const values = source === "Mesa de montaje"
      ? value.split("·").map((item) => item.trim()).filter(Boolean)
      : [value.trim()].filter(Boolean);
    if (!values.length) return;

    setRecentSediments((current) => {
      let next = [...current];
      for (const item of values) {
        const normalized = item.toLocaleLowerCase("es");
        next = next.filter(
          (sediment) => sediment.value.toLocaleLowerCase("es") !== normalized,
        );
        next.unshift({
          id: Date.now() + Math.floor(Math.random() * 10000),
          value: item,
          source,
          kind: source === "Mesa de montaje" ? "montaje" : kind,
          touchedAt: Date.now(),
        });
      }
      return next.slice(0, 7);
    });
  }

  function caretViewportPoint() {
    const textarea = textareaRef.current;
    if (!textarea || typeof window === "undefined") return null;
    const textareaRect = textarea.getBoundingClientRect();
    const computed = window.getComputedStyle(textarea);
    const mirror = document.createElement("div");
    const props = [
      "fontFamily", "fontSize", "fontWeight", "fontStyle", "lineHeight",
      "letterSpacing", "textTransform", "textIndent", "textAlign",
      "wordSpacing", "tabSize", "paddingTop", "paddingRight",
      "paddingBottom", "paddingLeft", "borderTopWidth", "borderRightWidth",
      "borderBottomWidth", "borderLeftWidth", "boxSizing",
    ] as const;

    mirror.style.position = "fixed";
    mirror.style.visibility = "hidden";
    mirror.style.pointerEvents = "none";
    mirror.style.whiteSpace = "pre-wrap";
    mirror.style.overflowWrap = "break-word";
    mirror.style.wordBreak = "break-word";
    mirror.style.left = `${textareaRect.left}px`;
    mirror.style.top = `${textareaRect.top - textarea.scrollTop}px`;
    mirror.style.width = `${textareaRect.width}px`;
    mirror.style.minHeight = `${textareaRect.height}px`;
    for (const prop of props) {
      // CSSStyleDeclaration supports these copied camelCase properties at runtime.
      (mirror.style as unknown as Record<string, string>)[prop] = computed[prop];
    }

    const caretIndex = Math.min(selectionRef.current.start, textarea.value.length);
    mirror.textContent = textarea.value.slice(0, caretIndex);
    const marker = document.createElement("span");
    marker.textContent = textarea.value.slice(caretIndex, caretIndex + 1) || "\u200b";
    mirror.appendChild(marker);
    document.body.appendChild(mirror);
    const markerRect = marker.getBoundingClientRect();
    mirror.remove();

    return {
      x: Math.max(textareaRect.left + 18, Math.min(markerRect.left, textareaRect.right - 24)),
      y: Math.max(textareaRect.top + 18, Math.min(markerRect.top + 8, textareaRect.bottom - 22)),
    };
  }

  function flyToCursor(value: string, sourceElement: HTMLElement) {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = caretViewportPoint();
    if (!target) return;
    const sourceRect = sourceElement.getBoundingClientRect();
    const ghost = document.createElement("span");
    ghost.className = styles.notebookFlyingWord;
    ghost.textContent = value;
    ghost.style.left = `${sourceRect.left + sourceRect.width / 2}px`;
    ghost.style.top = `${sourceRect.top + sourceRect.height / 2}px`;
    document.body.appendChild(ghost);

    const dx = target.x - (sourceRect.left + sourceRect.width / 2);
    const dy = target.y - (sourceRect.top + sourceRect.height / 2);
    const animation = ghost.animate(
      [
        { transform: "translate(-50%, -50%) scale(.96)", opacity: 0 },
        { transform: "translate(-50%, -50%) scale(1)", opacity: 0.78, offset: 0.14 },
        { transform: `translate(calc(-50% + ${dx * 0.72}px), calc(-50% + ${dy * 0.72}px)) scale(.9)`, opacity: 0.48, offset: 0.72 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(.72)`, opacity: 0 },
      ],
      { duration: 560, easing: "cubic-bezier(.22,.7,.2,1)" },
    );
    sourceElement.animate(
      [
        { filter: "brightness(1)", transform: "translateY(0)" },
        { filter: "brightness(1.65)", transform: "translateY(-1px)", offset: 0.38 },
        { filter: "brightness(1)", transform: "translateY(0)" },
      ],
      { duration: 320, easing: "ease-out" },
    );
    animation.onfinish = () => ghost.remove();
    animation.oncancel = () => ghost.remove();
  }

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
    const start = Math.min(selectionRef.current.start, activePage.body.length);
    const end = Math.min(selectionRef.current.end, activePage.body.length);
    const next = boundaryInsertion(activePage.body, start, end, value.trim());
    patchActivePage({ body: next.text });
    selectionRef.current = { start: next.caret, end: next.caret };
    window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(next.caret, next.caret);
    });
  }

  useEffect(() => {
    if (!insertion || insertion.id === lastInsertionRef.current) return;
    lastInsertionRef.current = insertion.id;
    rememberSediment(insertion.text, insertion.source, "impulso");
    insertText(insertion.text);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insertion]);

  function addPage() {
    const next = makePage(pages.length + 1);
    setPages((current) => [...current, next]);
    setActivePageId(next.id);
    selectionRef.current = { start: 0, end: 0 };
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
                onMouseDown={(event) => event.preventDefault()}
                onClick={(event: ReactMouseEvent<HTMLButtonElement>) => {
                  flyToCursor(entry.value, event.currentTarget);
                  rememberSediment(
                    entry.value,
                    entry.sourceLabels[0] || entry.evidence,
                    entry.kind,
                  );
                  insertText(entry.value);
                }}
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
                onClick={() => {
                  setActivePageId(page.id);
                  selectionRef.current = { start: page.body.length, end: page.body.length };
                }}
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

          {recentSediments.length ? (
            <aside className={styles.notebookSediments} aria-label="Sedimentos recientes">
              <span>SEDIMENTOS</span>
              <div>
                {recentSediments.map((sediment) => (
                  <button
                    key={sediment.id}
                    type="button"
                    data-kind={sediment.kind}
                    title={sediment.source}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={(event: ReactMouseEvent<HTMLButtonElement>) => {
                      flyToCursor(sediment.value, event.currentTarget);
                      rememberSediment(sediment.value, sediment.source, sediment.kind);
                      insertText(sediment.value);
                    }}
                  >
                    <i />
                    <em>{sediment.value}</em>
                  </button>
                ))}
              </div>
              <small>ÚLTIMAS FORMAS TOCADAS</small>
            </aside>
          ) : null}

          <textarea
            ref={textareaRef}
            className={styles.notebookTextarea}
            value={activePage?.body ?? ""}
            onChange={(event) => {
              patchActivePage({ body: event.target.value });
              selectionRef.current = {
                start: event.target.selectionStart ?? event.target.value.length,
                end: event.target.selectionEnd ?? event.target.value.length,
              };
            }}
            onSelect={rememberSelection}
            onKeyUp={rememberSelection}
            onClick={rememberSelection}
            onFocus={rememberSelection}
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
