"use client";

import dynamic from "next/dynamic";
import "./museo-vivo.css";

const MuseumExperience = dynamic(
  () => import("./components/MuseumExperience"),
  { ssr: false },
);

export default function MuseoVivoPage() {
  return (
    <main className="museumRoot">
      <MuseumExperience />

      <div className="museumIdentity">
        <span>POEMA UNIVERSAL</span>
        <strong>MUSEO VIVO</strong>
      </div>

      <div className="museumHint">
        desplázate para atravesar
      </div>
    </main>
  );
}
