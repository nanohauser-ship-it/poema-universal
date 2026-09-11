"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { BOOK_POEMS } from "../../components/world/MundoPoema";
import { FOUNDATIONAL_BOOK_POEMS } from "../../data/foundationalPoems";

/*
 * CORPUS ESCÉNICO
 *
 * Conserva los poemas existentes de MundoPoema
 * y añade automáticamente cualquier voz nueva
 * presente en foundationalPoems.ts.
 */
const SCENE_BOOK_POEMS = [
  ...BOOK_POEMS,

  ...FOUNDATIONAL_BOOK_POEMS.filter(
    (candidate) =>
      !BOOK_POEMS.some(
        (existing) =>
          existing.poetName === candidate.poetName &&
          existing.title === candidate.title
      )
  ),
];

function LivingScene({
  poemId,
  sceneIndex,
  progress,
}: {
  poemId: string;
  sceneIndex: number;
  progress: number;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(progress);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Alias no nulo para conservar el narrowing dentro de init() async.
    const mountElement: HTMLDivElement = mount;

    let cancelled = false;
    let frame = 0;

    let renderer: THREE.WebGLRenderer | null = null;
    let geometry: THREE.PlaneGeometry | null = null;
    let material: THREE.ShaderMaterial | null = null;
    let textureArray: THREE.DataArrayTexture | null = null;
    let observer: ResizeObserver | null = null;

    async function init() {
      /*
       * ------------------------------------------------
       * 1. CARGAMOS UNA FOTOGRAFÍA REAL
       * ------------------------------------------------
       */
      const image = new Image();

      /*
       * PRUEBA MULTIESCENA
       *
       * Cada poema recibe una fuente visual distinta.
       * Después sustituiremos esto por el atlas/frames
       * específicamente creados para cada poema.
       */
      const sceneImages = [
        "/museo/coleccion/no-desaparezcamos/el-arbol-blanco.webp",
        "/antologia/campo.jpg",
        "/museo/coleccion/bielka/la-memoria-bajo-el-agua.webp",
        "/antologia/elcarrodepaja.JPG",
        "/museo/coleccion/bielka/el-corazon-de-dos-mitades.webp",
        "/museo/coleccion/no-desaparezcamos/la-promesa.webp",
        "/museo/coleccion/no-desaparezcamos/el-exiliado.webp",
        "/museo/coleccion/jerarquia/la-cadena-rota.webp",
        "/museo/coleccion/jerarquia/los-perros-encadenados.webp",
        "/museo/coleccion/bielka/la-entrada-al-laberinto.webp",
      ];

      const sceneImage =
        sceneImages[
          sceneIndex % sceneImages.length
        ];

      image.src = sceneImage;

      await image.decode();

      if (cancelled) return;

      const WIDTH = 512;
      const HEIGHT = 512;
      const LAYERS = 8;

      /*
       * ------------------------------------------------
       * 2. GENERAMOS 8 ESTADOS DE ESA MISMA ESCENA
       * ------------------------------------------------
       */
      const data = new Uint8Array(
        WIDTH * HEIGHT * 4 * LAYERS
      );

      const canvas =
        document.createElement("canvas");

      canvas.width = WIDTH;
      canvas.height = HEIGHT;

      const ctx =
        canvas.getContext(
          "2d",
          {
            willReadFrequently: true,
          }
        );

      if (!ctx) {
        throw new Error(
          "No se pudo crear Canvas 2D"
        );
      }

      const imageRatio =
        image.width / image.height;

      const targetRatio =
        WIDTH / HEIGHT;

      let baseW: number;
      let baseH: number;

      if (imageRatio > targetRatio) {
        baseH = HEIGHT;
        baseW = HEIGHT * imageRatio;
      } else {
        baseW = WIDTH;
        baseH = WIDTH / imageRatio;
      }

      for (
        let layer = 0;
        layer < LAYERS;
        layer++
      ) {
        const p =
          layer / (LAYERS - 1);

        ctx.clearRect(
          0,
          0,
          WIDTH,
          HEIGHT
        );

        /*
         * Cada capa avanza ligeramente
         * dentro de la fotografía.
         */
        const zoom =
          1.0 + p * 0.14;

        const drawW =
          baseW * zoom;

        const drawH =
          baseH * zoom;

        const driftX =
          Math.sin(p * Math.PI) *
          WIDTH *
          0.025;

        const driftY =
          -p *
          HEIGHT *
          0.025;

        const x =
          (WIDTH - drawW) / 2 +
          driftX;

        const y =
          (HEIGHT - drawH) / 2 +
          driftY;

        /*
         * Evolución fotográfica.
         *
         * Principio:
         * más oscuro y desaturado.
         *
         * Final:
         * más abierto y luminoso.
         */
        const brightness =
          62 + p * 48;

        const saturation =
          62 + p * 48;

        const contrast =
          108 + p * 10;

        ctx.filter = `
          brightness(${brightness}%)
          saturate(${saturation}%)
          contrast(${contrast}%)
        `;

        ctx.drawImage(
          image,
          x,
          y,
          drawW,
          drawH
        );

        ctx.filter = "none";

        /*
         * Velo oscuro que desaparece
         * según avanza el poema.
         */
        const veil =
          0.34 * (1 - p);

        ctx.fillStyle =
          `rgba(4,3,2,${veil})`;

        ctx.fillRect(
          0,
          0,
          WIDTH,
          HEIGHT
        );

        /*
         * Luz cálida progresiva.
         */
        const gradient =
          ctx.createRadialGradient(
            WIDTH * 0.52,
            HEIGHT * 0.48,
            20,
            WIDTH * 0.52,
            HEIGHT * 0.48,
            WIDTH * 0.56
          );

        gradient.addColorStop(
          0,
          `rgba(255,196,122,${p * 0.16})`
        );

        gradient.addColorStop(
          0.5,
          `rgba(180,105,45,${p * 0.05})`
        );

        gradient.addColorStop(
          1,
          "rgba(0,0,0,0)"
        );

        ctx.fillStyle =
          gradient;

        ctx.fillRect(
          0,
          0,
          WIDTH,
          HEIGHT
        );

        /*
         * Viñeta cinematográfica.
         */
        const vignette =
          ctx.createRadialGradient(
            WIDTH / 2,
            HEIGHT / 2,
            WIDTH * 0.20,
            WIDTH / 2,
            HEIGHT / 2,
            WIDTH * 0.72
          );

        vignette.addColorStop(
          0,
          "rgba(0,0,0,0)"
        );

        vignette.addColorStop(
          1,
          "rgba(0,0,0,0.62)"
        );

        ctx.fillStyle =
          vignette;

        ctx.fillRect(
          0,
          0,
          WIDTH,
          HEIGHT
        );

        const frameData =
          ctx.getImageData(
            0,
            0,
            WIDTH,
            HEIGHT
          );

        data.set(
          frameData.data,
          layer *
          WIDTH *
          HEIGHT *
          4
        );
      }

      /*
       * ------------------------------------------------
       * 3. ARRAY DE TEXTURAS
       * ------------------------------------------------
       */
      textureArray =
        new THREE.DataArrayTexture(
          data,
          WIDTH,
          HEIGHT,
          LAYERS
        );

      textureArray.format =
        THREE.RGBAFormat;

      textureArray.type =
        THREE.UnsignedByteType;

      textureArray.minFilter =
        THREE.LinearFilter;

      textureArray.magFilter =
        THREE.LinearFilter;

      textureArray.generateMipmaps =
        false;

      textureArray.needsUpdate =
        true;

      /*
       * ------------------------------------------------
       * 4. THREE.JS
       * ------------------------------------------------
       */
      const scene =
        new THREE.Scene();

      scene.background =
        new THREE.Color("#020202");

      const camera =
        new THREE.PerspectiveCamera(
          42,
          1,
          0.1,
          100
        );

      camera.position.z = 6;

      renderer =
        new THREE.WebGLRenderer({
          antialias: true,
          powerPreference:
            "high-performance",
        });

      renderer.setPixelRatio(
        Math.min(
          window.devicePixelRatio,
          2
        )
      );

      renderer.outputColorSpace =
        THREE.SRGBColorSpace;

      mountElement.appendChild(
        renderer.domElement
      );

      /*
       * ------------------------------------------------
       * 5. SHADER
       *
       * Aquí ya estamos haciendo
       * exactamente lo interesante
       * de tu ejemplo.
       * ------------------------------------------------
       */
      material =
        new THREE.ShaderMaterial({
          glslVersion:
            THREE.GLSL3,

          uniforms: {
            diffuse: {
              value:
                textureArray,
            },

            depth: {
              value: 0,
            },

            time: {
              value: 0,
            },
          },

          vertexShader: `
            out vec2 vUv;

            void main() {
              vUv = uv;

              gl_Position =
                projectionMatrix *
                modelViewMatrix *
                vec4(
                  position,
                  1.0
                );
            }
          `,

          fragmentShader: `
            precision highp float;
            precision highp int;
            precision highp sampler2DArray;

            uniform sampler2DArray diffuse;
            uniform float depth;
            uniform float time;

            in vec2 vUv;

            out vec4 outColor;

            void main() {
              vec2 uv =
                vUv;

              /*
               * Canvas tiene origen vertical
               * contrario a WebGL.
               */
              uv.y =
                1.0 - uv.y;

              /*
               * Movimiento muy sutil.
               */
              uv.x +=
                sin(
                  uv.y * 6.0 +
                  time * 0.20
                ) *
                0.0015;

              /*
               * Dos capas consecutivas.
               */
              float lower =
                floor(depth);

              float upper =
                min(
                  lower + 1.0,
                  7.0
                );

              float blend =
                fract(depth);

              vec4 frameA =
                texture(
                  diffuse,
                  vec3(
                    uv,
                    lower
                  )
                );

              vec4 frameB =
                texture(
                  diffuse,
                  vec3(
                    uv,
                    upper
                  )
                );

              /*
               * Mezcla continua:
               * no hay saltos entre frames.
               */
              vec4 color =
                mix(
                  frameA,
                  frameB,
                  smoothstep(
                    0.0,
                    1.0,
                    blend
                  )
                );

              outColor =
                vec4(
                  color.rgb,
                  1.0
                );
            }
          `,
        });

      /*
       * ------------------------------------------------
       * 6. PLANO CINEMATOGRÁFICO
       * ------------------------------------------------
       */
      geometry =
        new THREE.PlaneGeometry(
          5.25,
          5.25
        );

      const mesh =
        new THREE.Mesh(
          geometry,
          material
        );

      scene.add(mesh);

      /*
       * Resize.
       */
      const resize = () => {
        if (
          !renderer ||
          !material
        ) return;

        const rect =
          mountElement.getBoundingClientRect();

        const width =
          Math.max(
            1,
            rect.width
          );

        const height =
          Math.max(
            1,
            rect.height
          );

        camera.aspect =
          width / height;

        camera.updateProjectionMatrix();

        renderer.setSize(
          width,
          height,
          false
        );
      };

      observer =
        new ResizeObserver(
          resize
        );

      observer.observe(
        mountElement
      );

      resize();

      /*
       * ------------------------------------------------
       * 7. ANIMACIÓN
       * ------------------------------------------------
       */
      const start =
        performance.now();

      let displayedDepth = 0;

      const animate = () => {
        if (
          cancelled ||
          !renderer ||
          !material
        ) return;

        frame =
          requestAnimationFrame(
            animate
          );

        const time =
          (
            performance.now() -
            start
          ) / 1000;

        material.uniforms
          .time
          .value =
          time;

        /*
         * SCROLL DEL POEMA
         *        ↓
         * CAPA DEL ARRAY
         */
        const target =
          progressRef.current *
          (LAYERS - 1);

        displayedDepth =
          THREE.MathUtils.lerp(
            displayedDepth,
            target,
            0.045
          );

        material.uniforms
          .depth
          .value =
          displayedDepth;

        renderer.render(
          scene,
          camera
        );
      };

      animate();
    }

    init().catch(error => {
      console.error(
        "ERROR TEXTURE ARRAY:",
        error
      );

      mountElement.innerHTML = `
        <div style="
          position:absolute;
          inset:40px;
          color:#ff8877;
          border:1px solid #993322;
          padding:30px;
          font-family:monospace;
        ">
          ERROR TEXTURE ARRAY<br><br>
          ${String(error)}
        </div>
      `;
    });

    return () => {
      cancelled = true;

      cancelAnimationFrame(
        frame
      );

      observer?.disconnect();

      geometry?.dispose();
      material?.dispose();
      textureArray?.dispose();
      renderer?.dispose();

      if (
        renderer?.domElement
          .parentNode === mountElement
      ) {
        mountElement.removeChild(
          renderer.domElement
        );
      }
    };
  }, [poemId, sceneIndex]);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        inset: 0,
      }}
    />
  );
}

export default function Page() {
  const [index, setIndex] =
    useState(0);

  const [mode, setMode] =
    useState<
      "original" | "translation"
    >("original");

  const [progress, setProgress] =
    useState(0);

  const readerRef =
    useRef<HTMLDivElement>(null);

  const poem =
    SCENE_BOOK_POEMS[index];

  const total =
    SCENE_BOOK_POEMS.length;

  const visibleText =
    mode === "translation" &&
    poem.translation
      ? poem.translation
      : poem.poem;

  const lines =
    useMemo(
      () =>
        visibleText.split("\n"),
      [visibleText]
    );

  function changePoem(
    direction: number
  ) {
    setIndex(current => {
      const next =
        (current +
          direction +
          total) %
        total;

      return next;
    });

    setMode("original");
    setProgress(0);

    requestAnimationFrame(() => {
      if (readerRef.current) {
        readerRef.current.scrollTop =
          0;
      }
    });
  }

  function handleScroll() {
    const el =
      readerRef.current;

    if (!el) return;

    const max =
      el.scrollHeight -
      el.clientHeight;

    setProgress(
      max > 0
        ? Math.min(
            1,
            Math.max(
              0,
              el.scrollTop / max
            )
          )
        : 0
    );
  }

  useEffect(() => {
    function keydown(
      event: KeyboardEvent
    ) {
      if (
        event.key ===
        "ArrowLeft"
      ) {
        changePoem(-1);
      }

      if (
        event.key ===
        "ArrowRight"
      ) {
        changePoem(1);
      }
    }

    window.addEventListener(
      "keydown",
      keydown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        keydown
      );
  });

  if (!poem) {
    return null;
  }

  return (
    <main
      style={{
        position: "fixed",
        inset: 0,
        display: "grid",
        gridTemplateColumns:
          "minmax(420px, 42%) 1fr",
        overflow: "hidden",
        background: "#050403",
        color: "#eee8de",
      }}
    >
      <section
        style={{
          position: "relative",
          minHeight: 0,
          minWidth: 0,
          overflow: "hidden",
          borderRight:
            "1px solid rgba(184,132,69,.16)",
          background:
            "linear-gradient(135deg,#080604,#0d0906)",
        }}
      >
        <header
          style={{
            position: "absolute",
            zIndex: 10,
            top: 0,
            left: 0,
            right: 0,
            padding:
              "26px 38px 20px",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            background:
              "linear-gradient(#080604 68%,transparent)",
          }}
        >
          <button
            onClick={() =>
              changePoem(-1)
            }
            style={{
              border: 0,
              background:
                "transparent",
              color: "#b58b56",
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            ←
          </button>

          <div
            style={{
              fontSize: 9,
              letterSpacing:
                ".22em",
              color: "#9d7543",
            }}
          >
            LIBRO DE LAS SESENTA VOCES
          </div>

          <div
            style={{
              fontSize: 10,
              letterSpacing:
                ".12em",
              opacity: 0.48,
            }}
          >
            {String(
              index + 1
            ).padStart(2, "0")}
            {" / "}
            {String(
              total
            ).padStart(2, "0")}
          </div>

          <button
            onClick={() =>
              changePoem(1)
            }
            style={{
              border: 0,
              background:
                "transparent",
              color: "#b58b56",
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            →
          </button>
        </header>

        <div
          ref={readerRef}
          onScroll={
            handleScroll
          }
          style={{
            position: "absolute",
            inset: 0,
            overflowY: "auto",
            overflowX: "hidden",
            boxSizing: "border-box",
            padding:
              "118px 68px 220px",
            scrollbarWidth: "thin",
            overscrollBehavior: "contain",
            touchAction: "pan-y",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div
            style={{
              color: "#a9783e",
              fontSize: 10,
              letterSpacing:
                ".19em",
              textTransform:
                "uppercase",
              marginBottom: 15,
            }}
          >
            {poem.poetName}
            {" · "}
            {poem.country}
          </div>

          <h1
            style={{
              fontFamily:
                "Georgia, Times New Roman, serif",
              fontSize:
                "clamp(42px,4.6vw,72px)",
              fontWeight: 400,
              lineHeight: 0.96,
              letterSpacing:
                "-.045em",
              margin:
                "0 0 30px",
              maxWidth: 580,
            }}
          >
            {poem.title}
          </h1>

          {poem.translation && (
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 42,
              }}
            >
              <button
                onClick={() =>
                  setMode(
                    "original"
                  )
                }
                style={{
                  border:
                    "1px solid rgba(170,122,64,.26)",
                  background:
                    mode ===
                    "original"
                      ? "rgba(170,122,64,.13)"
                      : "transparent",
                  color: "#b98b51",
                  padding:
                    "7px 11px",
                  cursor:
                    "pointer",
                  fontSize: 9,
                  letterSpacing:
                    ".12em",
                }}
              >
                ORIGINAL
              </button>

              <button
                onClick={() =>
                  setMode(
                    "translation"
                  )
                }
                style={{
                  border:
                    "1px solid rgba(170,122,64,.26)",
                  background:
                    mode ===
                    "translation"
                      ? "rgba(170,122,64,.13)"
                      : "transparent",
                  color: "#b98b51",
                  padding:
                    "7px 11px",
                  cursor:
                    "pointer",
                  fontSize: 9,
                  letterSpacing:
                    ".12em",
                }}
              >
                TRADUCCIÓN
              </button>
            </div>
          )}

          {!poem.translation && (
            <div
              style={{
                marginBottom: 38,
                fontSize: 9,
                letterSpacing:
                  ".16em",
                color:
                  "rgba(184,139,83,.58)",
              }}
            >
              {poem.originalLabel}
            </div>
          )}

          <div
            style={{
              maxWidth: 500,
              fontFamily:
                "Georgia, Times New Roman, serif",
              fontSize: 18,
              lineHeight: 1.82,
            }}
          >
            {lines.map(
              (line, i) =>
                line ? (
                  <div key={i}>
                    {line}
                  </div>
                ) : (
                  <div
                    key={i}
                    style={{
                      height: 27,
                    }}
                  />
                )
            )}
          </div>

          <div
            style={{
              height: "45vh",
            }}
          />
        </div>
      </section>

      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: "#020202",
        }}
      >
        <LivingScene
          key={poem.id}
          poemId={poem.id}
          sceneIndex={index}
          progress={progress}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents:
              "none",
            background:
              "radial-gradient(circle at center,transparent 25%,rgba(0,0,0,.48) 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 35,
            left: 40,
            pointerEvents:
              "none",
          }}
        >
          <div
            style={{
              color: "#a77a42",
              fontSize: 9,
              letterSpacing:
                ".24em",
              marginBottom: 9,
            }}
          >
            ESCENA POÉTICA ·{" "}
            {String(
              index + 1
            ).padStart(2, "0")}
          </div>

          <div
            style={{
              fontFamily:
                "Georgia",
              fontSize: 14,
              opacity: 0.54,
            }}
          >
            {poem.title}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: 30,
            top: "50%",
            width: 1,
            height: 180,
            transform:
              "translateY(-50%)",
            background:
              "rgba(255,255,255,.10)",
          }}
        >
          <div
            style={{
              width: 3,
              height:
                `${progress * 100}%`,
              background:
                "#ad7639",
              transition:
                "height 80ms linear",
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 40,
            bottom: 34,
            fontSize: 9,
            letterSpacing:
              ".18em",
            opacity: 0.32,
          }}
        >
          ← → CAMBIAR VOZ ·
          DESPLAZA EL POEMA
        </div>
      </section>
    </main>
  );
}
