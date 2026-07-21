import type {
  Metadata,
} from "next";

import PresenciasTutelaresExperience
  from "./components/PresenciasTutelaresExperience";

export const metadata: Metadata = {
  title:
    "Presencias Tutelares | Poema Universal",
  description:
    "Elige quién vela tu escritura y entra en un santuario literario acompañado.",
};

export default function
PresenciasTutelaresPage() {
  return (
    <PresenciasTutelaresExperience />
  );
}
