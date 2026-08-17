import type { Metadata } from "next";
import OrganismoV47 from "./OrganismoV47";

export const metadata: Metadata = {
  title: "Organismo V4.7 · Alimentación verbal",
  description:
    "El teclado alimenta un organismo 3D que crece, reacciona y transforma su música.",
};

export default function OrganismoPage() {
  return <OrganismoV47 />;
}
