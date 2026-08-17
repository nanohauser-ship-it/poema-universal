from pathlib import Path
import re
import sys

world = Path(sys.argv[1])
src = world.read_text(encoding="utf-8")

MARKER = "V52_ANATOMIA_POETICA_REFINADA"
if MARKER in src:
    print("ℹ️ V5.2 ya estaba instalada; no se duplica.")
    raise SystemExit(0)

new_poet = r'''function Poet({
  position,
  rotation,
  color,
  task,
  phase,
  scale,
}: PoetData) {
  // V52_ANATOMIA_POETICA_REFINADA
  const root = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const leftUpperArm = useRef<THREE.Group>(null);
  const rightUpperArm = useRef<THREE.Group>(null);
  const leftForearm = useRef<THREE.Group>(null);
  const rightForearm = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);
  const leftLowerLeg = useRef<THREE.Group>(null);
  const rightLowerLeg = useRef<THREE.Group>(null);

  const silhouetteProfiles = [
    { height: 0.97, shoulders: 0.90, chest: 0.93, hips: 0.92, limbs: 0.97, headX: 0.93, headY: 1.08, stance: 0.095, robe: 0.82, lean: -0.010 },
    { height: 1.03, shoulders: 1.11, chest: 1.06, hips: 0.97, limbs: 1.02, headX: 0.98, headY: 1.02, stance: 0.112, robe: 0.72, lean: 0.000 },
    { height: 0.94, shoulders: 1.00, chest: 1.02, hips: 1.09, limbs: 0.93, headX: 1.02, headY: 0.99, stance: 0.122, robe: 1.04, lean: 0.012 },
    { height: 1.08, shoulders: 0.95, chest: 0.92, hips: 0.90, limbs: 1.08, headX: 0.91, headY: 1.10, stance: 0.102, robe: 0.68, lean: -0.012 },
    { height: 0.99, shoulders: 1.05, chest: 0.99, hips: 1.03, limbs: 1.00, headX: 1.00, headY: 1.04, stance: 0.118, robe: 1.12, lean: 0.008 },
    { height: 1.01, shoulders: 0.97, chest: 1.00, hips: 0.95, limbs: 0.99, headX: 0.96, headY: 1.01, stance: 0.106, robe: 0.88, lean: -0.004 },
  ] as const;

  const silhouetteIndex =
    Math.abs(Math.floor(phase * 17.31)) %
    silhouetteProfiles.length;

  const silhouette =
    silhouetteProfiles[silhouetteIndex];

  const skinPalette = [
    "#d0aa8d",
    "#bd9073",
    "#a87962",
    "#d8b99e",
    "#c49778",
    "#8f6655",
  ];

  const hairPalette = [
    "#3d3029",
    "#5a4638",
    "#2e2926",
    "#6a5240",
    "#403731",
    "#725641",
  ];

  const skin =
    skinPalette[silhouetteIndex];

  const hair =
    hairPalette[
      (silhouetteIndex + 2) %
        hairPalette.length
    ];

  const h = silhouette.height;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const local = t * 0.9 + phase;
    const slow =
      t * 0.28 + phase * 0.73;

    const breath =
      Math.sin(local * 1.08) * 0.008;

    const rareGesture =
      Math.pow(
        Math.max(
          0,
          Math.sin(
            t * 0.39 +
              phase * 1.57
          )
        ),
        11
      );

    let lean = silhouette.lean;

    let torsoTurn =
      Math.sin(slow * 0.76) *
      0.032;

    let headTurn =
      Math.sin(slow * 0.92) *
      0.085;

    let headTilt =
      Math.sin(slow * 1.07) *
      0.026;

    let leftShoulder = -0.08;
    let rightShoulder = -0.14;
    let leftElbow = -0.22;
    let rightElbow = -0.28;

    let leftHip = -0.018;
    let rightHip = 0.018;

    let leftKnee = 0.05;
    let rightKnee = 0.04;

    let stepX = 0;
    let stepZ = 0;

    switch (task) {
      case "stone":
        lean +=
          0.045 +
          rareGesture * 0.07;

        rightShoulder =
          -0.42 +
          Math.sin(
            local * 1.16
          ) * 0.12;

        leftShoulder =
          -0.28 +
          Math.sin(
            local * 0.82 + 1.1
          ) * 0.07;

        rightElbow =
          -0.5 -
          rareGesture * 0.18;

        leftElbow = -0.38;
        leftHip = -0.055;
        rightHip = 0.045;
        leftKnee = 0.12;
        rightKnee = 0.075;

        stepZ =
          Math.sin(
            local * 0.42
          ) * 0.009;

        break;

      case "pages":
        lean -= 0.008;

        rightShoulder =
          -0.04 +
          Math.sin(
            local * 0.55
          ) * 0.045;

        leftShoulder =
          0.08 +
          Math.sin(
            local * 0.5 + 0.8
          ) * 0.04;

        rightElbow =
          -0.62 +
          rareGesture * 0.23;

        leftElbow =
          -0.66 +
          Math.sin(
            local * 0.55
          ) * 0.08;

        headTilt -=
          rareGesture * 0.04;

        torsoTurn += 0.03;
        break;

      case "light":
        lean -= 0.015;

        rightShoulder =
          -0.27 -
          rareGesture * 0.18;

        leftShoulder = 0.06;

        rightElbow =
          -0.48 -
          rareGesture * 0.24;

        leftElbow = -0.32;

        headTurn +=
          rareGesture * 0.12;

        headTilt +=
          rareGesture * 0.035;

        torsoTurn += 0.04;
        break;

      case "water":
        lean +=
          0.038 +
          rareGesture * 0.045;

        rightShoulder =
          -0.36 +
          Math.sin(
            local * 0.84
          ) * 0.1;

        leftShoulder = -0.16;
        rightElbow = -0.52;
        leftElbow = -0.34;

        leftHip = -0.045;
        rightHip = 0.035;
        leftKnee = 0.1;

        stepX =
          Math.sin(
            local * 0.4
          ) * 0.008;

        break;

      case "rope":
        lean +=
          Math.sin(
            local * 0.43
          ) * 0.022;

        rightShoulder =
          -0.5 +
          Math.sin(
            local * 0.96
          ) * 0.13;

        leftShoulder =
          -0.38 +
          Math.sin(
            local * 0.96 + 1.2
          ) * 0.11;

        rightElbow = -0.58;
        leftElbow = -0.55;

        torsoTurn -= 0.05;

        leftHip = -0.04;
        rightHip = 0.04;

        leftKnee = 0.09;
        rightKnee = 0.08;

        stepZ =
          Math.sin(
            local * 0.41
          ) * 0.009;

        break;

      case "seed":
        lean +=
          0.03 +
          rareGesture * 0.065;

        rightShoulder =
          -0.28 +
          Math.sin(
            local * 0.67
          ) * 0.07;

        leftShoulder =
          -0.07 +
          rareGesture * 0.08;

        rightElbow = -0.5;
        leftElbow = -0.38;

        headTilt -=
          rareGesture * 0.035;

        leftHip = -0.04;
        leftKnee = 0.11;
        rightKnee = 0.07;

        break;
    }

    if (root.current) {
      root.current.position.x =
        position[0] + stepX;

      root.current.position.y =
        position[1] +
        breath +
        Math.sin(
          local * 0.34
        ) * 0.006;

      root.current.position.z =
        position[2] + stepZ;

      root.current.rotation.x =
        lean;

      root.current.rotation.y =
        rotation +
        torsoTurn +
        rareGesture * 0.014;
    }

    if (torso.current) {
      torso.current.scale.y =
        1 + breath * 0.18;

      torso.current.rotation.z =
        Math.sin(
          slow * 0.8
        ) * 0.01;
    }

    if (head.current) {
      head.current.rotation.y =
        headTurn;

      head.current.rotation.z =
        headTilt;
    }

    if (leftUpperArm.current) {
      leftUpperArm.current.rotation.x =
        leftShoulder;

      leftUpperArm.current.rotation.z =
        0.1;
    }

    if (rightUpperArm.current) {
      rightUpperArm.current.rotation.x =
        rightShoulder;

      rightUpperArm.current.rotation.z =
        -0.1;
    }

    if (leftForearm.current) {
      leftForearm.current.rotation.x =
        leftElbow;
    }

    if (rightForearm.current) {
      rightForearm.current.rotation.x =
        rightElbow;
    }

    if (leftLeg.current) {
      leftLeg.current.rotation.x =
        leftHip;
    }

    if (rightLeg.current) {
      rightLeg.current.rotation.x =
        rightHip;
    }

    if (leftLowerLeg.current) {
      leftLowerLeg.current.rotation.x =
        leftKnee;
    }

    if (rightLowerLeg.current) {
      rightLowerLeg.current.rotation.x =
        rightKnee;
    }
  });

  const shoulderX =
    0.225 *
    silhouette.shoulders;

  const hipX =
    silhouette.stance;

  const torsoY =
    0.83 * h;

  const neckY =
    1.13 * h;

  const headY =
    1.32 * h;

  const hipY =
    0.56 * h;

  return (
    <group
      ref={root}
      position={position}
      rotation={[0, rotation, 0]}
      scale={scale}
    >
      <group
        ref={torso}
        position={[
          0,
          torsoY,
          0,
        ]}
      >
        <mesh
          position={[
            0,
            0.1 * h,
            0,
          ]}
          scale={[
            silhouette.chest *
              1.28,
            0.82,
            silhouette.chest *
              0.76,
          ]}
          castShadow
        >
          <sphereGeometry
            args={[
              0.19,
              18,
              18,
            ]}
          />

          <meshStandardMaterial
            color={color}
            roughness={0.96}
            metalness={0.012}
          />
        </mesh>

        <mesh
          position={[
            0,
            -0.12 * h,
            0,
          ]}
          scale={[
            silhouette.hips *
              1.02,
            0.96,
            silhouette.hips *
              0.76,
          ]}
          castShadow
        >
          <sphereGeometry
            args={[
              0.18,
              16,
              16,
            ]}
          />

          <meshStandardMaterial
            color={color}
            roughness={0.97}
            metalness={0.01}
          />
        </mesh>

        <mesh
          position={[
            0,
            -0.28 * h,
            0,
          ]}
          castShadow
        >
          <cylinderGeometry
            args={[
              0.16 *
                silhouette.hips,
              0.21 *
                silhouette.hips *
                silhouette.robe,
              0.34 *
                h *
                silhouette.robe,
              16,
            ]}
          />

          <meshStandardMaterial
            color={color}
            roughness={0.98}
            metalness={0.008}
          />
        </mesh>

        <mesh
          position={[
            0,
            0.23 * h,
            0,
          ]}
          rotation={[
            0,
            0,
            Math.PI / 2,
          ]}
          scale={[
            1,
            silhouette.shoulders,
            1,
          ]}
          castShadow
        >
          <cylinderGeometry
            args={[
              0.055,
              0.065,
              0.37,
              12,
            ]}
          />

          <meshStandardMaterial
            color={color}
            roughness={0.96}
          />
        </mesh>
      </group>

      <mesh
        position={[
          0,
          neckY,
          0,
        ]}
        castShadow
      >
        <cylinderGeometry
          args={[
            0.048,
            0.06,
            0.12 * h,
            12,
          ]}
        />

        <meshStandardMaterial
          color={skin}
          roughness={0.92}
        />
      </mesh>

      <group
        ref={head}
        position={[
          0,
          headY,
          0,
        ]}
        scale={[
          silhouette.headX,
          silhouette.headY,
          0.91,
        ]}
      >
        <mesh castShadow>
          <sphereGeometry
            args={[
              0.165,
              20,
              20,
            ]}
          />

          <meshStandardMaterial
            color={skin}
            roughness={0.93}
          />
        </mesh>

        <mesh
          position={[
            0,
            -0.082,
            0.012,
          ]}
          scale={[
            0.88,
            0.63,
            0.86,
          ]}
          castShadow
        >
          <sphereGeometry
            args={[
              0.14,
              16,
              16,
            ]}
          />

          <meshStandardMaterial
            color={skin}
            roughness={0.94}
          />
        </mesh>

        <mesh
          position={[
            0,
            -0.005,
            0.152,
          ]}
          scale={[
            0.36,
            0.48,
            0.3,
          ]}
          castShadow
        >
          <sphereGeometry
            args={[
              0.07,
              12,
              12,
            ]}
          />

          <meshStandardMaterial
            color={skin}
            roughness={0.95}
          />
        </mesh>

        {silhouetteIndex !==
          2 && (
          <mesh
            position={[
              0,
              0.105,
              -0.012,
            ]}
            scale={[
              1.02,
              0.48,
              0.96,
            ]}
            castShadow
          >
            <sphereGeometry
              args={[
                0.16,
                16,
                16,
              ]}
            />

            <meshStandardMaterial
              color={hair}
              roughness={0.98}
            />
          </mesh>
        )}
      </group>

      <group
        ref={leftUpperArm}
        position={[
          shoulderX,
          1.0 * h,
          0,
        ]}
      >
        <mesh
          position={[
            0,
            -0.14 * h,
            0,
          ]}
          castShadow
        >
          <cylinderGeometry
            args={[
              0.046,
              0.057,
              0.29 *
                h *
                silhouette.limbs,
              10,
            ]}
          />

          <meshStandardMaterial
            color={color}
            roughness={0.96}
          />
        </mesh>

        <mesh
          position={[
            0,
            -0.29 * h,
            0,
          ]}
          castShadow
        >
          <sphereGeometry
            args={[
              0.052,
              12,
              12,
            ]}
          />

          <meshStandardMaterial
            color={skin}
            roughness={0.94}
          />
        </mesh>

        <group
          ref={leftForearm}
          position={[
            0,
            -0.29 * h,
            0,
          ]}
        >
          <mesh
            position={[
              0.015,
              -0.12 * h,
              0.015,
            ]}
            castShadow
          >
            <cylinderGeometry
              args={[
                0.034,
                0.043,
                0.25 *
                  h *
                  silhouette.limbs,
                10,
              ]}
            />

            <meshStandardMaterial
              color={skin}
              roughness={0.94}
            />
          </mesh>

          <mesh
            position={[
              0.025,
              -0.255 * h,
              0.03,
            ]}
            scale={[
              0.7,
              1,
              0.52,
            ]}
            castShadow
          >
            <sphereGeometry
              args={[
                0.052,
                12,
                12,
              ]}
            />

            <meshStandardMaterial
              color={skin}
              roughness={0.94}
            />
          </mesh>
        </group>
      </group>

      <group
        ref={rightUpperArm}
        position={[
          -shoulderX,
          1.0 * h,
          0,
        ]}
      >
        <mesh
          position={[
            0,
            -0.14 * h,
            0,
          ]}
          castShadow
        >
          <cylinderGeometry
            args={[
              0.046,
              0.057,
              0.29 *
                h *
                silhouette.limbs,
              10,
            ]}
          />

          <meshStandardMaterial
            color={color}
            roughness={0.96}
          />
        </mesh>

        <mesh
          position={[
            0,
            -0.29 * h,
            0,
          ]}
          castShadow
        >
          <sphereGeometry
            args={[
              0.052,
              12,
              12,
            ]}
          />

          <meshStandardMaterial
            color={skin}
            roughness={0.94}
          />
        </mesh>

        <group
          ref={rightForearm}
          position={[
            0,
            -0.29 * h,
            0,
          ]}
        >
          <mesh
            position={[
              -0.015,
              -0.12 * h,
              0.015,
            ]}
            castShadow
          >
            <cylinderGeometry
              args={[
                0.034,
                0.043,
                0.25 *
                  h *
                  silhouette.limbs,
                10,
              ]}
            />

            <meshStandardMaterial
              color={skin}
              roughness={0.94}
            />
          </mesh>

          <mesh
            position={[
              -0.025,
              -0.255 * h,
              0.03,
            ]}
            scale={[
              0.7,
              1,
              0.52,
            ]}
            castShadow
          >
            <sphereGeometry
              args={[
                0.052,
                12,
                12,
              ]}
            />

            <meshStandardMaterial
              color={skin}
              roughness={0.94}
            />
          </mesh>
        </group>
      </group>

      <group
        ref={leftLeg}
        position={[
          hipX,
          hipY,
          0,
        ]}
      >
        <mesh
          position={[
            0,
            -0.16 * h,
            0,
          ]}
          castShadow
        >
          <cylinderGeometry
            args={[
              0.058,
              0.069,
              0.33 *
                h *
                silhouette.limbs,
              10,
            ]}
          />

          <meshStandardMaterial
            color={color}
            roughness={0.97}
          />
        </mesh>

        <mesh
          position={[
            0,
            -0.33 * h,
            0,
          ]}
          castShadow
        >
          <sphereGeometry
            args={[
              0.057,
              12,
              12,
            ]}
          />

          <meshStandardMaterial
            color="#796b60"
            roughness={0.98}
          />
        </mesh>

        <group
          ref={leftLowerLeg}
          position={[
            0,
            -0.33 * h,
            0,
          ]}
        >
          <mesh
            position={[
              0,
              -0.14 * h,
              0.01,
            ]}
            castShadow
          >
            <cylinderGeometry
              args={[
                0.043,
                0.054,
                0.28 *
                  h *
                  silhouette.limbs,
                10,
              ]}
            />

            <meshStandardMaterial
              color="#6f6258"
              roughness={0.99}
            />
          </mesh>

          <mesh
            position={[
              0,
              -0.29 * h,
              0.065,
            ]}
            scale={[
              0.7,
              0.48,
              1.2,
            ]}
            castShadow
          >
            <boxGeometry
              args={[
                0.12,
                0.1,
                0.17,
              ]}
            />

            <meshStandardMaterial
              color="#564c45"
              roughness={1}
            />
          </mesh>
        </group>
      </group>

      <group
        ref={rightLeg}
        position={[
          -hipX,
          hipY,
          0,
        ]}
      >
        <mesh
          position={[
            0,
            -0.16 * h,
            0,
          ]}
          castShadow
        >
          <cylinderGeometry
            args={[
              0.058,
              0.069,
              0.33 *
                h *
                silhouette.limbs,
              10,
            ]}
          />

          <meshStandardMaterial
            color={color}
            roughness={0.97}
          />
        </mesh>

        <mesh
          position={[
            0,
            -0.33 * h,
            0,
          ]}
          castShadow
        >
          <sphereGeometry
            args={[
              0.057,
              12,
              12,
            ]}
          />

          <meshStandardMaterial
            color="#796b60"
            roughness={0.98}
          />
        </mesh>

        <group
          ref={rightLowerLeg}
          position={[
            0,
            -0.33 * h,
            0,
          ]}
        >
          <mesh
            position={[
              0,
              -0.14 * h,
              0.01,
            ]}
            castShadow
          >
            <cylinderGeometry
              args={[
                0.043,
                0.054,
                0.28 *
                  h *
                  silhouette.limbs,
                10,
              ]}
            />

            <meshStandardMaterial
              color="#6f6258"
              roughness={0.99}
            />
          </mesh>

          <mesh
            position={[
              0,
              -0.29 * h,
              0.065,
            ]}
            scale={[
              0.7,
              0.48,
              1.2,
            ]}
            castShadow
          >
            <boxGeometry
              args={[
                0.12,
                0.1,
                0.17,
              ]}
            />

            <meshStandardMaterial
              color="#564c45"
              roughness={1}
            />
          </mesh>
        </group>
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

src = (
    src[:match.start()]
    + new_poet
    + "\n\nfunction Terraces()"
    + src[match.end():]
)

world.write_text(
    src,
    encoding="utf-8"
)

print("✅ V5.2 aplicada al componente Poet.")
print("✅ Seis siluetas corporales distintas.")
print("✅ Cabeza ovalada, mandíbula, cuello y nariz sugerida.")
print("✅ Hombros más naturales, codos y rodillas articulados.")
print("✅ Ropaje escultórico y posturas más humanas.")
print("✅ Microgestos por oficio conservados y refinados.")
