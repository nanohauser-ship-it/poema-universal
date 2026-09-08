"use client";

import { useRouter } from "next/navigation";
import AnthologyCinema from "../components/anthology-cinema/AnthologyCinema";

export default function Page() {
  const router = useRouter();

  function goBack() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/poema-universal");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={goBack}
        aria-label="Volver"
        style={{
          position: "fixed",
          top: "22px",
          left: "22px",
          zIndex: 99999,
          padding: "10px 16px",
          border: "1px solid rgba(255,255,255,0.24)",
          borderRadius: "999px",
          background: "rgba(10,10,10,0.58)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          color: "rgba(255,255,255,0.9)",
          fontSize: "12px",
          letterSpacing: "0.08em",
          cursor: "pointer",
        }}
      >
        ← VOLVER
      </button>

      <AnthologyCinema />
    </>
  );
}
