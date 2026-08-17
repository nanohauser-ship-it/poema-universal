"use client";

import Link from "next/link";
import { obtenerFichaCuratorial } from "../fichas-curatoriales";

const CAMBIOS = [
  "El absurdo como punto de partida filosófico, no como caída.",
  "La dignidad humana frente al sinsentido del mundo.",
  "La rebelión como afirmación de límites y justicia.",
  "La lucidez sin cinismo: mirar de frente y actuar con medida.",
  "La claridad moral convertida en forma literaria.",
];

const CRONOLOGIA = [
  ["1913", "Nace en Mondovi, en la Argelia francesa."],
  ["1942", "Publica El extranjero y El mito de Sísifo."],
  ["1947", "Publica La peste."],
  ["1951", "Publica El hombre rebelde."],
  ["1957", "Recibe el Premio Nobel de Literatura."],
  ["1960", "Muere en un accidente de automóvil."],
];

const ARCHIVO = [
  {
    tipo: "Reliquia",
    titulo: "Cuaderno de notas",
    detalle: "Argelia, 1946",
    simbolo: "▤",
  },
  {
    tipo: "Manuscrito",
    titulo: "Borradores de El extranjero",
    detalle: "Proceso de escritura",
    simbolo: "⌁",
  },
  {
    tipo: "Fotografía",
    titulo: "Argel, 1940",
    detalle: "Memoria y territorio",
    simbolo: "◫",
  },
  {
    tipo: "Biblioteca invisible",
    titulo: "Libros que formaron su pensamiento",
    detalle: "Genealogía intelectual",
    simbolo: "▥",
  },
];

const CONSTELACION = [
  {
    nombre: "Franz Kafka",
    relacion: "La culpa y el absurdo",
    x: 50,
    y: 14,
  },
  {
    nombre: "José Saramago",
    relacion: "La conciencia activa",
    x: 83,
    y: 27,
  },
  {
    nombre: "Samuel Beckett",
    relacion: "El silencio y la espera",
    x: 90,
    y: 58,
  },
  {
    nombre: "Abbas Kiarostami",
    relacion: "La mirada ética",
    x: 73,
    y: 84,
  },
  {
    nombre: "Andrei Tarkovski",
    relacion: "El tiempo espiritual",
    x: 27,
    y: 84,
  },
  {
    nombre: "W. G. Sebald",
    relacion: "Memoria y ruinas",
    x: 10,
    y: 58,
  },
  {
    nombre: "Simone Weil",
    relacion: "Atención y lucidez",
    x: 17,
    y: 27,
  },
];

const ANIOS: Record<string, string> = {
  "El extranjero": "1942",
  "El mito de Sísifo": "1942",
  "La peste": "1947",
  "El hombre rebelde": "1951",
  "El primer hombre": "Póst. 1994",
};

const SIMBOLOS = ["○", "◒", "▥", "⌁", "◇"];

export default function SalaCamusMaestra() {
  const ficha = obtenerFichaCuratorial("Albert Camus");

  if (!ficha) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        No se encontró la ficha de Albert Camus.
      </main>
    );
  }

  return (
    <main className="camus-master min-h-screen bg-[#050504] text-[#d8c6a6]">
      <style>{`
        .camus-master {
          --gold: #a98247;
          --gold-soft: rgba(169, 130, 71, 0.38);
          --line: rgba(169, 130, 71, 0.33);
          --paper: #dbc8a8;
          background:
            radial-gradient(circle at 58% 12%, rgba(125, 88, 38, 0.12), transparent 25%),
            linear-gradient(180deg, #050504 0%, #070604 100%);
        }

        .camus-layout {
          display: grid;
          grid-template-columns: 270px minmax(0, 1fr);
        }

        .camus-sidebar {
          position: sticky;
          top: 58px;
          height: calc(100vh - 58px);
          overflow-y: auto;
        }

        .camus-dashboard {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 440px;
        }

        .camus-hero {
          display: grid;
          grid-template-columns: minmax(0, 0.88fr) minmax(330px, 0.72fr);
        }

        .camus-middle {
          display: grid;
          grid-template-columns: 0.88fr 1fr 1.38fr;
        }

        .camus-archive {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .camus-bottom {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 440px;
        }

        @media (max-width: 1250px) {
          .camus-layout {
            grid-template-columns: 220px minmax(0, 1fr);
          }

          .camus-dashboard,
          .camus-bottom {
            grid-template-columns: minmax(0, 1fr);
          }

          .camus-constellation,
          .camus-triptych {
            border-left: 0 !important;
            border-top: 1px solid var(--line);
          }
        }

        @media (max-width: 900px) {
          .camus-layout {
            display: block;
          }

          .camus-sidebar {
            display: none;
          }

          .camus-hero,
          .camus-middle,
          .camus-archive {
            grid-template-columns: minmax(0, 1fr);
          }
        }
      `}</style>

      <header className="sticky top-0 z-50 h-[58px] border-b border-[#a98247]/30 bg-[#050504]/95 backdrop-blur-xl">
        <div className="flex h-full items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#a98247]/55 text-[#c79b55]">
              ✦
            </span>

            <p className="font-serif text-lg uppercase tracking-[0.13em] text-[#d8c6a6]">
              Poema Universal
            </p>
          </div>

          <p className="hidden text-[10px] uppercase tracking-[0.25em] text-[#b48c51] md:block">
            Atlas &nbsp; / &nbsp; Artistas fundamentales
          </p>

          <Link
            href="/artistas"
            className="border-l border-[#a98247]/30 pl-6 text-[9px] uppercase tracking-[0.23em] text-[#c49a5a]"
          >
            Biblioteca invisible
          </Link>
        </div>
      </header>

      <div className="camus-layout">
        <aside className="camus-sidebar border-r border-[#a98247]/30 px-8 py-9">
          <h1 className="font-serif text-[23px] uppercase leading-8 tracking-[0.11em] text-[#d0ae77]">
            Artistas
            <br />
            fundamentales
          </h1>

          <p className="mt-7 text-[12px] leading-6 text-[#a9987d]">
            Un atlas de cien conciencias que transformaron la cultura para
            siempre. No es una enciclopedia. Es un mapa vivo de pensamiento,
            creación e influencia.
          </p>

          <div className="mt-8 border-t border-[#a98247]/25 pt-7">
            <p className="text-[9px] uppercase tracking-[0.24em] text-[#b88e50]">
              Principios del diseño
            </p>

            <div className="mt-6 space-y-7">
              {[
                ["▥", "Belleza atemporal", "Archivo, biblioteca y objeto de estudio."],
                ["⌁", "Revelación progresiva", "La información se descubre por capas."],
                ["◇", "Conexión significativa", "Cada presencia dialoga con otras."],
                ["≋", "Navegación intuitiva", "Explorar el Atlas debe sentirse como viajar."],
                ["▤", "Profundidad y silencio", "Espacio suficiente para una lectura lenta."],
              ].map(([icono, titulo, texto]) => (
                <article key={titulo} className="grid grid-cols-[38px_1fr] gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#a98247]/45 text-[#bf9351]">
                    {icono}
                  </span>

                  <div>
                    <h2 className="font-serif text-[14px] text-[#ccb083]">
                      {titulo}
                    </h2>

                    <p className="mt-1 text-[10px] leading-5 text-[#887b68]">
                      {texto}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-10 border-t border-[#a98247]/25 pt-7 text-center">
            <p className="text-[9px] uppercase tracking-[0.24em] text-[#b88e50]">
              Explorar el Atlas
            </p>

            <Link
              href="/artistas"
              className="mt-5 block border border-[#a98247]/40 px-4 py-4 text-[9px] uppercase tracking-[0.2em] text-[#c99b57]"
            >
              Ver todos los artistas
            </Link>
          </div>
        </aside>

        <div>
          <div className="camus-dashboard border-b border-[#a98247]/30">
            <section className="camus-hero min-h-[330px]">
              <div className="relative p-9">
                <Link
                  href="/artistas"
                  className="text-[9px] uppercase tracking-[0.22em] text-[#ba8e4d]"
                >
                  ← Volver al Atlas
                </Link>

                <p className="mt-8 text-[9px] uppercase tracking-[0.26em] text-[#a98247]">
                  AU-001 · Archivo literario
                </p>

                <h2 className="mt-4 font-serif text-[70px] uppercase leading-[0.82] tracking-[-0.045em] text-[#d8c4a1]">
                  Albert
                  <br />
                  Camus
                </h2>

                <p className="mt-7 font-serif text-lg tracking-[0.12em] text-[#b69056]">
                  1913–1960
                </p>

                <p className="mt-2 text-[9px] uppercase tracking-[0.23em] text-[#b28648]">
                  Escritor · Ensayista · Pensador
                </p>

                <blockquote className="mt-7 max-w-md font-serif text-[20px] italic leading-7 text-[#c9ae7f]">
                  Una de las conciencias morales decisivas del siglo XX.
                </blockquote>
              </div>

              <div className="relative min-h-[330px] overflow-hidden border-l border-[#a98247]/25">
                <img
                  src="/artistas/portadas/AU-001-albert-camus.webp"
                  alt="Albert Camus"
                  className="absolute h-full w-full scale-[1.48] object-cover object-[72%_58%] grayscale-[0.3]"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-[#080705] via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080705]/55 via-transparent to-transparent" />

                <div className="absolute bottom-7 right-7 border-l border-[#a98247]/50 pl-5">
                  <p className="text-[8px] uppercase tracking-[0.2em] text-[#a98247]">
                    Lugar de nacimiento
                  </p>
                  <p className="mt-2 font-serif text-sm text-[#cab28a]">
                    Mondovi, Argelia francesa
                  </p>

                  <p className="mt-5 text-[8px] uppercase tracking-[0.2em] text-[#a98247]">
                    Premio Nobel
                  </p>
                  <p className="mt-2 font-serif text-xl text-[#d1ad73]">
                    1957
                  </p>
                </div>
              </div>
            </section>

            <section className="camus-constellation border-l border-[#a98247]/30 p-7">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-[17px] uppercase tracking-[0.1em] text-[#c7a36a]">
                  Constelación de influencias
                </h2>

                <span className="text-[8px] uppercase tracking-[0.18em] text-[#a98247]">
                  Ver leyenda
                </span>
              </div>

              <div className="relative mx-auto mt-4 aspect-[1.25] max-w-[430px]">
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, rgba(190,143,72,0.7) 0 1px, transparent 1.5px)",
                    backgroundSize: "23px 23px",
                  }}
                />

                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 h-full w-full"
                >
                  {CONSTELACION.map((nodo) => (
                    <line
                      key={nodo.nombre}
                      x1="50"
                      y1="50"
                      x2={nodo.x}
                      y2={nodo.y}
                      stroke="rgba(205,158,84,0.68)"
                      strokeWidth="0.32"
                    />
                  ))}

                  {CONSTELACION.map((nodo) => (
                    <circle
                      key={`punto-${nodo.nombre}`}
                      cx={nodo.x}
                      cy={nodo.y}
                      r="1.1"
                      fill="#edc477"
                    />
                  ))}
                </svg>

                <div
                  className="absolute flex h-[82px] w-[82px] items-center justify-center rounded-full border border-[#c69750] bg-[#090704] text-center shadow-[0_0_30px_rgba(188,137,59,0.28)]"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <span className="font-serif text-sm uppercase leading-5 text-[#d5b57f]">
                    Albert
                    <br />
                    Camus
                  </span>
                </div>

                {CONSTELACION.map((nodo) => (
                  <div
                    key={nodo.nombre}
                    className="absolute w-[112px] -translate-x-1/2 -translate-y-1/2 text-center"
                    style={{
                      left: `${nodo.x}%`,
                      top: `${nodo.y}%`,
                    }}
                  >
                    <p className="font-serif text-[11px] uppercase leading-4 tracking-[0.08em] text-[#c7aa7b]">
                      {nodo.nombre}
                    </p>

                    <p className="mt-1 text-[8px] leading-3 text-[#7e705e]">
                      {nodo.relacion}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="camus-dashboard">
            <div>
              <section className="camus-middle border-b border-[#a98247]/30">
                <article className="border-r border-[#a98247]/30 p-6">
                  <p className="text-[9px] uppercase tracking-[0.22em] text-[#b4894a]">
                    Lugar en la literatura
                  </p>

                  <p className="mt-5 text-[12px] leading-6 text-[#aa9a80]">
                    Camus renovó la literatura del siglo XX al colocar la
                    experiencia del absurdo en el centro de la condición
                    humana, no como derrota, sino como punto de partida para
                    una ética de la lucidez y la solidaridad.
                  </p>
                </article>

                <article className="border-r border-[#a98247]/30 p-6">
                  <p className="text-[9px] uppercase tracking-[0.22em] text-[#b4894a]">
                    Qué cambió con él
                  </p>

                  <div className="mt-5 space-y-3">
                    {CAMBIOS.map((cambio, index) => (
                      <div
                        key={cambio}
                        className="grid grid-cols-[25px_1fr] gap-3"
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#a98247]/45 text-[8px] text-[#b88b48]">
                          {index + 1}
                        </span>

                        <p className="text-[10px] leading-5 text-[#9d8d75]">
                          {cambio}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="p-6">
                  <p className="text-[9px] uppercase tracking-[0.22em] text-[#b4894a]">
                    Obras fundamentales
                  </p>

                  <div className="mt-5 grid grid-cols-5 gap-3">
                    {ficha.obras.slice(0, 5).map((obra, index) => (
                      <div key={obra.titulo}>
                        <div
                          className="flex aspect-[0.78] items-center justify-center border border-[#a98247]/25 text-3xl text-[#aa864d]"
                          style={{
                            background:
                              "radial-gradient(circle at 50% 20%, rgba(175,129,62,0.16), transparent 60%), #0b0906",
                          }}
                        >
                          {SIMBOLOS[index]}
                        </div>

                        <h3 className="mt-3 font-serif text-[13px] italic leading-4 text-[#c7aa7c]">
                          {obra.titulo}
                        </h3>

                        <p className="mt-1 text-[8px] uppercase tracking-[0.14em] text-[#a98247]">
                          {ANIOS[obra.titulo] || "Obra esencial"}
                        </p>

                        <p className="mt-2 text-[9px] leading-4 text-[#827563]">
                          {obra.razon}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              </section>

              <section className="border-b border-[#a98247]/30 px-6 py-5">
                <p className="text-[9px] uppercase tracking-[0.22em] text-[#b4894a]">
                  Línea de tiempo
                </p>

                <div className="relative mt-6 grid grid-cols-6 gap-5">
                  <div className="absolute left-0 right-0 top-[5px] h-px bg-[#a98247]/55" />

                  {CRONOLOGIA.map(([anio, texto]) => (
                    <article key={anio} className="relative">
                      <span className="relative block h-[9px] w-[9px] rounded-full bg-[#d3aa64] shadow-[0_0_12px_rgba(211,170,100,0.7)]" />

                      <p className="mt-3 font-serif text-[14px] text-[#c49f65]">
                        {anio}
                      </p>

                      <p className="mt-1 text-[9px] leading-4 text-[#807360]">
                        {texto}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="px-6 py-5">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] uppercase tracking-[0.22em] text-[#b4894a]">
                    Archivo material
                  </p>

                  <span className="text-[8px] uppercase tracking-[0.18em] text-[#8d7149]">
                    Ver todo el archivo
                  </span>
                </div>

                <div className="camus-archive mt-4 gap-4">
                  {ARCHIVO.map((pieza) => (
                    <article
                      key={pieza.titulo}
                      className="grid min-h-[105px] grid-cols-[1fr_72px] overflow-hidden border border-[#a98247]/30 bg-[#090805]"
                    >
                      <div className="p-4">
                        <p className="text-[8px] uppercase tracking-[0.18em] text-[#b4884a]">
                          {pieza.tipo}
                        </p>

                        <h3 className="mt-2 font-serif text-[13px] text-[#cab083]">
                          {pieza.titulo}
                        </h3>

                        <p className="mt-1 text-[9px] text-[#756a5a]">
                          {pieza.detalle}
                        </p>
                      </div>

                      <div className="flex items-center justify-center border-l border-[#a98247]/25 bg-[#100d08] text-3xl text-[#a77f45]">
                        {pieza.simbolo}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <aside className="camus-triptych border-l border-[#a98247]/30">
              <section className="border-b border-[#a98247]/30 p-7">
                <p className="font-serif text-[17px] uppercase tracking-[0.1em] text-[#c7a36a]">
                  En diálogo con el tríptico
                </p>

                <div className="mt-6 space-y-6">
                  {ficha.triptico.map((conexion, index) => (
                    <article
                      key={conexion.obra}
                      className="grid grid-cols-[36px_1fr] gap-4"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#a98247]/40 text-[#b58a4c]">
                        {index + 1}
                      </span>

                      <div>
                        <p className="text-[8px] uppercase tracking-[0.2em] text-[#a98247]">
                          {conexion.obra}
                        </p>

                        <p className="mt-2 text-[11px] leading-5 text-[#8d7e68]">
                          {conexion.relacion}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="p-7">
                <blockquote className="border border-[#a98247]/25 p-7 text-center font-serif text-[18px] italic leading-7 text-[#bda476]">
                  «La verdadera generosidad para con el porvenir consiste en
                  darlo todo en el presente.»
                </blockquote>
              </section>
            </aside>
          </div>

          <footer className="camus-bottom border-t border-[#a98247]/30">
            <div className="flex items-center gap-10 px-7 py-5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#a98247]/45 text-2xl text-[#b99152]">
                ✦
              </span>

              <div>
                <p className="text-[9px] uppercase tracking-[0.22em] text-[#a98247]">
                  Conectado con Poema Universal
                </p>

                <p className="mt-2 font-serif text-[15px] italic text-[#9d8a6c]">
                  Camus como nodo de conciencia dentro del mapa de lo humano.
                </p>
              </div>
            </div>

            <Link
              href="/artistas"
              className="flex items-center justify-center border-l border-[#a98247]/30 bg-[#1b140b] px-8 text-[11px] uppercase tracking-[0.2em] text-[#c7a25f]"
            >
              Explorar su constelación →
            </Link>
          </footer>
        </div>
      </div>
    </main>
  );
}
