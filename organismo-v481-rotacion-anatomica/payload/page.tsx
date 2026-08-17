import type { Metadata } from "next";
import OrganismoV47 from "./OrganismoV47";

export const metadata: Metadata = {
  title: "Organismo V4.8.1 · Rotación anatómica",
  description:
    "El modelo anatómico del embrión rota independientemente dentro de su cámara.",
};

export default function OrganismoPage() {
  return <OrganismoV47 />;
}
