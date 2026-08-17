import type {
  Metadata,
} from "next";

import ArchivoApariciones
  from "./ArchivoApariciones";

import {
  museumPhotos,
} from "./data";

export const metadata:
  Metadata = {
  title:
    "Archivo de apariciones | Poema Universal",
  description:
    "Archivo visual de No dejes que desaparezcamos, La Jerarquía del Hambre y Memorias de Bielka.",
};

export default function
ArchivoAparicionesPage() {
  return (
    <main>
      <ArchivoApariciones
        photos={
          museumPhotos
        }
      />
    </main>
  );
}
