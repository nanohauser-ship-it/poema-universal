import { BestiaryInvocation } from "./components/BestiaryInvocation";

export const metadata = {
  title: "Bestiario Poético | Poema Universal",
  description: "Entrega un poema e invoca al animal simbólico que ha venido a proteger aquello que tu alma confió a la escritura."
};

export default function BestiaryPage() {
  return <BestiaryInvocation />;
}
