import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Ediciones · Poema Universal",
  description:
    "Proyecto editorial independiente en construcción dentro del universo Poema Universal.",
};

export default function EdicionesPage() {
  return (
    <main className={styles.page}>
      {/*
        Esta habitación no muestra el acceso flotante global
        a Verso → Techno.
      */}
      <style>{`
        a[href="/laboratorio/verso-tecno"] {
          display: none !important;
        }
      `}</style>

      <div className={styles.background} aria-hidden="true">
        <video
          className={styles.video}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/polilla-blanca-poster.jpg"
        >
          <source
            src="/videos/polilla-blanca-bg.mp4"
            type="video/mp4"
          />
        </video>

        <div className={styles.veil} />
        <div className={styles.vignette} />
      </div>

      <header className={styles.header}>
        <Link
          href="/poema-universal"
          className={styles.backLink}
        >
          <span aria-hidden="true">←</span>
          <span>Poema Universal</span>
        </Link>

        <span className={styles.roomLabel}>
          Habitación editorial
        </span>
      </header>

      <section
        className={styles.content}
        aria-labelledby="ediciones-title"
      >
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            POEMA UNIVERSAL
          </p>

          <div className={styles.rule} />

          <h1
            id="ediciones-title"
            className={styles.title}
          >
            EDICIONES
          </h1>

          <p className={styles.subtitle}>
            Proyecto editorial independiente en construcción
          </p>

          <p className={styles.intro}>
            Un sello futuro para custodiar literatura,
            pensamiento, cocina y obras nacidas dentro
            del universo Poema Universal.
          </p>

          <div className={styles.manifesto}>
            <p className={styles.manifestoLabel}>
              MANIFIESTO
            </p>

            <div className={styles.manifestoRule} />

            <p>Publicar con cuidado.</p>
            <p>Corregir con paciencia.</p>
            <p>Hacer del libro un objeto vivo.</p>
            <p>Crecer despacio, con verdad.</p>
          </div>

          <div className={styles.collaboration}>
            <p className={styles.collaborationLabel}>
              COLABORAR
            </p>

            <div className={styles.collaborationRule} />

            <p className={styles.collaborationText}>
              ¿Quieres ser colaborador de Poema Universal?
            </p>

            <a
              className={styles.collaborationLink}
              href="mailto:poemauniversalproject@gmail.com"
            >
              poemauniversalproject@gmail.com
            </a>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>
          La Polilla Blanca custodia esta habitación.
        </span>

        <span>
          Proyecto en desarrollo · 2026
        </span>
      </footer>
    </main>
  );
}
