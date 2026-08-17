import type { Metadata } from "next";
import VersoTecno from "./VersoTecno";

export const metadata: Metadata = {
  title: "Verso → Techno · Consola poético-industrial",
  description:
    "Una máquina de composición que transforma arquitectura literaria en techno.",
};

export default function VersoTecnoPage() {
  return <VersoTecno />;
}
