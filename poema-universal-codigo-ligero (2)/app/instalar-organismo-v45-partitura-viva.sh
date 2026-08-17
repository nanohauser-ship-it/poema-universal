#!/usr/bin/env bash
set -euo pipefail

cd "${HOME}/poema-universal"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " ORGANISMO V4.5 · PARTITURA VIVA"
echo " LA EVOLUCIÓN DE LA CANCIÓN SE HACE VISIBLE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [[ -d app/laboratorio/verso-tecno ]]; then
  TARGET="app/laboratorio/verso-tecno"
elif [[ -d src/app/laboratorio/verso-tecno ]]; then
  TARGET="src/app/laboratorio/verso-tecno"
else
  echo "❌ No encuentro /laboratorio/verso-tecno"
  exit 1
fi

UI="${TARGET}/VersoTecno.tsx"
CSS="${TARGET}/verso-tecno.module.css"

if [[ ! -f "$UI" || ! -f "$CSS" ]]; then
  echo "❌ No encuentro los archivos de Organismo."
  exit 1
fi

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="${TARGET}.before-score-v45-${STAMP}"
cp -R "$TARGET" "$BACKUP"

python3 - "$UI" "$CSS" <<'PY'
from pathlib import Path
import sys

ui_path = Path(sys.argv[1])
css_path = Path(sys.argv[2])

ui = ui_path.read_text(encoding="utf-8")
css = css_path.read_text(encoding="utf-8")

# ------------------------------------------------------------
# 1. Datos visuales de cada fase
# ------------------------------------------------------------

scenes_end = '''] as const;'''

phase_data = '''

const CAPAS_POR_FASE = [
  ["Drone uterino", "Palabra reliquia", "Respiración"],
  ["Primer latido", "Drone", "Eco espectral"],
  ["Pulso roto", "Secuencia", "Partículas agudas"],
  ["Bombo", "Subgrave", "Máquina", "Percusión"],
  ["Vacío", "Cicatriz rítmica", "Restos espectrales"],
  ["Cuerpo completo", "Expansión armónica", "Máxima energía"],
  ["Eco del origen", "Reliquia transformada", "Retirada"],
] as const;

const INTENSIDAD_POR_FASE = [16, 31, 52, 78, 34, 100, 24] as const;

const ACTIVACION_HABITATS: Array<Record<Habitat, number>> = [
  { deriva: 92, pulso: 4, fractura: 5, espectral: 66, maquina: 3, memoria: 48 },
  { deriva: 78, pulso: 22, fractura: 12, espectral: 62, maquina: 8, memoria: 56 },
  { deriva: 48, pulso: 48, fractura: 72, espectral: 44, maquina: 58, memoria: 34 },
  { deriva: 30, pulso: 94, fractura: 54, espectral: 28, maquina: 78, memoria: 22 },
  { deriva: 22, pulso: 18, fractura: 100, espectral: 74, maquina: 26, memoria: 38 },
  { deriva: 58, pulso: 100, fractura: 72, espectral: 66, maquina: 92, memoria: 52 },
  { deriva: 88, pulso: 12, fractura: 8, espectral: 76, maquina: 6, memoria: 100 },
];'''

if "const CAPAS_POR_FASE" not in ui:
    scenes_pos = ui.find("const ESCENAS = [")
    scenes_end_pos = ui.find(scenes_end, scenes_pos)
    if scenes_pos == -1 or scenes_end_pos == -1:
        raise SystemExit("❌ No encuentro ESCENAS.")
    insert_at = scenes_end_pos + len(scenes_end)
    ui = ui[:insert_at] + phase_data + ui[insert_at:]

# ------------------------------------------------------------
# 2. Cálculos de la partitura visible
# ------------------------------------------------------------

phase_block = '''  const faseVisual =
    progresoVisual < 4 / 56
      ? "Incubación"
      : progresoVisual < 10 / 56
        ? "Germinación"
        : progresoVisual < 18 / 56
          ? "Formación"
          : progresoVisual < 28 / 56
            ? "Cuerpo"
            : progresoVisual < 34 / 56
              ? "Fractura"
              : progresoVisual < 46 / 56
                ? "Expansión"
                : "Memoria";'''

phase_calculations = phase_block + '''

  const indiceFaseVisual =
    progresoVisual < 4 / 56
      ? 0
      : progresoVisual < 10 / 56
        ? 1
        : progresoVisual < 18 / 56
          ? 2
          : progresoVisual < 28 / 56
            ? 3
            : progresoVisual < 34 / 56
              ? 4
              : progresoVisual < 46 / 56
                ? 5
                : 6;

  const cicloVisual = Math.min(
    56,
    Math.max(0, Math.ceil(progresoVisual * 56)),
  );
  const segundosVisuales = Math.floor(
    (progresoVisual * duracionVisualMs) / 1000,
  );
  const tiempoVisual = `${Math.floor(segundosVisuales / 60)}:${String(
    segundosVisuales % 60,
  ).padStart(2, "0")}`;
  const intensidadVisual = INTENSIDAD_POR_FASE[indiceFaseVisual];
  const capasActivas = CAPAS_POR_FASE[indiceFaseVisual];
  const habitatsVisuales = ACTIVACION_HABITATS[indiceFaseVisual];'''

if "const indiceFaseVisual =" not in ui:
    if phase_block not in ui:
        raise SystemExit("❌ No encuentro faseVisual. Instala primero V4.4.")
    ui = ui.replace(phase_block, phase_calculations, 1)

# ------------------------------------------------------------
# 3. Hacer activa la fase de la línea temporal
# ------------------------------------------------------------

timeline_open = '''            <div className={styles.songTimeline}>
              {ESCENAS.map'''

timeline_open_new = '''            <div className={styles.songTimeline}>
              <span
                className={styles.songPlayhead}
                style={{ left: `${progresoVisual * 100}%` }}
              />
              {ESCENAS.map'''

if "className={styles.songPlayhead}" not in ui:
    if timeline_open not in ui:
        raise SystemExit("❌ No encuentro songTimeline.")
    ui = ui.replace(timeline_open, timeline_open_new, 1)

old_class = '''                  className={
                    index === 3 || index === 5
                      ? styles.songSceneStrong
                      : undefined
                  }'''

new_class = '''                  className={[
                    index === 3 || index === 5
                      ? styles.songSceneStrong
                      : "",
                    index === indiceFaseVisual
                      ? styles.songSceneActive
                      : "",
                    index < indiceFaseVisual
                      ? styles.songSceneComplete
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}'''

if "styles.songSceneActive" not in ui:
    if old_class not in ui:
        raise SystemExit("❌ No encuentro la clase de las escenas.")
    ui = ui.replace(old_class, new_class, 1)

# ------------------------------------------------------------
# 4. Partitura viva completa
# ------------------------------------------------------------

timeline_close = '''              ))}
            </div>

            {sonido ? ('''

living_score = '''              ))}
            </div>

            <section className={styles.livingScore}>
              <header className={styles.livingScoreHead}>
                <div>
                  <span>PARTITURA VIVA</span>
                  <strong>{faseVisual}</strong>
                </div>

                <div className={styles.scoreClock}>
                  <span>{tiempoVisual}</span>
                  <small>
                    CICLO {String(cicloVisual).padStart(2, "0")} / 56
                  </small>
                </div>

                <div className={styles.scoreIntensity}>
                  <small>INTENSIDAD</small>
                  <strong>{intensidadVisual}%</strong>
                </div>
              </header>

              <div className={styles.energyField} aria-hidden="true">
                {Array.from({ length: 64 }, (_, index) => {
                  const onda =
                    Math.abs(
                      Math.sin(
                        index * 0.53 +
                          progresoVisual * Math.PI * 18 +
                          indiceFaseVisual * 0.8,
                      ),
                    );
                  const secundaria =
                    Math.abs(
                      Math.cos(
                        index * 0.17 -
                          progresoVisual * Math.PI * 9,
                      ),
                    );
                  const altura =
                    7 +
                    (onda * 0.68 + secundaria * 0.32) *
                      intensidadVisual *
                      0.83;

                  return (
                    <i
                      key={index}
                      style={{ height: `${Math.min(94, altura)}%` }}
                    />
                  );
                })}
              </div>

              <div className={styles.scoreBody}>
                <div className={styles.habitatLanes}>
                  {HABITATS.map((habitat) => (
                    <div
                      key={habitat}
                      className={
                        habitatsVisuales[habitat] >= 75
                          ? styles.habitatLaneActive
                          : undefined
                      }
                    >
                      <span>{NOMBRES[habitat]}</span>
                      <i>
                        <b
                          style={{
                            width: `${Math.round(
                              (habitatsVisuales[habitat] *
                                organismo.habitats[habitat]) /
                                100,
                            )}%`,
                          }}
                        />
                      </i>
                      <strong>
                        {Math.round(
                          (habitatsVisuales[habitat] *
                            organismo.habitats[habitat]) /
                            100,
                        )}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className={styles.activeLayers}>
                  <span>CAPAS ACTIVAS</span>
                  <div>
                    {capasActivas.map((capa, index) => (
                      <strong key={capa}>
                        <i>{String(index + 1).padStart(2, "0")}</i>
                        {capa}
                      </strong>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {sonido ? ('''

if "className={styles.livingScore}" not in ui:
    if timeline_close not in ui:
        raise SystemExit("❌ No encuentro el cierre de songTimeline.")
    ui = ui.replace(timeline_close, living_score, 1)

# ------------------------------------------------------------
# 5. CSS
# ------------------------------------------------------------

marker = "/* ORGANISMO V4.5 · PARTITURA VIVA */"

if marker not in css:
    css += r'''

/* ORGANISMO V4.5 · PARTITURA VIVA */

.songTimeline {
  position: relative;
}

.songPlayhead {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 8;
  width: 1px;
  background: var(--acid);
  box-shadow:
    0 0 9px var(--acid),
    0 0 22px rgba(217, 255, 89, 0.45);
  pointer-events: none;
  transition: left 110ms linear;
}

.songPlayhead::before {
  content: "";
  position: absolute;
  top: -4px;
  left: -3px;
  width: 7px;
  height: 7px;
  transform: rotate(45deg);
  background: var(--acid);
}

.songTimeline .songSceneActive {
  background:
    linear-gradient(to top, rgba(217, 255, 89, 0.17), transparent 84%);
  box-shadow:
    inset 0 0 0 1px rgba(217, 255, 89, 0.38),
    inset 0 -28px 44px rgba(217, 255, 89, 0.055);
}

.songTimeline .songSceneActive strong {
  color: var(--acid);
}

.songTimeline .songSceneComplete {
  opacity: 0.54;
}

.songTimeline .songSceneComplete::after {
  background: rgba(217, 255, 89, 0.45);
}

.livingScore {
  margin-top: 10px;
  border: 1px solid var(--line);
  background:
    radial-gradient(
      circle at 74% 0%,
      rgba(217, 255, 89, 0.07),
      transparent 34%
    ),
    #060808;
}

.livingScoreHead {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 22px;
  min-height: 60px;
  padding: 0 14px;
  border-bottom: 1px solid var(--line);
}

.livingScoreHead > div:first-child,
.scoreClock,
.scoreIntensity {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.livingScoreHead > div:first-child > span,
.scoreClock small,
.scoreIntensity small {
  color: var(--muted);
  font-size: 6px;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.livingScoreHead > div:first-child > strong {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 18px;
  font-weight: 400;
}

.scoreClock {
  align-items: flex-end;
  min-width: 86px;
  padding-right: 20px;
  border-right: 1px solid var(--line);
}

.scoreClock > span {
  color: var(--ink);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 18px;
}

.scoreIntensity {
  align-items: flex-end;
  min-width: 64px;
}

.scoreIntensity strong {
  color: var(--acid);
  font-size: 11px;
}

.energyField {
  display: flex;
  align-items: center;
  gap: 2px;
  height: 92px;
  overflow: hidden;
  padding: 8px 13px;
  border-bottom: 1px solid var(--line);
  background:
    linear-gradient(
      to bottom,
      rgba(217, 255, 89, 0.025),
      transparent 50%
    );
}

.energyField > i {
  display: block;
  min-width: 2px;
  flex: 1;
  max-width: 7px;
  background:
    linear-gradient(to top, var(--signal), var(--acid));
  opacity: 0.76;
  transform-origin: bottom;
  transition: height 105ms linear;
  box-shadow: 0 0 6px rgba(217, 255, 89, 0.12);
}

.scoreBody {
  display: grid;
  grid-template-columns: minmax(300px, 1fr) minmax(230px, 0.52fr);
  gap: 0;
}

.habitatLanes {
  padding: 13px;
  border-right: 1px solid var(--line);
}

.habitatLanes > div {
  display: grid;
  grid-template-columns: 75px 1fr 28px;
  align-items: center;
  gap: 10px;
  min-height: 29px;
  opacity: 0.58;
  transition: opacity 180ms ease;
}

.habitatLanes > div > span {
  color: var(--muted);
  font-size: 7px;
  letter-spacing: 0.08em;
}

.habitatLanes > div > i {
  display: block;
  height: 3px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
}

.habitatLanes > div > i b {
  display: block;
  height: 100%;
  background:
    linear-gradient(90deg, var(--signal), var(--acid));
  transition: width 220ms ease;
}

.habitatLanes > div > strong {
  color: var(--muted);
  font-size: 7px;
  text-align: right;
}

.habitatLanes .habitatLaneActive {
  opacity: 1;
}

.habitatLanes .habitatLaneActive > span,
.habitatLanes .habitatLaneActive > strong {
  color: var(--acid);
}

.activeLayers {
  padding: 15px;
}

.activeLayers > span {
  color: var(--muted);
  font-size: 6px;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.activeLayers > div {
  display: grid;
  gap: 7px;
  margin-top: 12px;
}

.activeLayers strong {
  display: flex;
  align-items: center;
  gap: 9px;
  min-height: 31px;
  padding: 0 9px;
  border: 1px solid var(--line);
  color: #d5d7cf;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 10px;
  font-weight: 400;
}

.activeLayers strong i {
  color: var(--acid);
  font-family: Arial, Helvetica, sans-serif;
  font-size: 6px;
  font-style: normal;
}

@media (max-width: 760px) {
  .livingScoreHead {
    grid-template-columns: 1fr auto;
  }

  .scoreIntensity {
    display: none;
  }

  .scoreClock {
    padding-right: 0;
    border-right: 0;
  }

  .scoreBody {
    grid-template-columns: 1fr;
  }

  .habitatLanes {
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }

  .energyField {
    height: 72px;
  }
}
'''

ui_path.write_text(ui, encoding="utf-8")
css_path.write_text(css, encoding="utf-8")

print("✅ Partitura Viva añadida.")
print("✅ Cabezal, fases, canales, intensidad y capas activas conectados.")
PY

rm -rf .next

echo ""
echo "===== VALIDANDO TYPESCRIPT ====="

if npx tsc --noEmit --pretty false; then
  echo "✅ TypeScript correcto."
else
  echo "❌ TypeScript encontró errores."
  echo "   Restauración: $BACKUP"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ORGANISMO V4.5 INSTALADO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Cabezal móvil"
echo "✅ Fase activa iluminada"
echo "✅ Ciclos y reloj visibles"
echo "✅ Campo de energía"
echo "✅ Seis canales electrónicos"
echo "✅ Capas activas por fase"
echo "✅ Embrión V4.4 conservado"
echo ""
echo "Arranca con:"
echo "  npm run dev -- --webpack"
