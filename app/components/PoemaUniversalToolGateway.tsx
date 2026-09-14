'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

import styles from './PoemaUniversalToolGateway.module.css';

const BASE =
  '/poema-universal/herramienta-central/layers';

export default function PoemaUniversalToolGateway() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = root.current;
    if (!node) return;

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    let raf = 0;
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;

    const draw = () => {
      raf = 0;

      x += (tx - x) * 0.055;
      y += (ty - y) * 0.055;

      node.style.setProperty('--tool-x', `${x}px`);
      node.style.setProperty('--tool-y', `${y}px`);

      if (Math.abs(tx - x) + Math.abs(ty - y) > 0.02) {
        raf = requestAnimationFrame(draw);
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const pointer = (event: PointerEvent) => {
      if (
        reduced.matches ||
        event.pointerType !== 'mouse'
      ) {
        return;
      }

      tx =
        (event.clientX / window.innerWidth - 0.5) * 14;

      ty =
        (event.clientY / window.innerHeight - 0.5) * 10;

      schedule();
    };

    const reset = () => {
      tx = 0;
      ty = 0;
      schedule();
    };

    window.addEventListener('pointermove', pointer, {
      passive: true,
    });

    document.addEventListener('pointerleave', reset);

    return () => {
      cancelAnimationFrame(raf);

      window.removeEventListener(
        'pointermove',
        pointer
      );

      document.removeEventListener(
        'pointerleave',
        reset
      );
    };
  }, []);

  return (
    <section
      ref={root}
      className={styles.gateway}
      aria-labelledby="poema-tool-title"
    >
      <Link
        href="/poema-universal/gran-avatar"
        className={styles.portal}
        aria-label="Entrar en el Gran Avatar de Poema Universal"
      >
        <div
          className={`${styles.layer} ${styles.background}`}
          aria-hidden="true"
        >
          <img
            src={`${BASE}/00-background.png`}
            alt=""
            draggable="false"
          />
        </div>

        <div
          className={`${styles.layer} ${styles.avatar}`}
          aria-hidden="true"
        >
          <img
            src={`${BASE}/01-avatar-core.png`}
            alt=""
            draggable="false"
          />
        </div>

        <div
          className={`${styles.layer} ${styles.mist}`}
          aria-hidden="true"
        >
          <img
            src={`${BASE}/02-mist-clouds.png`}
            alt=""
            draggable="false"
          />
        </div>

        <div
          className={`${styles.layer} ${styles.pages}`}
          aria-hidden="true"
        >
          <img
            src={`${BASE}/03-floating-pages.png`}
            alt=""
            draggable="false"
          />
        </div>

        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            LA OBRA TODAVÍA ESTÁ ABIERTA
          </p>

          <h2 id="poema-tool-title">
            La herramienta
            <br />
            del Poema Universal
          </h2>

          <p className={styles.invitation}>
            Escribe algo que merezca permanecer.
          </p>

          <span className={styles.inputGhost}>
            deja aquí tu fragmento…
          </span>

          <span className={styles.enter}>
            ENTRAR EN LA SALA
            <span aria-hidden="true">↗</span>
          </span>

          <p className={styles.microcopy}>
            Cada fragmento alimenta el organismo común.
          </p>
        </div>
      </Link>
    </section>
  );
}
