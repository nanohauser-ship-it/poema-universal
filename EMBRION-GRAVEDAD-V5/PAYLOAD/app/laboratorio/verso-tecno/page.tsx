import type { Metadata } from "next";
import OrganismoV47 from "./OrganismoV47";

export const metadata: Metadata = {
  title: "Embrión V5 · Campo de gravedad simbólica",
  description:
    "Un organismo de escritura que ilumina palabras, símbolos, materias e imágenes alrededor de un núcleo poético.",
};

export default function OrganismoPage() {
  return <OrganismoV47 />;
}
