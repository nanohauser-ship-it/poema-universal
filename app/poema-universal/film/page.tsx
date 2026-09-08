"use client";

import { useEffect, useRef, useState } from "react";
import "./film.css";

const scenes = [
  {
    id: "01",
    kicker: "EL MUNDO",
    title: "Algo no está bien.",
    text: "Vivimos rodeados de ruido, distancia y heridas que a veces parecen demasiado grandes.",
  },
  {
    id: "02",
    kicker: "ANTES",
    title: "Yo era cocinero.",
    text: "Durante años trabajé entre fuego, orden, tiempo y materia. La cocina me enseñó a cuidar.",
  },
  {
    id: "03",
    kicker: "LA PAUSA",
    title: "Entonces me aparté.",
    text: "No para dejar de crear. Para descubrir hacia dónde quería seguir caminando.",
  },
  {
    id: "04",
    kicker: "LA LITERATURA",
    title: "Los libros seguían allí.",
    text: "Kafka. Pessoa. Pizarnik. Cortázar. Woolf. Historias capaces de hacer habitable el mundo.",
  },
  {
    id: "05",
    kicker: "LA PREGUNTA",
    title: "¿Qué puedo hacer yo?",
    text: "Quizá no pueda arreglar el mundo. Pero puedo intentar reunir algo hermoso dentro de él.",
  },
  {
    id: "06",
    kicker: "NACE UNA IDEA",
    title: "Poema Universal.",
    text: "Sesenta voces. Sesenta lugares. Una primera edición para encontrarnos a través de la palabra.",
  },
  {
    id: "07",
    kicker: "LA LLAMADA",
    title: "La carta sale al mundo.",
    text: "Y sucede algo pequeño y enorme: alguien, en algún lugar, responde.",
  },
];

export default function PoemaUniversalFilm() {
  const root = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = root.current;
      if (!el) return;

      const max = el.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      setProgress(Math.min(1, Math.max(0, p)));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main ref={root} className="film">
      <div className="filmGrain" />
      <div className="filmProgress">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>

      <header className="filmHud">
        <strong>POEMA UNIVERSAL</strong>
        <span>PELÍCULA · EDICIÓN FUNDACIONAL</span>
      </header>

      {scenes.map((scene, index) => {
        const depth = index % 2 === 0 ? "left" : "right";

        return (
          <section
            className={`filmScene filmScene--${depth}`}
            key={scene.id}
          >
            <div className="paperWorld">
              <div className="paperSun" />
              <div className="paperCloud paperCloud--1" />
              <div className="paperCloud paperCloud--2" />

              <div className="paperCard">
                <span>{scene.kicker}</span>
                <h1>{scene.title}</h1>
                <p>{scene.text}</p>
              </div>

              <div className="paperObject paperObject--back">
                {scene.id}
              </div>

              <div className="paperObject paperObject--front">
                ♥
              </div>
            </div>

            <div className="sceneNumber">
              {scene.id} / {String(scenes.length).padStart(2, "0")}
            </div>
          </section>
        );
      })}

      <section className="filmFinal">
        <div>
          <span>PRIMERA EDICIÓN</span>
          <h2>60 voces para construir algo hermoso.</h2>
          <p>Poema Universal · 2026</p>
        </div>
      </section>
    </main>
  );
}
