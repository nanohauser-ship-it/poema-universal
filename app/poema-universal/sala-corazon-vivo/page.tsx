import Link from "next/link";
import RecordingStudio from "./RecordingStudio";
import {
  LiveSessionProvider,
} from "./LiveSessionProvider";

export const metadata = {
  title:
    "Sala del Corazón Vivo · Poema Universal",
  description:
    "Lectura, diálogo, memoria y presencia en tiempo real dentro de Poema Universal.",
};

export default function SalaCorazonVivoPage() {
  return (
    <>
      <Link
        href="/poema-universal"
        aria-label="Volver a Poema Universal"
        style={{
          position: "fixed",
          top: 22,
          right: 24,
          zIndex: 10000,
          padding: "10px 16px",
          border: "1px solid rgba(230,205,155,.30)",
          borderRadius: 999,
          background: "rgba(8,8,8,.56)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          color: "#ead9ad",
          fontFamily: "Georgia, serif",
          fontSize: 11,
          letterSpacing: ".07em",
          textDecoration: "none",
          boxShadow: "0 8px 30px rgba(0,0,0,.28)",
        }}
      >
        ← Poema Universal
      </Link>

    <LiveSessionProvider>
      <RecordingStudio />
    </LiveSessionProvider>
    </>
  );
}
