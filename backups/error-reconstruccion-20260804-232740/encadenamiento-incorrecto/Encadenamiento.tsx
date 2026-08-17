"use client";

import Link from "next/link";
import {
  FormEvent,
  PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import styles from "./encadenamiento.module.css";

type Vertebra = {
  id: string;
  voice: string;
  territory: string;
  fragment: string;
  createdAt: string;
};

const STORAGE_KEY = "poema-universal:columna-voces:v1";

const INITIAL_VERTEBRAE: Vertebra[] = [
  {
    id: "fundacional-01",
    voice: "Voz I",
    territory: "Galicia",
    fragment:
      "Toda lengua guarda una casa que todavía no ha sido construida.",
    createdAt: "Edición fundacional · 2026",
  },
  {
    id: "fundacional-02",
    voice: "Voz II",
    territory: "México",
    fragment:
      "Lo que decimos juntos deja de pertenecerle al miedo.",
    createdAt: "Edición fundacional · 2026",
  },
  {
    id: "fundacional-03",
    voice: "Voz III",
    territory: "Japón",
    fragment:
      "Una luz pequeña también puede regresar descalza.",
    createdAt: "Edición fundacional · 2026",
  },
  {
    id: "fundacional-04",
    voice: "Voz IV",
    territory: "Senegal",
    fragment:
      "Llegar vivo es a veces el primer verso de una vida nueva.",
    createdAt: "Edición fundacional · 2026",
  },
  {
    id: "fundacional-05",
    voice: "Voz V",
    territory: "Colombia",
    fragment:
      "El tiempo no se compra: se protege dentro de aquello que amamos.",
    createdAt: "Edición fundacional · 2026",
  },
  {
    id: "fundacional-06",
    voice: "Voz VI",
    territory: "Italia",
    fragment:
      "Dos desconocidos pueden sostener el mismo silencio sin saberlo.",
    createdAt: "Edición fundacional · 2026",
  },
];

function loadVertebrae(): Vertebra[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return INITIAL_VERTEBRAE;

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length
      ? (parsed as Vertebra[])
      : INITIAL_VERTEBRAE;
  } catch {
    return INITIAL_VERTEBRAE;
  }
}

export default function Encadenamiento() {
  const [vertebrae, setVertebrae] =
    useState<Vertebra[]>(INITIAL_VERTEBRAE);
  const [selectedId, setSelectedId] =
    useState(INITIAL_VERTEBRAE[0].id);
  const [formOpen, setFormOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [bookPosition, setBookPosition] = useState({
    x: 0,
    y: 0,
  });

  const dragRef = useRef<{
    pointerX: number;
    pointerY: number;
    originX: number;
    originY: number;
  } | null>(null);

  useEffect(() => {
    const loaded = loadVertebrae();
    setVertebrae(loaded);
    setSelectedId(loaded[0]?.id ?? "");
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(vertebrae)
    );
  }, [hydrated, vertebrae]);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      setBookPosition({
        x: drag.originX + event.clientX - drag.pointerX,
        y: drag.originY + event.clientY - drag.pointerY,
      });
    };

    const stop = () => {
      dragRef.current = null;
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };
  }, []);

  const selected =
    vertebrae.find((item) => item.id === selectedId) ??
    vertebrae[0];

  function beginDrag(
    event: ReactPointerEvent<HTMLDivElement>
  ) {
    dragRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      originX: bookPosition.x,
      originY: bookPosition.y,
    };
  }

  function addVertebra(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const voice = String(data.get("voice") ?? "").trim();
    const territory = String(
      data.get("territory") ?? ""
    ).trim();
    const fragment = String(
      data.get("fragment") ?? ""
    ).trim();

    if (!voice || !territory || !fragment) return;

    const newVertebra: Vertebra = {
      id: `voz-${Date.now()}`,
      voice,
      territory,
      fragment,
      createdAt: new Intl.DateTimeFormat("es-ES", {
        dateStyle: "long",
      }).format(new Date()),
    };

    setVertebrae((current) => [...current, newVertebra]);
    setSelectedId(newVertebra.id);
    setFormOpen(false);
    event.currentTarget.reset();
  }

  return (
    <main className={styles.page}>
      <div className={styles.paperGlow} />

      <header className={styles.header}>
        <Link
          href="/poema-universal"
          className={styles.brand}
        >
          Poema Universal
        </Link>

        <p className={styles.headerLabel}>
          Sala de Encadenamiento · 2026
        </p>

        <button
          type="button"
          className={styles.headerAction}
          onClick={() => setFormOpen((value) => !value)}
        >
          {formOpen ? "Cerrar" : "Añadir voz"}
        </button>
      </header>

      <section className={styles.intro}>
        <p className={styles.eyebrow}>
          Archivo vivo · obra común
        </p>

        <h1>Columna de las Voces</h1>

        <p className={styles.lead}>
          Cada voz incorpora una vértebra. Ninguna ocupa
          el centro por sí sola, pero juntas sostienen el
          cuerpo entero del poema.
        </p>

        <div className={styles.introRule}>
          <span />
          <strong>
            {vertebrae.length.toString().padStart(2, "0")}
          </strong>
          <span />
        </div>
      </section>

      {formOpen && (
        <section className={styles.formPanel}>
          <form onSubmit={addVertebra}>
            <div className={styles.formHeading}>
              <div>
                <p>Nueva incorporación</p>
                <h2>Añadir una vértebra</h2>
              </div>
              <span>La voz quedará guardada localmente.</span>
            </div>

            <div className={styles.formGrid}>
              <label>
                Nombre o voz
                <input
                  name="voice"
                  placeholder="José Naveiro"
                  required
                />
              </label>

              <label>
                Territorio
                <input
                  name="territory"
                  placeholder="Galicia"
                  required
                />
              </label>

              <label className={styles.fragmentField}>
                Fragmento
                <textarea
                  name="fragment"
                  placeholder="Escribe aquí la frase que se incorporará a la columna…"
                  rows={4}
                  required
                />
              </label>
            </div>

            <div className={styles.formFooter}>
              <button type="submit">
                Incorporar a la columna
              </button>
            </div>
          </form>
        </section>
      )}

      <section className={styles.chamber}>
        <aside className={styles.sideNote}>
          <span>01</span>
          <p>
            La columna no termina. Crece hacia arriba y
            hacia abajo con cada incorporación.
          </p>
        </aside>

        <div className={styles.columnWrap}>
          <div className={styles.columnLight} />
          <div className={styles.spineLine} />

          <ol className={styles.vertebrae}>
            {vertebrae.map((vertebra, index) => {
              const active = vertebra.id === selected?.id;

              return (
                <li
                  key={vertebra.id}
                  className={
                    active
                      ? styles.vertebraActive
                      : styles.vertebra
                  }
                >
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedId(vertebra.id)
                    }
                    aria-label={`Abrir ${vertebra.voice}`}
                  >
                    <span className={styles.number}>
                      {(index + 1)
                        .toString()
                        .padStart(2, "0")}
                    </span>

                    <span className={styles.bone}>
                      <i />
                      <b />
                      <i />
                    </span>

                    <span className={styles.voiceMeta}>
                      <strong>{vertebra.voice}</strong>
                      <small>{vertebra.territory}</small>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <button
            type="button"
            className={styles.addBone}
            onClick={() => setFormOpen(true)}
          >
            <span>+</span>
            Añadir vértebra
          </button>
        </div>

        <aside className={styles.sideNoteRight}>
          <span>∞</span>
          <p>
            El libro lateral puede moverse. Cada vértebra
            abre una página distinta del archivo.
          </p>
        </aside>

        {selected && (
          <article
            className={styles.book}
            style={{
              transform: `translate3d(${bookPosition.x}px, ${bookPosition.y}px, 0)`,
            }}
          >
            <div
              className={styles.bookHandle}
              onPointerDown={beginDrag}
            >
              <span>Archivo de la voz</span>
              <small>Arrastrar libro</small>
            </div>

            <div className={styles.bookPages}>
              <div className={styles.leftPage}>
                <p className={styles.bookIndex}>
                  Vértebra{" "}
                  {(
                    vertebrae.findIndex(
                      (item) => item.id === selected.id
                    ) + 1
                  )
                    .toString()
                    .padStart(2, "0")}
                </p>

                <div className={styles.relicMark}>
                  <span />
                  <strong>V</strong>
                  <span />
                </div>

                <p className={styles.bookTerritory}>
                  {selected.territory}
                </p>
              </div>

              <div className={styles.rightPage}>
                <p className={styles.bookDate}>
                  {selected.createdAt}
                </p>

                <h2>{selected.voice}</h2>

                <blockquote>
                  “{selected.fragment}”
                </blockquote>

                <div className={styles.signature}>
                  <span />
                  <p>
                    Incorporada a la Columna de las Voces
                  </p>
                </div>
              </div>
            </div>
          </article>
        )}
      </section>

      <footer className={styles.footer}>
        <p>
          Una arquitectura de Poema Universal para
          sostener aquello que ninguna voz podría cargar
          sola.
        </p>
        <Link href="/poema-universal">
          Volver a Poema Universal
        </Link>
      </footer>
    </main>
  );
}
