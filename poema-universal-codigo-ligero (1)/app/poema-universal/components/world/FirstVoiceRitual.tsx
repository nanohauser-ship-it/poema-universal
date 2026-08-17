"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const CYCLE_DURATION = 32;

const POET_POSITION = new THREE.Vector3(-5.15, 3.05, 0.2);

function clamp01(value: number) {
  return THREE.MathUtils.clamp(value, 0, 1);
}

function smooth(value: number) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

function cycleProgress(elapsed: number) {
  return (elapsed % CYCLE_DURATION) / CYCLE_DURATION;
}

function FirstPoetHalo() {
  const halo = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    if (!halo.current || !material.current) return;

    const elapsed = clock.getElapsedTime();
    const cycle = cycleProgress(elapsed);

    const awakening = smooth((cycle - 0.13) / 0.07);
    const fading = 1 - smooth((cycle - 0.34) / 0.08);
    const presence = awakening * fading;

    const pulse = 1 + Math.sin(elapsed * 2.8) * 0.12;

    halo.current.scale.setScalar(
      Math.max(0.001, presence * pulse)
    );

    halo.current.rotation.z += 0.002;

    material.current.opacity = presence * 0.56;
  });

  return (
    <mesh
      ref={halo}
      position={[-5.4, 2.82, 0.5]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={0}
    >
      <ringGeometry args={[0.5, 0.57, 48]} />

      <meshBasicMaterial
        ref={material}
        color="#eed094"
        transparent
        opacity={0}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function PageFragment() {
  const page = useRef<THREE.Group>(null);
  const parchment = useRef<THREE.MeshStandardMaterial>(null);
  const glow = useRef<THREE.PointLight>(null);

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-8.2, 1.5, 4.4),
        new THREE.Vector3(-5.8, 2.6, 1.2),
        new THREE.Vector3(-1.2, 3.9, -2),
        new THREE.Vector3(3, 5.2, -4.6),
        new THREE.Vector3(4.2, 6.25, -6.1),
      ]),
    []
  );

  const bookPosition = useMemo(() => new THREE.Vector3(), []);
  const currentPosition = useMemo(() => new THREE.Vector3(), []);
  const startingPosition = useMemo(
    () => POET_POSITION.clone(),
    []
  );

  useFrame(({ clock }) => {
    if (!page.current || !parchment.current) return;

    const elapsed = clock.getElapsedTime();
    const cycle = cycleProgress(elapsed);

    const bookTravel = Math.min(cycle / 0.78, 1);
    const bookEase =
      bookTravel * bookTravel * (3 - 2 * bookTravel);

    curve.getPointAt(bookEase, bookPosition);

    bookPosition.y += Math.sin(elapsed * 2) * 0.08;

    const appearance = smooth((cycle - 0.16) / 0.07);
    const journey = smooth((cycle - 0.27) / 0.2);
    const absorption = smooth((cycle - 0.47) / 0.07);
    const reset = 1 - smooth((cycle - 0.975) / 0.018);

    currentPosition
      .copy(startingPosition)
      .lerp(bookPosition, journey);

    currentPosition.y +=
      Math.sin(journey * Math.PI) * 1.75;

    page.current.position.copy(currentPosition);

    page.current.rotation.x =
      -0.18 + Math.sin(elapsed * 1.6) * 0.08;

    page.current.rotation.y =
      elapsed * 0.35 + journey * Math.PI;

    page.current.rotation.z =
      Math.sin(elapsed * 1.3) * 0.09;

    const visibility =
      appearance * (1 - absorption) * reset;

    const pulse =
      1 + Math.sin(elapsed * 4.2) * 0.08;

    page.current.scale.setScalar(
      Math.max(0.001, visibility * pulse)
    );

    parchment.current.emissiveIntensity =
      0.18 + visibility * 0.55;

    if (glow.current) {
      glow.current.intensity = visibility * 7;
    }
  });

  return (
    <group ref={page} position={POET_POSITION} scale={0}>
      <mesh
        position={[-0.18, 0, 0]}
        rotation={[0, 0.08, 0.08]}
        castShadow
      >
        <boxGeometry args={[0.35, 0.035, 0.48]} />

        <meshStandardMaterial
          ref={parchment}
          color="#eee4cc"
          emissive="#7a5b2b"
          emissiveIntensity={0.2}
          roughness={0.86}
        />
      </mesh>

      <mesh
        position={[0.18, 0, 0]}
        rotation={[0, -0.08, -0.08]}
        castShadow
      >
        <boxGeometry args={[0.35, 0.035, 0.48]} />

        <meshStandardMaterial
          color="#f4ead4"
          emissive="#715225"
          emissiveIntensity={0.2}
          roughness={0.86}
        />
      </mesh>

      {[-0.11, 0, 0.11].map((z, index) => (
        <mesh
          key={z}
          position={[
            index % 2 === 0 ? -0.18 : 0.18,
            0.025,
            z,
          ]}
        >
          <boxGeometry args={[0.22, 0.008, 0.018]} />
          <meshBasicMaterial
            color="#8c7148"
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}

      <pointLight
        ref={glow}
        position={[0, 0.22, 0]}
        color="#ecc47e"
        intensity={0}
        distance={3.5}
      />
    </group>
  );
}

function BookAcceptance() {
  const group = useRef<THREE.Group>(null);
  const rings = useRef<Array<THREE.Mesh | null>>([]);
  const materials =
    useRef<Array<THREE.MeshBasicMaterial | null>>([]);

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-8.2, 1.5, 4.4),
        new THREE.Vector3(-5.8, 2.6, 1.2),
        new THREE.Vector3(-1.2, 3.9, -2),
        new THREE.Vector3(3, 5.2, -4.6),
        new THREE.Vector3(4.2, 6.25, -6.1),
      ]),
    []
  );

  const destination = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    if (!group.current) return;

    const elapsed = clock.getElapsedTime();
    const cycle = cycleProgress(elapsed);

    const bookTravel = Math.min(cycle / 0.78, 1);
    const bookEase =
      bookTravel * bookTravel * (3 - 2 * bookTravel);

    curve.getPointAt(bookEase, destination);
    destination.y += Math.sin(elapsed * 2) * 0.08;

    group.current.position.copy(destination);

    const arrival = smooth((cycle - 0.45) / 0.06);
    const departure = 1 - smooth((cycle - 0.59) / 0.07);
    const resonance = arrival * departure;

    rings.current.forEach((ring, index) => {
      const material = materials.current[index];

      if (!ring || !material) return;

      const wave =
        resonance *
        (0.75 + index * 0.52) *
        (1 + Math.sin(elapsed * 2.5 + index) * 0.06);

      ring.scale.setScalar(Math.max(0.001, wave));
      material.opacity =
        resonance * Math.max(0.08, 0.42 - index * 0.1);
    });
  });

  return (
    <group ref={group}>
      {[0.4, 0.72, 1.05].map((radius, index) => (
        <mesh
          key={radius}
          ref={(node) => {
            rings.current[index] = node;
          }}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0}
        >
          <torusGeometry args={[radius, 0.022, 8, 48]} />

          <meshBasicMaterial
            ref={(node) => {
              materials.current[index] = node;
            }}
            color="#f4d696"
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function WordGate() {
  const pieces = useRef<Array<THREE.Mesh | null>>([]);

  const structure = [
    {
      position: [-0.72, 0.82, 0] as [number, number, number],
      size: [0.38, 1.65, 0.48] as [number, number, number],
      delay: 0,
    },
    {
      position: [0.72, 0.82, 0] as [number, number, number],
      size: [0.38, 1.65, 0.48] as [number, number, number],
      delay: 0.035,
    },
    {
      position: [0, 1.72, 0] as [number, number, number],
      size: [1.85, 0.32, 0.58] as [number, number, number],
      delay: 0.07,
    },
  ];

  useFrame(({ clock }) => {
    const cycle = cycleProgress(clock.getElapsedTime());

    structure.forEach((piece, index) => {
      const mesh = pieces.current[index];
      if (!mesh) return;

      const growth =
        smooth((cycle - 0.51 - piece.delay) / 0.13) *
        (1 - smooth((cycle - 0.975) / 0.018));

      mesh.position.y = THREE.MathUtils.lerp(
        -1.8,
        piece.position[1],
        growth
      );

      mesh.rotation.z = THREE.MathUtils.lerp(
        index === 1 ? -0.3 : 0.3,
        0,
        growth
      );

      mesh.scale.setScalar(
        THREE.MathUtils.lerp(0.72, 1, growth)
      );
    });
  });

  return (
    <group position={[0.15, 3.22, -4.25]}>
      {structure.map((piece, index) => (
        <mesh
          key={index}
          ref={(node) => {
            pieces.current[index] = node;
          }}
          position={[
            piece.position[0],
            -1.8,
            piece.position[2],
          ]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={piece.size} />

          <meshStandardMaterial
            color={
              index === 2
                ? "#8a806d"
                : "#706759"
            }
            roughness={1}
          />
        </mesh>
      ))}

      <mesh position={[0, 1.7, 0.31]}>
        <boxGeometry args={[0.62, 0.08, 0.03]} />

        <meshStandardMaterial
          color="#c6aa70"
          emissive="#4f3716"
          emissiveIntensity={0.35}
        />
      </mesh>
    </group>
  );
}

function FirstBlossom() {
  const blossom = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!blossom.current) return;

    const elapsed = clock.getElapsedTime();
    const cycle = cycleProgress(elapsed);

    const response =
      smooth((cycle - 0.61) / 0.12) *
      (1 - smooth((cycle - 0.975) / 0.018));

    const pulse =
      1 + Math.sin(elapsed * 2.4) * 0.07;

    blossom.current.scale.setScalar(
      Math.max(0.001, response * pulse)
    );

    blossom.current.rotation.y += 0.003;

    if (light.current) {
      light.current.intensity = response * 7;
    }
  });

  return (
    <group
      ref={blossom}
      position={[4.95, 9.25, -6.05]}
      scale={0}
    >
      {[0, 1, 2, 3, 4].map((index) => {
        const angle = (index / 5) * Math.PI * 2;

        return (
          <mesh
            key={index}
            position={[
              Math.cos(angle) * 0.19,
              Math.sin(angle) * 0.19,
              0,
            ]}
            rotation={[0, 0, angle]}
          >
            <sphereGeometry args={[0.15, 14, 10]} />

            <meshStandardMaterial
              color="#f7f3e9"
              emissive="#cbbd91"
              emissiveIntensity={0.85}
              roughness={0.72}
            />
          </mesh>
        );
      })}

      <mesh position={[0, 0, 0.04]}>
        <sphereGeometry args={[0.09, 14, 14]} />

        <meshStandardMaterial
          color="#d9b765"
          emissive="#a16f25"
          emissiveIntensity={1.3}
        />
      </mesh>

      <pointLight
        ref={light}
        color="#fff0bc"
        intensity={0}
        distance={4}
      />
    </group>
  );
}

export default function FirstVoiceRitual() {
  return (
    <>
      <FirstPoetHalo />
      <PageFragment />
      <BookAcceptance />
      <WordGate />
      <FirstBlossom />
    </>
  );
}
