"use client";

import { useEffect, useRef, useState } from "react";

import { SceneEngine } from "../engine/SceneEngine";
import type {
  BorderlessStageId,
  HumanCutoutStatus,
  HumanPresencePreset,
  SceneMode,
  WebcamStatus,
} from "../types/audiovisual";
import { BorderlessControls } from "./BorderlessControls";
import { LabControls } from "./LabControls";
import { PerformanceControls } from "./PerformanceControls";

export default function AudiovisualLab3D() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<SceneEngine | null>(null);
  const webcamRequestRef = useRef(0);
  const cutoutRequestRef = useRef(0);
  const [mode, setMode] = useState<SceneMode>("gallery");
  const [webcamStatus, setWebcamStatus] = useState<WebcamStatus>("idle");
  const [cutoutStatus, setCutoutStatus] =
    useState<HumanCutoutStatus>("idle");
  const [humanPreset, setHumanPreset] =
    useState<HumanPresencePreset>("PRESENCE");
  const [borderlessStage, setBorderlessStage] =
    useState<BorderlessStageId>("ROOM");

  useEffect(() => {
    const mount = containerRef.current;

    if (!mount) {
      return;
    }

    const engine = new SceneEngine(mount);
    engineRef.current = engine;
    engine.start("gallery");

    return () => {
      webcamRequestRef.current += 1;
      cutoutRequestRef.current += 1;
      engine.dispose();

      if (engineRef.current === engine) {
        engineRef.current = null;
      }
    };
  }, []);

  const changeMode = (nextMode: SceneMode): void => {
    if (nextMode !== "performance") {
      webcamRequestRef.current += 1;
      cutoutRequestRef.current += 1;
      setWebcamStatus("idle");
      setCutoutStatus("idle");
      setHumanPreset("PRESENCE");
    }

    setBorderlessStage("ROOM");
    setMode(nextMode);
    engineRef.current?.setExperience(nextMode);
  };

  const enableWebcam = async (): Promise<void> => {
    const engine = engineRef.current;

    if (!engine) {
      setWebcamStatus("error");
      return;
    }

    const requestId = ++webcamRequestRef.current;
    cutoutRequestRef.current += 1;
    setCutoutStatus("idle");
    setWebcamStatus("requesting");
    const status = await engine.enableWebcam();

    if (webcamRequestRef.current === requestId) {
      setWebcamStatus(status);
    }
  };

  const disableWebcam = (): void => {
    webcamRequestRef.current += 1;
    cutoutRequestRef.current += 1;
    engineRef.current?.disableWebcam();
    setWebcamStatus("idle");
    setCutoutStatus("idle");
  };

  const enableSemanticCutout = async (): Promise<void> => {
    const engine = engineRef.current;

    if (!engine) {
      setCutoutStatus("error");
      return;
    }

    const requestId = ++cutoutRequestRef.current;
    setCutoutStatus("loading");
    const status = await engine.enableHumanSegmentation();

    if (cutoutRequestRef.current === requestId) {
      setCutoutStatus(status);
    }
  };

  const disableCutout = (): void => {
    cutoutRequestRef.current += 1;
    engineRef.current?.disableHumanCutout();
    setCutoutStatus("idle");
  };

  const changeHumanPreset = (preset: HumanPresencePreset): void => {
    setHumanPreset(preset);
    engineRef.current?.setHumanPreset(preset);
  };

  const changeBorderlessStage = (stage: BorderlessStageId): void => {
    if (engineRef.current?.setBorderlessStage(stage)) {
      setBorderlessStage(stage);
    }
  };

  return (
    <section className="relative h-screen min-h-[720px] overflow-hidden bg-black text-white">
      <div ref={containerRef} className="absolute inset-0" />

      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-6 sm:p-8">
        <div>
          <p className="text-[8px] uppercase tracking-[0.46em] text-[#d4ad6d]">
            Poema Universal
          </p>
          <h1 className="mt-3 font-serif text-3xl tracking-[-0.04em] sm:text-5xl">
            Sala Madre
          </h1>
          <p className="mt-3 text-[8px] uppercase tracking-[0.26em] text-white/30">
            Arquitectura audiovisual
          </p>
        </div>

        <p className="text-[7px] uppercase tracking-[0.24em] text-white/30">
          Arrastra para mirar
        </p>
      </header>

      <PerformanceControls
        mode={mode}
        webcamStatus={webcamStatus}
        cutoutStatus={cutoutStatus}
        humanPreset={humanPreset}
        onEnableWebcam={() => void enableWebcam()}
        onDisableWebcam={disableWebcam}
        onEnableSemanticCutout={() => void enableSemanticCutout()}
        onDisableCutout={disableCutout}
        onHumanPresetChange={changeHumanPreset}
      />

      <BorderlessControls
        mode={mode}
        stage={borderlessStage}
        onStageChange={changeBorderlessStage}
      />

      <LabControls mode={mode} onModeChange={changeMode} />
    </section>
  );
}
