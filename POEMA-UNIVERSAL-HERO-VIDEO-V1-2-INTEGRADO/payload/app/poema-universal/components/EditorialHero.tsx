"use client";

// POEMA HERO VIDEO V1.2 · integración robusta sin dependencia de CSS Module

import Link from "next/link";
import { useEffect, useRef } from "react";

type CountdownTime = {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
};

type EditorialHeroProps = {
  time: CountdownTime;
  legacyItems?: unknown;
};

const pad = (value: number) =>
  String(Math.max(0, value)).padStart(2, "0");

export default function EditorialHero({
  time,
  legacyItems,
}: EditorialHeroProps) {
  void legacyItems;

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const attempt = video.play();
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(() => {
        // El poster permanece visible si el navegador retrasa autoplay.
      });
    }
  }, []);

  const countdown = [
    { value: String(Math.max(0, time.dias)), label: "Días" },
    { value: pad(time.horas), label: "Horas" },
    { value: pad(time.minutos), label: "Minutos" },
    { value: pad(time.segundos), label: "Segundos" },
  ];

  return (
    <section
      aria-labelledby="poema-universal-title"
      data-poema-video-hero="v1.2"
      style={{
        position: "relative",
        minHeight: "calc(100svh - 70px)",
        overflow: "hidden",
        isolation: "isolate",
        background: "#050604",
        color: "#f4ede2",
      }}
    >
      {/* Fondo atmosférico: poster ampliado. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "-44px",
          zIndex: 0,
          backgroundImage:
            "url('/poema-universal/media/poema-universal-opening-poster.jpg')",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          filter: "blur(30px) brightness(0.32) saturate(0.72)",
          transform: "scale(1.08)",
          opacity: 0.96,
        }}
      />

      {/* VIDEO REAL. Esta capa no depende del CSS de la portada. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "rgba(4,5,4,.20)",
        }}
      >
        <video
          ref={videoRef}
          src="/poema-universal/media/poema-universal-opening.mp4"
          poster="/poema-universal/media/poema-universal-opening-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center center",
            background: "transparent",
            filter: "brightness(.72) contrast(1.04) saturate(.86)",
          }}
        />
      </div>

      {/* Velos para que el texto siga siendo legible. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          background:
            "linear-gradient(180deg, rgba(3,4,3,.70) 0%, rgba(3,4,3,.18) 25%, rgba(3,4,3,.08) 52%, rgba(3,4,3,.78) 100%), linear-gradient(90deg, rgba(3,4,3,.66) 0%, transparent 25%, transparent 75%, rgba(3,4,3,.66) 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 3,
          width: "min(1380px, calc(100% - 48px))",
          minHeight: "calc(100svh - 70px)",
          margin: "0 auto",
          padding: "30px 0 24px",
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            paddingBottom: 16,
            borderBottom: "1px solid rgba(244,237,226,.22)",
            color: "rgba(244,237,226,.52)",
            fontSize: 7,
            letterSpacing: ".28em",
            textTransform: "uppercase",
          }}
        >
          <p style={{ margin: 0 }}>Institución literaria internacional</p>
          <p style={{ margin: 0 }}>Presentación · 01.01.2027</p>
        </div>

        <div
          style={{
            alignSelf: "center",
            justifySelf: "center",
            width: "min(920px, 94vw)",
            padding: "42px 18px 30px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: "0 0 18px",
              color: "#c7a467",
              fontSize: 8,
              letterSpacing: ".48em",
              textTransform: "uppercase",
            }}
          >
            Edición fundacional
          </p>

          <h1
            id="poema-universal-title"
            style={{
              margin: 0,
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontWeight: 400,
              letterSpacing: "-.055em",
              lineHeight: 0.82,
              textShadow: "0 5px 34px rgba(0,0,0,.62)",
            }}
          >
            <span
              style={{
                display: "block",
                fontSize: "clamp(68px, 9vw, 146px)",
                color: "#fffaf0",
              }}
            >
              Poema
            </span>
            <span
              style={{
                display: "block",
                marginTop: ".08em",
                fontSize: "clamp(74px, 10vw, 162px)",
                fontStyle: "italic",
                color: "rgba(244,237,226,.92)",
              }}
            >
              Universal
            </span>
          </h1>

          <p
            style={{
              maxWidth: 760,
              margin: "46px auto 0",
              fontFamily: 'Georgia, "Times New Roman", serif',
              color: "rgba(250,244,234,.94)",
              fontSize: "clamp(18px, 2.1vw, 31px)",
              fontStyle: "italic",
              lineHeight: 1.42,
              textShadow: "0 3px 24px rgba(0,0,0,.75)",
            }}
          >
            Una única obra escrita durante un año
            <span style={{ display: "block" }}>por sesenta voces del mundo.</span>
          </p>

          <p
            style={{
              margin: "20px 0 0",
              color: "rgba(244,237,226,.52)",
              fontSize: 7,
              letterSpacing: ".38em",
              textTransform: "uppercase",
            }}
          >
            Sesenta voces · un solo año · una misma dignidad
          </p>

          <Link
            href="#manifiesto"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 14,
              marginTop: 22,
              paddingBottom: 8,
              borderBottom: "1px solid rgba(199,164,103,.62)",
              color: "rgba(244,237,226,.80)",
              fontSize: 7,
              letterSpacing: ".34em",
              textDecoration: "none",
              textTransform: "uppercase",
            }}
          >
            Leer la declaración fundacional
            <span aria-hidden="true">↓</span>
          </Link>
        </div>

        <div style={{ alignSelf: "end" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 20,
              paddingBottom: 10,
              color: "rgba(244,237,226,.48)",
              fontSize: 7,
              letterSpacing: ".28em",
              textTransform: "uppercase",
            }}
          >
            <p style={{ margin: 0 }}>Tiempo restante</p>
            <p style={{ margin: 0 }}>Apertura del primer libro</p>
          </div>

          <div
            aria-label="Cuenta atrás para la presentación"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              borderTop: "1px solid rgba(244,237,226,.24)",
              borderBottom: "1px solid rgba(244,237,226,.24)",
              background: "rgba(4,5,4,.26)",
              backdropFilter: "blur(5px)",
            }}
          >
            {countdown.map((item, index) => (
              <div
                key={item.label}
                style={{
                  minHeight: 96,
                  padding: "18px 20px 14px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderRight:
                    index < countdown.length - 1
                      ? "1px solid rgba(244,237,226,.18)"
                      : "0",
                }}
              >
                <span
                  style={{
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontSize: "clamp(29px, 3vw, 46px)",
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: "-.04em",
                    lineHeight: 1,
                    color: "rgba(255,250,240,.98)",
                  }}
                >
                  {item.value}
                </span>
                <span
                  style={{
                    color: "rgba(244,237,226,.50)",
                    fontSize: 7,
                    letterSpacing: ".31em",
                    textTransform: "uppercase",
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 24,
              paddingTop: 10,
              color: "rgba(244,237,226,.34)",
              fontSize: 7,
              letterSpacing: ".28em",
              textTransform: "uppercase",
            }}
          >
            <span>Poema Universal · 2026</span>
            <span>60 voces · un solo libro</span>
          </div>
        </div>
      </div>
    </section>
  );
}
