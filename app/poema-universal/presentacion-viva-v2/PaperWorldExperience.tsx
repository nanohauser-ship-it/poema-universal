"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useState } from "react";
import styles from "./paper-world.module.css";
import { PaperWorld } from "./world/PaperWorld";

export function PaperWorldExperience() {
  const [filmMode, setFilmMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFilmMode(params.get("film") === "1");
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.canvas}>
        <Canvas
          shadows
          dpr={[1, 1.75]}
          camera={{ fov: 38, near: 0.1, far: 180, position: [0, 2.1, 10] }}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        >
          <color attach="background" args={["#d8c7ae"]} />
          <fog attach="fog" args={["#d8c7ae", 22, 90]} />
          <ambientLight intensity={1.4} />
          <directionalLight
            castShadow
            position={[-8, 12, 8]}
            intensity={3.2}
            color="#fff0d2"
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[5, 4, 3]} intensity={1.4} color="#ffbc73" />
<Suspense fallback={null}>
            <PaperWorld filmMode={filmMode} />
            <Environment preset="apartment" environmentIntensity={0.45} />
          </Suspense>
        </Canvas>
      </div>

      {!filmMode && (
        <>
          <header className={styles.header}>
            <div className={styles.kicker}>POEMA UNIVERSAL</div>
            <div className={styles.sub}>EDICIÓN FUNDACIONAL · 10 / 60</div>
          </header>

          <div className={styles.hint}>
            DESPLÁZATE PARA RECORRER EL MUNDO · F PARA PANTALLA COMPLETA
          </div>
        </>
      )}

      <div className={styles.scroll} />
    </main>
  );
}
