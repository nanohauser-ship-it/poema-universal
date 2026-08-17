import type { Metadata } from "next";
import { getBootstrap } from "@/lib/embrion/repository";
import EmbrionExperience from "./EmbrionExperience";

export const metadata: Metadata = {
  title: "Embrión — Atlas histórico de la sensibilidad poética",
  description: "Explora cómo cambia una idea al atravesar siglos de poesía.",
};

export default function EmbrionPage() {
  return <EmbrionExperience initialData={getBootstrap()} />;
}
