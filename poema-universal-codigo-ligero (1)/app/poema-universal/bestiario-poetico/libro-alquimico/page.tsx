import type { Metadata } from "next";

import {
  ALQUIMIC_PLATES,
} from "./laminas";

import LibroAlquimicoClient
  from "./LibroAlquimicoClient";

export const metadata: Metadata = {
  title:
    "El Libro Alquímico | Poema Universal",
  description:
    "Archivo editorial de las láminas alquímicas del Bestiario Poético.",
};

export default function LibroAlquimicoPage() {
  return (
    <LibroAlquimicoClient
      plates={ALQUIMIC_PLATES}
    />
  );
}
