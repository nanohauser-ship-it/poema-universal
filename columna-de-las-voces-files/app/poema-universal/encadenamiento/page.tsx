import type { Metadata } from "next";

import Encadenamiento from "./Encadenamiento";

export const metadata: Metadata = {
  title: "Columna de las Voces | Poema Universal",
  description:
    "Una columna vertebral viva donde las voces se encadenan y construyen una obra común.",
};

export default function EncadenamientoPage() {
  return <Encadenamiento />;
}
