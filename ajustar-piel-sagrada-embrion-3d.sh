#!/usr/bin/env bash
set -euo pipefail
cd "${HOME}/poema-universal"

if [[ -f app/laboratorio/verso-tecno/organismo/OrganismoEmbryoScene.tsx ]]; then
  FILE="app/laboratorio/verso-tecno/organismo/OrganismoEmbryoScene.tsx"
elif [[ -f src/app/laboratorio/verso-tecno/organismo/OrganismoEmbryoScene.tsx ]]; then
  FILE="src/app/laboratorio/verso-tecno/organismo/OrganismoEmbryoScene.tsx"
else
  echo "❌ No encuentro OrganismoEmbryoScene.tsx"
  exit 1
fi

STAMP="$(date +%Y%m%d-%H%M%S)"
cp "$FILE" "${FILE}.before-sacred-skin-${STAMP}"

python3 - "$FILE" <<'PY'
from pathlib import Path
import sys

path = Path(sys.argv[1])
text = path.read_text(encoding="utf-8")

simple_pairs = [
    ("renderer.toneMappingExposure = 1.08;", "renderer.toneMappingExposure = 0.82;"),
    ("const scale = 2.1 / Math.max(0.001, largest);", "const scale = 1.86 / Math.max(0.001, largest);"),
    ('embryo.rotation.set(0.06, -0.34, 0.08);', 'embryo.rotation.set(0.12, -0.56, -0.06);'),
    ("embryo.position.y = -0.16;", "embryo.position.y = -0.08;"),
    ("opacity: 0.09,", "opacity: 0.14,"),
    ("opacity: 0.018,", "opacity: 0.009,"),
]
for old, new in simple_pairs:
    text = text.replace(old, new, 1)

material_start = text.find("if (cloned instanceof THREE.MeshStandardMaterial) {")
material_end_marker = "disposeMaterial(cloned, resources.disposables);"
material_end = text.find(material_end_marker, material_start)

if material_start != -1 and material_end != -1:
    replacement = '''if (cloned instanceof THREE.MeshStandardMaterial) {
              cloned.color = new THREE.Color(0xc7ab86);
              cloned.roughness = 0.74;
              cloned.metalness = 0.0;
              cloned.emissive = new THREE.Color(0x160904);
              cloned.emissiveIntensity =
                0.055 + organismo.energia * 0.0007;
              cloned.envMapIntensity = 0.58;
              cloned.side = THREE.DoubleSide;
              cloned.transparent = false;
              cloned.opacity = 1;
              if (cloned.map) {
                cloned.map.colorSpace = THREE.SRGBColorSpace;
              }
              cloned.needsUpdate = true;
            }

            if (cloned instanceof THREE.MeshPhysicalMaterial) {
              cloned.color = new THREE.Color(0xc7ab86);
              cloned.roughness = 0.7;
              cloned.metalness = 0.0;
              cloned.emissive = new THREE.Color(0x160904);
              cloned.emissiveIntensity =
                0.06 + organismo.energia * 0.00075;
              cloned.transmission = 0.0;
              cloned.thickness = 0.08;
              cloned.clearcoat = 0.12;
              cloned.clearcoatRoughness = 0.34;
              cloned.envMapIntensity = 0.58;
              cloned.side = THREE.DoubleSide;
              cloned.transparent = false;
              cloned.opacity = 1;
              if (cloned.map) {
                cloned.map.colorSpace = THREE.SRGBColorSpace;
              }
              cloned.needsUpdate = true;
            }

            '''
    text = text[:material_start] + replacement + text[material_end:]

text = text.replace(
    '''const ambient = new THREE.AmbientLight(0x506020, 0.72);
    scene.add(ambient);''',
    '''const ambient = new THREE.AmbientLight(0x313520, 0.34);
    scene.add(ambient);

    const hemisphere = new THREE.HemisphereLight(
      0xffddb8,
      0x10200d,
      0.82,
    );
    scene.add(hemisphere);''',
    1,
)

text = text.replace(
    '''0xffc56a,
      5.2 + organismo.energia * 0.028,''',
    '''0xffc884,
      2.55 + organismo.energia * 0.011,''',
    1,
)
text = text.replace(
    "keyLight.position.set(1.45, 1.0, 2.35);",
    "keyLight.position.set(1.2, 0.75, 2.7);",
    1,
)
text = text.replace(
    '''0xd9ff59,
      3.6 + organismo.memoriaVital * 0.024,''',
    '''0xd9ff59,
      1.35 + organismo.memoriaVital * 0.009,''',
    1,
)
text = text.replace(
    '''0xffe1b0,
      3.4 + organismo.energia * 0.018,''',
    '''0xffe2bd,
      1.45 + organismo.energia * 0.006,''',
    1,
)
text = text.replace(
    '''0xffa85a,
      2.2 + organismo.estabilidad * 0.018,''',
    '''0xe77932,
      0.78 + organismo.estabilidad * 0.006,''',
    1,
)
text = text.replace(
    "const rimLight = new THREE.DirectionalLight(0x89a9ff, 1.28);",
    "const rimLight = new THREE.DirectionalLight(0x8ca4b8, 0.72);",
    1,
)
text = text.replace(
    "const lowerLight = new THREE.PointLight(0xef7145, 1.8, 6);",
    "const lowerLight = new THREE.PointLight(0xef7145, 0.62, 5.5);",
    1,
)
text = text.replace(
    '''keyLight.intensity =
        3.7 +
        organismo.energia * 0.024 +
        pulse * 1.35 * stageFactor;''',
    '''keyLight.intensity =
        1.95 +
        organismo.energia * 0.01 +
        pulse * 0.48 * stageFactor;''',
    1,
)
text = text.replace(
    '''sacredLight.intensity =
        2.25 +
        organismo.memoriaVital * 0.019 +
        breath * 0.72;''',
    '''sacredLight.intensity =
        0.95 +
        organismo.memoriaVital * 0.008 +
        breath * 0.34;''',
    1,
)
text = text.replace(
    '''embryo.position.y =
          -0.16 + Math.sin(elapsed * 0.62) * 0.028 * stageFactor;
        embryo.rotation.y =
          -0.34 + Math.sin(elapsed * 0.21) * 0.035;''',
    '''embryo.position.y =
          -0.08 + Math.sin(elapsed * 0.62) * 0.025 * stageFactor;
        embryo.rotation.y =
          -0.56 + Math.sin(elapsed * 0.21) * 0.028;''',
    1,
)

path.write_text(text, encoding="utf-8")
print("✅ Piel, exposición, cápsula, escala y ángulo corregidos.")
PY

rm -rf .next
npx tsc --noEmit --pretty false

echo ""
echo "✅ PASADA DE PIEL SAGRADA INSTALADA"
echo "Arranca con:"
echo "  npm run dev -- --webpack"
