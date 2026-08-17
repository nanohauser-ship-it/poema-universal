import type { Metadata } from "next";

import { BestiarioPoetico } from "./components/BestiarioPoetico";

export const metadata: Metadata = {
  title: "Bestiario Poético — Poema Universal",
  description: "Una herramienta que revela la criatura simbólica latente en cada poema."
};

export default function BestiarioPoeticoPage() {
  return <BestiarioPoetico />;
}
