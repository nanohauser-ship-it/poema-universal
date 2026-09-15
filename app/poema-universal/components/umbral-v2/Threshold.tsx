'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

import SuspendedStudy from './SuspendedStudy';
import styles from './threshold.module.css';

type ThresholdProps = {
  enterHref?: string;
  publicHome?: boolean;
};

export default function Threshold({
  enterHref = '/poema-universal/cuerpo-vivo',
  publicHome = false,
}: ThresholdProps) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = root.current;
    if (!node) return;

    const preference = matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    let frame = 0;
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let progress = 0;

    const draw = () => {
      frame = 0;

      x += (tx - x) * 0.055;
      y += (ty - y) * 0.055;

      node.style.setProperty('--px', `${x.toFixed(3)}px`);
      node.style.setProperty('--py', `${y.toFixed(3)}px`);
      /*
       * /poema-universal:
       * dejamos el primer 30% del recorrido prácticamente congelado
       * para contemplar la portada completa.
       *
       * La Home pública conserva el comportamiento original.
       */
      let visualProgress = progress;

      if (!publicHome) {
        const HOLD = 0.30;

        if (progress <= HOLD) {
          visualProgress = 0;
        } else {
          const t = Math.min(
            1,
            Math.max(
              0,
              (progress - HOLD) / (1 - HOLD)
            )
          );

          // smoothstep: arranque y llegada más cinematográficos
          visualProgress =
            t * t * (3 - 2 * t);
        }
      }

      node.style.setProperty(
        '--scroll',
        String(visualProgress)
      );

      node.style.setProperty(
        '--raw-scroll',
        String(progress)
      );

      /*
       * Cámara cinematográfica:
       *
       * 0.00 → 0.28  contemplación
       * 0.28 → 0.68  acercamiento hasta la reunión
       * 0.68 → 0.80  pausa entre los poetas
       * 0.80 → 1.00  atravesamos el arco
       */
      let cameraProgress = 0;

      if (!publicHome) {
        const raw = progress;

        if (raw <= 0.28) {
          cameraProgress = 0;
        } else if (raw <= 0.68) {
          const t = (raw - 0.28) / 0.40;
          const eased = t * t * (3 - 2 * t);

          cameraProgress = eased * 0.64;
        } else if (raw <= 0.80) {
          cameraProgress = 0.64;
        } else {
          const t = Math.min(
            1,
            (raw - 0.80) / 0.20
          );

          const eased = t * t * (3 - 2 * t);

          cameraProgress =
            0.64 + eased * 0.36;
        }
      } else {
        cameraProgress = visualProgress;
      }

      node.style.setProperty(
        '--camera-progress',
        String(cameraProgress)
      );

      /*
       * Intensidad de vida de la reunión:
       * aparece al llegar a los poetas,
       * permanece durante la pausa
       * y desaparece al cruzar el arco.
       */
      let poetsLife = 0;

      if (!publicHome) {
        const raw = progress;

        if (raw >= 0.64 && raw < 0.68) {
          poetsLife = (raw - 0.64) / 0.04;
        } else if (raw >= 0.68 && raw <= 0.80) {
          poetsLife = 1;
        } else if (raw > 0.80 && raw <= 0.84) {
          poetsLife = 1 - (raw - 0.80) / 0.04;
        }
      }

      node.style.setProperty(
        '--poets-life',
        String(poetsLife)
      );

      if (Math.abs(tx - x) + Math.abs(ty - y) > 0.025) {
        frame = requestAnimationFrame(draw);
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const scroll = () => {
      progress = preference.matches
        ? 0
        : Math.min(
            1,
            Math.max(
              0,
              -node.getBoundingClientRect().top / innerHeight
            )
          );

      schedule();
    };

    const pointer = (event: PointerEvent) => {
      if (
        preference.matches ||
        event.pointerType !== 'mouse'
      ) {
        return;
      }

      tx = (event.clientX / innerWidth - 0.5) * 8;
      ty = (event.clientY / innerHeight - 0.5) * 6;

      schedule();
    };

    const reset = () => {
      tx = 0;
      ty = 0;
      schedule();
    };

    const change = () => {
      if (preference.matches) {
        x = 0;
        y = 0;
        tx = 0;
        ty = 0;
        progress = 0;
      }

      scroll();
    };

    window.addEventListener('pointermove', pointer, {
      passive: true,
    });

    window.addEventListener('scroll', scroll, {
      passive: true,
    });

    window.addEventListener('resize', scroll);
    document.addEventListener('pointerleave', reset);
    preference.addEventListener('change', change);

    scroll();

    return () => {
      cancelAnimationFrame(frame);

      window.removeEventListener(
        'pointermove',
        pointer
      );

      window.removeEventListener(
        'scroll',
        scroll
      );

      window.removeEventListener(
        'resize',
        scroll
      );

      document.removeEventListener(
        'pointerleave',
        reset
      );

      preference.removeEventListener(
        'change',
        change
      );
    };
  }, []);

  return (
    <main
      ref={root}
      className={`${styles.experience} ${
        publicHome ? styles.publicHome : ''
      }`}
    >
      <section
        className={styles.stage}
        aria-label="Primer acto: el umbral"
      >
        <header className={styles.header}>
          <span className={styles.edition}>
            POEMA UNIVERSAL
            <br />
            EDICIÓN — 2026
          </span>

          {!publicHome && (
            <Link
              href="/#inicio"
              scroll={true}
              className={styles.backHome}
              aria-label="Volver a la página principal de Poema Universal"
            >
              <span aria-hidden="true">←</span>
              VOLVER AL INICIO
            </Link>
          )}
        </header>

        <h1 className={styles.semantic}>
          Poema Universal
        </h1>

        <div className={styles.camera}>
        {/* PLANO 1 · cielo y mundo lejano */}
        <div
          className={`${styles.objectPosition} ${styles.objectPositionBack}`}
        >
          <div className={styles.object}>
            <SuspendedStudy part="back" />
          </div>
        </div>

        {/* PLANO 2 · POEMA */}
        <div
          className={styles.backTitle}
          aria-hidden="true"
        >
          <span>POEMA</span>
        </div>

        {/* PLANO 3 · isla, árbol, voces, niebla */}
        <div
          className={`${styles.objectPosition} ${styles.objectPositionFront}`}
        >
          <div className={styles.object}>
            <SuspendedStudy part="front" />
          </div>
        </div>

        {/* PLANO 4 · UNIVERSAL */}
        <div
          className={styles.frontTitle}
          aria-hidden="true"
        >
          <span>UNIVERSAL</span>
        </div>

        </div>

        {!publicHome && (
          <span
            className={styles.cameraTarget}
            aria-hidden="true"
          />
        )}

        <aside className={styles.manifesto}>
          UNA OBRA
          <br />
          COLECTIVA
          <br />
          MUNDIAL
          <span>2026</span>
        </aside>

        <p className={styles.common}>
          SESENTA DESCONOCIDOS.
          <br />
          UNA VOZ COMÚN.
        </p>

        <footer className={styles.footer}>
          <p>
            60 VOCES
            <br />
            INFINITAS POSIBILIDADES
            <br />
            UN SOLO AÑO
          </p>

          <span className={styles.scrollCue}>
            DESPLAZA PARA ESCUCHAR EL SILENCIO
            <span aria-hidden="true">↓</span>
          </span>

          <Link
            className={styles.enter}
            href={enterHref}
          >
            ENTRAR
            <span aria-hidden="true">↗</span>
          </Link>
        </footer>
      

        {!publicHome && (
                  <div className={styles.worldPortal}>
                    <p>EDICIÓN FUNDACIONAL · 2026</p>
        
                    <h2>El Mundo</h2>
        
                    <span className={styles.worldPortalLine}>
                      Sesenta voces · un año · una obra
                    </span>
        
                    <Link
                      href="/poema-universal/antologia-viva"
                      className={styles.worldPortalButton}
                    >
                      ENTRAR EN LA ANTOLOGÍA
                      <span aria-hidden="true">↗</span>
                    </Link>
                  </div>
                )}

      </section>
</main>
  );
}
