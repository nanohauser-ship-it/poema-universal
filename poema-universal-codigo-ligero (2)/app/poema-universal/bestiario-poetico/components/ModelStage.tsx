"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls, useGLTF } from "@react-three/drei";
import type { Group } from "three";

function ProceduralPresence() {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.18;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.06;
  });

  return (
    <group ref={group}>
      <mesh castShadow receiveShadow>
        <icosahedronGeometry args={[1.05, 3]} />
        <meshStandardMaterial
          color="#a99a7d"
          roughness={0.46}
          metalness={0.4}
          emissive="#211b12"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2.3, 0.2, 0]}>
        <torusGeometry args={[1.42, 0.035, 16, 160]} />
        <meshStandardMaterial color="#c7a868" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh rotation={[0.2, Math.PI / 2.1, 0.4]}>
        <torusGeometry args={[1.25, 0.022, 16, 160]} />
        <meshStandardMaterial color="#6e6554" metalness={0.75} roughness={0.3} />
      </mesh>
    </group>
  );
}

function GLBCreature({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={cloned} scale={1.25} position={[0, -1.2, 0]} />;
}

export function ModelStage({ modelUrl }: { modelUrl?: string }) {
  return (
    <div style={{ width: "100%", height: "100%", minHeight: 440 }}>
      <Canvas shadows camera={{ position: [0, 0.4, 4.7], fov: 38 }}>
        <color attach="background" args={["#080807"]} />
        <fog attach="fog" args={["#080807", 5.5, 11]} />
        <ambientLight intensity={0.55} />
        <directionalLight
          castShadow
          intensity={3.2}
          position={[3, 5, 4]}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight intensity={14} position={[-3, 1, -2]} color="#7c6840" />
        <Suspense fallback={<ProceduralPresence />}>
          {modelUrl ? <GLBCreature url={modelUrl} /> : <ProceduralPresence />}
          <Environment preset="warehouse" />
        </Suspense>
        <ContactShadows position={[0, -1.45, 0]} opacity={0.58} scale={8} blur={2.4} far={4} />
        <OrbitControls
          enablePan={false}
          minDistance={3.1}
          maxDistance={7}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.65}
        />
      </Canvas>
    </div>
  );
}
