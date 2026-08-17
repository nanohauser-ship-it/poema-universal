import type { Metadata } from "next";
import OrganismoV47 from "./OrganismoV47";

export const metadata: Metadata = {
  title: "Organismo V4.7 · Alimentación verbal",
  description:
    "El embrión 3D reacciona al teclado, absorbe palabras y desarrolla biomasa verbal.",
};

export default function OrganismoPage() {
  return <OrganismoV47 />;
}
