import type { Metadata } from "next";

import Threshold from "./poema-universal/components/umbral-v2/Threshold";
import PoemaUniversalToolGateway from "./components/PoemaUniversalToolGateway";
import HomeNuevaConBarraOriginal from "./components/HomeNuevaConBarraOriginal";
import HomeRecorderDot from "./components/HomeRecorderDot";

export const metadata: Metadata = {
  title: "Poema Universal",
  description:
    "Poema Universal · una obra colectiva mundial · edición fundacional 2026.",
};

export default function HomePage() {
  return (
    <>
      <HomeNuevaConBarraOriginal
        hero={<Threshold enterHref="#herramienta" publicHome />}
        tool={<PoemaUniversalToolGateway />}
      />

      <HomeRecorderDot />
    </>
  );
}
