from pathlib import Path
import re
import sys

world = Path(sys.argv[1])
src = world.read_text(encoding="utf-8")

MARKER = "V5_FIGURAS_ESCULTORICAS_HUMANAS"
if MARKER in src:
    print("ℹ️ V5 ya estaba instalada; no se duplica.")
    raise SystemExit(0)

new_poet = r'''function Poet({
  position,
  rotation,
  color,
  task,
  phase,
  scale,
}: PoetData) {
  // V5_FIGURAS_ESCULTORICAS_HUMANAS
  const group = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const leftUpperArm = useRef<THREE.Group>(null);
  const rightUpperArm = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);

  const bodyVariation =
    0.96 + ((Math.sin(phase * 2.17) + 1) * 0.5) * 0.09;
  const shoulderVariation =
    0.94 + ((Math.cos(phase * 1.73) + 1) * 0.5) * 0.12;
  const headVariation =
    0.96 + ((Math.sin(phase * 1.31 + 0.7) + 1) * 0.5) * 0.07;

  const skinPalette = [
    "#c69b7d",
    "#b98c70",
    "#d0aa8d",
    "#a97860",
    "#c09274",
    "#d2b197",
  ];

  const skinIndex =
    Math.abs(Math.floor(phase * 13)) % skinPalette.length;
  const skin = skinPalette[skinIndex];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const local = t * 0.96 + phase;
    const slow = t * 0.31 + phase * 0.71;

    const breath = Math.sin(local * 1.12) * 0.009;
    const rareGesture = Math.pow(
      Math.max(0, Math.sin(t * 0.41 + phase * 1.61)),
      10
    );

    let lean = 0;
    let rightArm = -0.16;
    let leftArm = -0.08;
    let headTurn = Math.sin(slow * 0.82) * 0.08;
    let headTilt = Math.sin(slow * 1.06) * 0.026;
    let stepX = 0;
    let stepZ = 0;
    let torsoTurn = Math.sin(slow * 0.64) * 0.035;
    let leftKnee = -0.02;
    let rightKnee = 0.02;

    switch (task) {
      case "stone":
        lean = 0.045 + rareGesture * 0.075;
        rightArm = -0.46 + Math.sin(local * 1.24) * 0.12;
        leftArm = -0.28 + Math.sin(local * 0.92 + 1.2) * 0.08;
        leftKnee = -0.07;
        rightKnee = 0.055;
        stepZ = Math.sin(local * 0.48) * 0.012;
        break;

      case "pages":
        lean = -0.01;
        rightArm = -0.08 + Math.sin(local * 0.61) * 0.06 + rareGesture * 0.16;
        leftArm = 0.12 + Math.sin(local * 0.55 + 0.9) * 0.05;
        headTilt -= rareGesture * 0.045;
        torsoTurn += 0.035;
        break;

      case "light":
        lean = -0.018;
        rightArm = -0.3 - rareGesture * 0.22;
        leftArm = 0.08;
        headTurn += rareGesture * 0.13;
        headTilt += rareGesture * 0.045;
        torsoTurn += 0.045;
        break;

      case "water":
        lean = 0.045 + rareGesture * 0.05;
        rightArm = -0.4 + Math.sin(local * 0.92) * 0.11;
        leftArm = -0.16;
        leftKnee = -0.055;
        rightKnee = 0.04;
        stepX = Math.sin(local * 0.46) * 0.01;
        break;

      case "rope":
        lean = Math.sin(local * 0.48) * 0.025;
        rightArm = -0.55 + Math.sin(local * 1.02) * 0.15;
        leftArm = -0.42 + Math.sin(local * 1.02 + 1.15) * 0.12;
        torsoTurn -= 0.055;
        leftKnee = -0.045;
        rightKnee = 0.045;
        stepZ = Math.sin(local * 0.45) * 0.012;
        break;

      case "seed":
        lean = 0.035 + rareGesture * 0.08;
        rightArm = -0.31 + Math.sin(local * 0.72) * 0.08;
        leftArm = -0.08 + rareGesture * 0.09;
        headTilt -= rareGesture * 0.04;
        leftKnee = -0.05;
        rightKnee = 0.035;
        break;
    }

    if (group.current) {
      group.current.position.x = position[0] + stepX;
      group.current.position.y =
        position[1] + breath + Math.sin(local * 0.4) * 0.008;
      group.current.position.z = position[2] + stepZ;
      group.current.rotation.x = lean;
      group.current.rotation.y =
        rotation + torsoTurn + rareGesture * 0.018;
    }

    if (torso.current) {
      torso.current.scale.y = 1 + breath * 0.25;
      torso.current.rotation.z = Math.sin(slow * 0.82) * 0.012;
    }

    if (head.current) {
      head.current.rotation.y = headTurn;
      head.current.rotation.z = headTilt;
    }

    if (rightUpperArm.current) {
      rightUpperArm.current.rotation.x = rightArm;
      rightUpperArm.current.rotation.z = -0.13;
    }

    if (leftUpperArm.current) {
      leftUpperArm.current.rotation.x = leftArm;
      leftUpperArm.current.rotation.z = 0.13;
    }

    if (leftLeg.current) {
      leftLeg.current.rotation.x = leftKnee;
    }

    if (rightLeg.current) {
      rightLeg.current.rotation.x = rightKnee;
    }
  });

  return (
    <group
      ref={group}
      position={position}
      rotation={[0, rotation, 0]}
      scale={scale}
    >
      {/* torso y ropa: una silueta escultórica, no un avatar de videojuego */}
      <group
        ref={torso}
        position={[0, 0.84, 0]}
        scale={[shoulderVariation, bodyVariation, 1]}
      >
        <mesh position={[0, -0.03, 0]} castShadow>
          <cylinderGeometry args={[0.17, 0.245, 0.56, 14]} />
          <meshStandardMaterial
            color={color}
            roughness={0.96}
            metalness={0.015}
          />
        </mesh>

        <mesh
          position={[0, 0.23, 0]}
          scale={[1.38, 0.55, 0.72]}
          castShadow
        >
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial
            color={color}
            roughness={0.96}
            metalness={0.015}
          />
        </mesh>

        <mesh
          position={[0, -0.28, 0]}
          scale={[1.03, 0.62, 0.75]}
          castShadow
        >
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial
            color={color}
            roughness={0.96}
            metalness={0.015}
          />
        </mesh>
      </group>

      <mesh position={[0, 1.16, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.065, 0.13, 12]} />
        <meshStandardMaterial color={skin} roughness={0.92} />
      </mesh>

      <group
        ref={head}
        position={[0, 1.34, 0]}
        scale={[0.94 * headVariation, 1.06 * headVariation, 0.9]}
      >
        <mesh castShadow>
          <sphereGeometry args={[0.17, 18, 18]} />
          <meshStandardMaterial color={skin} roughness={0.92} />
        </mesh>

        <mesh
          position={[0, -0.015, 0.155]}
          scale={[0.45, 0.55, 0.32]}
          castShadow
        >
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color={skin} roughness={0.94} />
        </mesh>
      </group>

      <group
        ref={leftUpperArm}
        position={[0.235 * shoulderVariation, 1.02, 0]}
      >
        <mesh
          position={[0, -0.16, 0]}
          rotation={[0, 0, 0.12]}
          castShadow
        >
          <cylinderGeometry args={[0.05, 0.062, 0.34, 10]} />
          <meshStandardMaterial color={color} roughness={0.95} />
        </mesh>
        <mesh
          position={[0.035, -0.38, 0.025]}
          rotation={[0.06, 0, 0.06]}
          castShadow
        >
          <cylinderGeometry args={[0.038, 0.047, 0.29, 10]} />
          <meshStandardMaterial color={skin} roughness={0.92} />
        </mesh>
        <mesh
          position={[0.055, -0.54, 0.04]}
          scale={[0.75, 1.0, 0.55]}
          castShadow
        >
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshStandardMaterial color={skin} roughness={0.92} />
        </mesh>
      </group>

      <group
        ref={rightUpperArm}
        position={[-0.235 * shoulderVariation, 1.02, 0]}
      >
        <mesh
          position={[0, -0.16, 0]}
          rotation={[0, 0, -0.12]}
          castShadow
        >
          <cylinderGeometry args={[0.05, 0.062, 0.34, 10]} />
          <meshStandardMaterial color={color} roughness={0.95} />
        </mesh>
        <mesh
          position={[-0.035, -0.38, 0.025]}
          rotation={[0.06, 0, -0.06]}
          castShadow
        >
          <cylinderGeometry args={[0.038, 0.047, 0.29, 10]} />
          <meshStandardMaterial color={skin} roughness={0.92} />
        </mesh>
        <mesh
          position={[-0.055, -0.54, 0.04]}
          scale={[0.75, 1.0, 0.55]}
          castShadow
        >
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshStandardMaterial color={skin} roughness={0.92} />
        </mesh>
      </group>

      <group ref={leftLeg} position={[0.105, 0.53, 0]}>
        <mesh position={[0, -0.16, 0]} castShadow>
          <cylinderGeometry args={[0.065, 0.075, 0.36, 10]} />
          <meshStandardMaterial color={color} roughness={0.96} />
        </mesh>
        <mesh position={[0, -0.43, 0.01]} castShadow>
          <cylinderGeometry args={[0.047, 0.06, 0.28, 10]} />
          <meshStandardMaterial color="#6f6257" roughness={0.98} />
        </mesh>
        <mesh position={[0, -0.59, 0.06]} scale={[0.65, 0.48, 1.15]} castShadow>
          <boxGeometry args={[0.13, 0.11, 0.18]} />
          <meshStandardMaterial color="#5b5048" roughness={1} />
        </mesh>
      </group>

      <group ref={rightLeg} position={[-0.105, 0.53, 0]}>
        <mesh position={[0, -0.16, 0]} castShadow>
          <cylinderGeometry args={[0.065, 0.075, 0.36, 10]} />
          <meshStandardMaterial color={color} roughness={0.96} />
        </mesh>
        <mesh position={[0, -0.43, 0.01]} castShadow>
          <cylinderGeometry args={[0.047, 0.06, 0.28, 10]} />
          <meshStandardMaterial color="#6f6257" roughness={0.98} />
        </mesh>
        <mesh position={[0, -0.59, 0.06]} scale={[0.65, 0.48, 1.15]} castShadow>
          <boxGeometry args={[0.13, 0.11, 0.18]} />
          <meshStandardMaterial color="#5b5048" roughness={1} />
        </mesh>
      </group>

      <PoetTool task={task} />
    </group>
  );
}'''

pattern = re.compile(
    r"function Poet\(\{.*?\n\}\n\nfunction Terraces\(\)",
    re.S,
)

match = pattern.search(src)
if not match:
    raise SystemExit(
        "❌ No pude localizar function Poet() de forma segura. "
        "El archivo NO se ha modificado."
    )

src = src[:match.start()] + new_poet + "\n\nfunction Terraces()" + src[match.end():]
world.write_text(src, encoding="utf-8")

print("✅ V5 aplicada al componente Poet.")
print("✅ Cabeza, cuello, hombros, torso, brazos, manos, piernas y pies nuevos.")
print("✅ Microgestos por oficio preservados.")
