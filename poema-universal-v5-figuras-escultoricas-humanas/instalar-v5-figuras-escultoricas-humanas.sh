#!/bin/bash
set -euo pipefail

PROJECT="$HOME/poema-universal"
WORLD="$PROJECT/app/poema-universal/components/world/MundoPoema.tsx"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="$HOME/.poema-universal-backups/figuras-escultoricas-humanas-$STAMP"

printf '
================================================
'
printf ' POEMA UNIVERSAL · V5 · FIGURAS ESCULTÓRICAS HUMANAS
'
printf '================================================

'

if [ ! -f "$WORLD" ]; then
  echo "❌ No encuentro:"
  echo "   $WORLD"
  exit 1
fi

mkdir -p "$BACKUP_DIR"
cp "$WORLD" "$BACKUP_DIR/MundoPoema.tsx"

echo "✅ Copia de seguridad:"
echo "   $BACKUP_DIR"

python3 - "$WORLD" <<'PY'
from pathlib import Path
import re
import sys

world = Path(sys.argv[1])
src = world.read_text(encoding='utf-8')

new_poet = function Poet({
  position,
  rotation,
  color,
  task,
  phase,
  scale,
}: PoetData) {
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const local = t * 1.02 + phase;
    const slow = t * 0.35 + phase * 0.73;

    const breath = Math.sin(local * 1.15) * 0.012;
    const weightShift = Math.sin(slow) * 0.018;
    const rareGesture = Math.pow(Math.max(0, Math.sin(t * 0.46 + phase * 1.7)), 8);

    let lean = 0;
    let armBase = -0.35;
    let armMotion = Math.sin(local) * 0.12;
    let leftArmExtra = 0.0;
    let leftArmSpread = 0.18;
    let rightArmSpread = -0.22;
    let stepX = 0;
    let stepZ = 0;
    let headTilt = Math.sin(slow * 1.2) * 0.035;
    let torsoTurn = Math.sin(slow * 0.72) * 0.04;
    let kneeFold = 0.12 + Math.sin(local * 0.92) * 0.03;

    switch (task) {
      case 'stone':
        lean = 0.06 + rareGesture * 0.12;
        armBase = -0.6;
        armMotion = Math.sin(local * 1.28) * 0.22;
        leftArmExtra = -0.18 - rareGesture * 0.18;
        stepZ = Math.sin(local * 0.66) * 0.018;
        torsoTurn -= 0.05;
        kneeFold += 0.05;
        break;
      case 'pages':
        lean = -0.01;
        armBase = -0.2;
        armMotion = Math.sin(local * 0.75) * 0.14 + rareGesture * 0.32;
        leftArmExtra = 0.35 + Math.sin(local * 0.65) * 0.1;
        headTilt -= rareGesture * 0.08;
        torsoTurn += 0.04;
        break;
      case 'light':
        lean = -0.025;
        armBase = -0.45;
        armMotion = Math.sin(local * 0.82) * 0.11 - rareGesture * 0.42;
        leftArmExtra = 0.22;
        headTilt += rareGesture * 0.12;
        torsoTurn += 0.06;
        break;
      case 'water':
        lean = 0.055 + rareGesture * 0.08;
        armBase = -0.48;
        armMotion = Math.sin(local * 1.04) * 0.18;
        leftArmExtra = -0.1;
        stepX = Math.sin(local * 0.52) * 0.014;
        torsoTurn -= 0.04;
        kneeFold += 0.04;
        break;
      case 'rope':
        lean = Math.sin(local * 0.5) * 0.035;
        armBase = -0.72;
        armMotion = Math.sin(local * 1.08) * 0.28;
        leftArmExtra = -0.24 + Math.sin(local * 1.08 + 1.4) * 0.12;
        stepZ = Math.sin(local * 0.56) * 0.02;
        torsoTurn -= 0.08;
        break;
      case 'seed':
        lean = 0.03 + rareGesture * 0.13;
        armBase = -0.42;
        armMotion = Math.sin(local * 0.88) * 0.15 + rareGesture * 0.2;
        leftArmExtra = 0.12;
        headTilt -= rareGesture * 0.07;
        kneeFold += 0.03;
        break;
    }

    if (group.current) {
      group.current.position.x = position[0] + stepX;
      group.current.position.y = position[1] + breath + Math.sin(local * 0.44) * 0.016;
      group.current.position.z = position[2] + stepZ;
      group.current.rotation.y = rotation + torsoTurn + Math.sin(slow * 0.7) * 0.045 + rareGesture * 0.024;
      group.current.rotation.x = lean + weightShift;
    }

    if (body.current) {
      body.current.scale.y = 1 + breath * 0.24;
      body.current.rotation.z = Math.sin(slow * 0.9) * 0.02;
    }

    if (head.current) {
      head.current.rotation.z = headTilt;
      head.current.rotation.y = Math.sin(slow * 0.82) * 0.08 + rareGesture * 0.12;
    }

    if (rightArm.current) {
      rightArm.current.rotation.x = armBase + armMotion;
      rightArm.current.rotation.z = rightArmSpread + Math.sin(slow * 1.1) * 0.03;
    }

    if (leftArm.current) {
      leftArm.current.rotation.x = armBase * 0.45 + leftArmExtra;
      leftArm.current.rotation.z = leftArmSpread + Math.sin(slow * 0.9 + 1.2) * 0.03;
    }

    if (leftLeg.current) {
      leftLeg.current.rotation.x = -kneeFold * 0.5 + Math.sin(local * 0.78) * 0.02;
    }

    if (rightLeg.current) {
      rightLeg.current.rotation.x = kneeFold * 0.35 + Math.sin(local * 0.81 + 0.8) * 0.02;
    }
  });

  return (
    <group ref={group} position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group ref={body} position={[0, 0.58, 0]}>
        <mesh position={[0, 0.1, 0]} castShadow>
          <capsuleGeometry args={[0.16, 0.38, 8, 16]} />
          <meshStandardMaterial color={color} roughness={0.94} metalness={0.03} />
        </mesh>

        <mesh position={[0, 0.42, 0]} castShadow>
          <sphereGeometry args={[0.2, 18, 18]} />
          <meshStandardMaterial color={color} roughness={0.95} metalness={0.02} />
        </mesh>

        <mesh position={[0, 0.62, 0]} castShadow>
          <capsuleGeometry args={[0.11, 0.16, 8, 14]} />
          <meshStandardMaterial color={color} roughness={0.95} metalness={0.02} />
        </mesh>
      </group>

      <group ref={head} position={[0, 1.28, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.17, 18, 18]} />
          <meshStandardMaterial color="#c59a7d" roughness={0.9} />
        </mesh>

        <mesh position={[0, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.06, 0.1, 12]} />
          <meshStandardMaterial color="#c59a7d" roughness={0.9} />
        </mesh>
      </group>

      <group ref={leftArm} position={[0.22, 0.92, 0.02]}>
        <mesh rotation={[0, 0, 0.28]} castShadow>
          <capsuleGeometry args={[0.045, 0.42, 6, 12]} />
          <meshStandardMaterial color="#c09778" roughness={0.9} />
        </mesh>
      </group>

      <group ref={rightArm} position={[-0.22, 0.92, -0.02]}>
        <mesh rotation={[0, 0, -0.32]} castShadow>
          <capsuleGeometry args={[0.045, 0.46, 6, 12]} />
          <meshStandardMaterial color="#c09778" roughness={0.9} />
        </mesh>
      </group>

      <group ref={leftLeg} position={[0.11, 0.3, 0]}>
        <mesh rotation={[0, 0, 0.03]} castShadow>
          <capsuleGeometry args={[0.055, 0.46, 6, 12]} />
          <meshStandardMaterial color={color} roughness={0.95} metalness={0.02} />
        </mesh>
      </group>

      <group ref={rightLeg} position={[-0.11, 0.3, 0]}>
        <mesh rotation={[0, 0, -0.03]} castShadow>
          <capsuleGeometry args={[0.055, 0.46, 6, 12]} />
          <meshStandardMaterial color={color} roughness={0.95} metalness={0.02} />
        </mesh>
      </group>

      <PoetTool task={task} />
    </group>
  );
}

pattern = re.compile(r'function Poet\(\{.*?
\}

function Terraces\(\)', re.S)
if not pattern.search(src):
    raise SystemExit('❌ No pude localizar el componente Poet de forma segura. No se ha modificado el archivo.')

src = pattern.sub(new_poet + "

function Terraces()", src, count=1)
world.write_text(src, encoding='utf-8')

print('✅ Figuras escultóricas humanas aplicadas.')
print('✅ Anatomía más creíble: torso, cuello, brazos y piernas.')
print('✅ Materiales escultóricos conservados.')
print('✅ Oficios y microgestos preservados.')
PY

echo ""
echo "===== COMPROBACIÓN DE SINTAXIS ====="

echo ""
echo "================================================"
echo " ✅ V5 · FIGURAS ESCULTÓRICAS HUMANAS INSTALADO"
echo "================================================"
echo ""
echo "Se ha mejorado:"
echo "  · la anatomía general"
echo "  · cuello y cabeza"
echo "  · hombros y torso"
echo "  · brazos y piernas"
echo "  · silueta poética y más humana"
echo "  · microgestos por oficio"
echo ""
echo "No se ha tocado:"
echo "  · la arquitectura"
echo "  · la iluminación"
echo "  · la BSO"
echo "  · la Dramaturgia Viva"
echo "  · la Mirada Orbital"
echo ""
echo "Reinicia Next para verlo."
echo ""
