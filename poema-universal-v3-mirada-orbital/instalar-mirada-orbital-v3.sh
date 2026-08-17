#!/bin/bash
set -euo pipefail

PROJECT="$HOME/poema-universal"
WORLD="$PROJECT/app/poema-universal/components/world/MundoPoema.tsx"
CSS="$PROJECT/app/poema-universal/components/world/MundoPoema.module.css"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="$HOME/.poema-universal-backups/mirada-orbital-$STAMP"

echo ""
echo "=============================================="
echo " POEMA UNIVERSAL · V3 · MIRADA ORBITAL"
echo "=============================================="
echo ""

if [ ! -f "$WORLD" ]; then
  echo "❌ No encuentro:"
  echo "   $WORLD"
  exit 1
fi

mkdir -p "$BACKUP_DIR"
cp "$WORLD" "$BACKUP_DIR/MundoPoema.tsx"

if [ -f "$CSS" ]; then
  cp "$CSS" "$BACKUP_DIR/MundoPoema.module.css"
fi

echo "✅ Copia de seguridad:"
echo "   $BACKUP_DIR"

python3 - "$WORLD" "$CSS" <<'PY'
from pathlib import Path
import re
import sys

world = Path(sys.argv[1])
css = Path(sys.argv[2])

src = world.read_text(encoding="utf-8")

patterns = [
    (
        'import { Sparkles } from "@react-three/drei";',
        'import { OrbitControls, Sparkles } from "@react-three/drei";'
    ),
    (
        "import { Sparkles } from '@react-three/drei';",
        "import { OrbitControls, Sparkles } from '@react-three/drei';"
    ),
]

if "OrbitControls" not in src:
    for old, new in patterns:
        if old in src:
            src = src.replace(old, new, 1)
            break
    else:
        raise SystemExit(
            "❌ No pude localizar el import de Sparkles para añadir OrbitControls."
        )

new_camera = r'''function AutonomousCamera() {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const interactingRef = useRef(false);
  const resumeAtRef = useRef(0);
  const hasTouchedRef = useRef(false);

  useFrame(({ clock }) => {
    const controls = controlsRef.current;
    if (!controls) return;

    const now =
      typeof performance !== "undefined"
        ? performance.now()
        : 0;

    const canResumeAutonomous =
      !interactingRef.current &&
      now >= resumeAtRef.current;

    if (canResumeAutonomous) {
      const t = clock.getElapsedTime() * 0.045;

      const targetPosition = new THREE.Vector3(
        8 + Math.sin(t) * 2.6,
        10.8 + Math.sin(t * 0.8) * 0.7,
        22 + Math.cos(t) * 2.8
      );

      const returnStrength =
        hasTouchedRef.current ? 0.0065 : 0.02;

      camera.position.lerp(
        targetPosition,
        returnStrength
      );

      controls.target.lerp(
        new THREE.Vector3(1.8, 3.1, -2.4),
        hasTouchedRef.current ? 0.025 : 0.08
      );
    }

    controls.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      target={[1.8, 3.1, -2.4]}
      enablePan={false}
      enableRotate
      enableZoom
      enableDamping
      dampingFactor={0.055}
      rotateSpeed={0.42}
      zoomSpeed={0.58}
      minDistance={9}
      maxDistance={38}
      minPolarAngle={0.48}
      maxPolarAngle={1.48}
      onStart={() => {
        interactingRef.current = true;
        hasTouchedRef.current = true;
        resumeAtRef.current = Number.POSITIVE_INFINITY;

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent(
              "poema-universal:camera-orbit",
              { detail: { active: true } }
            )
          );
        }
      }}
      onEnd={() => {
        interactingRef.current = false;
        resumeAtRef.current =
          (typeof performance !== "undefined"
            ? performance.now()
            : 0) + 12000;

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent(
              "poema-universal:camera-orbit",
              { detail: { active: false } }
            )
          );
        }
      }}
    />
  );
}'''

pattern = re.compile(
    r'function AutonomousCamera\(\)\s*\{.*?\n\}',
    re.S
)

match = pattern.search(src)
if not match:
    raise SystemExit(
        "❌ No pude localizar function AutonomousCamera(). No se ha tocado el archivo."
    )

src = src[:match.start()] + new_camera + src[match.end():]
world.write_text(src, encoding="utf-8")

if css.exists():
    css_text = css.read_text(encoding="utf-8")
    marker = "/* V3 · MIRADA ORBITAL */"

    if marker not in css_text:
        css_text += r'''

/* V3 · MIRADA ORBITAL */
.canvas canvas {
  cursor: grab;
  touch-action: none;
}

.canvas canvas:active {
  cursor: grabbing;
}
'''
        css.write_text(css_text, encoding="utf-8")

print("✅ OrbitControls integrado.")
print("✅ Cámara autónoma conservada.")
print("✅ Arrastre 360º activado.")
print("✅ Zoom suave activado.")
print("✅ Retorno autónomo después de 12 s.")
print("✅ PoemBook, terrazas, poetas y Árbol intactos.")
PY

echo ""
echo "===== COMPROBACIÓN DE SINTAXIS ====="

cd "$PROJECT"

node <<'NODE'
const fs = require("fs");
const ts = require("typescript");

const file =
  "app/poema-universal/components/world/MundoPoema.tsx";

const source = fs.readFileSync(file, "utf8");

const result = ts.transpileModule(source, {
  compilerOptions: {
    jsx: ts.JsxEmit.Preserve,
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext
  },
  reportDiagnostics: true
});

const errors = (result.diagnostics || []).filter(
  d => d.category === ts.DiagnosticCategory.Error
);

if (errors.length) {
  for (const error of errors) {
    console.error(
      ts.flattenDiagnosticMessageText(
        error.messageText,
        "\n"
      )
    );
  }
  process.exit(1);
}

console.log("✅ Sintaxis TSX correcta.");
NODE

echo ""
echo "=============================================="
echo " ✅ MIRADA ORBITAL INSTALADA"
echo "=============================================="
echo ""
echo "Controles:"
echo "  · Arrastrar: girar alrededor de la obra"
echo "  · Rueda / trackpad: acercar y alejar"
echo "  · Soltar: conserva tu mirada"
echo "  · Tras 12 s: vuelve lentamente la cámara autónoma"
echo ""
echo "Reinicia Next para verla."
echo ""
