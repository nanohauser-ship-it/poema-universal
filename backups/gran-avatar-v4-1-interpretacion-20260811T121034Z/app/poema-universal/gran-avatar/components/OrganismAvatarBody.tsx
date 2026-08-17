"use client";

import Image from "next/image";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

import { silenceAvatarVoice } from "../lib/avatarVoiceSignal";
import type {
  AvatarBodyHandle,
  AvatarLifeState,
  AvatarPresenceState,
} from "../types";
import styles from "../gran-avatar.module.css";
import PoeticOrganism from "./PoeticOrganism";

type OrganismAvatarBodyProps = {
  portraitUrl: string;
  state: AvatarPresenceState;
  onLifeStateChange?: (state: AvatarLifeState) => void;
};

const OrganismAvatarBody = forwardRef<
  AvatarBodyHandle,
  OrganismAvatarBodyProps
>(function OrganismAvatarBody(
  { portraitUrl, state, onLifeStateChange },
  ref,
) {
  const [awake, setAwake] = useState(true);

  const wake = useCallback(async () => {
    setAwake(true);
    onLifeStateChange?.("organism");
    return true;
  }, [onLifeStateChange]);

  const sleep = useCallback(async () => {
    silenceAvatarVoice();
    setAwake(false);
    onLifeStateChange?.("sleeping");
  }, [onLifeStateChange]);

  useImperativeHandle(
    ref,
    () => ({
      interrupt: silenceAvatarVoice,
      sleep,
      // La voz local se reproduce en la experiencia principal. Al devolver
      // false conservamos sus controles, progreso y accesibilidad.
      speak: async () => false,
      wake,
    }),
    [sleep, wake],
  );

  useEffect(() => {
    onLifeStateChange?.("organism");
    return () => {
      silenceAvatarVoice();
      onLifeStateChange?.("sleeping");
    };
  }, [onLifeStateChange]);

  return (
    <div
      className={styles.avatarBody}
      data-live={awake ? "organism" : "sleeping"}
      data-state={state}
    >
      <Image
        className={styles.organismPortraitFallback}
        src={portraitUrl}
        alt="Presencia humana del Gran Avatar en una sala oscura"
        fill
        priority
        sizes="(max-width: 980px) 100vw, 62vw"
      />

      {awake ? (
        <PoeticOrganism portraitUrl={portraitUrl} state={state} />
      ) : null}

      <div className={styles.organismAura} aria-hidden="true" />
      <div className={styles.avatarVignette} aria-hidden="true" />
    </div>
  );
});

OrganismAvatarBody.displayName = "OrganismAvatarBody";

export default OrganismAvatarBody;
