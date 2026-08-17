"use client";

import { useEffect, useMemo, useState } from "react";
import OrganismoEmbryoScene from "./organismo/OrganismoEmbryoScene";
import {
  CICLOS_COMPOSICION,
  HABITATS,
  analizarPoema,
  bpmActual,
  codigoStrudel,
  duracionComposicionMinutos,
  despertar,
  evolucionarHastaHoy,
  incubar,
  injertar,
  mutarAhora,
  urlStrudel,
  type Habitat,
  type Organismo,
} from "./organismo/motor";
import styles from "./verso-tecno.module.css";

const STORAGE = "organismo-electronico-v4";

const POEMA = `No dejes que desaparezcamos.
Todavía queda fuego bajo la tierra.
La ciudad respira el nombre que olvidamos.
Pero el silencio vuelve con otra forma.
Y al final solo queda una luz respirando.`;

const NOMBRES: Record<Habitat, string> = {
  deriva: "Deriva",
  pulso: "Pulso",
  fractura: "Fractura",
  espectral: "Espectral",
  maquina: "Máquina",
  memoria: "Memoria",
};

const DESCRIPCIONES: Record<Habitat, string> = {
  deriva: "Ambient, drone y profundidad espacial.",
  pulso: "Latido, subgrave y energía física.",
  fractura: "Glitch, cortes y ritmos irregulares.",
  espectral: "Presencia, resonancia y voz fantasma.",
  maquina: "Metal, secuencia y precisión algorítmica.",
  memoria: "Motivos que regresan y se degradan.",
};

const ETAPAS: Record<string, string> = {
  embrion: "Embrión",
  germinacion: "Germinación",
  formacion: "Formación",
  cuerpo: "Cuerpo",
  mutacion: "Mutación",
  madurez: "Madurez",
  latencia: "Latencia",
};

const ESCENAS_MUSICALES = [
  ["Incubación", 8],
  ["Germinación", 16],
  ["Formación", 20],
  ["Cuerpo", 24],
  ["Fractura", 12],
  ["Expansión", 20],
  ["Memoria", 16],
] as const;

export default function VersoTecno() {
  const [nombre, setNombre] = useState("La luz que permanece");
  const [poema, setPoema] = useState(POEMA);
  const [organismo, setOrganismo] = useState<Organismo | null>(null);
  const [injerto, setInjerto] = useState("");
  const [cargando, setCargando] = useState(true);
  const [sonido, setSonido] = useState(true);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(STORAGE);
      if (guardado) {
        const evolucion = evolucionarHastaHoy(
          JSON.parse(guardado) as Organismo,
        );
        setOrganismo(evolucion.organismo);
        window.localStorage.setItem(
          STORAGE,
          JSON.stringify(evolucion.organismo),
        );

        if (evolucion.ciclos > 0) {
          aviso(
            `Completó ${evolucion.ciclos} ciclos vitales mientras no estabas.`,
          );
        }
      }
    } catch {
      window.localStorage.removeItem(STORAGE);
    }

    setCargando(false);
  }, []);

  const previo = useMemo(() => analizarPoema(poema), [poema]);
  const codigo = useMemo(
    () => (organismo ? codigoStrudel(organismo) : ""),
    [organismo],
  );
  const url = useMemo(() => (codigo ? urlStrudel(codigo) : ""), [codigo]);
  const duracion = organismo
    ? duracionComposicionMinutos(organismo)
    : 0;

  function aviso(texto: string) {
    setMensaje(texto);
    window.setTimeout(() => setMensaje(""), 2500);
  }

  function guardar(nuevo: Organismo) {
    setOrganismo(nuevo);
    window.localStorage.setItem(STORAGE, JSON.stringify(nuevo));
  }

  function crear() {
    if (poema.trim().length < 12) {
      aviso("El organismo necesita más materia literaria.");
      return;
    }

    const nuevo = incubar(nombre, poema);
    guardar(nuevo);
    aviso(`${nuevo.codigo} ha nacido alrededor de «${nuevo.reliquia}».`);
  }

  function mutar() {
    if (!organismo) return;
    guardar(mutarAhora(organismo));
    setSonido(true);
    aviso("Mutación inducida sin alterar su edad.");
  }

  function alimentar() {
    if (!organismo || !injerto.trim()) return;
    guardar(injertar(organismo, injerto));
    setInjerto("");
    setSonido(true);
    aviso("El verso entró en su genealogía.");
  }

  function despertarAhora() {
    if (!organismo) return;
    guardar(despertar(organismo));
    aviso("El organismo salió de la latencia.");
  }

  function liberar() {
    if (!window.confirm("¿Eliminar este organismo y su diario local?")) return;
    window.localStorage.removeItem(STORAGE);
    setOrganismo(null);
    setPoema(POEMA);
    setNombre("La luz que permanece");
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(codigo);
      aviso("Código electrónico copiado.");
    } catch {
      aviso("No se pudo copiar automáticamente.");
    }
  }

  if (cargando) {
    return (
      <main className={styles.page}>
        <div className={styles.loading}>Buscando vida sonora…</div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.grid} aria-hidden="true" />

      <header className={styles.topbar}>
        <div className={styles.brand}>
          <span>O/E</span>
          <div>
            <small>POEMA UNIVERSAL · LABORATORIO 02</small>
            <h1>ORGANISMO</h1>
          </div>
        </div>
        <p><i /> Literatura electrónica viva</p>
      </header>

      {!organismo ? (
        <section className={styles.birthLayout}>
          <article className={styles.panel}>
            <Header n="01" title="Cámara de incubación" tag="NACIMIENTO" />

            <label className={styles.field}>
              <span>Nombre provisional</span>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                maxLength={80}
              />
            </label>

            <label className={styles.field}>
              <span>Poema · ADN fundacional</span>
              <textarea
                value={poema}
                onChange={(e) => setPoema(e.target.value.slice(0, 5000))}
              />
            </label>

            <blockquote className={styles.principle}>
              El poema no producirá una canción cerrada. Creará una edad, una
              memoria y una fisiología electrónica.
            </blockquote>

            <button className={styles.primary} onClick={crear}>
              INCUBAR POEMA <b>ENGENDRAR PRESENCIA ↗</b>
            </button>
          </article>

          <aside className={styles.panel}>
            <Header n="02" title="Lectura genética" tag="PREVISIÓN" />

            <div className={styles.relicPreview}>
              <small>PALABRA RELIQUIA</small>
              <strong>{previo.reliquia}</strong>
              <span>{previo.bpmBase} BPM potenciales · {previo.tonalidad}</span>
            </div>

            <Habitats valores={previo.habitats} />
          </aside>
        </section>
      ) : (
        <>
          <section className={styles.organismLayout}>
            <article className={styles.panel}>
              <Header n="01" title="Cámara vital" tag={organismo.codigo} />
              <OrganismoEmbryoScene organismo={organismo} />
              <div className={styles.organismTitle}>
                <div>
                  <small>ORGANISMO ACTUAL</small>
                  <h2>{organismo.nombre}</h2>
                </div>
                <strong>{organismo.edad}<span>DÍAS</span></strong>
              </div>
            </article>

            <article className={styles.panel}>
              <Header
                n="02"
                title="Estado fisiológico"
                tag={ETAPAS[organismo.etapa]}
              />

              <div className={styles.vitalHero}>
                <small>ETAPA VITAL</small>
                <strong>{ETAPAS[organismo.etapa]}</strong>
                <span>
                  «{organismo.reliquia}» · {bpmActual(organismo)} BPM ·{" "}
                  {organismo.tonalidad}
                </span>
              </div>

              <div className={styles.metrics}>
                <Metric label="Energía" value={organismo.energia} />
                <Metric label="Estabilidad" value={organismo.estabilidad} />
                <Metric label="Memoria" value={organismo.memoriaVital} />
                <Metric label="Complejidad" value={organismo.complejidad} />
              </div>

              <Habitats valores={organismo.habitats} />

              <div className={styles.actions}>
                <button
                  onClick={
                    organismo.etapa === "latencia"
                      ? despertarAhora
                      : mutar
                  }
                >
                  {organismo.etapa === "latencia"
                    ? "DESPERTAR"
                    : "INDUCIR MUTACIÓN"}
                </button>
                <button onClick={() => setSonido((v) => !v)}>
                  {sonido ? "CERRAR SONIDO" : "ESCUCHAR"}
                </button>
              </div>
            </article>

            <aside className={styles.panel}>
              <Header
                n="03"
                title="Alimentación"
                tag={`${organismo.injertos.length} INJERTOS`}
              />

              <p className={styles.help}>
                El ADN fundacional permanece intacto. Todo nuevo verso se
                registra como una intervención posterior.
              </p>

              <label className={styles.field}>
                <span>Nuevo verso</span>
                <textarea
                  className={styles.graft}
                  value={injerto}
                  onChange={(e) => setInjerto(e.target.value.slice(0, 500))}
                  placeholder="Entrégale una frase que todavía no conoce…"
                />
              </label>

              <button
                className={styles.primary}
                onClick={alimentar}
                disabled={!injerto.trim()}
              >
                INJERTAR VERSO
              </button>

              <div className={styles.origin}>
                <small>ADN FUNDACIONAL</small>
                <p>{organismo.poema}</p>
              </div>

              <button className={styles.release} onClick={liberar}>
                LIBERAR ORGANISMO
              </button>
            </aside>
          </section>

          <section className={`${styles.panel} ${styles.sound}`}>
            <div className={styles.soundHead}>
              <Header
                n="04"
                title="Manifestación electrónica actual"
                tag={`${duracion} MIN · ${CICLOS_COMPOSICION} CICLOS`}
              />
              <div>
                <button onClick={copiar}>COPIAR CÓDIGO</button>
                <a href={url} target="_blank" rel="noreferrer">
                  STRUDEL ↗
                </a>
              </div>
            </div>

            <p>
              La canción madura durante una sola reproducción: nace, forma
              su cuerpo, se fractura, se expande y finalmente recuerda.
            </p>

            <div className={styles.songTimeline}>
              {ESCENAS_MUSICALES.map(([escena, ciclos], index) => (
                <div
                  key={escena}
                  style={{ flexGrow: ciclos }}
                  className={
                    index === 3 || index === 5
                      ? styles.songSceneStrong
                      : undefined
                  }
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{escena}</strong>
                  <small>{ciclos} C</small>
                </div>
              ))}
            </div>

            {sonido ? (
              <iframe
                key={url}
                src={url}
                title={`Organismo ${organismo.nombre}`}
                allow="autoplay; microphone; midi"
              />
            ) : null}
          </section>

          <section className={`${styles.panel} ${styles.diary}`}>
            <Header
              n="05"
              title="Diario vital"
              tag={`${organismo.diario.length} REGISTROS`}
            />

            <div>
              {organismo.diario
                .slice()
                .reverse()
                .map((entrada) => (
                  <article key={entrada.id}>
                    <span>DÍA {String(entrada.dia).padStart(2, "0")}</span>
                    <div>
                      <h3>{entrada.titulo}</h3>
                      <p>{entrada.texto}</p>
                    </div>
                    <time>{entrada.fecha}</time>
                  </article>
                ))}
            </div>
          </section>

          <details className={`${styles.panel} ${styles.source}`}>
            <summary>Ver código de la manifestación actual</summary>
            <pre>{codigo}</pre>
          </details>
        </>
      )}

      <footer className={styles.footer}>
        <span>ORGANISMO · V4 · FASE I</span>
        <span>El poema engendra una presencia.</span>
      </footer>

      {mensaje ? <div className={styles.toast}>{mensaje}</div> : null}
    </main>
  );
}

function Header({
  n,
  title,
  tag,
}: {
  n: string;
  title: string;
  tag: string;
}) {
  return (
    <div className={styles.header}>
      <div><span>{n}</span><h2>{title}</h2></div>
      <small>{tag}</small>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles.metric}>
      <div><span>{label}</span><b>{value}%</b></div>
      <i><span style={{ width: `${value}%` }} /></i>
    </div>
  );
}

function Habitats({ valores }: { valores: Record<Habitat, number> }) {
  return (
    <div className={styles.habitats}>
      <div className={styles.habitatHead}>
        <span>HÁBITATS ELECTRÓNICOS</span>
        <small>NO SON GÉNEROS CERRADOS</small>
      </div>

      {HABITATS.slice()
        .sort((a, b) => valores[b] - valores[a])
        .map((habitat) => (
          <div className={styles.habitat} key={habitat}>
            <div>
              <strong>{NOMBRES[habitat]}</strong>
              <small>{DESCRIPCIONES[habitat]}</small>
            </div>
            <i><span style={{ width: `${valores[habitat]}%` }} /></i>
            <b>{valores[habitat]}%</b>
          </div>
        ))}
    </div>
  );
}
