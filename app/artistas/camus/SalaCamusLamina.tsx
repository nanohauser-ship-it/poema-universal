"use client";

import Link from "next/link";
import { obtenerFichaCuratorial } from "../fichas-curatoriales";

const PRINCIPIOS = [
  {
    icono: "▥",
    titulo: "Belleza atemporal",
    texto: "Archivos, bibliotecas antiguas y objetos de estudio.",
  },
  {
    icono: "⌁",
    titulo: "Revelación progresiva",
    texto: "La información aparece mediante capas y descubrimientos.",
  },
  {
    icono: "◇",
    titulo: "Conexión significativa",
    texto: "Cada presencia forma parte de una genealogía literaria.",
  },
  {
    icono: "≋",
    titulo: "Navegación intuitiva",
    texto: "Explorar el Atlas debe sentirse como atravesar un cosmos.",
  },
  {
    icono: "▤",
    titulo: "Profundidad y silencio",
    texto: "Tipografía y espacio concebidos para una lectura lenta.",
  },
];

const CAMBIOS = [
  "El absurdo como punto de partida filosófico, no como caída.",
  "La dignidad humana frente al sinsentido del mundo.",
  "La rebelión como afirmación de límites y justicia.",
  "La lucidez sin cinismo: mirar de frente y actuar con medida.",
  "La claridad moral convertida en forma de resistencia.",
];

const OBRAS = [
  {
    titulo: "El extranjero",
    imagen: "/artistas/camus/obra-extranjero.jpg",
    anio: "1942",
    simbolo: "○",
    fondo:
      "linear-gradient(160deg, #d1c9b5 0%, #99917e 45%, #32322f 100%)",
    texto: "La indiferencia del mundo y el juicio.",
  },
  {
    titulo: "El mito de Sísifo",
    imagen: "/artistas/camus/obra-sisifo.jpg",
    anio: "1942",
    simbolo: "◒",
    fondo:
      "linear-gradient(160deg, #bdaf8b 0%, #6f634e 48%, #25231e 100%)",
    texto: "El absurdo y la rebelión lúcida.",
  },
  {
    titulo: "La peste",
    imagen: "/artistas/camus/obra-peste.jpg",
    anio: "1947",
    simbolo: "▥",
    fondo:
      "linear-gradient(160deg, #7b725f 0%, #4f4738 52%, #181714 100%)",
    texto: "La prueba moral de una comunidad.",
  },
  {
    titulo: "El hombre rebelde",
    imagen: "/artistas/camus/obra-rebelde.jpg",
    anio: "1951",
    simbolo: "⌁",
    fondo:
      "linear-gradient(160deg, #a79a7d 0%, #5f5442 48%, #211e18 100%)",
    texto: "La rebelión y sus límites éticos.",
  },
  {
    titulo: "El primer hombre",
    imagen: "/artistas/camus/obra-primer-hombre.jpg",
    anio: "Póst. 1994",
    simbolo: "◇",
    fondo:
      "linear-gradient(160deg, #7c7465 0%, #4a4338 50%, #1e1b17 100%)",
    texto: "Infancia, pobreza, origen y filiación.",
  },
];

const CRONOLOGIA = [
  ["1913", "Nace en Mondovi, Argelia francesa."],
  ["1942", "El extranjero y El mito de Sísifo."],
  ["1947", "Publica La peste."],
  ["1951", "Publica El hombre rebelde."],
  ["1957", "Premio Nobel de Literatura."],
  ["1960", "Muere en accidente de automóvil."],
];

const ARCHIVO = [
  {
    tipo: "Reliquia",
    titulo: "Cuaderno de notas",
    imagen: "/artistas/camus/archivo-cuaderno.jpg",
    lugar: "Argelia · 1946",
    simbolo: "▤",
  },
  {
    tipo: "Manuscrito",
    titulo: "Borradores de El extranjero",
    imagen: "/artistas/camus/archivo-manuscrito.jpg",
    lugar: "Archivo de escritura",
    simbolo: "⌁",
  },
  {
    tipo: "Fotografía",
    titulo: "Argel · 1940",
    imagen: "/artistas/camus/archivo-foto.jpg",
    lugar: "Territorio y memoria",
    simbolo: "◫",
  },
  {
    tipo: "Biblioteca invisible",
    titulo: "Libros que formaron su pensamiento",
    imagen: "/artistas/camus/archivo-biblioteca.jpg",
    lugar: "Genealogía intelectual",
    simbolo: "▥",
  },
];

const CONSTELACION = [
  {
    nombre: "Franz Kafka",
    relacion: "La culpa y el absurdo",
    x: 50,
    y: 13,
  },
  {
    nombre: "José Saramago",
    relacion: "La conciencia activa",
    x: 82,
    y: 28,
  },
  {
    nombre: "Samuel Beckett",
    relacion: "El silencio y la espera",
    x: 89,
    y: 58,
  },
  {
    nombre: "Abbas Kiarostami",
    relacion: "La mirada ética",
    x: 72,
    y: 84,
  },
  {
    nombre: "Andrei Tarkovski",
    relacion: "El tiempo espiritual",
    x: 28,
    y: 84,
  },
  {
    nombre: "W. G. Sebald",
    relacion: "Memoria y ruinas",
    x: 11,
    y: 58,
  },
  {
    nombre: "Simone Weil",
    relacion: "Atención y lucidez",
    x: 18,
    y: 28,
  },
];

const TRIPTICO = [
  {
    numero: "01",
    titulo: "Presencia en el tríptico",
    texto: "La conciencia del límite y la justicia humana.",
  },
  {
    numero: "02",
    titulo: "Constelación ética",
    texto: "Racionalidad moral, solidaridad, medida y compasión.",
  },
  {
    numero: "03",
    titulo: "Pregunta central",
    texto: "¿Cómo vivir sin explicaciones absolutas y seguir siendo justo?",
  },
];

export default function SalaCamusLamina() {
  const ficha = obtenerFichaCuratorial("Albert Camus");

  if (!ficha) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        No se encontró la ficha curatorial de Albert Camus.
      </main>
    );
  }

  return (
    <main className="camus-lamina">
      <style jsx global>{`
        html,
        body {
          background: #050504;
        }

        body {
          margin: 0;
        }

        .camus-lamina,
        .camus-lamina * {
          box-sizing: border-box;
        }

        .camus-lamina {
          --oro: #b08346;
          --oro-claro: #d1ad70;
          --papel: #d7c3a0;
          --texto: #a99a81;
          --linea: rgba(176, 131, 70, 0.33);

          min-height: 100vh;
          overflow-x: auto;
          background:
            radial-gradient(
              circle at 55% 10%,
              rgba(148, 100, 36, 0.09),
              transparent 24%
            ),
            linear-gradient(180deg, #050504 0%, #070604 100%);
          color: var(--papel);
        }

        .camus-lamina::before {
          content: "";
          position: fixed;
          inset: 0;
          z-index: 40;
          pointer-events: none;
          opacity: 0.11;
          mix-blend-mode: soft-light;
          background-image:
            url("/artistas/camus/textura-grano.png"),
            radial-gradient(
              circle at 52% 8%,
              rgba(204, 153, 74, 0.15),
              transparent 35%
            );
          background-repeat: repeat, no-repeat;
          background-size: 520px 520px, cover;
        }

        .camus-lamina::after {
          content: "";
          position: fixed;
          inset: 0;
          z-index: 39;
          pointer-events: none;
          box-shadow:
            inset 0 0 160px rgba(0, 0, 0, 0.72),
            inset 0 0 36px rgba(176, 128, 54, 0.1);
        }

        .camus-barra {
          height: 58px;
          min-width: 1220px;
          display: grid;
          grid-template-columns: clamp(260px, 16vw, 340px) minmax(0, 1fr) clamp(480px, 29vw, 650px);
          align-items: center;
          border-bottom: 1px solid var(--linea);
          background: rgba(5, 5, 4, 0.97);
        }

        .camus-hoja {
          width: 100%;
          min-width: 1220px;
          max-width: none;
          height: calc(100vh - 58px);
          min-height: 920px;
          margin: 0;
          display: grid;
          grid-template-columns: clamp(260px, 16vw, 340px) minmax(0, 1fr) clamp(480px, 29vw, 650px);
          grid-template-rows: 40fr 25fr 10fr 17fr 8fr;
          border-left: 1px solid var(--linea);
          border-right: 1px solid var(--linea);
          background:
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.012),
              transparent 17%,
              transparent 83%,
              rgba(255, 255, 255, 0.01)
            );
        }

        .lamina-panel {
          position: relative;
          overflow: hidden;
          border-right: 1px solid var(--linea);
          border-bottom: 1px solid var(--linea);
        }

        .camus-lateral {
          grid-column: 1;
          grid-row: 1 / 6;
        }

        .camus-heroe {
          grid-column: 2;
          grid-row: 1;
        }

        .camus-constelacion {
          grid-column: 3;
          grid-row: 1;
        }

        .camus-centro {
          grid-column: 2;
          grid-row: 2;
        }

        .camus-triptico {
          grid-column: 3;
          grid-row: 2 / 4;
        }

        .camus-tiempo {
          grid-column: 2;
          grid-row: 3;
        }

        .camus-archivo {
          grid-column: 2;
          grid-row: 4;
        }

        .camus-cita {
          grid-column: 3;
          grid-row: 4;
        }

        .camus-pie {
          grid-column: 2 / 4;
          grid-row: 5;
        }

        .camus-heroe-interior {
          height: 100%;
          display: grid;
          grid-template-columns: 52% 48%;
        }

        .camus-retrato {
          position: relative;
          overflow: hidden;
        }

        .camus-retrato img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 52% center;
          transform: scale(1);
          filter: grayscale(0.12) sepia(0.12) contrast(1.04) brightness(1.18);
        }

        .camus-retrato::before {
          content: "";
          position: absolute;
          z-index: 2;
          inset: 0;
          background:
            linear-gradient(
              90deg,
              #080705 0%,
              rgba(8, 7, 5, 0.26) 12%,
              transparent 43%
            ),
            linear-gradient(
              0deg,
              rgba(6, 5, 4, 0.28),
              transparent 38%
            );
          pointer-events: none;
        }

        .camus-centro-interior {
          height: 100%;
          display: grid;
          grid-template-columns: 29% 31% 40%;
        }

        .camus-centro-interior > article {
          min-width: 0;
          padding: 21px 22px;
          border-right: 1px solid var(--linea);
        }

        .camus-centro-interior > article:last-child {
          border-right: 0;
        }

        .camus-obras {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 10px;
          margin-top: 15px;
        }

        .camus-cronologia {
          position: relative;
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 18px;
          margin-top: 19px;
        }

        .camus-cronologia::before {
          content: "";
          position: absolute;
          left: 4px;
          right: 4px;
          top: 4px;
          height: 1px;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(211, 164, 91, 0.85) 5%,
              rgba(211, 164, 91, 0.85) 95%,
              transparent
            );
        }

        .camus-archivo-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 13px;
          margin-top: 12px;
        }

        @media (max-width: 1500px) {
          .camus-barra,
          .camus-hoja {
            grid-template-columns: 230px minmax(0, 1fr) 410px;
          }

          .camus-centro-interior > article {
            padding: 18px;
          }
        }

        @media (max-width: 1219px) {
          .camus-barra,
          .camus-hoja {
            min-width: 0;
          }

          .camus-barra {
            display: flex;
            justify-content: space-between;
            padding: 0 20px;
          }

          .camus-hoja {
            display: block;
            height: auto;
            min-height: 0;
          }

          .camus-lateral {
            display: none;
          }

          .camus-heroe,
          .camus-constelacion,
          .camus-centro,
          .camus-triptico,
          .camus-tiempo,
          .camus-archivo,
          .camus-cita,
          .camus-pie {
            min-height: auto;
          }

          .camus-heroe-interior,
          .camus-centro-interior {
            grid-template-columns: minmax(0, 1fr);
          }

          .camus-retrato {
            min-height: 420px;
          }

          .camus-centro-interior > article {
            border-right: 0;
            border-bottom: 1px solid var(--linea);
          }

          .camus-obras,
          .camus-archivo-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .camus-cronologia {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .camus-cronologia::before {
            display: none;
          }
        }
      `}</style>

      <header className="camus-barra">
        <div className="flex h-full items-center gap-3 border-r border-[#b08346]/30 px-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#b08346]/55 text-[#d0a25b]">
            ✦
          </span>

          <p className="whitespace-nowrap font-serif text-[18px] uppercase tracking-[0.1em] text-[#d5bf99]">
            Poema Universal
          </p>
        </div>

        <div className="text-center text-[11px] uppercase tracking-[0.27em] text-[#b78b4b]">
          Atlas &nbsp;&nbsp;/&nbsp;&nbsp; Artistas fundamentales
        </div>

        <div className="flex h-full items-center justify-end border-l border-[#b08346]/30 px-6">
          <Link
            href="/artistas"
            className="text-[10px] uppercase tracking-[0.22em] text-[#b99457]"
          >
            Biblioteca invisible &nbsp;⌕
          </Link>
        </div>
      </header>

      <section className="camus-hoja">
        <aside className="camus-lateral lamina-panel px-8 py-9">
          <h1 className="font-serif text-[30px] uppercase leading-8 tracking-[0.12em] text-[#caa56b]">
            Artistas
            <br />
            fundamentales
          </h1>

          <p className="mt-7 text-[13px] leading-[1.72] text-[#a0937e]">
            Un atlas de cien conciencias que transformaron la cultura para
            siempre. No es una enciclopedia. Es un mapa vivo de pensamiento,
            creación e influencia.
          </p>

          <div className="mt-8 border-t border-[#b08346]/26 pt-7">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#b68a4c]">
              Principios del diseño
            </p>

            <div className="mt-6 space-y-6">
              {PRINCIPIOS.map((principio) => (
                <article
                  key={principio.titulo}
                  className="grid grid-cols-[38px_1fr] gap-3"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#b08346]/48 text-[#c29652]">
                    {principio.icono}
                  </span>

                  <div>
                    <h2 className="font-serif text-[15px] text-[#c9ad7e]">
                      {principio.titulo}
                    </h2>

                    <p className="mt-1 text-[11px] leading-4 text-[#7f7463]">
                      {principio.texto}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="absolute bottom-8 left-8 right-8 border-t border-[#b08346]/26 pt-6 text-center">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#b68a4c]">
              Explorar el Atlas
            </p>

            <Link
              href="/artistas"
              className="mt-4 block border border-[#b08346]/40 px-3 py-4 text-[10px] uppercase tracking-[0.2em] text-[#c49a58]"
            >
              Ver todos los artistas
            </Link>
          </div>
        </aside>

        <section className="camus-heroe lamina-panel">
          <div className="camus-heroe-interior">
            <div className="relative px-9 py-7">
              <Link
                href="/artistas"
                className="text-[10px] uppercase tracking-[0.22em] text-[#b68a4c]"
              >
                ← Volver al Atlas
              </Link>

              <p className="mt-8 text-[10px] uppercase tracking-[0.25em] text-[#a97d41]">
                AU-001 · Archivo literario
              </p>

              <h2 className="mt-5 font-serif text-[94px] uppercase leading-[0.8] tracking-[-0.052em] text-[#d1b990]">
                Albert
                <br />
                Camus
              </h2>

              <p className="mt-6 font-serif text-[19px] tracking-[0.13em] text-[#ba9359]">
                1913–1960
              </p>

              <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-[#ac8146]">
                Escritor · Ensayista · Pensador
              </p>

              <blockquote className="absolute bottom-20 left-9 max-w-[430px] font-serif text-[25px] italic leading-8 text-[#c6a977]">
                Una de las conciencias morales decisivas del siglo XX.
              </blockquote>
            </div>

            <div className="camus-retrato">
              <img
                src="/artistas/camus/hero-camus.jpg"
                alt="Albert Camus"
              />
            </div>
          </div>
        </section>

        <section className="camus-constelacion lamina-panel px-6 py-5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-[18px] uppercase tracking-[0.09em] text-[#c6a26a]">
              Constelación de influencias
            </h2>

            <span className="text-[9px] uppercase tracking-[0.2em] text-[#a97d41]">
              Ver leyenda ◉
            </span>
          </div>

          <div
            className="relative mx-auto mt-2 w-full max-w-[560px]"
            style={{ height: "calc(100% - 32px)" }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(189,139,66,0.75) 0 1px, transparent 1.3px)",
                backgroundSize: "21px 21px",
              }}
            />

            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              {CONSTELACION.map((nodo) => (
                <line
                  key={nodo.nombre}
                  x1="50"
                  y1="50"
                  x2={nodo.x}
                  y2={nodo.y}
                  stroke="rgba(205,158,84,0.68)"
                  strokeWidth="0.3"
                />
              ))}

              {CONSTELACION.map((nodo) => (
                <circle
                  key={`punto-${nodo.nombre}`}
                  cx={nodo.x}
                  cy={nodo.y}
                  r="1.05"
                  fill="#e8be73"
                />
              ))}
            </svg>

            <div
              className="absolute z-10 flex h-[72px] w-[72px] items-center justify-center rounded-full border border-[#c1934d] bg-[#090704] text-center shadow-[0_0_30px_rgba(188,137,59,0.28)]"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <span className="font-serif text-[14px] uppercase leading-4 text-[#d4b47e]">
                Albert
                <br />
                Camus
              </span>
            </div>

            {CONSTELACION.map((nodo) => (
              <div
                key={nodo.nombre}
                className="absolute z-20 w-[122px] -translate-x-1/2 -translate-y-1/2 text-center"
                style={{
                  left: `${nodo.x}%`,
                  top: `${nodo.y}%`,
                }}
              >
                <p className="font-serif text-[11px] uppercase leading-3 tracking-[0.07em] text-[#c5a878]">
                  {nodo.nombre}
                </p>

                <p className="mt-1 text-[9px] leading-3 text-[#776a59]">
                  {nodo.relacion}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="camus-centro lamina-panel">
          <div className="camus-centro-interior">
            <article>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#c09350]">
                Lugar en la literatura
              </p>

              <p className="mt-5 text-[15px] leading-[1.72] text-[#b0a088]">
                Camus renovó la literatura del siglo XX al colocar la
                experiencia del absurdo en el centro de la condición humana,
                no como derrota, sino como punto de partida para una ética de
                la lucidez y la solidaridad.
              </p>

              <p className="mt-3 text-[15px] leading-[1.72] text-[#b0a088]">
                Su obra une filosofía, novela, ensayo y conciencia moral.
              </p>
            </article>

            <article>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#c09350]">
                Qué cambió con él
              </p>

              <div className="mt-5 space-y-[10px]">
                {CAMBIOS.map((cambio, index) => (
                  <div
                    key={cambio}
                    className="grid grid-cols-[24px_1fr] items-start gap-3"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#b08346]/45 text-[9px] text-[#bd914e]">
                      {index + 1}
                    </span>

                    <p className="text-[12px] leading-5 text-[#a5967e]">
                      {cambio}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#c09350]">
                Obras fundamentales
              </p>

              <div className="camus-obras">
                {OBRAS.map((obra) => (
                  <div key={obra.titulo} className="min-w-0">
                    <div className="relative h-[126px] overflow-hidden border border-[#b08346]/38 bg-[#090704]">
                      <img
                        src={obra.imagen}
                        alt={obra.titulo}
                        loading="lazy"
                        className="h-full w-full object-cover grayscale-[0.12] sepia-[0.22] transition duration-700 hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-[#b08346]/10" />

                      <span className="absolute bottom-2 right-2 font-serif text-lg text-[#e1bd7b]/90">
                        {obra.simbolo}
                      </span>
                    </div>

                    <h3 className="mt-2 font-serif text-[12px] italic leading-3 text-[#c5a777]">
                      {obra.titulo}
                    </h3>

                    <p className="mt-1 text-[9px] uppercase tracking-[0.11em] text-[#a77c41]">
                      {obra.anio}
                    </p>

                    <p className="mt-1 text-[9px] leading-3 text-[#756a59]">
                      {obra.texto}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <aside className="camus-triptico lamina-panel px-6 py-6">
          <h2 className="font-serif text-[18px] uppercase tracking-[0.09em] text-[#c6a26a]">
            En diálogo con el tríptico
          </h2>

          <div className="mt-7 space-y-6">
            {TRIPTICO.map((elemento) => (
              <article
                key={elemento.numero}
                className="grid grid-cols-[38px_1fr] gap-4"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#b08346]/45 font-serif text-[13px] text-[#bd914f]">
                  {elemento.numero}
                </span>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.19em] text-[#ae8245]">
                    {elemento.titulo}
                  </p>

                  <p className="mt-2 text-[12px] leading-[1.55] text-[#887b68]">
                    {elemento.texto}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </aside>

        <section className="camus-tiempo lamina-panel px-6 py-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#c09350]">
            Línea de tiempo
          </p>

          <div className="camus-cronologia">
            {CRONOLOGIA.map(([anio, texto]) => (
              <article key={anio} className="relative">
                <span className="relative z-10 block h-[9px] w-[9px] rounded-full bg-[#d2a65e] shadow-[0_0_12px_rgba(210,166,94,0.68)]" />

                <p className="mt-2 font-serif text-[14px] text-[#bd965c]">
                  {anio}
                </p>

                <p className="mt-1 text-[9px] leading-3 text-[#746956]">
                  {texto}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="camus-archivo lamina-panel px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#c09350]">
              Archivo material
            </p>

            <span className="text-[9px] uppercase tracking-[0.18em] text-[#8e6c40]">
              Ver todo el archivo
            </span>
          </div>

          <div className="camus-archivo-grid">
            {ARCHIVO.map((pieza) => (
              <article
                key={pieza.titulo}
                className="grid h-[118px] overflow-hidden border border-[#b08346]/30 bg-[#090805]"
                style={{
                  gridTemplateColumns: "0.9fr 1.1fr",
                }}
              >
                <div className="p-3">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-[#ad8247]">
                    {pieza.tipo}
                  </p>

                  <h3 className="mt-2 font-serif text-[13px] leading-4 text-[#c4a575]">
                    {pieza.titulo}
                  </h3>

                  <p className="mt-1 text-[9px] text-[#746856]">
                    {pieza.lugar}
                  </p>
                </div>

                <div className="relative overflow-hidden border-l border-[#b08346]/30 bg-[#0c0905]">
                  <img
                    src={pieza.imagen}
                    alt={pieza.titulo}
                    loading="lazy"
                    className="h-full w-full object-cover grayscale-[0.08] sepia-[0.16] brightness-[1.08]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/25" />

                  <span className="absolute bottom-2 right-2 text-lg text-[#e0b875]">
                    {pieza.simbolo}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="camus-cita lamina-panel flex items-center justify-center px-8">
          <blockquote className="border border-[#b08346]/28 px-8 py-6 text-center font-serif text-[20px] italic leading-7 text-[#b69b70]">
            «La verdadera generosidad para con el porvenir consiste en darlo
            todo en el presente.»
            <span className="mt-3 block text-[13px] text-[#97794b]">
              Albert Camus
            </span>
          </blockquote>
        </section>

        <footer className="camus-pie grid grid-cols-[1fr_390px] border-t border-[#b08346]/30">
          <div className="flex items-center gap-5 px-7">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#b08346]/45 text-xl text-[#b78b4c]">
              ✦
            </span>

            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#c09350]">
                Conectado con Poema Universal
              </p>

              <p className="mt-1 font-serif text-[14px] italic text-[#8c7b61]">
                Camus como nodo de conciencia dentro del mapa de lo humano.
              </p>
            </div>
          </div>

          <Link
            href="/artistas"
            className="flex items-center justify-center border-l border-[#b08346]/30 bg-gradient-to-r from-[#181108] to-[#271a0b] text-[12px] uppercase tracking-[0.2em] text-[#c59e5b]"
          >
            Explorar su constelación →
          </Link>
        </footer>
      </section>
    </main>
  );
}
