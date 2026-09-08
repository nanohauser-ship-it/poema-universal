import type { Metadata } from "next";
import { PaperWorldExperience } from "./PaperWorldExperience";

export const metadata: Metadata = {
  title: "Poema Universal · Paper World",
  description: "Presentación viva de Poema Universal",
};

export default function Page() {
  return <PaperWorldExperience />;
}
