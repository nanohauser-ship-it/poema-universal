import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tienda | Poema Universal",
  description:
    "Libros, imágenes y objetos nacidos del universo de Poema Universal.",
};

const futureRooms = [
  {
    number: "01",
    title: "Libros",
    subtitle: "Memorias que perduran",
    description:
      "Las obras de José Naveiro y las futuras ediciones nacidas dentro de este universo.",
  },
  {
    number: "02",
    title: "Imágenes",
    subtitle: "Ecos de lo vivido",
    description:
      "Láminas, cartografías, símbolos, retratos y escenas nacidas de las obras.",
  },
  {
    number: "03",
    title: "Objetos",
    subtitle: "Huellas de lo cotidiano",
    description:
      "Cuadernos, postales, marcapáginas y piezas concebidas para conservar memoria.",
  },
  {
    number: "04",
    title: "Ediciones",
    subtitle: "Piezas irrepetibles",
    description:
      "Ediciones especiales y futuras formas materiales vinculadas a Poema Universal.",
  },
  {
    number: "05",
    title: "Imagen y sonido",
    subtitle: "Presencias en tránsito",
    description:
      "Lecturas, archivos sonoros, piezas audiovisuales y futuras ediciones digitales.",
  },
];

export default function StorePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        overflowX: "hidden",
        background: "#071017",
        color: "#f1e7d7",
      }}
    >
      <style>{`
        @keyframes tiendaRespira {
          0%, 100% {
            transform: translateY(0px) scale(1);
            filter: brightness(1);
          }

          50% {
            transform: translateY(-3px) scale(1.008);
            filter: brightness(1.035);
          }
        }

        @keyframes haloRespira {
          0%, 100% {
            opacity: .25;
            transform: scale(1);
          }

          50% {
            opacity: .42;
            transform: scale(1.04);
          }
        }

        .tienda-video-vivo {
          animation: tiendaRespira 9s ease-in-out infinite;
          transform-origin: center;
        }

        .tienda-video-halo {
          animation: haloRespira 9s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .tienda-video-vivo,
          .tienda-video-halo {
            animation: none;
          }
        }

        @media (max-width: 900px) {
          .tienda-hero {
            aspect-ratio: 4 / 5 !important;
            min-height: 760px !important;
          }

          .tienda-living-grid {
            grid-template-columns: 1fr !important;
          }

          .tienda-video-oval {
            width: 320px !important;
            height: 205px !important;
          }
        }

        @media (max-width: 520px) {
          .tienda-video-oval {
            width: 270px !important;
            height: 175px !important;
          }
        }
      `}</style>

      {/* =========================================================
          NAVEGACIÓN
      ========================================================= */}

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(5,12,17,0.91)",
          borderBottom: "1px solid rgba(210,165,87,0.20)",
          backdropFilter: "blur(18px)",
        }}
      >
        <div className="mx-auto flex min-h-[68px] max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="font-serif text-xl"
            style={{
              color: "#d5ad66",
              textDecoration: "none",
            }}
          >
            Poema Universal
          </Link>

          <span
            className="hidden sm:block"
            style={{
              fontSize: "8px",
              letterSpacing: ".42em",
              textTransform: "uppercase",
              color: "rgba(213,173,102,.55)",
            }}
          >
            Tienda
          </span>

          <Link
            href="/"
            style={{
              border: "1px solid rgba(213,173,102,.36)",
              padding: "10px 20px",
              fontSize: "8px",
              letterSpacing: ".28em",
              textTransform: "uppercase",
              color: "#e1c58f",
              textDecoration: "none",
            }}
          >
            Volver a la casa
          </Link>
        </div>
      </header>

      {/* =========================================================
          HERO
          GATO2.PNG = ARQUITECTURA
      ========================================================= */}

      <section
        className="tienda-hero"
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          minHeight: "680px",
          maxHeight: "900px",
          overflow: "hidden",
          background: "#071017",
        }}
      >
        {/* FONDO AMBIENTAL */}

        <img
          src="/gato2.PNG"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "block",
            objectFit: "cover",
            objectPosition: "center center",
            filter: "blur(18px) brightness(0.55)",
            transform: "scale(1.06)",
            opacity: 0.65,
          }}
        />

        {/* FOTOGRAFÍA PRINCIPAL */}

        <img
          src="/gato2.PNG"
          alt="Una mujer mayor en una habitación azul junto a un gato, una lámpara y un antiguo televisor."
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "94%",
            height: "94%",
            display: "block",
            objectFit: "contain",
            objectPosition: "center center",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* SOMBRA LOCALIZADA PARA EL TEXTO */}

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(3,10,15,.91) 0%, rgba(3,10,15,.79) 15%, rgba(3,10,15,.56) 29%, rgba(3,10,15,.24) 43%, rgba(3,10,15,.04) 58%, transparent 70%)",
          }}
        />

        {/* OSCURECIMIENTO SUPERIOR */}

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "0 0 auto",
            height: "150px",
            background:
              "linear-gradient(to bottom,rgba(2,7,10,.32),transparent)",
          }}
        />

        {/* FUNDIDO INFERIOR */}

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "auto 0 0",
            height: "150px",
            background:
              "linear-gradient(to bottom,transparent,#071017)",
          }}
        />

        {/* CONTENIDO HERO */}

        <div
          className="mx-auto flex h-full max-w-[1440px] flex-col justify-between px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20"
          style={{
            position: "relative",
            zIndex: 3,
          }}
        >
          <div
            style={{
              maxWidth: "670px",
            }}
          >
            <div className="flex items-center gap-5">
              <span
                style={{
                  fontSize: "8px",
                  letterSpacing: ".52em",
                  textTransform: "uppercase",
                  color: "#d7ad62",
                }}
              >
                Tienda · Poema Universal
              </span>

              <span
                style={{
                  width: "78px",
                  height: "1px",
                  background:
                    "linear-gradient(to right,#d7ad62,transparent)",
                }}
              />
            </div>

            {/* TÍTULO DORADO */}

            <h1
              className="font-serif"
              style={{
                marginTop: "30px",
                marginBottom: 0,
                fontSize: "clamp(64px,7vw,116px)",
                lineHeight: 0.88,
                letterSpacing: "-0.055em",
                color: "#d5a54f",
                textShadow: "0 3px 26px rgba(0,0,0,.36)",
              }}
            >
              Tienda
              <span
                style={{
                  display: "block",
                  color: "#d5a54f",
                }}
              >
                Poema Universal.
              </span>
            </h1>

            {/* ORNAMENTO */}

            <div
              className="flex items-center gap-4"
              style={{
                marginTop: "35px",
              }}
            >
              <span
                style={{
                  width: "95px",
                  height: "1px",
                  background:
                    "linear-gradient(to right,#d5a54f,rgba(213,165,79,.1))",
                }}
              />

              <span
                style={{
                  color: "#d5a54f",
                  fontSize: "15px",
                }}
              >
                ✦
              </span>

              <span
                style={{
                  width: "60px",
                  height: "1px",
                  background:
                    "linear-gradient(to left,#d5a54f,transparent)",
                }}
              />
            </div>

            <p
              className="font-serif"
              style={{
                maxWidth: "520px",
                marginTop: "30px",
                marginBottom: 0,
                fontSize: "clamp(23px,2vw,32px)",
                lineHeight: 1.42,
                color: "#f5ead9",
              }}
            >
              Libros, imágenes y objetos nacidos de una misma memoria.
            </p>

            <p
              style={{
                maxWidth: "470px",
                marginTop: "21px",
                fontSize: "14px",
                lineHeight: 2,
                color: "rgba(245,234,217,.70)",
              }}
            >
              Una tienda construida como extensión material de la obra. Nada
              aparece aquí antes de encontrar una razón para permanecer.
            </p>
          </div>

          {/* PIE HERO */}

          <div
            className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
            style={{
              borderTop: "1px solid rgba(213,165,79,.27)",
              paddingTop: "20px",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "7px",
                  letterSpacing: ".48em",
                  textTransform: "uppercase",
                  color: "#d5a54f",
                }}
              >
                Archivo doméstico · 001
              </p>

              <p
                className="font-serif"
                style={{
                  maxWidth: "520px",
                  margin: "12px 0 0",
                  fontSize: "19px",
                  fontStyle: "italic",
                  lineHeight: 1.55,
                  color: "rgba(245,234,217,.76)",
                }}
              >
                Las cosas permanecen donde alguien aprendió a esperarlas.
              </p>
            </div>

            <p
              style={{
                margin: 0,
                fontSize: "8px",
                letterSpacing: ".22em",
                textTransform: "uppercase",
                color: "rgba(245,234,217,.34)",
              }}
            >
              Cuarto azul · memoria doméstica
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          SALA PRINCIPAL
      ========================================================= */}

      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(180deg,#071017 0%,#07131b 55%,#071017 100%)",
          color: "#f4ead9",
          borderTop: "1px solid rgba(213,165,79,.15)",
        }}
      >
        {/* TEXTURA SUAVE */}

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.035,
            backgroundImage:
              "radial-gradient(circle, rgba(213,165,79,.40) 0.5px, transparent 0.7px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div
          className="mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-12"
          style={{
            position: "relative",
            paddingTop: "64px",
            paddingBottom: "0px",
          }}
        >
          <div
            className="tienda-living-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "0.9fr 1.05fr 0.82fr",
              gap: "54px",
              alignItems: "center",
            }}
          >
            {/* IZQUIERDA */}

            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "8px",
                  letterSpacing: ".48em",
                  textTransform: "uppercase",
                  color: "#d5a54f",
                }}
              >
                Sala principal
              </p>

              <h2
                className="font-serif"
                style={{
                  margin: "22px 0 0",
                  fontSize: "clamp(45px,4.5vw,68px)",
                  lineHeight: 1,
                  letterSpacing: "-.045em",
                  color: "#d5a54f",
                }}
              >
                Todo está
                <span
                  style={{
                    display: "block",
                    color: "#d5a54f",
                  }}
                >
                  todavía por llegar.
                </span>
              </h2>

              <p
                style={{
                  maxWidth: "400px",
                  margin: "22px 0 0",
                  fontSize: "14px",
                  lineHeight: 1.9,
                  color: "rgba(244,234,217,.60)",
                }}
              >
                Cada pieza de esta tienda será una extensión de una historia.
                Nada aquí existe por prisa.
              </p>
            </div>

            {/* =================================================
                CENTRO
                VIDEO OVAL HORIZONTAL
            ================================================= */}

            <div
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                className="tienda-video-halo"
                aria-hidden="true"
                style={{
                  position: "absolute",
                  width: "460px",
                  height: "295px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(ellipse,rgba(71,130,167,.20),rgba(213,165,79,.05) 54%,transparent 76%)",
                  filter: "blur(38px)",
                }}
              />

              <div
                className="tienda-video-vivo tienda-video-oval"
                style={{
                  position: "relative",
                  width: "420px",
                  height: "265px",
                  overflow: "hidden",
                  borderRadius: "50%",
                  background: "#071017",
                  boxShadow:
                    "0 28px 75px rgba(0,0,0,.48), 0 0 0 1px rgba(213,165,79,.18)",
                }}
              >
                <video
                  src="/gatos.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  aria-label="Presencia viva integrada en la tienda"
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",

                    /* AJUSTE FINAL */
                    objectPosition: "center 56%",

                    filter: "brightness(1.08) contrast(1.02)",
                  }}
                />

                {/* VIGNETTE */}

                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    boxShadow:
                      "inset 0 0 45px rgba(2,8,12,.18)",
                    pointerEvents: "none",
                  }}
                />

                {/* CRISTAL */}

                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "12%",
                    top: "5%",
                    width: "34%",
                    height: "18%",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg,rgba(255,255,255,.13),transparent)",
                    filter: "blur(10px)",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>

            {/* DERECHA */}

            <div>
              <div className="flex items-center gap-4">
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#d5a54f",
                    boxShadow:
                      "0 0 14px rgba(213,165,79,.40)",
                  }}
                />

                <p
                  style={{
                    margin: 0,
                    fontSize: "8px",
                    letterSpacing: ".46em",
                    textTransform: "uppercase",
                    color: "#d5a54f",
                  }}
                >
                  Presencia en tránsito
                </p>
              </div>

              <p
                className="font-serif"
                style={{
                  maxWidth: "330px",
                  margin: "22px 0 0",
                  fontSize: "23px",
                  fontStyle: "italic",
                  lineHeight: 1.5,
                  color: "rgba(244,234,217,.84)",
                }}
              >
                Algunas cosas llegan antes de convertirse en objeto.
              </p>

              <p
                className="font-serif"
                style={{
                  margin: "18px 0 0",
                  fontSize: "17px",
                  fontStyle: "italic",
                  color: "rgba(213,165,79,.76)",
                }}
              >
                La tienda también aprende a respirar.
              </p>
            </div>
          </div>

          {/* =====================================================
              COLECCIONES
          ===================================================== */}

          <div
            style={{
              marginTop: "54px",
              borderTop: "1px solid rgba(213,165,79,.20)",
            }}
          >
            <ol className="grid md:grid-cols-2 xl:grid-cols-5">
              {futureRooms.map((room, index) => (
                <li
                  key={room.number}
                  style={{
                    minHeight: "184px",
                    padding: "24px 20px 25px",
                    borderRight:
                      index < futureRooms.length - 1
                        ? "1px solid rgba(213,165,79,.12)"
                        : "none",
                  }}
                >
                  <p
                    className="font-serif"
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      fontStyle: "italic",
                      color: "rgba(213,165,79,.62)",
                    }}
                  >
                    {room.number}
                  </p>

                  <h3
                    className="font-serif"
                    style={{
                      margin: "15px 0 0",
                      fontSize: "25px",
                      fontWeight: 400,
                      color: "#d7ae65",
                    }}
                  >
                    {room.title}
                  </h3>

                  <p
                    style={{
                      margin: "7px 0 0",
                      fontSize: "8px",
                      letterSpacing: ".22em",
                      textTransform: "uppercase",

                      /* MÁS LEGIBLE */
                      color: "rgba(244,234,217,.50)",
                    }}
                  >
                    {room.subtitle}
                  </p>

                  <p
                    style={{
                      margin: "13px 0 0",
                      fontSize: "12px",
                      lineHeight: 1.75,

                      /* MÁS LEGIBLE */
                      color: "rgba(244,234,217,.60)",
                    }}
                  >
                    {room.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* =========================================================
          PRINCIPIO
      ========================================================= */}

      <section
        style={{
          position: "relative",
          backgroundColor: "#eadfce",
          color: "#1b1712",
          borderTop: "1px solid rgba(73,52,30,.16)",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.045,
            backgroundImage:
              "radial-gradient(circle,rgba(71,48,28,.55) .5px,transparent .7px)",
            backgroundSize: "21px 21px",
          }}
        />

        <div
          className="mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-12"
          style={{
            position: "relative",
            paddingTop: "64px",
            paddingBottom: "64px",
          }}
        >
          <div
            className="grid gap-10 lg:grid-cols-[1fr_0.5fr] lg:items-end"
            style={{
              borderTop: "1px solid rgba(72,51,29,.15)",
              borderBottom: "1px solid rgba(72,51,29,.15)",
              padding: "42px 0",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "8px",
                  letterSpacing: ".44em",
                  textTransform: "uppercase",
                  color: "#95703d",
                }}
              >
                Principio de la tienda
              </p>

              <p
                className="font-serif"
                style={{
                  maxWidth: "900px",
                  margin: "22px 0 0",
                  fontSize: "clamp(40px,5vw,70px)",
                  lineHeight: 1.05,
                  letterSpacing: "-.04em",
                  color: "#272019",
                }}
              >
                Cada objeto deberá pertenecer
                <span
                  style={{
                    display: "block",
                    fontStyle: "italic",
                    color: "#8b7153",
                  }}
                >
                  verdaderamente a la obra.
                </span>
              </p>
            </div>

            <div className="lg:text-right">
              <p
                style={{
                  maxWidth: "390px",
                  margin: "0 0 0 auto",
                  fontSize: "14px",
                  lineHeight: 1.9,
                  color: "#66594c",
                }}
              >
                Ninguna compra concederá una voz, una plaza o una decisión
                editorial dentro de Poema Universal.
              </p>

              <Link
                href="/poema-universal"
                style={{
                  display: "inline-block",
                  marginTop: "24px",
                  paddingBottom: "7px",
                  borderBottom: "1px solid rgba(123,90,49,.40)",
                  fontSize: "8px",
                  letterSpacing: ".28em",
                  textTransform: "uppercase",
                  color: "#79572f",
                  textDecoration: "none",
                }}
              >
                Volver a la sala universal →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer
        style={{
          background: "#061019",
          borderTop: "1px solid rgba(213,165,79,.18)",
          color: "#eee3d2",
        }}
      >
        <div className="mx-auto flex max-w-[1380px] flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <p
            className="font-serif"
            style={{
              margin: 0,
              fontSize: "18px",
              color: "#d5a54f",
            }}
          >
            Tienda de Poema Universal
          </p>

          <p
            style={{
              margin: 0,
              fontSize: "7px",
              letterSpacing: ".34em",
              textTransform: "uppercase",
              color: "rgba(238,227,210,.30)",
            }}
          >
            Memoria · materia · presencia
          </p>
        </div>
      </footer>
    </main>
  );
}