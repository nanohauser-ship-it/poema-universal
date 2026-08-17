"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  EmotionalState,
  SoulExpression,
} from "./organismo";

export type BroadcastMode =
  | "room"
  | "vertical"
  | "studio"
  | "master";

export type LiveSessionState = {
  live: boolean;

  voiceLevel: number;
  voiceActive: boolean;

  artisticPulse: number;
  emotionalState: EmotionalState;
  organismIntensity: number;

  sceneIndex: number;
  sceneTitle: string;

  guestActive: boolean;

  currentExpression:
    SoulExpression | null;

  dominantWords: string[];

  broadcastMode: BroadcastMode;
};

type LiveSessionContextValue = {
  state: LiveSessionState;

  setLive: (value: boolean) => void;
  setVoiceLevel: (value: number) => void;
  setVoiceActive: (value: boolean) => void;

  setArtisticPulse: (value: number) => void;
  setEmotionalState:
    (value: EmotionalState) => void;
  setOrganismIntensity:
    (value: number) => void;

  setSceneIndex: (value: number) => void;
  setSceneTitle: (value: string) => void;

  setGuestActive: (value: boolean) => void;

  setCurrentExpression:
    (value: SoulExpression | null) => void;

  setDominantWords:
    (value: string[]) => void;

  setBroadcastMode:
    (value: BroadcastMode) => void;
};

const LiveSessionContext =
  createContext<
    LiveSessionContextValue | null
  >(null);

export function LiveSessionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [live, setLive] =
    useState(true);

  const [voiceLevel, setVoiceLevel] =
    useState(0);

  const [voiceActive, setVoiceActive] =
    useState(false);

  const [
    artisticPulse,
    setArtisticPulse,
  ] = useState(68);

  const [
    emotionalState,
    setEmotionalState,
  ] =
    useState<EmotionalState>("reposo");

  const [
    organismIntensity,
    setOrganismIntensity,
  ] = useState(0);

  const [
    sceneIndex,
    setSceneIndex,
  ] = useState(0);

  const [
    sceneTitle,
    setSceneTitle,
  ] = useState("");

  const [
    guestActive,
    setGuestActive,
  ] = useState(false);

  const [
    currentExpression,
    setCurrentExpression,
  ] =
    useState<SoulExpression | null>(null);

  const [
    dominantWords,
    setDominantWords,
  ] = useState<string[]>([]);

  const [
    broadcastMode,
    setBroadcastMode,
  ] =
    useState<BroadcastMode>("room");

  const state =
    useMemo<LiveSessionState>(
      () => ({
        live,

        voiceLevel,
        voiceActive,

        artisticPulse,
        emotionalState,
        organismIntensity,

        sceneIndex,
        sceneTitle,

        guestActive,

        currentExpression,

        dominantWords,

        broadcastMode,
      }),
      [
        live,
        voiceLevel,
        voiceActive,
        artisticPulse,
        emotionalState,
        organismIntensity,
        sceneIndex,
        sceneTitle,
        guestActive,
        currentExpression,
        dominantWords,
        broadcastMode,
      ],
    );

  return (
    <LiveSessionContext.Provider
      value={{
        state,

        setLive,
        setVoiceLevel,
        setVoiceActive,

        setArtisticPulse,
        setEmotionalState,
        setOrganismIntensity,

        setSceneIndex,
        setSceneTitle,

        setGuestActive,

        setCurrentExpression,

        setDominantWords,

        setBroadcastMode,
      }}
    >
      {children}
    </LiveSessionContext.Provider>
  );
}

export function useLiveSession() {
  const context =
    useContext(LiveSessionContext);

  if (!context) {
    throw new Error(
      "useLiveSession debe usarse dentro de LiveSessionProvider",
    );
  }

  return context;
}
