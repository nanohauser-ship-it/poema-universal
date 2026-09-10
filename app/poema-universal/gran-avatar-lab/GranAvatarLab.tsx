"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Canvas } from "@react-three/fiber";

import {
  Bounds,
  OrbitControls,
  useAnimations,
  useGLTF,
} from "@react-three/drei";

import * as THREE from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

const BASE =
  "/poema-universal/gran-avatar/animations/";

const animations = [
  {
    id: "01",
    short: "01a08b9c",
    file:
      "Meshy_AI_Gilded_Apotheosis_biped_Animation_01a08b9c-c56b-716d-896e-45367ceafe0f_withSkin.glb",
  },
  {
    id: "02",
    short: "01a08b9e",
    file:
      "Meshy_AI_Gilded_Apotheosis_biped_Animation_01a08b9e-8770-75db-a188-d4c16774a1d3_withSkin.glb",
  },
  {
    id: "03",
    short: "01a08ba7",
    file:
      "Meshy_AI_Gilded_Apotheosis_biped_Animation_01a08ba7-b021-7442-b133-a4c4c34e1453_withSkin.glb",
  },
  {
    id: "04",
    short: "01a08bb5",
    file:
      "Meshy_AI_Gilded_Apotheosis_biped_Animation_01a08bb5-e62f-70bf-a1f4-4979b1d240c4_withSkin.glb",
  },
  {
    id: "05",
    short: "01a08bb8",
    file:
      "Meshy_AI_Gilded_Apotheosis_biped_Animation_01a08bb8-468c-7416-94b7-8b551e7074f4_withSkin.glb",
  },
  {
    id: "06",
    short: "01a08bbb",
    file:
      "Meshy_AI_Gilded_Apotheosis_biped_Animation_01a08bbb-85e5-765f-a858-362b8e7316f7_withSkin.glb",
  },
  {
    id: "07",
    short: "01a08bbf",
    file:
      "Meshy_AI_Gilded_Apotheosis_biped_Animation_01a08bbf-d589-711a-8c19-149b40117699_withSkin.glb",
  },
  {
    id: "08",
    short: "01a08bc7",
    file:
      "Meshy_AI_Gilded_Apotheosis_biped_Animation_01a08bc7-4986-7304-92f9-588cc56f082c_withSkin.glb",
  },
  {
    id: "09",
    short: "Walking",
    file:
      "Meshy_AI_Gilded_Apotheosis_biped_Animation_Walking_withSkin.glb",
  },
  {
    id: "10",
    short: "Running",
    file:
      "Meshy_AI_Gilded_Apotheosis_biped_Animation_Running_withSkin.glb",
  },
];

function Avatar({
  url,
  paused,
  loop,
  speed,
}: {
  url: string;
  paused: boolean;
  loop: boolean;
  speed: number;
}) {
  const group = useRef<THREE.Group>(null);

  const gltf = useGLTF(url);

  const scene = useMemo(
    () => clone(gltf.scene),
    [gltf.scene],
  );

  const { actions, names } =
    useAnimations(gltf.animations, group);

  useEffect(() => {
    const name =
      names.find((name) =>
        name.toLowerCase().includes("baselayer")
      ) ??
      names[0];

    if (!name) return;

    const action = actions[name];

    if (!action) return;

    action.reset();

    action.enabled = true;
    action.clampWhenFinished = true;
    action.timeScale = speed;

    action.setLoop(
      loop ? THREE.LoopRepeat : THREE.LoopOnce,
      loop ? Infinity : 1,
    );

    action.play();

    return () => {
      action.stop();
    };
  }, [actions, names, loop]);

  useEffect(() => {
    const name =
      names.find((name) =>
        name.toLowerCase().includes("baselayer")
      ) ??
      names[0];

    if (!name) return;

    const action = actions[name];

    if (!action) return;

    action.paused = paused;
    action.timeScale = speed;
  }, [actions, names, paused, speed]);

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

function Scene({
  url,
  paused,
  loop,
  speed,
}: {
  url: string;
  paused: boolean;
  loop: boolean;
  speed: number;
}) {
  return (
    <>
      <ambientLight intensity={1.4} />

      <directionalLight
        position={[4, 7, 5]}
        intensity={3}
      />

      <directionalLight
        position={[-4, 3, -3]}
        intensity={1.5}
      />

      <Bounds
        fit
        clip
        observe
        margin={1.75}
      >
        <Avatar
          url={url}
          paused={paused}
          loop={loop}
          speed={speed}
        />
      </Bounds>

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
      />

      <gridHelper
        args={[20, 20]}
        position={[0, 0, 0]}
      />
    </>
  );
}

export default function GranAvatarLab() {
  const [selected, setSelected] =
    useState(animations[0]);

  const [paused, setPaused] =
    useState(false);

  const [loop, setLoop] =
    useState(true);

  const [speed, setSpeed] =
    useState(1);

  const [replayKey, setReplayKey] =
    useState(0);

  const url = BASE + selected.file;

  return (
    <main
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: "#090909",
        color: "#eee8db",
        fontFamily:
          "Inter, system-ui, sans-serif",
        display: "grid",
        gridTemplateColumns:
          "320px minmax(0, 1fr)",
      }}
    >
      <aside
        style={{
          padding: "28px 22px",
          borderRight:
            "1px solid rgba(255,255,255,.1)",
          overflowY: "auto",
          background:
            "rgba(8,8,8,.96)",
        }}
      >
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 24,
            letterSpacing: ".05em",
          }}
        >
          GRAN AVATAR
        </div>

        <div
          style={{
            opacity: 0.5,
            fontSize: 11,
            letterSpacing: ".22em",
            marginTop: 5,
            marginBottom: 26,
          }}
        >
          ANIMATION LAB
        </div>

        <div
          style={{
            display: "grid",
            gap: 7,
          }}
        >
          {animations.map((item) => {
            const active =
              selected.file === item.file;

            return (
              <button
                key={item.file}
                onClick={() => {
                  setSelected(item);
                  setPaused(false);
                  setReplayKey((v) => v + 1);
                }}
                style={{
                  border: active
                    ? "1px solid rgba(231,194,122,.8)"
                    : "1px solid rgba(255,255,255,.1)",
                  background: active
                    ? "rgba(231,194,122,.12)"
                    : "rgba(255,255,255,.025)",
                  color: active
                    ? "#f2d59c"
                    : "#d3cec4",
                  padding: "12px 11px",
                  textAlign: "left",
                  cursor: "pointer",
                  borderRadius: 5,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span
                  style={{
                    opacity: 0.45,
                    width: 23,
                  }}
                >
                  {item.id}
                </span>

                <span>▶</span>

                <span
                  style={{
                    fontFamily:
                      "ui-monospace, monospace",
                    fontSize: 12,
                  }}
                >
                  {item.short}
                </span>
              </button>
            );
          })}
        </div>

        <div
          style={{
            height: 1,
            background:
              "rgba(255,255,255,.1)",
            margin: "24px 0",
          }}
        />

        <div
          style={{
            display: "grid",
            gap: 9,
          }}
        >
          <button
            onClick={() =>
              setPaused((v) => !v)
            }
            style={controlStyle}
          >
            {paused ? "▶ Play" : "Ⅱ Pause"}
          </button>

          <button
            onClick={() => {
              setPaused(false);
              setReplayKey((v) => v + 1);
            }}
            style={controlStyle}
          >
            ↺ Replay
          </button>

          <button
            onClick={() =>
              setLoop((v) => !v)
            }
            style={controlStyle}
          >
            Loop · {loop ? "ON" : "OFF"}
          </button>
        </div>

        <div
          style={{
            marginTop: 24,
            fontSize: 11,
            opacity: 0.55,
            letterSpacing: ".12em",
          }}
        >
          VELOCIDAD
        </div>

        <div
          style={{
            display: "flex",
            gap: 6,
            marginTop: 9,
          }}
        >
          {[0.5, 0.75, 1, 1.25, 1.5].map(
            (value) => (
              <button
                key={value}
                onClick={() =>
                  setSpeed(value)
                }
                style={{
                  ...smallButtonStyle,
                  border:
                    speed === value
                      ? "1px solid #d9b870"
                      : "1px solid rgba(255,255,255,.12)",
                  color:
                    speed === value
                      ? "#f0d395"
                      : "#aaa",
                }}
              >
                {value}×
              </button>
            ),
          )}
        </div>

        <div
          style={{
            marginTop: 25,
            opacity: 0.35,
            fontSize: 11,
            lineHeight: 1.6,
          }}
        >
          Arrastra para rotar.
          <br />
          Rueda para acercarte.
          <br />
          Identifica cada movimiento.
        </div>
      </aside>

      <section
        style={{
          position: "relative",
          minWidth: 0,
        }}
      >
        <Canvas
          camera={{
            position: [0, 1.5, 7],
            fov: 40,
          }}
          gl={{
            antialias: true,
            alpha: false,
          }}
        >
          <color
            attach="background"
            args={["#10100f"]}
          />

          <Suspense fallback={null}>
            <Scene
              key={`${selected.file}-${replayKey}`}
              url={url}
              paused={paused}
              loop={loop}
              speed={speed}
            />
          </Suspense>
        </Canvas>

        <div
          style={{
            position: "absolute",
            left: 30,
            bottom: 26,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 22,
            }}
          >
            {selected.id} · {selected.short}
          </div>

          <div
            style={{
              marginTop: 5,
              opacity: 0.45,
              fontSize: 11,
              letterSpacing: ".18em",
            }}
          >
            POEMA UNIVERSAL · GRAN AVATAR
          </div>
        </div>
      </section>
    </main>
  );
}

const controlStyle: React.CSSProperties = {
  border:
    "1px solid rgba(255,255,255,.12)",
  background:
    "rgba(255,255,255,.035)",
  color: "#ddd6c9",
  borderRadius: 5,
  padding: "11px 12px",
  cursor: "pointer",
  textAlign: "left",
};

const smallButtonStyle: React.CSSProperties = {
  background: "transparent",
  border:
    "1px solid rgba(255,255,255,.12)",
  borderRadius: 4,
  padding: "6px 7px",
  cursor: "pointer",
};
