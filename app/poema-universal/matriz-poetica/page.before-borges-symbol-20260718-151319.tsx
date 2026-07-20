"use client";

import Link from "next/link";
import {
  useState,
  type FormEvent,
} from "react";

import styles from "./MatrizPoetica.module.css";

type MatrixResult = {
  pulse: string;
  core: string;
  gravityLine: string;
  symbol: string;
  relic: string;
  scenography: string;
  finalGesture: string;
  altar: string;
};

type PoeticProfile = {
  words: string[];
  result: Omit<
    MatrixResult,
    "gravityLine"
  >;
};

const PROFILES: PoeticProfile[] = [
  {
    words: [
      "tierra",
      "raíz",
      "árbol",
      "hueso",
      "polvo",
      "semilla",
      "jardín",
      "huerto",
    ],
    result: {
      pulse:
        "El poema excava. Desciende hacia aquello que parecía terminado y descubre que la memoria todavía produce materia.",
      core:
        "Lo perdido no aparece como vacío, sino como una profundidad que conserva calor y capacidad de crecimiento.",
      symbol:
        "Una raíz blanca que recuerda aquello sobre lo que fue plantada.",
      relic:
        "Una semilla de hueso tibia, hecha de tierra oscura, memoria y ámbar.",
      scenography:
        "Un jardín suspendido donde la luz viaja bajo el suelo y cada recuerdo alimenta una flor distinta.",
      finalGesture:
        "La tierra se cierra mientras algo continúa corriendo bajo ella hasta alcanzar las raíces.",
      altar:
        "El poema descansa sobre tierra removida. En el centro, una semilla de hueso demuestra que recordar también puede ser una forma de germinar.",
    },
  },
  {
    words: [
      "luz",
      "brillo",
      "blanco",
      "pétalo",
      "aire",
      "flotar",
      "regresa",
      "huella",
      "pies",
    ],
    result: {
      pulse:
        "El poema permanece suspendido entre la aparición y la desaparición, como si la luz intentara recordar una forma.",
      core:
        "La creación ocurre en el instante preciso en que algo adquiere cuerpo sin dejar de pertenecer al aire.",
      symbol:
        "Unas huellas descalzas hechas de claridad que regresan hacia su propio origen.",
      relic:
        "Una portadilla de papel opalino que nunca termina de abrirse.",
      scenography:
        "Vías inmóviles, pétalos palpables y una figura flotando sobre una capa precisa de aire detenido.",
      finalGesture:
        "La última huella atraviesa el lomo del libro y se transforma en un pétalo.",
      altar:
        "El poema se eleva sobre un altar de aire detenido. Su nombre permanece abierto mientras la luz regresa sin tocar completamente el suelo.",
    },
  },
  {
    words: [
      "casa",
      "habitación",
      "puerta",
      "ventana",
      "cama",
      "hogar",
      "pasillo",
      "llave",
      "silla",
    ],
    result: {
      pulse:
        "El poema construye un espacio para comprobar si todavía puede ser habitado.",
      core:
        "La casa funciona como memoria, identidad y posibilidad de volver a ser reconocido.",
      symbol:
        "Una puerta cerrada cuya madera respira como si alguien continuara al otro lado.",
      relic:
        "Una llave sin cerradura que se calienta cerca de los lugares donde alguien fue feliz.",
      scenography:
        "Una casa incompleta donde las habitaciones se iluminan únicamente cuando el poema nombra aquello que estuvo allí.",
      finalGesture:
        "La última puerta no se abre: respira una vez y deja pasar una línea de luz.",
      altar:
        "El poema ocupa una casa vacía. Sobre una mesa descansa una llave sin cerradura mientras una puerta conserva la respiración de una presencia.",
    },
  },
];

const FALLBACK: Omit<
  MatrixResult,
  "gravityLine"
> = {
  pulse:
    "El poema avanza mediante imágenes que se acercan, se rozan y dejan entre ellas una zona de silencio.",
  core:
    "Su fuerza parece encontrarse en aquello que no explica por completo y que continúa vibrando después de la lectura.",
  symbol:
    "Un recipiente oscuro que conserva una pequeña cantidad de luz.",
  relic:
    "Una pieza de cristal atravesada por el primer verso del poema.",
  scenography:
    "Una sala silenciosa donde las palabras aparecen como objetos suspendidos y cambian lentamente de posición.",
  finalGesture:
    "La última palabra desaparece, pero su sombra permanece visible unos segundos.",
  altar:
    "El poema se eleva sobre una superficie desnuda. Nada lo explica: una luz tenue permite contemplar aquello que todavía no acepta un nombre.",
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    );
}

function analyzePoem(
  poem: string
): MatrixResult {
  const normalized =
    normalize(poem);

  let selected:
    PoeticProfile | null = null;

  let bestScore = 0;

  for (const profile of PROFILES) {
    const score =
      profile.words.reduce(
        (total, word) =>
          total +
          (
            normalized.includes(
              normalize(word)
            )
              ? 1
              : 0
          ),
        0
      );

    if (score > bestScore) {
      bestScore = score;
      selected = profile;
    }
  }

  const lines = poem
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const gravityLine =
    [...lines].sort(
      (a, b) =>
        b.length - a.length
    )[0] ??
    "El poema todavía guarda su línea de mayor gravedad.";

  return {
    ...(selected?.result ?? FALLBACK),
    gravityLine,
  };
}

export default function MatrizPoeticaPage() {
  const [title, setTitle] =
    useState("");

  const [author, setAuthor] =
    useState("");

  const [language, setLanguage] =
    useState("Español");

  const [poem, setPoem] =
    useState("");

  const [result, setResult] =
    useState<MatrixResult | null>(
      null
    );

  const [error, setError] =
    useState("");

  function submit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const cleanPoem =
      poem.trim();

    if (cleanPoem.length < 40) {
      setError(
        "La Matriz necesita al menos 40 caracteres para comenzar a escuchar el poema."
      );
      setResult(null);
      return;
    }

    setError("");
    setResult(
      analyzePoem(cleanPoem)
    );

    window.setTimeout(() => {
      document
        .getElementById(
          "altar-poetico"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 80);
  }

  function deleteSession() {
    setTitle("");
    setAuthor("");
    setLanguage("Español");
    setPoem("");
    setResult(null);
    setError("");
  }

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link
          href="/poema-universal"
          className={styles.brand}
        >
          <span>✦</span>
          POEMA UNIVERSAL
        </Link>

        <p>
          HERRAMIENTA PÚBLICA ·
          INDEPENDIENTE
        </p>
      </header>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>
          Arquitectura invisible
          de la palabra
        </p>

        <h1>Matriz Poética</h1>

        <p className={styles.promise}>
          Tu poema no alimenta la
          máquina. La máquina trabaja
          para tu poema.
        </p>

        <p className={styles.intro}>
          Entrega un poema y recibe una
          lectura posible de su núcleo,
          su símbolo, su reliquia, su
          escenografía y su gesto final.
        </p>
      </section>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <form
            className={styles.panel}
            onSubmit={submit}
          >
            <div className={styles.heading}>
              <span>✧</span>

              <div>
                <h2>
                  Entrega tu poema
                </h2>

                <p>
                  No se guarda ni se
                  transmite
                </p>
              </div>
            </div>

            <label>
              <span>Título</span>

              <input
                value={title}
                placeholder="Ej. Cartografía del silencio"
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
              />
            </label>

            <label>
              <span>
                Autor o seudónimo
              </span>

              <input
                value={author}
                placeholder="Ej. Ada Salazar"
                onChange={(event) =>
                  setAuthor(
                    event.target.value
                  )
                }
              />
            </label>

            <label>
              <span>Idioma</span>

              <select
                value={language}
                onChange={(event) =>
                  setLanguage(
                    event.target.value
                  )
                }
              >
                <option>Español</option>
                <option>Galego</option>
                <option>English</option>
                <option>Français</option>
                <option>Português</option>
                <option>日本語</option>
                <option>Otro</option>
              </select>
            </label>

            <label>
              <span>
                Poema original
              </span>

              <textarea
                value={poem}
                maxLength={5000}
                placeholder="Escribe o pega aquí tu poema…"
                onChange={(event) =>
                  setPoem(
                    event.target.value
                  )
                }
              />

              <small>
                {poem.length} / 5000
              </small>
            </label>

            {error && (
              <p
                className={styles.error}
                role="alert"
              >
                {error}
              </p>
            )}

            <button type="submit">
              <span>✦</span>
              Elevar el poema
            </button>
          </form>

          <section
            className={`${styles.panel} ${styles.ethics}`}
          >
            <div className={styles.heading}>
              <span>◇</span>

              <div>
                <h2>
                  Privacidad por diseño
                </h2>

                <p>
                  La palabra sigue
                  siendo tuya
                </p>
              </div>
            </div>

            <article>
              <strong>
                Privado por defecto
              </strong>
              <p>
                Nada se publica sin una
                decisión expresa.
              </p>
            </article>

            <article>
              <strong>
                Sin entrenamiento
              </strong>
              <p>
                Tu obra no se usa para
                entrenar modelos.
              </p>
            </article>

            <article>
              <strong>
                Sin alimentación interna
              </strong>
              <p>
                El poema no enriquece
                ningún sistema de Poema
                Universal.
              </p>
            </article>

            <article>
              <strong>
                Sin guardado
              </strong>
              <p>
                Al cerrar esta página,
                la sesión desaparece.
              </p>
            </article>
          </section>
        </aside>

        <section
          id="altar-poetico"
          className={styles.results}
        >
          {!result ? (
            <div className={styles.empty}>
              <div>✦</div>

              <p>
                Altar en espera
              </p>

              <h2>
                Aquí aparecerá el mundo
                invisible de tu poema
              </h2>

              <span>
                La Matriz no decidirá
                qué significa tu obra.
                Construirá una lectura
                posible para que puedas
                contemplarla desde otro
                lugar.
              </span>
            </div>
          ) : (
            <div className={styles.stack}>
              <section
                className={styles.altar}
              >
                <p>
                  Altar del poema
                </p>

                <h2>
                  {title.trim() ||
                    "Poema sin título"}
                </h2>

                <span>
                  {author.trim() ||
                    "Autor no indicado"}
                  {" · "}
                  {language}
                </span>

                <blockquote>
                  “{result.gravityLine}”
                </blockquote>

                <small>
                  Esto no es lo que tu
                  poema significa. Es una
                  de las formas en que ha
                  decidido aparecer.
                </small>
              </section>

              <div className={styles.grid}>
                <article>
                  <p>Pulso del poema</p>
                  <span>
                    {result.pulse}
                  </span>
                </article>

                <article>
                  <p>Núcleo invisible</p>
                  <span>
                    {result.core}
                  </span>
                </article>

                <article>
                  <p>Símbolo central</p>
                  <h3>
                    {result.symbol}
                  </h3>
                </article>

                <article>
                  <p>Reliquia</p>
                  <h3>
                    {result.relic}
                  </h3>
                </article>
              </div>

              <section
                className={styles.scene}
              >
                <div
                  className={
                    styles.sceneVisual
                  }
                >
                  <div
                    className={
                      styles.light
                    }
                  />

                  <div
                    className={
                      styles.book
                    }
                  />

                  <div
                    className={
                      styles.door
                    }
                  />
                </div>

                <div>
                  <p>Escenografía</p>

                  <h3>
                    {result.scenography}
                  </h3>
                </div>
              </section>

              <div className={styles.grid}>
                <article>
                  <p>Gesto final</p>
                  <span>
                    {
                      result.finalGesture
                    }
                  </span>
                </article>

                <article>
                  <p>Altar simbólico</p>
                  <span>
                    {result.altar}
                  </span>
                </article>
              </div>

              <section
                className={
                  styles.deleteArea
                }
              >
                <div>
                  <strong>
                    Esta lectura solo
                    existe durante la
                    sesión
                  </strong>

                  <p>
                    Este prototipo no
                    guarda ni transmite
                    el poema.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={deleteSession}
                >
                  Eliminar sesión
                </button>
              </section>
            </div>
          )}
        </section>
      </div>

      <footer className={styles.footer}>
        ✦ La palabra es tuya. El mundo
        que genera, también. ✦
      </footer>
    </main>
  );
}
