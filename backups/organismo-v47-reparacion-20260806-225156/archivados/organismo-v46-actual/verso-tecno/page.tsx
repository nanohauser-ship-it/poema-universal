import type { Metadata } from "next";
import OrganismoV46 from "./OrganismoV46";

export const metadata: Metadata = {
  title: "Organismo V4.6 · La canción adquiere cuerpo",
  description:
    "Cámara de evolución para organismos de literatura electrónica viva.",
};

export default function OrganismoPage() {
  return <OrganismoV46 />;
}
