import type { Metadata } from "next";

import {
  CONFIRMED_POETIC_PRESENCES,
  FOUNDATIONAL_EDITION_YEAR,
  TOTAL_PRESENCES,
} from "../data/poeticPresences";

import PresenceHorizon from "./components/PresenceHorizon";

export const metadata: Metadata = {
  title: "Las 60 Presencias · Poema Universal",
  description:
    "Sesenta voces, sesenta territorios y un horizonte humano compartido.",
};

export default function PresenciasPage() {
  return (
    <PresenceHorizon
      presences={CONFIRMED_POETIC_PRESENCES}
      total={TOTAL_PRESENCES}
      year={FOUNDATIONAL_EDITION_YEAR}
    />
  );
}
