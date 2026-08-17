#!/usr/bin/env bash
set -euo pipefail

cd "${HOME}/poema-universal"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " ORGANISMO V4.3 · MADURACIÓN RADICAL"
echo " 56 CICLOS · ESCENAS REALMENTE DISTINTAS"
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

if [[ ! -f "$MOTOR" || ! -f "$UI" ]]; then
  echo "❌ No encuentro los archivos de Organismo V4.2"
  exit 1
fi

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="${TARGET}.before-v43-${STAMP}"
cp -R "$TARGET" "$BACKUP"

python3 - "$MOTOR" "$UI" <<'PY'
from pathlib import Path
import sys

motor = Path(sys.argv[1])
ui = Path(sys.argv[2])

motor_text = motor.read_text(encoding="utf-8")
ui_text = ui.read_text(encoding="utf-8")

motor_text = motor_text.replace(
    "export const CICLOS_COMPOSICION = 116;",
    "export const CICLOS_COMPOSICION = 56;",
    1,
)

start = motor_text.find("export function codigoStrudel(")
end = motor_text.find("\nfunction base64Utf8", start)

if start == -1 or end == -1:
    raise SystemExit("❌ No encuentro codigoStrudel en motor.ts")

new_function = r'''export function codigoStrudel(organismo: Organismo): string {
  const notas = rotar(
    organismo.notas,
    organismo.ciclosVitales +
      organismo.diario.length +
      organismo.injertos.length,
  );

  const n1 = notas.slice(0, 5).join(" ");
  const n2 = rotar(notas, 2).slice(0, 5).join(" ");
  const n3 = rotar(notas, 4).slice(0, 5).join(" ");
  const reliquia =
    notas[hashTexto(organismo.reliquia) % notas.length];
  const ultima = notas[notas.length - 1] ?? reliquia;
  const h = organismo.habitats;
  const bpm = bpmActual(organismo);

  const bomboCuerpo =
    h.pulso >= 64
      ? "bd*4"
      : h.fractura >= 48
        ? "bd(5,8)"
        : "bd ~ bd ~";

  const bomboExpansion =
    h.maquina >= h.deriva ? "bd(5,8)" : "bd ~ bd bd";

  const incubacion = `stack(
  note("<${n1}>")
    .s("sine")
    .slow(12)
    .gain(${decimal(0.1 + h.deriva / 720)})
    .room(0.88)
    .delay(0.52),

  note("<${reliquia} ~ ~ ~>")
    .s("triangle")
    .slow(8)
    .gain(${decimal(0.055 + h.memoria / 900)})
    .room(0.94)
    .lpf(920)
)`;

  const germinacion = `stack(
  note("<${n1}>")
    .s("triangle")
    .slow(6)
    .gain(${decimal(0.12 + h.deriva / 650)})
    .room(0.7)
    .delay(0.34),

  s("bd ~ ~ ~")
    .gain(${decimal(0.15 + h.pulso / 720)}),

  note("<${reliquia} ~ ${ultima} ~>")
    .s("sine")
    .slow(5)
    .gain(${decimal(0.06 + h.espectral / 820)})
    .room(0.82)
)`;

  const formacion = `stack(
  note("<${n2}>")
    .s("square")
    .slow(3)
    .gain(${decimal(0.075 + h.maquina / 850)})
    .lpf(${Math.round(680 + h.maquina * 17)})
    .lpq(8),

  s("bd(3,8)")
    .gain(${decimal(0.22 + h.pulso / 520)}),

  s("[~ hh]*4")
    .gain(${decimal(0.055 + h.fractura / 760)})
    .hpf(5100)
    .delay(${decimal(0.1 + h.fractura / 520)}),

  note("<${reliquia} ${ultima}>")
    .s("sine")
    .slow(7)
    .gain(${decimal(0.045 + h.espectral / 980)})
    .room(0.9)
)`;

  const cuerpo = `stack(
  s("${bomboCuerpo}")
    .gain(${decimal(0.34 + h.pulso / 280)}),

  s("~ cp ~ cp")
    .gain(${decimal(0.11 + h.pulso / 680)})
    .room(0.14),

  s("hh*8")
    .gain(${decimal(0.055 + h.fractura / 760)})
    .hpf(5700),

  note("<${n1}>")
    .s("sawtooth")
    .slow(2)
    .gain(${decimal(0.12 + h.maquina / 560)})
    .lpf(${Math.round(720 + h.maquina * 24)})
    .lpq(9),

  note("<${n3}>")
    .s("sine")
    .slow(5)
    .gain(${decimal(0.06 + h.deriva / 900)})
    .room(0.5)
)`;

  const fractura = `stack(
  s("rim ~ ~ rim")
    .gain(${decimal(0.08 + h.fractura / 620)})
    .delay(0.31),

  s("[~ hh ~ ~]*2")
    .gain(${decimal(0.04 + h.fractura / 900)})
    .hpf(6200),

  note("<${ultima} ~ ${reliquia} ~>")
    .s("square")
    .slow(4)
    .gain(${decimal(0.055 + h.espectral / 900)})
    .lpf(980)
    .room(0.88)
    .delay(0.48)
)`;

  const expansion = `stack(
  s("${bomboExpansion}")
    .gain(${decimal(0.37 + h.pulso / 260)}),

  s("~ cp ~ cp")
    .gain(${decimal(0.13 + h.pulso / 620)})
    .room(0.2),

  s("hh*16")
    .gain(${decimal(0.06 + h.fractura / 700)})
    .hpf(6100),

  note("<${n2}>")
    .s("sawtooth")
    .slow(2)
    .gain(${decimal(0.15 + h.maquina / 500)})
    .lpf(${Math.round(1050 + h.maquina * 29)})
    .lpq(10),

  note("<${n3}>")
    .s("triangle")
    .slow(3)
    .gain(${decimal(0.09 + h.deriva / 720)})
    .room(0.58)
    .delay(0.22),

  note("<${reliquia} ${ultima}>")
    .s("sine")
    .slow(6)
    .gain(${decimal(0.055 + h.espectral / 820)})
    .room(0.92)
)`;

  const memoria = `stack(
  note("<${n1}>")
    .s("sine")
    .slow(10)
    .gain(${decimal(0.09 + h.deriva / 780)})
    .room(0.92)
    .delay(0.55),

  note("<${reliquia} ~ ${ultima} ~>")
    .s("triangle")
    .slow(7)
    .gain(${decimal(0.055 + h.memoria / 850)})
    .room(0.9)
    .delay(0.46),

  s("bd ~ ~ ~")
    .gain(${decimal(0.055 + h.pulso / 1100)})
)`;

  return `/*
ORGANISMO · LITERATURA ELECTRÓNICA VIVA
${organismo.codigo} · ${organismo.nombre}
Día ${organismo.edad} · ciclo vital ${organismo.ciclosVitales}
Metabolismo: ${organismo.metabolismo}
Núcleo: ${organismo.reliquia}
Duración estimada: ${duracionComposicionMinutos(organismo)} minutos

V4.3:
La transformación es rápida y cada escena cambia de identidad.
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
  [4, incubacion],
  [6, germinacion],
  [8, formacion],
  [10, cuerpo],
  [6, fractura],
  [12, expansion],
  [10, memoria]
)
`;
}
'''

motor_text = motor_text[:start] + new_function + motor_text[end:]

old_scenes_start = ui_text.find("const ESCENAS = [")
old_scenes_end = ui_text.find("] as const;", old_scenes_start)

if old_scenes_start == -1 or old_scenes_end == -1:
    raise SystemExit("❌ No encuentro ESCENAS en VersoTecno.tsx")

new_scenes = '''const ESCENAS = [
  ["Incubación", 4],
  ["Germinación", 6],
  ["Formación", 8],
  ["Cuerpo", 10],
  ["Fractura", 6],
  ["Expansión", 12],
  ["Memoria", 10],
] as const;'''

ui_text = (
    ui_text[:old_scenes_start]
    + new_scenes
    + ui_text[old_scenes_end + len("] as const;"):]
)

ui_text = ui_text.replace(
    "La canción ya no espera a que pasen los días: nace, forma su",
    "La canción madura con mucha más rapidez: nace, forma su",
    1,
)

ui_text = ui_text.replace(
    "cuerpo, se fractura, se expande y recuerda durante una sola",
    "cuerpo, colapsa, se expande y recuerda en unos pocos minutos.",
    1,
)

# El reemplazo anterior deja una línea sobrante en algunas versiones.
ui_text = ui_text.replace(
    'reproducción.\n            </p>',
    '</p>',
    1,
)

motor.write_text(motor_text, encoding="utf-8")
ui.write_text(ui_text, encoding="utf-8")

print("✅ Motor reducido a 56 ciclos.")
print("✅ Siete escenas con identidades sonoras distintas.")
PY

rm -rf .next

echo ""
echo "===== VALIDANDO TYPESCRIPT ====="

if npx tsc --noEmit --pretty false; then
  echo "✅ TypeScript correcto."
else
  echo "❌ La validación encontró errores."
  echo "   Copia anterior: $BACKUP"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ORGANISMO V4.3 INSTALADO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 56 ciclos en lugar de 116"
echo "✅ Aproximadamente 2,5–3 minutos a 83 BPM"
echo "✅ Incubación sin batería"
echo "✅ Formación con pulso roto"
echo "✅ Cuerpo con identidad física"
echo "✅ Fractura casi vacía"
echo "✅ Expansión claramente más intensa"
echo "✅ Memoria final ambiental"
echo ""
echo "Arranca con:"
echo "  npm run dev -- --webpack"
