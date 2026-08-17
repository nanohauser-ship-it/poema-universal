"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  analizarLiteratura,
  crearUrlStrudel,
  generarCodigoStrudel,
  type ModoTransmutacion,
} from "./motor";
import styles from "./verso-tecno.module.css";

const TEXTO_INICIAL = `No dejes que desaparezcamos.
Todavía queda fuego bajo la tierra.
La ciudad respira el nombre que olvidamos.`;

const NOMBRE_FAMILIA: Record<string, string> = {
  tierra: "Tierra",
  agua: "Agua",
  fuego: "Fuego",
  aire: "Aire",
  memoria: "Memoria",
  ausencia: "Ausencia",
  cuerpo: "Cuerpo",
  maquina: "Máquina",
  hambre: "Hambre",
  neutra: "Materia",
};

const MODOS: Array<{
  id: ModoTransmutacion;
  nombre: string;
  codigo: string;
  descripcion: string;
}> = [
  {
    id: "huella",
    nombre: "Huella",
    codigo: "H01",
    descripcion: "La métrica y la estructura dominan.",
  },
  {
    id: "ritual",
    nombre: "Ritual",
    codigo: "R02",
    descripcion: "Equilibrio entre símbolo, atmósfera y pulso.",
  },
  {
    id: "club",
    nombre: "Cuerpo",
    codigo: "C03",
    descripcion: "Más presión, repetición y materia física.",
  },
];

const FASES = [
  ["A", "Aparición", "8"],
  ["B", "Invocación", "16"],
  ["C", "Cuerpo", "16"],
  ["D", "Ruptura", "8"],
  ["E", "Retorno", "16"],
  ["F", "Clímax", "24"],
  ["G", "Desaparición", "8"],
] as const;

export default function VersoTecno() {
  const [titulo, setTitulo] = useState("No dejes que desaparezcamos");
  const [texto, setTexto] = useState(TEXTO_INICIAL);
  const [modo, setModo] = useState<ModoTransmutacion>("ritual");
  const [revision, setRevision] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [motorVisible, setMotorVisible] = useState(true);

  useEffect(() => {
    try {
      const guardado =
        window.localStorage.getItem("verso-techno-v2") ??
        window.localStorage.getItem("verso-techno-v1");

      if (!guardado) return;

      const estado = JSON.parse(guardado) as {
        titulo?: string;
        texto?: string;
        modo?: ModoTransmutacion;
      };

      if (estado.titulo) setTitulo(estado.titulo);
      if (estado.texto) setTexto(estado.texto);
      if (estado.modo) setModo(estado.modo);
    } catch {
      // La consola sigue funcionando aunque la persistencia esté bloqueada.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        "verso-techno-v2",
        JSON.stringify({ titulo, texto, modo }),
      );
    } catch {
      // No interrumpimos el proceso creativo.
    }
  }, [titulo, texto, modo]);

  const analisis = useMemo(
    () => analizarLiteratura(texto, modo),
    [texto, modo, revision],
  );

  const codigo = useMemo(
    () => generarCodigoStrudel(titulo, texto, modo, analisis),
    [titulo, texto, modo, analisis, revision],
  );

  const urlStrudel = useMemo(() => crearUrlStrudel(codigo), [codigo]);

  const palabrasActivas = analisis.eventos.slice(0, 10);
  const modoActual = MODOS.find((item) => item.id === modo) ?? MODOS[1];

  function notificar(textoMensaje: string) {
    setMensaje(textoMensaje);
    window.setTimeout(() => setMensaje(""), 2300);
  }

  async function copiarCodigo() {
    try {
      await navigator.clipboard.writeText(codigo);
      notificar("Arquitectura Strudel copiada.");
    } catch {
      notificar("No se pudo copiar automáticamente.");
    }
  }

  function transmutar() {
    setRevision((valor) => valor + 1);
    setMotorVisible(true);
    notificar("Nueva arquitectura sonora engendrada.");
  }

  function limpiar() {
    setTitulo("");
    setTexto("");
    notificar("La cámara de escritura ha quedado vacía.");
  }

  return (
    <main className={`${styles.page} ${styles[`mode_${modo}`]}`}>
      <div className={styles.noise} aria-hidden="true" />
      <div className={styles.scanline} aria-hidden="true" />

      <header className={styles.topbar}>
        <div className={styles.identity}>
          <span className={styles.mark}>V/T</span>
          <div>
            <p>POEMA UNIVERSAL · LABORATORIO SONORO 01</p>
            <h1>VERSO → TECHNO</h1>
          </div>
        </div>

        <div className={styles.status}>
          <span className={styles.statusDot} />
          <div>
            <small>MOTOR LITERARIO</small>
            <strong>ACTIVO · {modoActual.codigo}</strong>
          </div>
        </div>
      </header>

      <section className={styles.console}>
        <aside className={`${styles.module} ${styles.writer}`}>
          <ModuleHeader index="01" title="Cámara de escritura" tag="ORIGEN" />

          <label className={styles.titleField}>
            <span>Nombre de la transmutación</span>
            <input
              value={titulo}
              onChange={(event) => setTitulo(event.target.value)}
              placeholder="Obra sin título"
              maxLength={90}
            />
          </label>

          <label className={styles.textField}>
            <div>
              <span>Poema · fragmento · escena</span>
              <b>{texto.length}/5000</b>
            </div>
            <textarea
              value={texto}
              onChange={(event) => setTexto(event.target.value.slice(0, 5000))}
              placeholder="Escribe la materia que deberá convertirse en sonido…"
            />
          </label>

          <div className={styles.modeSelector}>
            <p>Régimen de transmutación</p>
            {MODOS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={modo === item.id ? styles.modeActive : styles.mode}
                onClick={() => setModo(item.id)}
              >
                <span>{item.codigo}</span>
                <div>
                  <strong>{item.nombre}</strong>
                  <small>{item.descripcion}</small>
                </div>
              </button>
            ))}
          </div>

          <div className={styles.writerActions}>
            <button type="button" onClick={limpiar}>
              Vaciar
            </button>
            <button
              type="button"
              className={styles.primaryAction}
              onClick={transmutar}
              disabled={!texto.trim()}
            >
              TRANSMUTAR
              <span>↗</span>
            </button>
          </div>
        </aside>

        <section className={`${styles.module} ${styles.reactor}`}>
          <ModuleHeader index="02" title="Núcleo de transmutación" tag="VIVO" />

          <div className={styles.reactorStage}>
            <div className={styles.coordinate}>X {analisis.palabras}.04</div>
            <div className={styles.coordinateRight}>
              Y {analisis.pausas}.08
            </div>

            <div
              className={styles.orbitOuter}
              style={{
                animationDuration: `${Math.max(8, 19 - analisis.tension / 8)}s`,
              }}
            >
              {palabrasActivas.slice(0, 6).map((evento, indice) => (
                <span
                  key={`${evento.palabra}-${indice}`}
                  style={
                    {
                      "--i": indice,
                      "--total": Math.max(
                        1,
                        Math.min(6, palabrasActivas.length),
                      ),
                    } as CSSProperties
                  }
                >
                  {evento.palabra}
                </span>
              ))}
            </div>

            <div
              className={styles.orbitInner}
              style={{
                transform: `rotate(${revision * 17 + analisis.oscuridad}deg)`,
              }}
            />

            <div className={styles.core}>
              <small>TEMPO</small>
              <strong>{analisis.bpm}</strong>
              <span>BPM</span>
            </div>

            <div className={styles.pulseRing} />
            <div className={styles.axisHorizontal} />
            <div className={styles.axisVertical} />
          </div>

          <div className={styles.reactorReadout}>
            <div>
              <span>Tonalidad</span>
              <strong>{analisis.tonalidad}</strong>
            </div>
            <div>
              <span>Versos</span>
              <strong>{analisis.versos.toString().padStart(2, "0")}</strong>
            </div>
            <div>
              <span>Repeticiones</span>
              <strong>{analisis.repeticiones.toString().padStart(2, "0")}</strong>
            </div>
            <div>
              <span>Modo</span>
              <strong>{modoActual.nombre}</strong>
            </div>
          </div>

          <div className={styles.manifesto}>
            <span>PRINCIPIO DE LA MÁQUINA</span>
            <p>
              El texto no ilustra la música. Su longitud, respiración,
              insistencias y símbolos construyen la máquina que deberá sonar.
            </p>
          </div>
        </section>

        <aside className={`${styles.module} ${styles.decoder}`}>
          <ModuleHeader index="03" title="Decodificador simbólico" tag="MAPA" />

          <div className={styles.pressure}>
            <Pressure label="Oscuridad" value={analisis.oscuridad} />
            <Pressure label="Tensión" value={analisis.tension} />
            <Pressure label="Luminosidad" value={analisis.luminosidad} />
          </div>

          <div className={styles.families}>
            <p>Campos detectados</p>
            <div>
              {analisis.familias.length ? (
                analisis.familias.map(({ familia, cantidad }) => (
                  <span key={familia}>
                    {NOMBRE_FAMILIA[familia]}
                    <b>{cantidad.toString().padStart(2, "0")}</b>
                  </span>
                ))
              ) : (
                <span>
                  Materia indeterminada <b>00</b>
                </span>
              )}
            </div>
          </div>

          <div className={styles.translation}>
            <div className={styles.translationHead}>
              <p>Genealogía de señal</p>
              <span>PALABRA / CAMPO / NOTA</span>
            </div>
            <div className={styles.translationRows}>
              {palabrasActivas.map((evento, indice) => (
                <div key={`${evento.palabra}-${indice}`}>
                  <i>{String(indice + 1).padStart(2, "0")}</i>
                  <strong>{evento.palabra}</strong>
                  <span>{NOMBRE_FAMILIA[evento.familia]}</span>
                  <b>{evento.nota}</b>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className={`${styles.module} ${styles.sequence}`}>
        <ModuleHeader index="04" title="Arquitectura temporal" tag="96 CICLOS" />
        <div className={styles.timeline}>
          {FASES.map(([letra, nombre, ciclos], index) => (
            <div
              key={letra}
              className={index === 5 ? styles.climax : undefined}
              style={{ flexGrow: Number(ciclos) }}
            >
              <span>{letra}</span>
              <strong>{nombre}</strong>
              <small>{ciclos} C</small>
            </div>
          ))}
        </div>
      </section>

      <section className={`${styles.module} ${styles.soundEngine}`}>
        <div className={styles.engineHead}>
          <ModuleHeader
            index="05"
            title={titulo || "Transmutación sin título"}
            tag="INSTRUMENTO"
          />
          <div className={styles.engineActions}>
            <button type="button" onClick={copiarCodigo}>
              Copiar código
            </button>
            <button
              type="button"
              onClick={() => setMotorVisible((visible) => !visible)}
            >
              {motorVisible ? "Cerrar motor" : "Abrir motor"}
            </button>
            <a href={urlStrudel} target="_blank" rel="noreferrer">
              Strudel ↗
            </a>
          </div>
        </div>

        {motorVisible ? (
          <div className={styles.player}>
            <div className={styles.playerGuide}>
              <span>01</span>
              <p>
                Pulsa el triángulo de reproducción dentro del motor para
                permitir el audio del navegador.
              </p>
            </div>
            <iframe
              key={`${urlStrudel}-${revision}`}
              src={urlStrudel}
              title={`Instrumento Strudel: ${titulo}`}
              allow="autoplay; microphone; midi"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        ) : null}
      </section>

      <details className={`${styles.module} ${styles.source}`}>
        <summary>
          <span>06</span>
          Ver la partitura algorítmica generada
          <b>STRUDel / LIVE CODE</b>
        </summary>
        <pre>{codigo}</pre>
      </details>

      <footer className={styles.footer}>
        <p>VERSO → TECHNO · CONSOLA POÉTICO-INDUSTRIAL · V2</p>
        <p>La literatura permanece como origen verificable de cada sonido.</p>
      </footer>

      {mensaje ? <div className={styles.toast}>{mensaje}</div> : null}
    </main>
  );
}

function ModuleHeader({
  index,
  title,
  tag,
}: {
  index: string;
  title: string;
  tag: string;
}) {
  return (
    <div className={styles.moduleHead}>
      <div>
        <span>{index}</span>
        <h2>{title}</h2>
      </div>
      <small>{tag}</small>
    </div>
  );
}

function Pressure({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles.pressureItem}>
      <div>
        <span>{label}</span>
        <b>{value}%</b>
      </div>
      <i>
        <span style={{ width: `${value}%` }} />
      </i>
    </div>
  );
}
