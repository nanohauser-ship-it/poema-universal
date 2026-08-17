#!/usr/bin/env bash
set -euo pipefail

cd "${HOME}/poema-universal"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " ORGANISMO V4.4 · EMBRIÓN SINCRONIZADO"
echo " EVOLUCIÓN VISUAL EN 56 CICLOS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [[ -d app/laboratorio/verso-tecno ]]; then
  TARGET="app/laboratorio/verso-tecno"
elif [[ -d src/app/laboratorio/verso-tecno ]]; then
  TARGET="src/app/laboratorio/verso-tecno"
else
  echo "❌ No encuentro /laboratorio/verso-tecno"
  exit 1
fi

SCENE="${TARGET}/organismo/OrganismoEmbryoScene.tsx"
UI="${TARGET}/VersoTecno.tsx"
CSS="${TARGET}/verso-tecno.module.css"

for FILE in "$SCENE" "$UI" "$CSS"; do
  if [[ ! -f "$FILE" ]]; then
    echo "❌ Falta $FILE"
    exit 1
  fi
done

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="${TARGET}.before-embryo-sync-v44-${STAMP}"
cp -R "$TARGET" "$BACKUP"

python3 - "$SCENE" "$UI" "$CSS" <<'PY'
from pathlib import Path
import re
import sys

scene_path = Path(sys.argv[1])
ui_path = Path(sys.argv[2])
css_path = Path(sys.argv[3])

scene = scene_path.read_text(encoding="utf-8")
ui = ui_path.read_text(encoding="utf-8")
css = css_path.read_text(encoding="utf-8")

# ============================================================
# 1. ESCENA 3D: aceptar progreso y fase musical
# ============================================================

old_signature = '''export default function OrganismoEmbryoScene({
  organismo,
}: {
  organismo: Organismo;
}) {'''

new_signature = '''export default function OrganismoEmbryoScene({
  organismo,
  progresoMusical = 0,
  faseMusical = "Incubación",
  reproduciendo = false,
}: {
  organismo: Organismo;
  progresoMusical?: number;
  faseMusical?: string;
  reproduciendo?: boolean;
}) {'''

if old_signature not in scene and "progresoMusical" not in scene:
    raise SystemExit("❌ No encuentro la firma de OrganismoEmbryoScene.")

scene = scene.replace(old_signature, new_signature, 1)

state_marker = '''  const [estado, setEstado] = useState<"cargando" | "activo" | "error">(
    "cargando",
  );'''

state_replacement = state_marker + '''

  const progresoRef = useRef(progresoMusical);
  const faseRef = useRef(faseMusical);
  const reproduciendoRef = useRef(reproduciendo);

  useEffect(() => {
    progresoRef.current = Math.max(0, Math.min(1, progresoMusical));
    faseRef.current = faseMusical;
    reproduciendoRef.current = reproduciendo;
  }, [progresoMusical, faseMusical, reproduciendo]);'''

if "const progresoRef" not in scene:
    if state_marker not in scene:
        raise SystemExit("❌ No encuentro el estado de carga del embrión.")
    scene = scene.replace(state_marker, state_replacement, 1)

animate_marker = '''      const breath = Math.sin(elapsed * 1.12) * 0.5 + 0.5;'''

animate_injection = animate_marker + '''

      const progreso = progresoRef.current;
      const faseIndice =
        progreso < 4 / 56
          ? 0
          : progreso < 10 / 56
            ? 1
            : progreso < 18 / 56
              ? 2
              : progreso < 28 / 56
                ? 3
                : progreso < 34 / 56
                  ? 4
                  : progreso < 46 / 56
                    ? 5
                    : 6;

      const escalaFase = [0.82, 0.88, 0.95, 1.02, 0.91, 1.1, 0.96][
        faseIndice
      ];
      const actividadFase = [0.22, 0.38, 0.58, 0.82, 0.45, 1, 0.32][
        faseIndice
      ];
      const aperturaFase = [0.05, 0.16, 0.32, 0.54, 0.24, 0.76, 0.18][
        faseIndice
      ];
      const fracturaFase = faseIndice === 4 ? 1 : 0;
      const expansionFase = faseIndice === 5 ? 1 : 0;
      const memoriaFase = faseIndice === 6 ? 1 : 0;
      const relojActivo = reproduciendoRef.current ? 1 : 0.35;'''

if "const faseIndice =" not in scene:
    if animate_marker not in scene:
        raise SystemExit("❌ No encuentro el bucle de animación.")
    scene = scene.replace(animate_marker, animate_injection, 1)

render_marker = '''      renderer.render(scene, camera);'''

visual_block = '''      const crecimiento =
        escalaFase +
        breath * 0.012 * actividadFase * relojActivo;

      root.scale.setScalar(crecimiento);

      haloGroup.scale.setScalar(
        0.86 +
          aperturaFase * 0.34 +
          pulse * 0.025 * actividadFase,
      );

      ringGroup.rotation.z =
        Math.sin(elapsed * (0.11 + actividadFase * 0.09)) *
        (0.012 + aperturaFase * 0.045);

      capsuleGroup.scale.x =
        1 + Math.sin(elapsed * 0.75) * 0.008 * actividadFase;
      capsuleGroup.scale.y =
        1 +
        Math.sin(elapsed * 0.63 + 0.8) *
          0.014 *
          actividadFase;

      shellMaterial.opacity =
        0.08 +
        organismo.estabilidad * 0.00038 +
        aperturaFase * 0.075 +
        pulse * 0.018 * actividadFase;

      liquidMaterial.opacity =
        0.055 +
        organismo.memoriaVital * 0.0003 +
        aperturaFase * 0.06 +
        breath * 0.018;

      particleMaterial.opacity =
        0.14 +
        organismo.complejidad * 0.0013 +
        actividadFase * 0.25 +
        pulse * 0.08;

      particleMaterial.size =
        0.008 +
        actividadFase * 0.009 +
        expansionFase * 0.006;

      filamentGroup.scale.setScalar(
        0.74 +
          aperturaFase * 0.42 +
          breath * 0.024 * actividadFase,
      );

      filamentGroup.rotation.z =
        fracturaFase *
        Math.sin(elapsed * 8.5) *
        0.055;

      lowerLight.intensity =
        0.42 +
        actividadFase * 0.82 +
        fracturaFase * pulse * 1.7;

      keyLight.intensity =
        1.45 +
        organismo.energia * 0.008 +
        actividadFase * 1.45 +
        expansionFase * pulse * 1.85;

      sacredLight.intensity =
        0.72 +
        organismo.memoriaVital * 0.006 +
        actividadFase * 0.78 +
        memoriaFase * breath * 0.72;

      if (embryo) {
        embryo.rotation.z =
          -0.06 +
          Math.sin(elapsed * 0.38) * 0.014 * actividadFase +
          fracturaFase * Math.sin(elapsed * 7.6) * 0.018;

        embryo.position.x =
          fracturaFase * Math.sin(elapsed * 9.4) * 0.018;

        embryo.position.z =
          expansionFase * 0.08 +
          Math.sin(elapsed * 0.42) * 0.012 * actividadFase;
      }

''' + render_marker

if "const crecimiento =" not in scene:
    if render_marker not in scene:
        raise SystemExit("❌ No encuentro renderer.render.")
    scene = scene.replace(render_marker, visual_block, 1)

telemetry_old = '''      <div className={styles.embryoTelemetry}>
        <span>{organismo.codigo}</span>
        <span>{organismo.etapa.toUpperCase()}</span>
      </div>'''

telemetry_new = '''      <div className={styles.embryoTelemetry}>
        <span>{organismo.codigo}</span>
        <span>
          {reproduciendo
            ? faseMusical.toUpperCase()
            : organismo.etapa.toUpperCase()}
        </span>
      </div>

      <div className={styles.embryoMusicalPhase}>
        <div>
          <small>EVOLUCIÓN DE LA OBRA</small>
          <strong>{faseMusical}</strong>
        </div>
        <span>
          <i style={{ width: `${Math.round(progresoMusical * 100)}%` }} />
        </span>
        <b>{Math.round(progresoMusical * 100)}%</b>
      </div>'''

if "embryoMusicalPhase" not in scene:
    if telemetry_old not in scene:
        raise SystemExit("❌ No encuentro la telemetría del embrión.")
    scene = scene.replace(telemetry_old, telemetry_new, 1)

# ============================================================
# 2. UI: reloj visual sincronizado con la escucha
# ============================================================

ui = ui.replace(
    'import { useEffect, useMemo, useState } from "react";',
    'import { useEffect, useMemo, useRef, useState } from "react";',
    1,
)

message_marker = '''  const [mensaje, setMensaje] = useState("");'''

message_replacement = message_marker + '''
  const [progresoVisual, setProgresoVisual] = useState(0);
  const [reproduciendoVisual, setReproduciendoVisual] = useState(false);
  const inicioVisualRef = useRef(0);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);'''

if "progresoVisual" not in ui:
    if message_marker not in ui:
        raise SystemExit("❌ No encuentro el estado de mensaje.")
    ui = ui.replace(message_marker, message_replacement, 1)

duration_marker = '''  const duracion = organismo
    ? duracionComposicionMinutos(organismo)
    : 0;'''

duration_replacement = duration_marker + '''

  const duracionVisualMs = Math.max(1, duracion * 60 * 1000);
  const faseVisual =
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

if "const faseVisual =" not in ui:
    if duration_marker not in ui:
        raise SystemExit("❌ No encuentro la duración de la composición.")
    ui = ui.replace(duration_marker, duration_replacement, 1)

memo_marker = '''  const previo = useMemo(() => analizarPoema(poema), [poema]);'''

effects = '''  useEffect(() => {
    if (!reproduciendoVisual) return;

    let frame = 0;

    const tick = (ahora: number) => {
      const transcurrido = ahora - inicioVisualRef.current;
      const nuevoProgreso = Math.min(1, transcurrido / duracionVisualMs);

      setProgresoVisual(nuevoProgreso);

      if (nuevoProgreso >= 1) {
        setReproduciendoVisual(false);
        return;
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [reproduciendoVisual, duracionVisualMs]);

  useEffect(() => {
    const detectarClickEnMotor = () => {
      window.setTimeout(() => {
        if (document.activeElement === iframeRef.current) {
          iniciarEvolucionVisual();
        }
      }, 0);
    };

    window.addEventListener("blur", detectarClickEnMotor);

    return () => {
      window.removeEventListener("blur", detectarClickEnMotor);
    };
  }, [duracionVisualMs]);

''' + memo_marker

if "detectarClickEnMotor" not in ui:
    if memo_marker not in ui:
        raise SystemExit("❌ No encuentro la previsualización del poema.")
    ui = ui.replace(memo_marker, effects, 1)

function_marker = '''  function aviso(texto: string) {'''

function_injection = '''  function iniciarEvolucionVisual() {
    inicioVisualRef.current = performance.now();
    setProgresoVisual(0);
    setReproduciendoVisual(true);
  }

  function reiniciarEvolucionVisual() {
    iniciarEvolucionVisual();
    aviso("El embrión vuelve a incubarse y crecerá con la pieza.");
  }

''' + function_marker

if "function iniciarEvolucionVisual" not in ui:
    if function_marker not in ui:
        raise SystemExit("❌ No encuentro la función aviso.")
    ui = ui.replace(function_marker, function_injection, 1)

component_old = '<OrganismoEmbryoScene organismo={organismo} />'
component_new = '''<OrganismoEmbryoScene
                organismo={organismo}
                progresoMusical={progresoVisual}
                faseMusical={faseVisual}
                reproduciendo={reproduciendoVisual}
              />'''

if "progresoMusical={progresoVisual}" not in ui:
    if component_old not in ui:
        raise SystemExit("❌ No encuentro OrganismoEmbryoScene en la UI.")
    ui = ui.replace(component_old, component_new, 1)

iframe_pattern = re.compile(r'(\s*)<iframe(\s*\n\s*)key=\{url\}', re.M)
if 'ref={iframeRef}' not in ui:
    ui, count = iframe_pattern.subn(
        r'\1<iframe\2ref={iframeRef}\2key={url}',
        ui,
        count=1,
    )
    if count == 0:
        raise SystemExit("❌ No encuentro el iframe de Strudel.")

sound_buttons_marker = '''              <div>
                <button onClick={copiar}>COPIAR CÓDIGO</button>'''

sound_buttons_replacement = '''              <div>
                <button onClick={reiniciarEvolucionVisual}>
                  {reproduciendoVisual
                    ? "REINICIAR EMBRIÓN"
                    : "SINCRONIZAR EMBRIÓN"}
                </button>
                <button onClick={copiar}>COPIAR CÓDIGO</button>'''

if "SINCRONIZAR EMBRIÓN" not in ui:
    if sound_buttons_marker not in ui:
        raise SystemExit("❌ No encuentro los controles de sonido.")
    ui = ui.replace(sound_buttons_marker, sound_buttons_replacement, 1)

timeline_marker = '''            <div className={styles.songTimeline}>'''

timeline_status = '''            <div className={styles.visualEvolutionReadout}>
              <div>
                <span>EMBRIÓN SINCRONIZADO</span>
                <strong>{faseVisual}</strong>
              </div>
              <i>
                <span
                  style={{ width: `${Math.round(progresoVisual * 100)}%` }}
                />
              </i>
              <b>{Math.round(progresoVisual * 100)}%</b>
            </div>

''' + timeline_marker

if "visualEvolutionReadout" not in ui:
    if timeline_marker not in ui:
        raise SystemExit("❌ No encuentro la línea temporal musical.")
    ui = ui.replace(timeline_marker, timeline_status, 1)

# ============================================================
# 3. CSS
# ============================================================

css_marker = "/* ORGANISMO V4.4 · EMBRIÓN SINCRONIZADO */"

if css_marker not in css:
    css += r'''

/* ORGANISMO V4.4 · EMBRIÓN SINCRONIZADO */

.embryoMusicalPhase {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 7;
  display: grid;
  grid-template-columns: minmax(90px, 1fr) 80px 28px;
  align-items: center;
  gap: 10px;
  min-width: 255px;
  padding: 9px 10px;
  border: 1px solid rgba(217, 255, 89, 0.22);
  background: rgba(5, 7, 6, 0.72);
  backdrop-filter: blur(12px);
  pointer-events: none;
}

.embryoMusicalPhase > div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.embryoMusicalPhase small {
  color: rgba(239, 237, 226, 0.42);
  font-size: 5px;
  font-weight: 800;
  letter-spacing: 0.17em;
}

.embryoMusicalPhase strong {
  color: var(--ink);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 10px;
  font-weight: 400;
}

.embryoMusicalPhase > span {
  display: block;
  height: 3px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.07);
}

.embryoMusicalPhase > span i {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--signal), var(--acid));
  transition: width 120ms linear;
}

.embryoMusicalPhase > b {
  color: var(--acid);
  font-size: 7px;
  font-weight: 800;
  text-align: right;
}

.visualEvolutionReadout {
  display: grid;
  grid-template-columns: minmax(150px, auto) 1fr 36px;
  align-items: center;
  gap: 14px;
  margin-top: 14px;
  padding: 10px 12px;
  border: 1px solid var(--line);
  background:
    linear-gradient(90deg, rgba(239, 113, 69, 0.075), transparent 36%),
    #070909;
}

.visualEvolutionReadout > div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.visualEvolutionReadout span {
  color: var(--muted);
  font-size: 6px;
  font-weight: 800;
  letter-spacing: 0.15em;
}

.visualEvolutionReadout strong {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 12px;
  font-weight: 400;
}

.visualEvolutionReadout > i {
  display: block;
  height: 4px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.07);
}

.visualEvolutionReadout > i span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--signal), var(--acid));
  transition: width 120ms linear;
}

.visualEvolutionReadout > b {
  color: var(--acid);
  font-size: 8px;
  text-align: right;
}

@media (max-width: 620px) {
  .embryoMusicalPhase {
    right: 9px;
    left: 9px;
    grid-template-columns: 1fr 65px 26px;
    min-width: 0;
  }

  .visualEvolutionReadout {
    grid-template-columns: 1fr 28px;
  }

  .visualEvolutionReadout > i {
    grid-column: 1 / -1;
    grid-row: 2;
  }
}
'''

scene_path.write_text(scene, encoding="utf-8")
ui_path.write_text(ui, encoding="utf-8")
css_path.write_text(css, encoding="utf-8")

print("✅ Embrión conectado a las siete fases musicales.")
print("✅ Sincronización automática al pulsar dentro de Strudel.")
print("✅ Control manual de reinicio añadido.")
PY

rm -rf .next

echo ""
echo "===== VALIDANDO TYPESCRIPT ====="

if npx tsc --noEmit --pretty false; then
  echo "✅ TypeScript correcto."
else
  echo "❌ TypeScript encontró errores."
  echo "   Copia anterior disponible en: $BACKUP"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ORGANISMO V4.4 INSTALADO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ El embrión crece durante la canción"
echo "✅ Incubación: pequeño, oscuro y protegido"
echo "✅ Germinación: aumenta el pulso"
echo "✅ Formación: nacen filamentos y partículas"
echo "✅ Cuerpo: alcanza presencia física"
echo "✅ Fractura: temblor y cicatriz luminosa"
echo "✅ Expansión: máxima luz y apertura"
echo "✅ Memoria: se repliega y conserva la huella"
echo ""
echo "Arranca con:"
echo "  npm run dev -- --webpack"
