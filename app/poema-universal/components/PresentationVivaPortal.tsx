"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export function PresentationVivaPortal() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.visible = "true";
        }
      },
      {
        threshold: 0.2,
      },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={root}
      className="puPresentationPortal"
      aria-labelledby="pu-presentation-title"
    >
      <div className="puPresentationSky" />

      <div className="puPresentationStars">
        {Array.from({ length: 18 }).map((_, i) => (
          <i
            key={i}
            style={{
              left: `${8 + ((i * 29) % 87)}%`,
              top: `${10 + ((i * 37) % 68)}%`,
              animationDelay: `${(i % 7) * 0.35}s`,
            }}
          />
        ))}
      </div>

      <div className="puPresentationTree" aria-hidden="true">
        <span className="puTreeTrunk" />

        <span className="puBranch puBranch1" />
        <span className="puBranch puBranch2" />
        <span className="puBranch puBranch3" />
        <span className="puBranch puBranch4" />
        <span className="puBranch puBranch5" />

        {Array.from({ length: 16 }).map((_, i) => (
          <span
            key={i}
            className="puTreeLight"
            style={{
              left: `${22 + ((i * 23) % 58)}%`,
              top: `${8 + ((i * 31) % 55)}%`,
              animationDelay: `${i * 0.12}s`,
            }}
          />
        ))}
      </div>

      <div className="puPresentationContent">
        <p className="puPresentationEyebrow">
          EDICIÓN FUNDACIONAL · EXPERIENCIA INTERACTIVA
        </p>

        <h2 id="pu-presentation-title">
          Presentación
          <br />
          <em>Viva</em>
        </h2>

        <p className="puPresentationIntro">
          La historia de cómo una pregunta,
          una llamada y diez primeras respuestas
          comenzaron a construir Poema Universal.
        </p>

        <div className="puPresentationMeta">
          <span>12 escenas</span>
          <i />
          <span>10 / 60 voces</span>
          <i />
          <span>Un mundo de papel</span>
        </div>

        <Link
          href="/poema-universal/presentacion-viva-v2"
          className="puPresentationEnter"
        >
          <span>Entrar en la historia</span>
          <b aria-hidden="true">→</b>
        </Link>
      </div>

      <div className="puPresentationNumber" aria-hidden="true">
        10
        <span>/60</span>
      </div>

      <div className="puPresentationThread" aria-hidden="true" />

      <style jsx>{`
        .puPresentationPortal {
          position: relative;
          width: min(1500px, calc(100% - 48px));
          min-height: 720px;
          margin: 100px auto;
          overflow: hidden;
          border-radius: 3px;
          background:
            radial-gradient(
              circle at 75% 40%,
              rgba(217, 185, 125, 0.16),
              transparent 35%
            ),
            linear-gradient(
              135deg,
              #15130f 0%,
              #1d1913 48%,
              #0c0b09 100%
            );
          color: #f1eadc;
          isolation: isolate;
          box-shadow:
            0 40px 100px rgba(0, 0, 0, 0.18),
            inset 0 0 0 1px rgba(232, 218, 189, 0.09);
          opacity: 0;
          transform: translateY(36px);
          transition:
            opacity 1.2s ease,
            transform 1.2s cubic-bezier(.16, 1, .3, 1);
        }

        .puPresentationPortal[data-visible="true"] {
          opacity: 1;
          transform: translateY(0);
        }

        .puPresentationPortal::before {
          content: "";
          position: absolute;
          inset: 18px;
          border: 1px solid rgba(224, 205, 170, 0.09);
          pointer-events: none;
          z-index: 5;
        }

        .puPresentationSky {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              90deg,
              rgba(10, 9, 7, 0.94) 0%,
              rgba(10, 9, 7, 0.72) 44%,
              rgba(10, 9, 7, 0.1) 78%
            );
          z-index: 1;
        }

        .puPresentationContent {
          position: relative;
          z-index: 6;
          width: min(610px, 80%);
          padding: 104px 0 100px 8%;
        }

        .puPresentationEyebrow {
          margin: 0 0 30px;
          font-family: Arial, sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.25em;
          color: #bf9b60;
        }

        .puPresentationContent h2 {
          margin: 0;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size: clamp(72px, 8vw, 142px);
          font-weight: 400;
          line-height: 0.78;
          letter-spacing: -0.065em;
        }

        .puPresentationContent h2 em {
          display: inline-block;
          margin-left: 0.52em;
          padding-top: 0.12em;
          font-weight: 400;
          color: #c8a76a;
        }

        .puPresentationIntro {
          max-width: 470px;
          margin: 54px 0 34px;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size: 20px;
          line-height: 1.55;
          color: rgba(242, 233, 216, 0.72);
        }

        .puPresentationMeta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 13px;
          margin-bottom: 46px;
          font-family: Arial, sans-serif;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: rgba(239, 229, 208, 0.46);
        }

        .puPresentationMeta i {
          display: block;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #a93f32;
        }

        .puPresentationEnter {
          display: inline-flex;
          align-items: center;
          gap: 34px;
          min-width: 255px;
          padding: 18px 0;
          border-top: 1px solid rgba(224, 204, 166, 0.32);
          border-bottom: 1px solid rgba(224, 204, 166, 0.32);
          color: #f1e9da;
          text-decoration: none;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size: 17px;
          transition:
            color 0.35s ease,
            gap 0.5s cubic-bezier(.16, 1, .3, 1);
        }

        .puPresentationEnter:hover {
          gap: 52px;
          color: #d1aa68;
        }

        .puPresentationEnter b {
          font-family: Arial, sans-serif;
          font-weight: 300;
          font-size: 21px;
        }

        .puPresentationTree {
          position: absolute;
          right: 7%;
          bottom: -3%;
          width: min(46vw, 650px);
          height: 88%;
          z-index: 3;
          filter:
            drop-shadow(0 30px 40px rgba(0, 0, 0, 0.4));
        }

        .puTreeTrunk {
          position: absolute;
          left: 49%;
          bottom: 0;
          width: 42px;
          height: 53%;
          transform:
            translateX(-50%)
            rotate(1deg);
          border-radius: 70% 40% 8px 8px;
          background:
            linear-gradient(
              90deg,
              #6c5a42,
              #b7a581 42%,
              #76644b 75%,
              #41372c
            );
          opacity: 0.9;
        }

        .puBranch {
          position: absolute;
          left: 50%;
          bottom: 42%;
          height: 17px;
          transform-origin: left center;
          border-radius: 999px;
          background:
            linear-gradient(
              90deg,
              #9a896c,
              #d1c2a2
            );
          opacity: 0.82;
        }

        .puBranch1 {
          width: 48%;
          transform: rotate(-39deg);
        }

        .puBranch2 {
          width: 46%;
          transform: rotate(-147deg);
        }

        .puBranch3 {
          bottom: 55%;
          width: 37%;
          transform: rotate(-20deg);
        }

        .puBranch4 {
          bottom: 57%;
          width: 42%;
          transform: rotate(-163deg);
        }

        .puBranch5 {
          bottom: 67%;
          width: 27%;
          transform: rotate(-88deg);
        }

        .puTreeLight {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ead39c;
          box-shadow:
            0 0 16px rgba(238, 202, 123, 0.9),
            0 0 38px rgba(208, 157, 71, 0.35);
          animation:
            puLightBreath 3.8s ease-in-out infinite;
        }

        @keyframes puLightBreath {
          0%,
          100% {
            opacity: 0.35;
            transform: scale(0.75);
          }

          50% {
            opacity: 1;
            transform: scale(1.18);
          }
        }

        .puPresentationStars {
          position: absolute;
          right: 0;
          top: 0;
          width: 56%;
          height: 77%;
          z-index: 2;
        }

        .puPresentationStars i {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(236, 211, 160, 0.72);
          animation:
            puStar 4.5s ease-in-out infinite;
        }

        @keyframes puStar {
          50% {
            opacity: 0.25;
            transform: scale(0.55);
          }
        }

        .puPresentationNumber {
          position: absolute;
          right: 3.5%;
          top: 5%;
          z-index: 6;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size: 48px;
          color: rgba(220, 196, 155, 0.18);
        }

        .puPresentationNumber span {
          font-size: 17px;
          margin-left: 3px;
        }

        .puPresentationThread {
          position: absolute;
          left: 59%;
          bottom: 17%;
          width: 39%;
          height: 1px;
          z-index: 4;
          transform: rotate(-8deg);
          transform-origin: left center;
          background:
            linear-gradient(
              90deg,
              transparent,
              #a84235 13%,
              #a84235 84%,
              transparent
            );
          opacity: 0.72;
        }

        @media (max-width: 850px) {
          .puPresentationPortal {
            width: calc(100% - 24px);
            min-height: 720px;
            margin: 62px auto;
          }

          .puPresentationContent {
            width: auto;
            padding:
              70px 34px
              340px;
          }

          .puPresentationContent h2 {
            font-size: clamp(
              64px,
              18vw,
              100px
            );
          }

          .puPresentationIntro {
            font-size: 17px;
          }

          .puPresentationTree {
            right: -10%;
            width: 100%;
            height: 47%;
          }

          .puPresentationNumber {
            right: 30px;
            top: auto;
            bottom: 28px;
          }

          .puPresentationThread {
            left: 20%;
            width: 80%;
            bottom: 15%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .puPresentationPortal,
          .puTreeLight,
          .puPresentationStars i {
            transition: none;
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
