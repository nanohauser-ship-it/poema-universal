from pathlib import Path
import re
import sys

world = Path(sys.argv[1])
src = world.read_text(encoding="utf-8")

MARKER = "V52C_CABEZAS_RENDIMIENTO"
if MARKER in src:
    print("ℹ️ V5.2C ya estaba instalada; no se duplica.")
    raise SystemExit(0)

if "V52_ANATOMIA_POETICA_REFINADA" not in src:
    raise SystemExit("❌ No encuentro V5.2 en MundoPoema.tsx. No se ha modificado el archivo.")

start = src.find("function Poet({")
end = src.find("\nfunction Terraces()", start)
if start == -1 or end == -1:
    raise SystemExit("❌ No pude aislar el componente Poet de forma segura.")

poet = src[start:end]
poet = poet.replace(
    "// V52_ANATOMIA_POETICA_REFINADA",
    "// V52_ANATOMIA_POETICA_REFINADA\n  // V52C_CABEZAS_RENDIMIENTO",
    1,
)

# Reducir resolución geométrica solo dentro de Poet.
poet = re.sub(
    r"(<sphereGeometry\s+args=\{\[\s*[^,\]]+,\s*)(?:16|18|20)(\s*,\s*)(?:16|18|20)(\s*,\s*\]\}\s*/>)",
    r"\g<1>12\g<2>12\g<3>",
    poet,
    flags=re.S,
)
poet = re.sub(
    r"(<cylinderGeometry\s+args=\{\[\s*[^,\]]+,\s*[^,\]]+,\s*[^,\]]+,\s*)(?:10|12|16)(\s*,\s*\]\}\s*/>)",
    r"\g<1>8\g<2>",
    poet,
    flags=re.S,
)

# Eliminar castShadow de piezas articuladas dentro de Poet.
poet = re.sub(r"\s+castShadow(?=[\s>])", "", poet)

# Sombra escultórica barata por figura.
anchor = r'''
      <mesh
        position={[0, 0.018, 0.035]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[0.52, 0.26, 1]}
        renderOrder={-1}
      >
        <circleGeometry args={[0.42, 12]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.24}
          depthWrite={false}
        />
      </mesh>
'''
insert_point = "    >\n      <group\n        ref={torso}"
if insert_point not in poet:
    raise SystemExit("❌ No pude insertar la sombra ligera de las figuras.")
poet = poet.replace(
    insert_point,
    "    >\n" + anchor + "      <group\n        ref={torso}",
    1,
)

# Corregir el casquete de cabello: arriba y atrás, sin cortar la frente.
cond = poet.find("{silhouetteIndex !==")
if cond == -1:
    raise SystemExit("❌ No encontré el bloque de cabello de V5.2.")
close = poet.find("        )}", cond)
if close == -1:
    raise SystemExit("❌ No encontré el cierre del cabello de V5.2.")
close += len("        )}")

new_hair = r'''{silhouetteIndex !== 2 && (
          <mesh
            position={[
              0,
              0.145,
              -0.055,
            ]}
            scale={[
              0.98,
              0.29,
              0.92,
            ]}
          >
            <sphereGeometry
              args={[
                0.16,
                12,
                12,
              ]}
            />

            <meshStandardMaterial
              color={hair}
              roughness={0.98}
            />
          </mesh>
        )}'''

poet = poet[:cond] + new_hair + poet[close:]
src = src[:start] + poet + src[end:]

# Optimización del Canvas.
src = src.replace("dpr={[1, 1.7]}", "dpr={[0.9, 1.3]}", 1)
src = src.replace("dpr={[1,1.7]}", "dpr={[0.9, 1.3]}", 1)

canvas_pos = src.find("<Canvas")
if canvas_pos != -1:
    window = src[canvas_pos:canvas_pos + 900]
    if 'shadows="basic"' not in window:
        new_window = re.sub(r"\bshadows\b", 'shadows="basic"', window, count=1)
        src = src[:canvas_pos] + new_window + src[canvas_pos + 900:]

src = src.replace("count={110}", "count={64}", 1)

if "antialias: true," in src and 'powerPreference: "high-performance"' not in src:
    src = src.replace(
        "antialias: true,",
        'antialias: true,\n            powerPreference: "high-performance",',
        1,
    )

world.write_text(src, encoding="utf-8")
print("✅ Cabello elevado y retrasado: desaparece el corte de frente.")
print("✅ Figuras aligeradas sin perder articulación.")
print("✅ Sombras de piezas pequeñas sustituidas por sombra escultórica barata.")
print("✅ DPR Retina reducido moderadamente.")
print("✅ Shadow map básico activado.")
print("✅ Sparkles reducidos.")
print("✅ Preferencia GPU high-performance activada.")
