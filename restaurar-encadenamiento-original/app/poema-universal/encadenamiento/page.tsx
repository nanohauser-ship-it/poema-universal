import type { Metadata } from "next";

import Encadenamiento from "./Encadenamiento";

export const metadata: Metadata = {
  title: "Habitación del Encadenamiento · Poema Universal",
  description:
    "Una columna vertebral construida con los poemas donados por institutos de todo el mundo.",
};

export default function EncadenamientoPage() {
  return <Encadenamiento />;
}
