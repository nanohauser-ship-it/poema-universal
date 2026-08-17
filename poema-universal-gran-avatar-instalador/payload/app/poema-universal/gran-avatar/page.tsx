import type { Metadata } from "next";

import GranAvatarExperience from "./GranAvatarExperience";

export const metadata: Metadata = {
  title: "El Gran Avatar · Poema Universal",
  description:
    "Una presencia central que recibe, escucha, lee y recuerda poemas.",
};

export default function GranAvatarPage() {
  return <GranAvatarExperience />;
}
