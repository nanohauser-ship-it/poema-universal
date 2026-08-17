import type { Metadata } from "next";
import OrganismoV47 from "./OrganismoV47";

export const metadata: Metadata = {
  title: "Organismo V4.9.1 · Crear otro poema",
  description:
    "Borra el organismo actual y regresa directamente a una incubadora vacía para crear otro poema.",
};

export default function OrganismoPage() {
  return <OrganismoV47 />;
}
