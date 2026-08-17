#!/usr/bin/env bash
set -euo pipefail

cd "${HOME}/poema-universal"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " VERSO → TECHNO · CONSOLA POÉTICO-INDUSTRIAL V2"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [[ ! -f package.json ]]; then
  echo "❌ No encuentro package.json en ~/poema-universal"
  exit 1
fi

if [[ -d app ]]; then
  APP_ROOT="app"
elif [[ -d src/app ]]; then
  APP_ROOT="src/app"
else
  echo "❌ No encuentro app/ ni src/app/"
  exit 1
fi

TARGET="${APP_ROOT}/laboratorio/verso-tecno"
STAMP="$(date +%Y%m%d-%H%M%S)"

if [[ ! -d "${TARGET}" ]]; then
  echo "❌ No encuentro la V1 en ${TARGET}"
  echo "   Ejecuta primero el reparador de ruta de Verso → Techno."
  exit 1
fi

BACKUP="${TARGET}.before-console-v2-${STAMP}"
cp -R "${TARGET}" "${BACKUP}"
echo "✅ Copia de seguridad: ${BACKUP}"

if [[ ! -f "${TARGET}/motor.ts" ]]; then
  if [[ -f lib/verso-tecno/motor.ts ]]; then
    cp lib/verso-tecno/motor.ts "${TARGET}/motor.ts"
  elif [[ -f src/lib/verso-tecno/motor.ts ]]; then
    cp src/lib/verso-tecno/motor.ts "${TARGET}/motor.ts"
  else
    echo "❌ No encuentro motor.ts."
    exit 1
  fi
fi

cat > "${TARGET}/page.tsx" <<'EOF'
import type { Metadata } from "next";
import VersoTecno from "./VersoTecno";

export const metadata: Metadata = {
  title: "Verso → Techno · Consola poético-industrial",
  description:
    "Una máquina de composición que transforma arquitectura literaria en techno.",
};

export default function VersoTecnoPage() {
  return <VersoTecno />;
}
EOF

cat > "${TARGET}/VersoTecno.tsx" <<'EOF'
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
                  <i>{String(index + 1).padStart(2, "0")}</i>
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
EOF

# Corrige un identificador para evitar cualquier sustitución accidental del shell.
python3 - "${TARGET}/VersoTecno.tsx" <<'PY'
from pathlib import Path
import sys

path = Path(sys.argv[1])
text = path.read_text(encoding="utf-8")
text = text.replace("String(index + 1)", "String(indice + 1)")
path.write_text(text, encoding="utf-8")
PY

cat > "${TARGET}/verso-tecno.module.css" <<'EOF'
.page {
  --bg: #07090a;
  --panel: rgba(15, 18, 19, 0.92);
  --panel-deep: #0b0d0e;
  --line: rgba(255, 255, 255, 0.11);
  --line-strong: rgba(255, 255, 255, 0.22);
  --ink: #f2eee4;
  --muted: #8a918e;
  --acid: #d9ff43;
  --acid-soft: rgba(217, 255, 67, 0.14);
  --signal: #f47744;
  --signal-soft: rgba(244, 119, 68, 0.16);
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  padding: 22px clamp(12px, 2.2vw, 34px) 42px;
  background:
    radial-gradient(circle at 50% -20%, rgba(244, 119, 68, 0.12), transparent 36%),
    linear-gradient(180deg, #0b0d0e 0%, var(--bg) 46%, #050606 100%);
  color: var(--ink);
  font-family: Arial, Helvetica, sans-serif;
}

.mode_huella {
  --acid: #d9ff43;
  --acid-soft: rgba(217, 255, 67, 0.14);
  --signal: #dce2d2;
  --signal-soft: rgba(220, 226, 210, 0.12);
}

.mode_ritual {
  --acid: #e7d9aa;
  --acid-soft: rgba(231, 217, 170, 0.14);
  --signal: #f47744;
  --signal-soft: rgba(244, 119, 68, 0.16);
}

.mode_club {
  --acid: #ff4f87;
  --acid-soft: rgba(255, 79, 135, 0.16);
  --signal: #a08cff;
  --signal-soft: rgba(160, 140, 255, 0.17);
}

.noise {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.22;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.023) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.018) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: linear-gradient(to bottom, black 0%, transparent 92%);
}

.scanline {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.2;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent 3px,
    rgba(255, 255, 255, 0.016) 4px
  );
}

.topbar,
.console,
.module,
.footer {
  position: relative;
  z-index: 1;
  width: min(1780px, 100%);
  margin-left: auto;
  margin-right: auto;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 74px;
  margin-bottom: 12px;
  border: 1px solid var(--line);
  background: rgba(7, 9, 10, 0.76);
  backdrop-filter: blur(18px);
}

.identity {
  display: flex;
  align-items: stretch;
  min-height: 74px;
}

.mark {
  display: grid;
  place-items: center;
  width: 74px;
  border-right: 1px solid var(--line);
  color: var(--acid);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 21px;
  font-style: italic;
}

.identity > div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 22px;
}

.identity p,
.identity h1 {
  margin: 0;
}

.identity p {
  color: var(--muted);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.23em;
}

.identity h1 {
  margin-top: 6px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(20px, 2.3vw, 34px);
  font-weight: 400;
  letter-spacing: 0.03em;
}

.status {
  display: flex;
  align-items: center;
  gap: 11px;
  min-height: 74px;
  padding: 0 24px;
  border-left: 1px solid var(--line);
}

.statusDot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--acid);
  box-shadow: 0 0 18px var(--acid);
  animation: blink 1.8s ease-in-out infinite;
}

.status div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.status small {
  color: var(--muted);
  font-size: 7px;
  letter-spacing: 0.22em;
}

.status strong {
  font-size: 9px;
  letter-spacing: 0.12em;
}

.console {
  display: grid;
  grid-template-columns: minmax(280px, 0.88fr) minmax(390px, 1.22fr) minmax(280px, 0.9fr);
  gap: 12px;
}

.module {
  border: 1px solid var(--line);
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.025), transparent 42%),
    var(--panel);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(18px);
}

.writer,
.reactor,
.decoder {
  min-height: 650px;
  padding: 20px;
}

.moduleHead {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--line);
}

.moduleHead > div {
  display: flex;
  align-items: baseline;
  gap: 11px;
}

.moduleHead span {
  color: var(--acid);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 11px;
  font-style: italic;
}

.moduleHead h2 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 18px;
  font-weight: 400;
}

.moduleHead small {
  margin-top: 4px;
  color: var(--muted);
  font-size: 7px;
  font-weight: 700;
  letter-spacing: 0.2em;
}

.titleField,
.textField {
  display: block;
  margin-top: 20px;
}

.titleField > span,
.textField > div span,
.modeSelector > p,
.families > p,
.translationHead p {
  color: var(--muted);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.titleField input,
.textField textarea {
  width: 100%;
  box-sizing: border-box;
  outline: none;
  border: 1px solid var(--line);
  border-radius: 0;
  background: #090b0c;
  color: var(--ink);
  transition: border-color 160ms ease, box-shadow 160ms ease;
}

.titleField input:focus,
.textField textarea:focus {
  border-color: var(--acid);
  box-shadow: 0 0 0 1px var(--acid-soft);
}

.titleField input {
  margin-top: 9px;
  padding: 13px 14px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 15px;
}

.textField > div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 9px;
}

.textField > div b {
  color: var(--muted);
  font-size: 8px;
  font-weight: 400;
}

.textField textarea {
  min-height: 242px;
  resize: vertical;
  padding: 16px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 16px;
  line-height: 1.72;
}

.modeSelector {
  margin-top: 20px;
}

.modeSelector > p {
  margin: 0 0 9px;
}

.mode,
.modeActive {
  display: grid;
  grid-template-columns: 42px 1fr;
  align-items: center;
  width: 100%;
  margin-top: 7px;
  padding: 10px;
  border: 1px solid var(--line);
  background: transparent;
  color: var(--ink);
  text-align: left;
  cursor: pointer;
}

.mode > span,
.modeActive > span {
  color: var(--muted);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 10px;
  font-style: italic;
}

.mode div,
.modeActive div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.mode strong,
.modeActive strong {
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.mode small,
.modeActive small {
  color: var(--muted);
  font-size: 8px;
  line-height: 1.35;
}

.modeActive {
  border-color: var(--acid);
  background: var(--acid-soft);
}

.modeActive > span,
.modeActive strong {
  color: var(--acid);
}

.writerActions {
  display: grid;
  grid-template-columns: 0.55fr 1.45fr;
  gap: 8px;
  margin-top: 18px;
}

.writerActions button,
.engineActions button,
.engineActions a {
  min-height: 42px;
  border: 1px solid var(--line);
  border-radius: 0;
  background: transparent;
  color: var(--ink);
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-decoration: none;
  text-transform: uppercase;
  cursor: pointer;
}

.writerActions button:hover,
.engineActions button:hover,
.engineActions a:hover {
  border-color: var(--acid);
}

.writerActions .primaryAction {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-color: var(--acid);
  background: var(--acid);
  color: #080a0a;
}

.primaryAction:disabled {
  cursor: not-allowed;
  opacity: 0.34;
}

.reactor {
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 45%, var(--signal-soft), transparent 26%),
    radial-gradient(circle at 50% 45%, var(--acid-soft), transparent 54%),
    var(--panel-deep);
}

.reactorStage {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 410px;
  overflow: hidden;
  margin-top: 14px;
  border: 1px solid var(--line);
  background:
    linear-gradient(var(--line) 1px, transparent 1px),
    linear-gradient(90deg, var(--line) 1px, transparent 1px),
    #080a0b;
  background-size: 48px 48px;
}

.coordinate,
.coordinateRight {
  position: absolute;
  top: 12px;
  z-index: 5;
  color: var(--muted);
  font-size: 7px;
  letter-spacing: 0.16em;
}

.coordinate {
  left: 12px;
}

.coordinateRight {
  right: 12px;
}

.orbitOuter,
.orbitInner,
.pulseRing {
  position: absolute;
  border-radius: 50%;
}

.orbitOuter {
  width: min(74%, 330px);
  aspect-ratio: 1;
  border: 1px solid var(--line-strong);
  animation: orbit 16s linear infinite;
}

.orbitOuter::before,
.orbitOuter::after {
  content: "";
  position: absolute;
  inset: 12%;
  border: 1px dashed var(--line);
  border-radius: inherit;
}

.orbitOuter::after {
  inset: 28%;
  border-style: solid;
}

.orbitOuter > span {
  --angle: calc((360deg / var(--total)) * var(--i));
  position: absolute;
  left: 50%;
  top: 50%;
  width: 68px;
  margin-left: -34px;
  transform:
    rotate(var(--angle))
    translateY(-165px)
    rotate(calc(-1 * var(--angle)));
  color: var(--muted);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 8px;
  font-style: italic;
  text-align: center;
}

.orbitInner {
  width: min(48%, 210px);
  aspect-ratio: 1;
  border: 1px solid var(--acid);
  box-shadow:
    inset 0 0 30px var(--acid-soft),
    0 0 24px var(--acid-soft);
  transition: transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
}

.orbitInner::before,
.orbitInner::after {
  content: "";
  position: absolute;
  background: var(--acid);
}

.orbitInner::before {
  left: 50%;
  top: -4px;
  width: 1px;
  height: calc(100% + 8px);
}

.orbitInner::after {
  left: -4px;
  top: 50%;
  width: calc(100% + 8px);
  height: 1px;
}

.core {
  position: relative;
  z-index: 4;
  display: flex;
  align-items: baseline;
  justify-content: center;
  width: 132px;
  height: 132px;
  border-radius: 50%;
  background: #090b0c;
  box-shadow:
    0 0 0 1px var(--line-strong),
    0 0 65px var(--signal-soft);
}

.core small {
  position: absolute;
  top: 29px;
  color: var(--muted);
  font-size: 7px;
  letter-spacing: 0.18em;
}

.core strong {
  align-self: center;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 47px;
  font-weight: 400;
  letter-spacing: -0.05em;
}

.core span {
  align-self: center;
  margin: 20px 0 0 5px;
  color: var(--acid);
  font-size: 8px;
  letter-spacing: 0.12em;
}

.pulseRing {
  width: 142px;
  height: 142px;
  border: 1px solid var(--signal);
  animation: pulse 2.2s ease-out infinite;
}

.axisHorizontal,
.axisVertical {
  position: absolute;
  opacity: 0.35;
  background: var(--line-strong);
}

.axisHorizontal {
  width: 100%;
  height: 1px;
}

.axisVertical {
  width: 1px;
  height: 100%;
}

.reactorReadout {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 1px solid var(--line);
  border-top: 0;
}

.reactorReadout > div {
  min-width: 0;
  padding: 12px;
  border-right: 1px solid var(--line);
}

.reactorReadout > div:last-child {
  border-right: 0;
}

.reactorReadout span,
.reactorReadout strong {
  display: block;
}

.reactorReadout span {
  color: var(--muted);
  font-size: 7px;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.reactorReadout strong {
  overflow: hidden;
  margin-top: 5px;
  font-size: 9px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.manifesto {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 20px;
  margin-top: 16px;
  padding: 16px 0 0;
  border-top: 1px solid var(--line);
}

.manifesto span {
  color: var(--acid);
  font-size: 7px;
  font-weight: 700;
  letter-spacing: 0.18em;
  line-height: 1.5;
}

.manifesto p {
  margin: 0;
  color: #c7cbc6;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 13px;
  font-style: italic;
  line-height: 1.55;
}

.pressure {
  margin-top: 20px;
}

.pressureItem {
  margin-top: 13px;
}

.pressureItem > div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 7px;
}

.pressureItem span,
.pressureItem b {
  font-size: 8px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.pressureItem span {
  color: var(--muted);
}

.pressureItem b {
  color: var(--acid);
}

.pressureItem > i {
  display: block;
  height: 4px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.07);
}

.pressureItem > i span {
  display: block;
  height: 100%;
  background:
    linear-gradient(90deg, var(--signal), var(--acid));
  transition: width 480ms ease;
}

.families {
  margin-top: 26px;
}

.families > p {
  margin: 0 0 9px;
}

.families > div {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.families > div > span {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 9px;
  border: 1px solid var(--line);
  color: #c8ccc8;
  font-size: 8px;
}

.families b {
  color: var(--acid);
  font-weight: 400;
}

.translation {
  margin-top: 25px;
}

.translationHead {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 9px;
}

.translationHead p {
  margin: 0;
}

.translationHead span {
  color: var(--muted);
  font-size: 6px;
  letter-spacing: 0.13em;
}

.translationRows {
  border: 1px solid var(--line);
}

.translationRows > div {
  display: grid;
  grid-template-columns: 27px minmax(0, 1.15fr) minmax(0, 0.85fr) 35px;
  align-items: center;
  min-height: 34px;
  border-bottom: 1px solid var(--line);
}

.translationRows > div:last-child {
  border-bottom: 0;
}

.translationRows i,
.translationRows strong,
.translationRows span,
.translationRows b {
  overflow: hidden;
  padding: 0 7px;
  font-size: 8px;
  font-style: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.translationRows i {
  color: var(--muted);
}

.translationRows strong {
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 400;
}

.translationRows span {
  color: var(--muted);
}

.translationRows b {
  color: var(--acid);
  text-align: right;
}

.sequence {
  margin-top: 12px;
  padding: 18px 20px 20px;
}

.timeline {
  display: flex;
  min-height: 92px;
  margin-top: 16px;
  overflow: hidden;
  border: 1px solid var(--line);
}

.timeline > div {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-width: 72px;
  padding: 12px;
  border-right: 1px solid var(--line);
  background:
    linear-gradient(to top, var(--acid-soft), transparent 72%);
}

.timeline > div:last-child {
  border-right: 0;
}

.timeline > div::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 24px;
  height: 1px;
  background: var(--line);
}

.timeline > div span {
  position: absolute;
  top: 9px;
  left: 10px;
  color: var(--muted);
  font-size: 7px;
}

.timeline strong {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 11px;
  font-weight: 400;
}

.timeline small {
  margin-top: 4px;
  color: var(--muted);
  font-size: 7px;
  letter-spacing: 0.1em;
}

.timeline .climax {
  background:
    linear-gradient(to top, var(--signal-soft), transparent 85%);
}

.timeline .climax strong,
.timeline .climax small {
  color: var(--acid);
}

.soundEngine {
  margin-top: 12px;
  padding: 18px 20px 20px;
}

.engineHead {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.engineHead .moduleHead {
  flex: 1;
}

.engineActions {
  display: flex;
  gap: 7px;
}

.engineActions button,
.engineActions a {
  display: grid;
  place-items: center;
  min-width: 116px;
  padding: 0 13px;
}

.player {
  position: relative;
  margin-top: 16px;
  border: 1px solid var(--line);
  background: #050606;
}

.playerGuide {
  display: flex;
  align-items: center;
  gap: 13px;
  min-height: 44px;
  padding: 0 13px;
  border-bottom: 1px solid var(--line);
}

.playerGuide span {
  color: var(--acid);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 10px;
  font-style: italic;
}

.playerGuide p {
  margin: 0;
  color: var(--muted);
  font-size: 8px;
  letter-spacing: 0.08em;
}

.player iframe {
  display: block;
  width: 100%;
  height: 600px;
  border: 0;
  filter: saturate(0.78) contrast(1.06);
}

.source {
  margin-top: 12px;
}

.source summary {
  display: grid;
  grid-template-columns: 42px 1fr auto;
  align-items: center;
  min-height: 64px;
  padding: 0 20px;
  list-style: none;
  cursor: pointer;
}

.source summary::-webkit-details-marker {
  display: none;
}

.source summary > span {
  color: var(--acid);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 11px;
  font-style: italic;
}

.source summary {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 15px;
}

.source summary b {
  color: var(--muted);
  font-family: Arial, Helvetica, sans-serif;
  font-size: 7px;
  letter-spacing: 0.16em;
}

.source pre {
  max-height: 660px;
  overflow: auto;
  margin: 0;
  padding: 22px;
  border-top: 1px solid var(--line);
  background: #050606;
  color: #d7ded6;
  font-size: 10px;
  line-height: 1.65;
  white-space: pre-wrap;
}

.footer {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 20px 0 0;
  color: var(--muted);
  font-size: 7px;
  letter-spacing: 0.14em;
}

.footer p {
  margin: 0;
}

.toast {
  position: fixed;
  right: 22px;
  bottom: 22px;
  z-index: 50;
  max-width: min(360px, calc(100vw - 44px));
  padding: 13px 16px;
  border: 1px solid var(--acid);
  background: #090b0c;
  color: var(--ink);
  box-shadow: 0 18px 55px rgba(0, 0, 0, 0.45);
  font-size: 9px;
  letter-spacing: 0.08em;
}

@keyframes orbit {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0% {
    opacity: 0.72;
    transform: scale(0.92);
  }
  100% {
    opacity: 0;
    transform: scale(1.42);
  }
}

@keyframes blink {
  50% {
    opacity: 0.4;
  }
}

@media (max-width: 1180px) {
  .console {
    grid-template-columns: minmax(300px, 0.9fr) minmax(430px, 1.1fr);
  }

  .decoder {
    grid-column: 1 / -1;
    min-height: auto;
  }

  .families > div {
    grid-template-columns: repeat(4, 1fr);
  }

  .translationRows {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1px;
    background: var(--line);
  }

  .translationRows > div {
    background: var(--panel-deep);
  }
}

@media (max-width: 820px) {
  .page {
    padding: 12px 8px 32px;
  }

  .topbar,
  .engineHead,
  .footer {
    align-items: stretch;
    flex-direction: column;
  }

  .status {
    min-height: 48px;
    border-top: 1px solid var(--line);
    border-left: 0;
  }

  .console {
    grid-template-columns: 1fr;
  }

  .writer,
  .reactor,
  .decoder {
    min-height: auto;
  }

  .reactorStage {
    min-height: 390px;
  }

  .decoder {
    grid-column: auto;
  }

  .families > div {
    grid-template-columns: repeat(2, 1fr);
  }

  .engineActions {
    flex-wrap: wrap;
  }

  .engineActions button,
  .engineActions a {
    flex: 1;
  }

  .timeline {
    overflow-x: auto;
  }

  .timeline > div {
    flex: 0 0 110px;
  }

  .player iframe {
    height: 540px;
  }
}

@media (max-width: 520px) {
  .identity p {
    display: none;
  }

  .identity > div {
    padding: 0 14px;
  }

  .mark {
    width: 58px;
  }

  .writer,
  .reactor,
  .decoder,
  .sequence,
  .soundEngine {
    padding: 15px;
  }

  .reactorReadout {
    grid-template-columns: repeat(2, 1fr);
  }

  .reactorReadout > div:nth-child(2) {
    border-right: 0;
  }

  .reactorReadout > div:nth-child(-n + 2) {
    border-bottom: 1px solid var(--line);
  }

  .manifesto {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .translationRows {
    grid-template-columns: 1fr;
  }

  .source summary {
    grid-template-columns: 32px 1fr;
  }

  .source summary b {
    display: none;
  }
}
EOF

rm -rf .next

echo ""
echo "✅ V2 instalada."
echo "✅ Motor literario conservado."
echo "✅ Aspecto sustituido por consola poético-industrial."
echo ""
echo "Arranca:"
echo "  npm run dev -- --webpack"
echo ""
echo "Abre:"
echo "  http://localhost:3000/laboratorio/verso-tecno"
echo "o, si Next usa otro puerto, sustituye 3000 por el puerto indicado."
