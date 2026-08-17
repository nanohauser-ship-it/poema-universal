import type { Metadata } from "next";
import OrganismoV47 from "./OrganismoV47";

export const metadata: Metadata = {
  title: "Embrión V6.1 · Membrana de las palabras",
  description:
    "Un organismo de escritura que ilumina, relaciona y conserva palabras, símbolos, materias e imágenes alrededor de un núcleo poético.",
};

export default function OrganismoPage() {
  return <OrganismoV47 />;
}
