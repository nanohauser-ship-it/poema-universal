"use client";

import {
  Float,
  OrbitControls,
  Sparkles,
  useGLTF,
} from "@react-three/drei";

import {
  Canvas,
  useFrame,
} from "@react-three/fiber";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  Box3,
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Vector3,
} from "three";

export type AssemblyDomain =
  | "memory"
  | "desire"
  | "wound"
  | "matter";

type AssemblySceneProps = {
  activeDomain:
    | AssemblyDomain
    | null;
  ritualActive: boolean;
};

type CreatureProps = {
  path: string;
  domain: AssemblyDomain;
  position: [number, number, number];
  rotation: [number, number, number];
  activeDomain:
    | AssemblyDomain
    | null;
  ritualActive: boolean;
  targetHeight?: number;
};

const domainColors:
  Record<AssemblyDomain, string> = {
  memory: "#91a8d0",
  desire: "#d5a14b",
  wound: "#9b74c4",
  matter: "#9baa77",
};

function normalizeModel(
  model: Object3D,
  targetHeight: number
) {
  const box = new Box3().setFromObject(model);
  const size = new Vector3();
  const center = new Vector3();

  box.getSize(size);
  box.getCenter(center);

  if (
    !Number.isFinite(size.y) ||
    size.y <= 0
  ) {
    return;
  }

  const scale =
    targetHeight / size.y;

  model.scale.setScalar(scale);

  const scaledBox =
    new Box3().setFromObject(model);

  const scaledCenter =
    new Vector3();

  scaledBox.getCenter(
    scaledCenter
  );

  model.position.x -=
    scaledCenter.x;

  model.position.z -=
    scaledCenter.z;

  model.position.y -=
    scaledBox.min.y;
}

function RealCreature({
  path,
  domain,
  position,
  rotation,
  activeDomain,
  ritualActive,
  targetHeight = 1.65,
}: CreatureProps) {
  const gltf = useGLTF(path);

  const group =
    useRef<Group>(null);

  const model = useMemo(() => {
    const cloned =
      gltf.scene.clone(true);

    normalizeModel(
      cloned,
      targetHeight
    );

    cloned.traverse(
      (object) => {
        if (
          object instanceof Mesh
        ) {
          object.castShadow = true;
          object.receiveShadow = true;

          if (
            object.material instanceof
            MeshStandardMaterial
          ) {
            object.material =
              object.material.clone();

            object.material.roughness =
              Math.min(
                0.9,
                object.material
                  .roughness + 0.08
              );
          }
        }
      }
    );

    return cloned;
  }, [
    gltf.scene,
    targetHeight,
  ]);

  const active =
    activeDomain === domain;

  useEffect(() => {
    model.traverse(
      (object) => {
        if (
          object instanceof Mesh &&
          object.material instanceof
            MeshStandardMaterial
        ) {
          object.material.emissive.set(
            domainColors[domain]
          );

          object.material
            .emissiveIntensity =
            active
              ? 0.2
              : ritualActive
                ? 0.045
                : 0.012;
        }
      }
    );
  }, [
    model,
    domain,
    active,
    ritualActive,
  ]);

  useFrame(({ clock }) => {
    if (!group.current) {
      return;
    }

    const baseScale =
      active ? 1.07 : 1;

    const breathing =
      Math.sin(
        clock.elapsedTime *
          0.72 +
          position[0]
      ) * 0.008;

    group.current.scale.setScalar(
      baseScale + breathing
    );

    group.current.position.y =
      position[1] +
      Math.sin(
        clock.elapsedTime *
          0.55 +
          position[2]
      ) *
        0.022;
  });

  return (
    <group
      ref={group}
      position={position}
      rotation={rotation}
    >
      <Float
        speed={0.8525}
        rotationIntensity={0.03375}
        floatIntensity={0.0944}
      >
        <primitive
          object={model}
        />
      </Float>

      <pointLight
        position={[0, 1.1, 0.5]}
        intensity={
          active
            ? 3.2
            : ritualActive
              ? 0.7
              : 0.22
        }
        distance={4.2}
        color={
          domainColors[domain]
        }
      />
    </group>
  );
}

function CentralPoem({
  ritualActive,
}: {
  ritualActive: boolean;
}) {
  const group =
    useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) {
      return;
    }

    group.current.position.y =
      0.02 +
      Math.sin(
        clock.elapsedTime * 0.7
      ) *
        0.025;

    group.current.rotation.y =
      Math.sin(
        clock.elapsedTime * 0.22
      ) *
      0.035;
  });

  return (
    <group ref={group}>
      <mesh
        position={[0, -0.06, 0]}
      >
        <cylinderGeometry
          args={[
            0.9,
            1.04,
            0.13,
            64,
          ]}
        />

        <meshStandardMaterial
          color="#211a12"
          metalness={0.35}
          roughness={0.72}
        />
      </mesh>

      <mesh
        position={[0, 0.22, 0]}
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
      >
        <planeGeometry
          args={[1.2, 1.52]}
        />

        <meshStandardMaterial
          color={
            ritualActive
              ? "#f7e4bd"
              : "#c2a87b"
          }
          emissive={
            ritualActive
              ? "#b27528"
              : "#493219"
          }
          emissiveIntensity={
            ritualActive
              ? 0.65
              : 0.18
          }
          roughness={0.86}
        />
      </mesh>

      <pointLight
        position={[0, 0.7, 0]}
        intensity={
          ritualActive
            ? 4.2
            : 1.5
        }
        distance={5.5}
        color="#edb96d"
      />
    </group>
  );
}

function AssemblyWorld({
  activeDomain,
  ritualActive,
}: AssemblySceneProps) {
  return (
    <>
      <ambientLight
        intensity={1.05}
      />

      <hemisphereLight
        intensity={1.35}
        color="#f7e2bc"
        groundColor="#302319"
      />

      <directionalLight
        position={[5, 7, 6]}
        intensity={2.7}
        color="#f8e7c8"
        castShadow
      />

      <directionalLight
        position={[-5, 3, -4]}
        intensity={1.3}
        color="#8c79bd"
      />

      <spotLight
        position={[0, 7, 1]}
        intensity={4.6}
        angle={0.48}
        penumbra={0.94}
        distance={17}
        color="#eab468"
      />

      <Sparkles
        count={
          ritualActive
            ? 120
            : 58
        }
        scale={[9, 5, 9]}
        size={1.6}
        speed={
          ritualActive
            ? 0.3
            : 0.12
        }
        opacity={0.38}
        color="#d8aa5f"
      />

      <CentralPoem
        ritualActive={
          ritualActive
        }
      />

      <Suspense fallback={null}>
        <RealCreature
          path="/models/bestiario/asamblea-web/guardiana-alas-cuerda-web.glb"
          domain="memory"
          position={[
            -2.15,
            -0.5,
            -1.42,
          ]}
          rotation={[
            0,
            0.62,
            0,
          ]}
          activeDomain={
            activeDomain
          }
          ritualActive={
            ritualActive
          }
          targetHeight={1.72}
        />

        <RealCreature
          path="/models/bestiario/asamblea-web/cordero-llama-fria-web.glb"
          domain="desire"
          position={[
            2.15,
            -0.5,
            -1.42,
          ]}
          rotation={[
            0,
            -0.62,
            0,
          ]}
          activeDomain={
            activeDomain
          }
          ritualActive={
            ritualActive
          }
          targetHeight={1.6}
        />

        <RealCreature
          path="/models/bestiario/asamblea-web/esfinge-del-umbral-web.glb"
          domain="wound"
          position={[
            -2.15,
            -0.5,
            1.45,
          ]}
          rotation={[
            0,
            2.48,
            0,
          ]}
          activeDomain={
            activeDomain
          }
          ritualActive={
            ritualActive
          }
          targetHeight={1.66}
        />

        <RealCreature
          path="/models/bestiario/asamblea-web/presencia-elefantina-amarilla-web.glb"
          domain="matter"
          position={[
            2.15,
            -0.5,
            1.45,
          ]}
          rotation={[
            0,
            -2.48,
            0,
          ]}
          activeDomain={
            activeDomain
          }
          ritualActive={
            ritualActive
          }
          targetHeight={1.68}
        />
      </Suspense>

      <mesh
        position={[0, -0.53, 0]}
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
        receiveShadow
      >
        <circleGeometry
          args={[4.45, 96]}
        />

        <meshStandardMaterial
          color="#19130e"
          metalness={0.28}
          roughness={0.8}
        />
      </mesh>

      <mesh
        position={[0, -0.5, 0]}
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
      >
        <ringGeometry
          args={[
            2.85,
            3.02,
            96,
          ]}
        />

        <meshBasicMaterial
          color="#a77732"
          transparent
          opacity={
            ritualActive
              ? 0.72
              : 0.28
          }
        />
      </mesh>

      <OrbitControls
        enablePan={false}
        minDistance={6.2}
        maxDistance={9}
        minPolarAngle={0.7}
        maxPolarAngle={1.28}
        target={[0, 0.25, 0]}
        autoRotate={
          ritualActive
        }
        autoRotateSpeed={0.18}
      />
    </>
  );
}

export default function AssemblyScene(
  props: AssemblySceneProps
) {
  return (
    <Canvas
      shadows
      camera={{
        position: [
          0,
          5.1,
          7.7,
        ],
        fov: 38,
      }}
      dpr={[1, 1.35]}
      gl={{
        antialias: true,
        alpha: true,
      }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure =
          1.48;
      }}
    >
      <AssemblyWorld {...props} />
    </Canvas>
  );
}

useGLTF.preload(
  "/models/bestiario/asamblea-web/guardiana-alas-cuerda-web.glb"
);

useGLTF.preload(
  "/models/bestiario/asamblea-web/cordero-llama-fria-web.glb"
);

useGLTF.preload(
  "/models/bestiario/asamblea-web/esfinge-del-umbral-web.glb"
);

useGLTF.preload(
  "/models/bestiario/asamblea-web/presencia-elefantina-amarilla-web.glb"
);
