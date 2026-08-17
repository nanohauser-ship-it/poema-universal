import { redirect } from "next/navigation";

export const metadata = {
  title: "Atlas Universal de las Influencias · Poema Universal",
  description:
    "Una cartografía viva de autores, obras, ideas, tradiciones y relaciones de la literatura universal.",
};

export default function AtlasInfluenciasPage() {
  redirect("/poema-universal/atlas-influencias/v4");
}
