"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type MatrixForm = {
  title: string;
  author: string;
  poem: string;
  notes: string;
  generateSymbolImage: boolean;
};

type MatrixResult = {
  threshold: string;
  centralSymbol: string;
  relic: string;
  scenography: string;
  finalGesture: string;
  symbolicAltar: string;
  movement: string;
  imageForce: string;
  resonance: string;
  privacyStatement: string;
  borgesianImage?: {
    title: string;
    description: string;
    prompt: string;
  };
};

const initialForm: MatrixForm = {
  title: "",
  author: "",
  poem: "",
  notes: "",
  generateSymbolImage: false,
};

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top, rgba(199,164,103,0.08), transparent 26%), #050505",
  color: "#f0e8dc",
};

const wrapperStyle: React.CSSProperties = {
  width: "min(1480px, calc(100% - 56px))",
  margin: "0 auto",
};

const panelStyle: React.CSSProperties = {
  border: "1px solid rgba(199,164,103,0.15)",
  background: "rgba(199,164,103,0.035)",
  boxShadow: "0 30px 80px rgba(0,0,0,.28)",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "10px",
  letterSpacing: ".26em",
  textTransform: "uppercase",
  color: "rgba(199,164,103,.72)",
  marginBottom: "10px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid rgba(199,164,103,0.16)",
  background: "rgba(8,8,8,0.76)",
  color: "#f0e8dc",
  padding: "14px 16px",
  outline: "none",
  fontSize: "15px",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: "vertical",
  minHeight: "200px",
  lineHeight: 1.8,
  fontFamily: 'Georgia, "Times New Roman", serif',
};

function hasAny(text: string, words: string[]) {
  const lower = text.toLowerCase();
  return words.some((word) => lower.includes(word));
}

function firstNonEmptyLine(poem: string) {
  return (
    poem
      .split("\n")
      .map((line) => line.trim())
      .find(Boolean) ?? ""
  );
}

function inferThreshold(poem: string) {
  if (
    hasAny(poem, [
      "puerta",
      "umbral",
      "entrada",
      "salida",
      "paso",
      "abrir",
      "cerrar",
    ])
  ) {
    return "El poema se organiza como un umbral: algo está a punto de abrirse o cruzarse.";
  }

  if (
    hasAny(poem, [
      "luz",
      "sombra",
      "brillo",
      "sol",
      "oscur",
      "fuego",
    ])
  ) {
    return "El poema avanza por una frontera entre aparición y penumbra.";
  }

  if (
    hasAny(poem, [
      "árbol",
      "raíz",
      "tierra",
      "jardín",
      "huerto",
      "flor",
      "rama",
    ])
  ) {
    return "El poema trabaja una zona de germinación: algo enterrado insiste en volver.";
  }

  return "El poema funda un recinto interior donde la experiencia todavía no ha terminado de tomar forma.";
}

function inferCentralSymbol(poem: string) {
  if (hasAny(poem, ["llave", "cerradura"])) {
    return "Una llave que no abre una puerta física, sino una memoria latente.";
  }

  if (hasAny(poem, ["árbol", "rama", "raíz", "huerto", "tierra"])) {
    return "Un núcleo vivo enterrado bajo la tierra que todavía conserva calor.";
  }

  if (hasAny(poem, ["luz", "descalz", "pies"])) {
    return "Una luz retenida como huella: el resplandor de unos pies que regresan.";
  }

  if (hasAny(poem, ["agua", "mar", "río", "lluvia"])) {
    return "Un recipiente oscuro que conserva una pequeña cantidad de agua primordial.";
  }

  return "Un recipiente oscuro que conserva una pequeña cantidad de luz.";
}

function inferRelic(poem: string) {
  if (hasAny(poem, ["hueso", "costilla", "perro"])) {
    return "Una pieza mínima atravesada por la memoria del cuerpo y del regreso.";
  }

  if (hasAny(poem, ["libro", "página", "portada", "cubierta"])) {
    return "Una lámina silenciosa donde el poema deja una marca casi invisible.";
  }

  if (hasAny(poem, ["luz", "brillo", "sol"])) {
    return "Un cristal tenue atravesado por la persistencia de una luz que no se extingue.";
  }

  return "Una reliquia sobria, capaz de guardar el temblor del primer verso.";
}

function inferScenography(poem: string) {
  if (hasAny(poem, ["huerto", "tierra", "árbol", "viento"])) {
    return "Una parcela silenciosa donde la tierra, el árbol y el aire actúan como custodios de lo que retorna.";
  }

  if (hasAny(poem, ["luz", "descalz", "pies", "portada", "paisaje"])) {
    return "Una sala mínima donde una portadilla vibra, unos pétalos aparecen y la luz deja huellas en el aire.";
  }

  if (hasAny(poem, ["biblioteca", "libro", "página"])) {
    return "Una biblioteca esencial donde las páginas parecen respirar y desplazarse lentamente.";
  }

  return "Una sala silenciosa donde las palabras aparecen como objetos suspendidos y cambian lentamente de posición.";
}

function inferFinalGesture(poem: string) {
  if (hasAny(poem, ["nombre", "nombr", "voz", "ladrido"])) {
    return "La última vibración no desaparece: queda suspendida como una voz que no termina de cerrarse.";
  }

  if (hasAny(poem, ["luz", "sombra"])) {
    return "La última luz se retira, pero deja su contorno visible durante unos segundos.";
  }

  return "La última palabra desaparece, pero su sombra permanece visible unos segundos.";
}

function inferSymbolicAltar(poem: string) {
  if (hasAny(poem, ["árbol", "raíz", "huerto", "tierra"])) {
    return "El poema se eleva sobre un altar de tierra desnuda. Nada se exhibe: todo parece recién desenterrado.";
  }

  if (hasAny(poem, ["luz", "descalz", "pies"])) {
    return "El poema se eleva sobre una superficie mínima iluminada desde dentro, como si el signo aún no aceptara cerrarse.";
  }

  return "El poema se eleva sobre una superficie desnuda. Nada lo explica: una luz tenue permite contemplar aquello que todavía no acepta un nombre.";
}

function inferMovement(poem: string) {
  if (hasAny(poem, ["corre", "regresa", "vuelve", "vuelta"])) {
    return "La energía del poema es de retorno: algo que parecía concluido vuelve hacia el centro de la escena.";
  }

  if (hasAny(poem, ["flota", "aire", "suspende"])) {
    return "La energía del poema es de suspensión: los elementos no caen, permanecen en espera.";
  }

  return "La energía del poema es de aproximación: las imágenes se acercan hasta generar una vibración compartida.";
}

function inferImageForce(poem: string) {
  if (hasAny(poem, ["hueso", "perro", "costilla", "ladrido"])) {
    return "La fuerza imaginal se concentra en la relación entre materia muerta y persistencia afectiva.";
  }

  if (hasAny(poem, ["luz", "pies", "descalz"])) {
    return "La fuerza imaginal se concentra en una huella luminosa que hace visible lo que ya estaba ausente.";
  }

  if (hasAny(poem, ["árbol", "flor", "raíz"])) {
    return "La fuerza imaginal se concentra en una germinación simbólica: lo enterrado empieza a transformarse.";
  }

  return "La fuerza parece encontrarse en aquello que no se explica por completo y que continúa vibrando después de la lectura.";
}

function inferResonance(poem: string) {
  const line = firstNonEmptyLine(poem);

  if (line) {
    return `La lectura parece quedar resonando alrededor de esta entrada: “${line}”.`;
  }

  return "La lectura deja una resonancia tenue que no se agota en el sentido literal.";
}

function buildBorgesianImagePrompt(params: {
  poem: string;
  title: string;
  author: string;
  centralSymbol: string;
  relic: string;
  scenography: string;
  symbolicAltar: string;
}) {
  return `
Crear una imagen profundamente simbólica y austera inspirada en una sensibilidad borgiana.
No ilustrar literalmente el poema.
No representar personas de forma narrativa.
Construir un único signo visual esencial, primigenio y metafísico.

Datos del poema:
- Título: ${params.title || "Sin título"}
- Autor: ${params.author || "Anónimo"}
- Símbolo central: ${params.centralSymbol}
- Reliquia: ${params.relic}
- Escenografía: ${params.scenography}
- Altar simbólico: ${params.symbolicAltar}

La imagen debe sentirse como:
- un emblema secreto
- una reliquia visual
- una miniatura sagrada
- una forma silenciosa y arcaica
- una geometría poética con ecos de laberinto, umbral, espejo, arena, llave, libro o constelación, solo si nace orgánicamente del poema

Estilo visual:
- fondo sobrio
- composición central
- pocos elementos
- simbología limpia
- luz tenue
- sin artificio
- sin barroquismo
- belleza esencial
- apariencia de grabado, sello o icono metafísico
- atmósfera literaria y atemporal

El resultado debe parecer más un símbolo hallado en una biblioteca imposible que una ilustración contemporánea.
`.trim();
}

function buildMatrixResult(form: MatrixForm): MatrixResult {
  const poem = form.poem.trim();

  const threshold = inferThreshold(poem);
  const centralSymbol = inferCentralSymbol(poem);
  const relic = inferRelic(poem);
  const scenography = inferScenography(poem);
  const finalGesture = inferFinalGesture(poem);
  const symbolicAltar = inferSymbolicAltar(poem);
  const movement = inferMovement(poem);
  const imageForce = inferImageForce(poem);
  const resonance = inferResonance(poem);

  const result: MatrixResult = {
    threshold,
    centralSymbol,
    relic,
    scenography,
    finalGesture,
    symbolicAltar,
    movement,
    imageForce,
    resonance,
    privacyStatement:
      "Esta lectura solo existe durante la sesión. Tu poema no se guarda, no se publica y no alimenta ningún sistema interno de Poema Universal.",
  };

  if (form.generateSymbolImage) {
    result.borgesianImage = {
      title: "Sello simbólico del poema",
      description:
        "No ilustra el texto: lo condensa en un signo esencial, primigenio y silencioso.",
      prompt: buildBorgesianImagePrompt({
        poem,
        title: form.title,
        author: form.author,
        centralSymbol,
        relic,
        scenography,
        symbolicAltar,
      }),
    };
  }

  return result;
}

function PreviewSymbol() {
  return (
    <div
      style={{
        height: "280px",
        border: "1px solid rgba(199,164,103,.14)",
        background:
          "radial-gradient(circle at center, rgba(199,164,103,.26), rgba(199,164,103,.04) 18%, transparent 34%), linear-gradient(180deg, rgba(199,164,103,.03), rgba(0,0,0,.08))",
        display: "grid",
        placeItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "999px",
          border: "1px solid rgba(199,164,103,.28)",
          boxShadow: "0 0 34px rgba(199,164,103,.24)",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "120px",
          height: "28px",
          borderTop: "2px solid rgba(232,208,153,.84)",
          transform: "translateY(58px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "58px",
          height: "126px",
          border: "2px solid rgba(199,164,103,.58)",
          transform: "translate(122px, 18px)",
        }}
      />
    </div>
  );
}

function ResultCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        ...panelStyle,
        padding: "22px 22px 24px",
      }}
    >
      <p
        style={{
          fontSize: "10px",
          letterSpacing: ".28em",
          textTransform: "uppercase",
          color: "rgba(199,164,103,.72)",
          marginBottom: "16px",
        }}
      >
        {title}
      </p>

      <div
        style={{
          color: "rgba(240,232,220,.84)",
          fontSize: "17px",
          lineHeight: 1.72,
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}
      >
        {children}
      </div>
    </section>
  );
}

export default function MatrizPoeticaPage() {
  const [form, setForm] = useState<MatrixForm>(initialForm);
  const [result, setResult] = useState<MatrixResult | null>(null);

  const canSubmit = useMemo(() => {
    return form.poem.trim().length > 12;
  }, [form.poem]);

  function updateField<K extends keyof MatrixForm>(
    key: K,
    value: MatrixForm[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setResult(buildMatrixResult(form));
  }

  function handleResetSession() {
    setForm(initialForm);
    setResult(null);
  }

  return (
    <main style={pageStyle}>
      <div style={{ padding: "24px 0 72px" }}>
        <div style={wrapperStyle}>
          <header
            style={{
              ...panelStyle,
              padding: "16px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "18px",
              marginBottom: "34px",
            }}
          >
            <div
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#f5ecdf",
              }}
            >
              Poema Universal
            </div>

            <nav
              style={{
                display: "flex",
                gap: "18px",
                flexWrap: "wrap",
                fontSize: "13px",
                color: "rgba(240,232,220,.66)",
              }}
            >
              <Link href="/poema-universal" style={{ color: "inherit", textDecoration: "none" }}>
                Fundación
              </Link>
              <Link href="/poema-universal/obra" style={{ color: "inherit", textDecoration: "none" }}>
                Obra
              </Link>
              <Link href="/poema-universal/avatares" style={{ color: "inherit", textDecoration: "none" }}>
                Artistas
              </Link>
              <Link href="/poema-universal/matriz-poetica" style={{ color: "#f0e8dc", textDecoration: "none" }}>
                Matriz
              </Link>
            </nav>
          </header>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(320px, 0.95fr) minmax(440px, 1.55fr)",
              gap: "18px",
              alignItems: "start",
            }}
          >
            <aside
              style={{
                ...panelStyle,
                padding: "28px",
                position: "sticky",
                top: "18px",
              }}
            >
              <p
                style={{
                  fontSize: "10px",
                  letterSpacing: ".34em",
                  textTransform: "uppercase",
                  color: "rgba(199,164,103,.72)",
                  marginBottom: "18px",
                }}
              >
                Matriz Poética
              </p>

              <h1
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: "56px",
                  lineHeight: 0.96,
                  letterSpacing: "-0.04em",
                  color: "#f7efdf",
                  margin: 0,
                }}
              >
                Elevar el poema
              </h1>

              <p
                style={{
                  marginTop: "18px",
                  color: "rgba(240,232,220,.72)",
                  lineHeight: 1.8,
                  fontSize: "15px",
                }}
              >
                Una herramienta pública e independiente para revelar la
                arquitectura invisible del poema. No reescribe la voz:
                devuelve símbolo, reliquia, escenografía y gesto final.
              </p>

              <form onSubmit={handleSubmit} style={{ marginTop: "24px" }}>
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Título</label>
                  <input
                    value={form.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    placeholder="Sin título"
                    style={inputStyle}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Autor o seudónimo</label>
                  <input
                    value={form.author}
                    onChange={(event) => updateField("author", event.target.value)}
                    placeholder="Anónimo"
                    style={inputStyle}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Poema</label>
                  <textarea
                    value={form.poem}
                    onChange={(event) => updateField("poem", event.target.value)}
                    placeholder="Deja aquí el poema..."
                    style={textareaStyle}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Notas del poeta · opcional</label>
                  <textarea
                    value={form.notes}
                    onChange={(event) => updateField("notes", event.target.value)}
                    placeholder="Contexto, intención, pregunta o latido de origen..."
                    style={{
                      ...textareaStyle,
                      minHeight: "110px",
                    }}
                  />
                </div>

                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    marginTop: "18px",
                    padding: "14px 16px",
                    border: "1px solid rgba(199,164,103,.18)",
                    background: "rgba(199,164,103,.04)",
                    color: "rgba(240,232,220,.78)",
                    fontSize: "13px",
                    lineHeight: 1.5,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.generateSymbolImage}
                    onChange={(event) =>
                      updateField(
                        "generateSymbolImage",
                        event.target.checked
                      )
                    }
                    style={{
                      width: "16px",
                      height: "16px",
                      accentColor: "#c7a467",
                      cursor: "pointer",
                      marginTop: "2px",
                    }}
                  />

                  <span>
                    Revelar un sello simbólico del poema
                    <span
                      style={{
                        display: "block",
                        opacity: 0.56,
                        fontSize: "11px",
                        marginTop: "2px",
                      }}
                    >
                      La Matriz no ilustrará el texto: condensará su núcleo
                      en una imagen esencial, sobria y borgiana.
                    </span>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  style={{
                    width: "100%",
                    marginTop: "20px",
                    padding: "16px 18px",
                    border: "1px solid rgba(212,170,92,.58)",
                    background: canSubmit
                      ? "linear-gradient(180deg, rgba(212,170,92,.96), rgba(184,136,53,.95))"
                      : "rgba(199,164,103,.18)",
                    color: canSubmit ? "#130b04" : "rgba(240,232,220,.38)",
                    fontWeight: 700,
                    fontSize: "15px",
                    cursor: canSubmit ? "pointer" : "not-allowed",
                  }}
                >
                  ✦ Elevar el poema
                </button>
              </form>

              <div
                style={{
                  ...panelStyle,
                  padding: "18px",
                  marginTop: "16px",
                  background: "rgba(199,164,103,.02)",
                }}
              >
                <p style={labelStyle}>Privacidad por diseño</p>

                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "18px",
                    color: "rgba(240,232,220,.66)",
                    lineHeight: 1.9,
                    fontSize: "13px",
                  }}
                >
                  <li>Privado por defecto.</li>
                  <li>Sin entrenamiento.</li>
                  <li>Sin alimentación interna.</li>
                  <li>Sin guardado al cerrar la sesión.</li>
                </ul>
              </div>
            </aside>

            <section
              style={{
                display: "grid",
                gap: "14px",
              }}
            >
              {!result ? (
                <>
                  <div
                    style={{
                      ...panelStyle,
                      padding: "28px",
                      minHeight: "180px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "10px",
                        letterSpacing: ".28em",
                        textTransform: "uppercase",
                        color: "rgba(199,164,103,.72)",
                        marginBottom: "16px",
                      }}
                    >
                      Cámara de lectura
                    </p>

                    <h2
                      style={{
                        margin: 0,
                        fontFamily: 'Georgia, "Times New Roman", serif',
                        fontSize: "32px",
                        color: "#f6eddc",
                      }}
                    >
                      La Matriz espera un poema.
                    </h2>

                    <p
                      style={{
                        marginTop: "14px",
                        color: "rgba(240,232,220,.72)",
                        fontSize: "16px",
                        lineHeight: 1.8,
                        maxWidth: "760px",
                      }}
                    >
                      Cuando dejes un texto, la Matriz devolverá una lectura
                      simbólica: umbral, movimiento, reliquia, escenografía,
                      altar, gesto final y, si lo deseas, un sello visual
                      esencial.
                    </p>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: "14px",
                    }}
                  >
                    <ResultCard title="Umbral">
                      El poema avanza mediante imágenes que se acercan, se rozan
                      y dejan entre ellas una zona de silencio.
                    </ResultCard>

                    <ResultCard title="Resonancia">
                      Su fuerza parece encontrarse en aquello que no explica por
                      completo y que continúa vibrando después de la lectura.
                    </ResultCard>

                    <ResultCard title="Símbolo central">
                      Un recipiente oscuro que conserva una pequeña cantidad de
                      luz.
                    </ResultCard>

                    <ResultCard title="Reliquia">
                      Una pieza de cristal atravesada por el primer verso del
                      poema.
                    </ResultCard>
                  </div>

                  <div
                    style={{
                      ...panelStyle,
                      padding: "18px",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "minmax(280px, 0.9fr) minmax(280px, 1fr)",
                        gap: "18px",
                        alignItems: "center",
                      }}
                    >
                      <PreviewSymbol />

                      <div>
                        <p style={labelStyle}>Escenografía</p>
                        <p
                          style={{
                            margin: 0,
                            color: "rgba(240,232,220,.84)",
                            lineHeight: 1.8,
                            fontSize: "18px",
                            fontFamily: 'Georgia, "Times New Roman", serif',
                          }}
                        >
                          Una sala silenciosa donde las palabras aparecen como
                          objetos suspendidos y cambian lentamente de posición.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: "14px",
                    }}
                  >
                    <ResultCard title="Gesto final">
                      La última palabra desaparece, pero su sombra permanece
                      visible unos segundos.
                    </ResultCard>

                    <ResultCard title="Altar simbólico">
                      El poema se eleva sobre una superficie desnuda. Nada lo
                      explica: una luz tenue permite contemplar aquello que
                      todavía no acepta un nombre.
                    </ResultCard>
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: "14px",
                    }}
                  >
                    <ResultCard title="Umbral">{result.threshold}</ResultCard>
                    <ResultCard title="Movimiento">{result.movement}</ResultCard>
                    <ResultCard title="Imagen persistente">
                      {result.imageForce}
                    </ResultCard>
                    <ResultCard title="Resonancia">
                      {result.resonance}
                    </ResultCard>
                    <ResultCard title="Símbolo central">
                      {result.centralSymbol}
                    </ResultCard>
                    <ResultCard title="Reliquia">{result.relic}</ResultCard>
                  </div>

                  <div
                    style={{
                      ...panelStyle,
                      padding: "18px",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "minmax(280px, 0.9fr) minmax(280px, 1fr)",
                        gap: "18px",
                        alignItems: "center",
                      }}
                    >
                      <PreviewSymbol />

                      <div>
                        <p style={labelStyle}>Escenografía</p>
                        <p
                          style={{
                            margin: 0,
                            color: "rgba(240,232,220,.84)",
                            lineHeight: 1.8,
                            fontSize: "18px",
                            fontFamily: 'Georgia, "Times New Roman", serif',
                          }}
                        >
                          {result.scenography}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: "14px",
                    }}
                  >
                    <ResultCard title="Gesto final">
                      {result.finalGesture}
                    </ResultCard>

                    <ResultCard title="Altar simbólico">
                      {result.symbolicAltar}
                    </ResultCard>
                  </div>

                  {result.borgesianImage && (
                    <section
                      style={{
                        ...panelStyle,
                        padding: "24px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "10px",
                          letterSpacing: ".28em",
                          textTransform: "uppercase",
                          color: "rgba(199,164,103,.72)",
                          marginBottom: "10px",
                        }}
                      >
                        Imagen simbólica
                      </p>

                      <h3
                        style={{
                          fontFamily: 'Georgia, "Times New Roman", serif',
                          fontSize: "30px",
                          color: "#f0e8dc",
                          margin: "0 0 12px 0",
                        }}
                      >
                        {result.borgesianImage.title}
                      </h3>

                      <p
                        style={{
                          color: "rgba(240,232,220,.68)",
                          fontSize: "15px",
                          lineHeight: 1.7,
                          marginBottom: "16px",
                        }}
                      >
                        {result.borgesianImage.description}
                      </p>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "minmax(220px, .75fr) minmax(320px, 1.25fr)",
                          gap: "18px",
                          alignItems: "start",
                        }}
                      >
                        <div
                          style={{
                            border: "1px solid rgba(199,164,103,.14)",
                            padding: "16px",
                            background: "rgba(0,0,0,.18)",
                          }}
                        >
                          <p style={labelStyle}>Vista simbólica</p>
                          <PreviewSymbol />
                        </div>

                        <div
                          style={{
                            border: "1px solid rgba(199,164,103,.14)",
                            padding: "16px",
                            background: "rgba(0,0,0,.22)",
                          }}
                        >
                          <p
                            style={{
                              fontSize: "10px",
                              letterSpacing: ".24em",
                              textTransform: "uppercase",
                              color: "rgba(199,164,103,.56)",
                              marginBottom: "10px",
                            }}
                          >
                            Prompt generado
                          </p>

                          <pre
                            style={{
                              whiteSpace: "pre-wrap",
                              fontFamily: 'Georgia, "Times New Roman", serif',
                              fontSize: "14px",
                              lineHeight: 1.7,
                              color: "rgba(240,232,220,.82)",
                              margin: 0,
                            }}
                          >
                            {result.borgesianImage.prompt}
                          </pre>
                        </div>
                      </div>
                    </section>
                  )}

                  <div
                    style={{
                      ...panelStyle,
                      padding: "18px 22px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "14px",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontFamily: 'Georgia, "Times New Roman", serif',
                          fontSize: "22px",
                          color: "#f3eadb",
                        }}
                      >
                        Esta lectura solo existe durante la sesión
                      </p>

                      <p
                        style={{
                          margin: "8px 0 0 0",
                          color: "rgba(240,232,220,.48)",
                          fontSize: "13px",
                        }}
                      >
                        {result.privacyStatement}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleResetSession}
                      style={{
                        border: "1px solid rgba(158,62,43,.55)",
                        background: "rgba(94,15,7,.16)",
                        color: "#d77c69",
                        padding: "12px 16px",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Eliminar sesión
                    </button>
                  </div>
                </>
              )}

              <p
                style={{
                  textAlign: "center",
                  color: "rgba(199,164,103,.62)",
                  fontSize: "12px",
                  letterSpacing: ".12em",
                  margin: "18px 0 0",
                }}
              >
                ✦ La palabra es tuya. El mundo que genera, también. ✦
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
