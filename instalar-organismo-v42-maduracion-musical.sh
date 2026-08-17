#!/usr/bin/env bash
set -euo pipefail

cd "${HOME}/poema-universal"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " ORGANISMO V4.2 · MADURACIÓN EN UNA ESCUCHA"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [[ -d app/laboratorio/verso-tecno ]]; then
  TARGET="app/laboratorio/verso-tecno"
elif [[ -d src/app/laboratorio/verso-tecno ]]; then
  TARGET="src/app/laboratorio/verso-tecno"
else
  echo "❌ No encuentro /laboratorio/verso-tecno"
  exit 1
fi

MOTOR="${TARGET}/organismo/motor.ts"
UI="${TARGET}/VersoTecno.tsx"
CSS="${TARGET}/verso-tecno.module.css"

for FILE in "$MOTOR" "$UI" "$CSS"; do
  [[ -f "$FILE" ]] || { echo "❌ Falta $FILE"; exit 1; }
done

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="${TARGET}.before-song-growth-v42-${STAMP}"
cp -R "$TARGET" "$BACKUP"

python3 - "$MOTOR" "$UI" "$CSS" <<'PY'
from pathlib import Path
import re
import sys

motor = Path(sys.argv[1])
ui = Path(sys.argv[2])
css = Path(sys.argv[3])

motor_text = motor.read_text(encoding="utf-8")
ui_text = ui.read_text(encoding="utf-8")
css_text = css.read_text(encoding="utf-8")

if "export const CICLOS_COMPOSICION = 116;" not in motor_text:
    marker = '''export const HABITATS: Habitat[] = [
  "deriva",
  "pulso",
  "fractura",
  "espectral",
  "maquina",
  "memoria",
];'''
    replacement = marker + "\n\nexport const CICLOS_COMPOSICION = 116;"
    if marker not in motor_text:
        raise SystemExit("❌ No encuentro la declaración HABITATS.")
    motor_text = motor_text.replace(marker, replacement, 1)

new_function = r'''export function duracionComposicionMinutos(
  organismo: Organismo,
): number {
  return Math.round(
    (CICLOS_COMPOSICION * 4 * 10) / bpmActual(organismo),
  ) / 10;
}

export function codigoStrudel(organismo: Organismo): string {
  const notas = rotar(
    organismo.notas,
    organismo.edad + organismo.diario.length + organismo.injertos.length,
  );
  const motivoA = notas.slice(0, 5).join(" ");
  const motivoB = rotar(notas, 2).slice(0, 5).join(" ");
  const motivoC = rotar(notas, 4).slice(0, 5).join(" ");
  const reliquia = notas[hashTexto(organismo.reliquia) % notas.length];
  const finalNote = notas[notas.length - 1] ?? reliquia;
  const h = organismo.habitats;
  const bpm = bpmActual(organismo);

  const incubacion = `stack(
  note("<${motivoA}>")
    .s("sine")
    .slow(10)
    .gain(${decimal(0.1 + h.deriva / 650)})
    .room(${decimal(0.72 + h.deriva / 390)})
    .delay(${decimal(0.28 + h.memoria / 420)}),

  note("<${reliquia} ~ ${reliquia} ~>")
    .s("triangle")
    .slow(8)
    .gain(${decimal(0.07 + h.memoria / 650)})
    .room(${decimal(0.6 + h.espectral / 430)})
)`;

  const germinacion = `stack(
  note("<${motivoA}>")
    .s("sine")
    .slow(7)
    .gain(${decimal(0.12 + h.deriva / 580)})
    .room(${decimal(0.62 + h.deriva / 470)}),

  note("<${reliquia} ~ ${finalNote} ~>")
    .s("triangle")
    .slow(6)
    .gain(${decimal(0.08 + h.memoria / 610)})
    .room(${decimal(0.54 + h.espectral / 480)}),

  s("bd ~ ~ ~")
    .gain(${decimal(0.1 + h.pulso / 760)})
)`;

  const formacion = `stack(
  note("<${motivoB}>")
    .s("sine")
    .slow(5)
    .gain(${decimal(0.13 + h.deriva / 560)})
    .room(${decimal(0.5 + h.deriva / 520)}),

  note("<${reliquia} ~ ${finalNote} ~>")
    .s("triangle")
    .slow(5)
    .gain(${decimal(0.09 + h.memoria / 590)})
    .lpf(${Math.round(900 + organismo.memoriaVital * 17)}),

  s("${h.fractura >= 58 ? "bd(3,8)" : "bd ~ bd ~"}")
    .gain(${decimal(0.18 + h.pulso / 450)}),

  s("[~ hh]*4")
    .gain(${decimal(0.04 + h.fractura / 760)})
    .hpf(${Math.round(4300 + h.fractura * 22)})
)`;

  const cuerpo = `stack(
  note("<${motivoB}>")
    .s("sawtooth")
    .slow(2)
    .gain(${decimal(0.1 + h.maquina / 570)})
    .lpf(${Math.round(650 + h.maquina * 20)})
    .lpq(7),

  note("<${motivoA}>")
    .s("sine")
    .slow(4)
    .gain(${decimal(0.1 + h.deriva / 660)})
    .room(0.42),

  s("${h.pulso >= 68 ? "bd*4" : "bd(3,8)"}")
    .gain(${decimal(0.28 + h.pulso / 280)}),

  s("~ cp ~ cp")
    .gain(${decimal(0.08 + h.pulso / 720)})
    .room(0.16),

  s("hh*8")
    .gain(${decimal(0.05 + h.fractura / 720)})
    .hpf(5200)
)`;

  const fractura = `stack(
  note("<${motivoC}>")
    .s("triangle")
    .slow(3)
    .gain(${decimal(0.11 + h.espectral / 650)})
    .room(${decimal(0.55 + h.espectral / 360)}),

  s("bd(3,8)")
    .gain(${decimal(0.2 + h.fractura / 430)}),

  s("[~ hh]*8")
    .gain(${decimal(0.05 + h.fractura / 650)})
    .hpf(${Math.round(5000 + h.fractura * 18)})
    .delay(${decimal(0.1 + h.fractura / 500)})
)`;

  const expansion = `stack(
  note("<${motivoC}>")
    .s("sine")
    .slow(4)
    .gain(${decimal(0.14 + h.deriva / 540)})
    .room(${decimal(0.48 + h.deriva / 510)}),

  note("<${motivoB}>")
    .s("sawtooth")
    .slow(2)
    .gain(${decimal(0.13 + h.maquina / 510)})
    .lpf(${Math.round(850 + h.maquina * 24)})
    .lpq(8),

  s("bd*4")
    .gain(${decimal(0.31 + h.pulso / 250)}),

  s("~ cp ~ cp")
    .gain(${decimal(0.11 + h.pulso / 640)})
    .room(0.2),

  s("hh*16")
    .gain(${decimal(0.05 + h.fractura / 680)})
    .hpf(5700),

  note("<${reliquia} ${finalNote}>")
    .s("triangle")
    .slow(6)
    .gain(${decimal(0.05 + h.espectral / 740)})
    .room(${decimal(0.66 + h.espectral / 390)})
)`;

  const memoria = `stack(
  note("<${motivoA}>")
    .s("sine")
    .slow(9)
    .gain(${decimal(0.09 + h.deriva / 690)})
    .room(${decimal(0.75 + h.deriva / 430)})
    .delay(${decimal(0.3 + h.memoria / 440)}),

  note("<${reliquia} ~ ${finalNote} ~>")
    .s("triangle")
    .slow(7)
    .gain(${decimal(0.06 + h.memoria / 650)})
    .room(${decimal(0.7 + h.espectral / 430)}),

  s("bd ~ ~ ~")
    .gain(${decimal(0.06 + h.pulso / 950)})
)`;

  return `/*
ORGANISMO · LITERATURA ELECTRÓNICA VIVA
${organismo.codigo} · ${organismo.nombre}
Día ${organismo.edad} · ${organismo.etapa}
Núcleo: ${organismo.reliquia}
Duración estimada: ${duracionComposicionMinutos(organismo)} minutos

La canción madura durante una sola reproducción.
El organismo continúa evolucionando con los días.
*/

setcpm(${bpm}/4)

const incubacion = ${incubacion}

const germinacion = ${germinacion}

const formacion = ${formacion}

const cuerpo = ${cuerpo}

const fractura = ${fractura}

const expansion = ${expansion}

const memoria = ${memoria}

arrange(
  [8, incubacion],
  [16, germinacion],
  [20, formacion],
  [24, cuerpo],
  [12, fractura],
  [20, expansion],
  [16, memoria]
)
`;
}

'''

pattern = re.compile(
    r'export function codigoStrudel\(organismo: Organismo\): string \{.*?\n\}\n\nfunction base64Utf8',
    re.S,
)
if not pattern.search(motor_text):
    raise SystemExit("❌ No encuentro codigoStrudel en motor.ts.")

motor_text = pattern.sub(
    new_function + "function base64Utf8",
    motor_text,
    count=1,
)

if "CICLOS_COMPOSICION" not in ui_text.split("from")[0]:
    ui_text = ui_text.replace(
        "  HABITATS,\n",
        "  CICLOS_COMPOSICION,\n  HABITATS,\n",
        1,
    )

if "duracionComposicionMinutos," not in ui_text:
    ui_text = ui_text.replace(
        "  codigoStrudel,\n",
        "  codigoStrudel,\n  duracionComposicionMinutos,\n",
        1,
    )

if "const ESCENAS_MUSICALES" not in ui_text:
    marker = '''const ETAPAS: Record<string, string> = {
  embrion: "Embrión",
  germinacion: "Germinación",
  formacion: "Formación",
  cuerpo: "Cuerpo",
  mutacion: "Mutación",
  madurez: "Madurez",
  latencia: "Latencia",
};'''
    scenes = marker + '''

const ESCENAS_MUSICALES = [
  ["Incubación", 8],
  ["Germinación", 16],
  ["Formación", 20],
  ["Cuerpo", 24],
  ["Fractura", 12],
  ["Expansión", 20],
  ["Memoria", 16],
] as const;'''
    if marker not in ui_text:
        raise SystemExit("❌ No encuentro ETAPAS en VersoTecno.tsx.")
    ui_text = ui_text.replace(marker, scenes, 1)

if "const duracion =" not in ui_text:
    marker = '''  const url = useMemo(() => (codigo ? urlStrudel(codigo) : ""), [codigo]);'''
    replacement = marker + '''
  const duracion = organismo
    ? duracionComposicionMinutos(organismo)
    : 0;'''
    if marker not in ui_text:
        raise SystemExit("❌ No encuentro el cálculo de url Strudel.")
    ui_text = ui_text.replace(marker, replacement, 1)

ui_text = ui_text.replace(
    'tag={`DÍA ${organismo.edad}`}',
    'tag={`${duracion} MIN · ${CICLOS_COMPOSICION} CICLOS`}',
    1,
)

old_sound = '''            <p>
              No pertenece a un género fijo. La forma emerge de sus hábitats,
              su edad, sus injertos y sus mutaciones.
            </p>

            {sonido ? ('''

new_sound = '''            <p>
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

            {sonido ? ('''

if old_sound not in ui_text:
    raise SystemExit("❌ No encuentro el bloque de manifestación sonora.")
ui_text = ui_text.replace(old_sound, new_sound, 1)

css_marker = "/* ORGANISMO V4.2 · MADURACIÓN MUSICAL */"
if css_marker not in css_text:
    css_text += r'''

/* ORGANISMO V4.2 · MADURACIÓN MUSICAL */

.songTimeline {
  display: flex;
  min-height: 82px;
  overflow-x: auto;
  margin-top: 15px;
  border: 1px solid var(--line);
  background: #070909;
}

.songTimeline > div {
  position: relative;
  display: flex;
  min-width: 92px;
  flex-direction: column;
  justify-content: flex-end;
  padding: 12px;
  border-right: 1px solid var(--line);
  background:
    linear-gradient(to top, rgba(217, 255, 89, 0.065), transparent 72%);
}

.songTimeline > div:last-child {
  border-right: 0;
}

.songTimeline > div::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 2px;
  background: rgba(217, 255, 89, 0.18);
}

.songTimeline span {
  position: absolute;
  top: 9px;
  left: 10px;
  color: var(--muted);
  font-size: 6px;
  letter-spacing: 0.12em;
}

.songTimeline strong {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 11px;
  font-weight: 400;
}

.songTimeline small {
  margin-top: 4px;
  color: var(--muted);
  font-size: 6px;
  letter-spacing: 0.1em;
}

.songTimeline .songSceneStrong {
  background:
    linear-gradient(to top, rgba(239, 113, 69, 0.13), transparent 78%);
}

.songTimeline .songSceneStrong::after {
  background: linear-gradient(90deg, var(--signal), var(--acid));
}

@media (max-width: 620px) {
  .songTimeline > div {
    flex: 0 0 110px;
  }
}
'''

motor.write_text(motor_text, encoding="utf-8")
ui.write_text(ui_text, encoding="utf-8")
css.write_text(css_text, encoding="utf-8")

print("✅ Motor secuenciado en siete escenas.")
print("✅ Duración y arquitectura visual integradas.")
PY

rm -rf .next

echo ""
echo "===== VALIDANDO TYPESCRIPT ====="

if npx tsc --noEmit --pretty false; then
  echo "✅ TypeScript correcto."
else
  echo "❌ TypeScript encontró errores."
  echo "   Copia de seguridad: $BACKUP"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ORGANISMO V4.2 INSTALADO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 116 ciclos de composición"
echo "✅ Siete escenas musicales"
echo "✅ Maduración completa en una escucha"
echo "✅ Duración aproximada: 4–6 minutos"
echo "✅ Embrión 3D y evolución diaria conservados"
echo ""
echo "Arranca con:"
echo "  npm run dev -- --webpack"
