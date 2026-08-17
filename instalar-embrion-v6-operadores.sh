#!/usr/bin/env bash
set -euo pipefail

cd "$HOME/poema-universal"

python3 - <<'PY'
from pathlib import Path
from datetime import datetime
import shutil
import subprocess
import sys

path = Path("app/laboratorio/verso-tecno/organismo/motor.ts")
if not path.exists():
    print("❌ No encuentro:", path)
    sys.exit(1)

stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
backup = path.with_name(f"motor.before-v6-operadores-{stamp}.ts")
shutil.copy2(path, backup)
print("✅ Copia de seguridad:", backup)

text = path.read_text(encoding="utf-8")

MARK_START = "// === EMBRION V6 · GRAMATICA DE OPERADORES ==="
MARK_END = "// === FIN EMBRION V6 · GRAMATICA DE OPERADORES ==="

if MARK_START in text and MARK_END in text:
    a = text.index(MARK_START)
    b = text.index(MARK_END) + len(MARK_END)
    text = text[:a] + text[b:]

def replace_function(source: str, signature: str, replacement: str) -> str:
    start = source.find(signature)
    if start == -1:
        raise RuntimeError(f"No encuentro la función: {signature}")

    brace = source.find("{", start)
    if brace == -1:
        raise RuntimeError(f"No encuentro la apertura de: {signature}")

    depth = 0
    i = brace
    quote = None
    escape = False

    while i < len(source):
        ch = source[i]

        if escape:
            escape = False
            i += 1
            continue

        if quote:
            if ch == "\\":
                escape = True
            elif ch == quote:
                quote = None
            i += 1
            continue

        if ch in ("'", '"', "`"):
            quote = ch
            i += 1
            continue

        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return source[:start] + replacement.rstrip() + source[i + 1:]

        i += 1

    raise RuntimeError(f"No encuentro el cierre de: {signature}")

helpers = r'''
// === EMBRION V6 · GRAMATICA DE OPERADORES ===

type OperadorV6 =
  | "RESPIRAR"
  | "PERMANECER"
  | "RETORNAR"
  | "VACIAR"
  | "CONTRAER"
  | "DESPOJAR"
  | "RECORDAR"
  | "EROSIONAR"
  | "EXPANDIR"
  | "NO_RESOLVER"
  | "HERIR";

type LecturaOperadoresV6 = {
  operadores: OperadorV6[];
  repeticion: number;
  fragmentacion: number;
  suspension: number;
  vacio: number;
  cuerpo: number;
  memoria: number;
  pulso: "suspendido" | "intermitente" | "roto" | "estable";
  noResuelto: boolean;
};

function clamp01V6(valor: number): number {
  return Math.max(0, Math.min(1, valor));
}

function rotarSeguroV6<T>(items: T[], desplazamiento: number): T[] {
  if (!items.length) return [];
  const n = ((desplazamiento % items.length) + items.length) % items.length;
  return [...items.slice(n), ...items.slice(0, n)];
}

function lecturaOperadoresV6(texto: string): LecturaOperadoresV6 {
  const analisis = analizarPoema(texto);
  const h = analisis.habitats;
  const lista = relevantes(texto).map(normalizar);
  const todas = palabras(texto);
  const normal = normalizar(texto);

  const lineas = texto
    .split(/\n+/)
    .map((linea) => linea.trim())
    .filter(Boolean);

  const frecuencia = new Map<string, number>();
  lista.forEach((palabra) => {
    frecuencia.set(palabra, (frecuencia.get(palabra) ?? 0) + 1);
  });

  const repetidas = [...frecuencia.values()].reduce(
    (total, cantidad) => total + Math.max(0, cantidad - 1),
    0,
  );

  const repeticion = clamp01V6(
    lista.length ? repetidas / lista.length : 0,
  );

  const signos = (texto.match(/[,.…;:!?—-]/g) ?? []).length;
  const breves = lineas.filter((linea) => palabras(linea).length <= 3).length;
  const proporcionBreves = lineas.length ? breves / lineas.length : 0;
  const densidadSignos = todas.length ? signos / todas.length : 0;
  const blancos = (texto.match(/\n\s*\n/g) ?? []).length;

  const fragmentacion = clamp01V6(
    proporcionBreves * 0.58 + densidadSignos * 2.7,
  );

  const cuerpo = clamp01V6(
    (h.pulso * 0.5 + h.maquina * 0.28) / 100 + repeticion * 0.26,
  );

  const memoria = clamp01V6(
    (h.memoria * 0.52 + h.espectral * 0.28) / 100 +
      repeticion * 0.24 +
      (/memoria|recuerda|recordar|olvido|vuelve|regresa|retorna/.test(normal) ? 0.18 : 0),
  );

  const suspension = clamp01V6(
    (h.deriva * 0.38 + h.espectral * 0.28) / 100 +
      proporcionBreves * 0.24 +
      (/espera|silencio|nadie|nunca|quiet|permanece|queda/.test(normal) ? 0.20 : 0) -
      cuerpo * 0.16,
  );

  const vacio = clamp01V6(
    0.30 +
      blancos * 0.055 +
      suspension * 0.38 +
      proporcionBreves * 0.20 -
      cuerpo * 0.20,
  );

  const ultimaLinea = normalizar(lineas[lineas.length - 1] ?? "");
  const noResuelto =
    /nadie|nunca|espera|queda|permanece|sin|pero|no |no$|olvido|ausencia/.test(ultimaLinea) ||
    /\?$/.test(texto.trim());

  let pulso: LecturaOperadoresV6["pulso"];
  if (suspension >= 0.58 && cuerpo < 0.58) pulso = "suspendido";
  else if (fragmentacion >= 0.58) pulso = "roto";
  else if (repeticion >= 0.16 || cuerpo >= 0.58) pulso = "estable";
  else pulso = "intermitente";

  const operadores: OperadorV6[] = [];
  const add = (operador: OperadorV6) => {
    if (operadores[operadores.length - 1] !== operador) operadores.push(operador);
  };

  if (vacio >= 0.60) add("VACIAR");
  else if (suspension >= 0.42) add("RESPIRAR");
  else add("PERMANECER");

  const vistas = new Map<string, number>();

  lineas.forEach((linea) => {
    const limpia = normalizar(linea);
    const nPalabras = palabras(linea).length;
    const veces = (vistas.get(limpia) ?? 0) + 1;
    vistas.set(limpia, veces);

    if (/respira|respirar|aire|aliento/.test(limpia)) add("RESPIRAR");
    if (/permanece|queda|espera|todavia|sigue|quiet/.test(limpia)) add("PERMANECER");
    if (/vuelve|regresa|retorna|otra vez/.test(limpia) || veces > 1) add("RETORNAR");
    if (/apaga|desaparece|silencio|ausencia|nadie|vacio|borra/.test(limpia)) add("VACIAR");
    if (/recuerda|memoria|recordar|olvido|eco/.test(limpia)) add("RECORDAR");
    if (/herida|roto|rompe|corte|marca|cicatriz|fractura/.test(limpia)) add("HERIR");

    if (nPalabras <= 2) add("CONTRAER");
    if (nPalabras >= 10 && suspension < 0.68) add("EXPANDIR");
  });

  if (fragmentacion >= 0.55) add("EROSIONAR");
  if (repeticion >= 0.16) add("RETORNAR");
  if (vacio >= 0.58) add("DESPOJAR");
  if (cuerpo >= 0.62 && vacio < 0.58) add("EXPANDIR");
  if (memoria >= 0.55) add("RECORDAR");
  if (noResuelto) add("NO_RESOLVER");

  const compactos = operadores.filter((operador, index) =>
    index === 0 || operador !== operadores[index - 1],
  );

  const final = compactos.slice(0, 9);
  if (!final.length) final.push("RESPIRAR", "PERMANECER", "RECORDAR");

  return {
    operadores: final,
    repeticion,
    fragmentacion,
    suspension,
    vacio,
    cuerpo,
    memoria,
    pulso,
    noResuelto,
  };
}

// === FIN EMBRION V6 · GRAMATICA DE OPERADORES ===
'''

codigo_v6 = r'''
export function codigoStrudel(organismo: Organismo): string {
  const textoVivo = [organismo.poema, ...organismo.injertos]
    .filter(Boolean)
    .join("\n");

  const analisis = analizarPoema(textoVivo);
  const lectura = lecturaOperadoresV6(textoVivo);
  const h = organismo.habitats;
  const bpm = bpmActual(organismo);

  const escalaBase = ESCALAS[analisis.semilla % ESCALAS.length] ?? ["c2", "eb2", "g2", "bb2"];
  const materia = [...new Set([
    ...organismo.notas,
    ...analisis.notas,
    ...escalaBase,
  ])].filter(Boolean);

  const notas = rotarSeguroV6(
    materia.length ? materia : ["c2", "eb2", "g2", "bb2"],
    hashTexto(textoVivo) + organismo.edad + organismo.diario.length,
  );

  const n1 = notas[0] ?? "c2";
  const n2 = notas[1] ?? notas[0] ?? "eb2";
  const n3 = notas[2] ?? notas[0] ?? "g2";
  const n4 = notas[3] ?? notas[1] ?? "bb2";
  const n5 = notas[4] ?? notas[2] ?? "d3";

  const motivoA = [n1, n2].join(" ");
  const motivoB = [n2, n3, n4].join(" ");
  const motivoC = [n4, n2, n5].join(" ");
  const retorno = [n1, n3, n2].join(" ");
  const noResuelto = [n2, n4, n3].join(" ");

  const osciladores = ["sine", "triangle", "sawtooth", "square"] as const;
  const oscA = osciladores[analisis.semilla % osciladores.length];
  const oscB = osciladores[Math.floor(analisis.semilla / 7) % osciladores.length];
  const oscC = osciladores[Math.floor(analisis.semilla / 19) % osciladores.length];

  const nota = (
    patron: string,
    osc: string,
    slow: number,
    gain: number,
    room: number,
  ) => `note("<${patron}>")
    .s("${osc}")
    .slow(${slow})
    .gain(${decimal(gain)})
    .room(${decimal(room)})`;

  const sub = (
    patron: string,
    slow: number,
    gain: number,
    cutoff: number,
  ) => `note("<${patron}>")
    .s("sine")
    .slow(${slow})
    .gain(${decimal(gain)})
    .lpf(${Math.round(cutoff)})`;

  const percusion = (
    patron: string,
    gain: number,
  ) => `s("${patron}").gain(${decimal(gain)})`;

  const aire = (
    patron: string,
    gain: number,
    room: number,
  ) => `note("<${patron}>")
    .s("triangle")
    .slow(12)
    .gain(${decimal(gain)})
    .room(${decimal(room)})
    .delay(${decimal(0.08 + lectura.memoria * 0.28)})`;

  const stackDe = (...capas: string[]) => `stack(\n${capas.filter(Boolean).join(",\n")}\n)`;

  const permitePulso = lectura.pulso !== "suspendido";
  const pulsoIntermitente = lectura.pulso === "roto"
    ? "bd(3,8)"
    : lectura.pulso === "estable"
      ? "bd*4"
      : "bd ~ ~ bd";

  function materialDe(operador: OperadorV6, indice: number): string {
    const giro = indice % 3;
    const motivo = giro === 0 ? motivoA : giro === 1 ? motivoB : motivoC;
    const osc = giro === 0 ? oscA : giro === 1 ? oscB : oscC;

    switch (operador) {
      case "RESPIRAR":
        return stackDe(
          nota(motivoA, oscA, 10 + Math.round(lectura.suspension * 4), 0.07 + h.deriva / 900, 0.68 + lectura.suspension * 0.22),
          aire(`${n3} ~ ${n2} ~`, 0.025 + lectura.memoria * 0.06, 0.78),
        );

      case "PERMANECER":
        return stackDe(
          nota(`${n1} ~ ${n1} ~`, "sine", 9, 0.08 + lectura.repeticion * 0.12, 0.58),
          lectura.vacio < 0.55
            ? sub(`${n1} ~`, 8, 0.05 + lectura.cuerpo * 0.10, 520 + lectura.cuerpo * 420)
            : "",
        );

      case "RETORNAR":
        return stackDe(
          nota(retorno, oscB, 5, 0.10 + lectura.repeticion * 0.18, 0.46 + lectura.memoria * 0.20),
          nota(`${n1} ~ ${n2} ~`, "triangle", 8, 0.04 + lectura.memoria * 0.08, 0.72),
          permitePulso && lectura.cuerpo > 0.44
            ? percusion(pulsoIntermitente, 0.08 + lectura.cuerpo * 0.16)
            : "",
        );

      case "VACIAR":
        return stackDe(
          aire(`${n2} ~ ~ ~`, 0.025 + lectura.memoria * 0.045, 0.90),
        );

      case "CONTRAER":
        return stackDe(
          nota(`${n2} ${n1}`, oscC, 6, 0.08 + lectura.fragmentacion * 0.12, 0.34),
          permitePulso && lectura.cuerpo > 0.52
            ? percusion("bd ~ ~ ~", 0.07 + lectura.cuerpo * 0.12)
            : "",
        );

      case "DESPOJAR":
        return stackDe(
          nota(`${n1} ~`, "sine", 12, 0.045 + lectura.memoria * 0.05, 0.82),
        );

      case "RECORDAR":
        return stackDe(
          nota(`${n1} ~ ${n3} ~`, "triangle", 8, 0.055 + lectura.memoria * 0.11, 0.72 + lectura.memoria * 0.16),
          nota(`${n2} ~ ~ ${n1}`, oscA, 11, 0.035 + lectura.memoria * 0.07, 0.84),
        );

      case "EROSIONAR":
        return stackDe(
          nota(motivo, osc, 5, 0.07 + lectura.fragmentacion * 0.13, 0.50)
            + `.lpf(${Math.round(420 + (1 - lectura.fragmentacion) * 1700)})`,
          lectura.cuerpo > 0.40
            ? percusion(lectura.pulso === "roto" ? "[~ hh]*8" : "~ hh ~ ~", 0.035 + lectura.fragmentacion * 0.08)
            : "",
        );

      case "EXPANDIR":
        return stackDe(
          nota(`${motivoA} ${n4}`, oscA, 3, 0.12 + lectura.cuerpo * 0.16, 0.42),
          sub(`${n1} ${n3}`, 2, 0.10 + lectura.cuerpo * 0.22, 760 + lectura.cuerpo * 900),
          permitePulso && lectura.cuerpo > 0.42
            ? percusion(pulsoIntermitente, 0.14 + lectura.cuerpo * 0.24)
            : "",
          permitePulso && lectura.cuerpo > 0.58
            ? percusion(lectura.fragmentacion > 0.55 ? "[~ hh]*8" : "hh*8", 0.04 + lectura.fragmentacion * 0.07)
            : "",
        );

      case "HERIR":
        return stackDe(
          nota(`${n4} ${n2} ~ ${n5}`, "square", 4, 0.08 + lectura.fragmentacion * 0.16, 0.48)
            + `.delay(${decimal(0.06 + lectura.fragmentacion * 0.18)})`,
          lectura.cuerpo > 0.36
            ? percusion("bd(5,12)", 0.08 + lectura.fragmentacion * 0.16)
            : "",
        );

      case "NO_RESOLVER":
        return stackDe(
          nota(noResuelto, oscB, 10, 0.055 + lectura.suspension * 0.08, 0.78),
          aire(`${n4} ~ ${n2} ~`, 0.025 + lectura.memoria * 0.05, 0.92),
        );
    }
  }

  const pesos = lectura.operadores.map((operador) => {
    switch (operador) {
      case "VACIAR": return 7 + lectura.vacio * 5;
      case "RESPIRAR": return 7 + lectura.suspension * 5;
      case "PERMANECER": return 8 + lectura.repeticion * 7;
      case "RETORNAR": return 6 + lectura.repeticion * 7;
      case "CONTRAER": return 4 + lectura.fragmentacion * 4;
      case "DESPOJAR": return 6 + lectura.vacio * 5;
      case "RECORDAR": return 7 + lectura.memoria * 6;
      case "EROSIONAR": return 5 + lectura.fragmentacion * 5;
      case "EXPANDIR": return 7 + lectura.cuerpo * 7;
      case "HERIR": return 4 + lectura.fragmentacion * 5;
      case "NO_RESOLVER": return 8 + lectura.suspension * 5;
    }
  });

  const totalPesos = pesos.reduce((total, valor) => total + valor, 0);
  const ciclos = pesos.map((peso) => Math.max(3, Math.floor((peso / totalPesos) * CICLOS_COMPOSICION)));

  let diferencia = CICLOS_COMPOSICION - ciclos.reduce((total, valor) => total + valor, 0);
  let cursor = 0;

  while (diferencia > 0) {
    ciclos[cursor % ciclos.length] += 1;
    cursor += 1;
    diferencia -= 1;
  }

  cursor = ciclos.length - 1;
  while (diferencia < 0) {
    const indice = ((cursor % ciclos.length) + ciclos.length) % ciclos.length;
    if (ciclos[indice] > 3) {
      ciclos[indice] -= 1;
      diferencia += 1;
    }
    cursor -= 1;
  }

  const escenas = lectura.operadores.map((operador, indice) => ({
    nombre: `escena${indice}`,
    operador,
    codigo: materialDe(operador, indice),
  }));

  const declaraciones = escenas
    .map((escena) => `const ${escena.nombre} = ${escena.codigo}`)
    .join("\n\n");

  const arreglo = escenas
    .map((escena, indice) => `  [${ciclos[indice]}, ${escena.nombre}]`)
    .join(",\n");

  return `/*
ORGANISMO · MOTOR COMPOSITIVO V6
GRAMÁTICA DE OPERADORES
${organismo.codigo} · ${organismo.nombre}
Pulso: ${lectura.pulso}
Repetición: ${Math.round(lectura.repeticion * 100)}
Fragmentación: ${Math.round(lectura.fragmentacion * 100)}
Suspensión: ${Math.round(lectura.suspension * 100)}
Vacío: ${Math.round(lectura.vacio * 100)}
Operadores: ${lectura.operadores.join(" → ")}
Ciclos: ${ciclos.join(" · ")}
*/

setcpm(${bpm}/4)

${declaraciones}

arrange(
${arreglo}
)
`;
}
'''

try:
    text = replace_function(text, "export function codigoStrudel", codigo_v6)

    anchor = "export function codigoStrudel"
    if anchor not in text:
        raise RuntimeError("No encuentro el punto de inserción para V6")

    text = text.replace(anchor, helpers.strip() + "\n\n" + anchor, 1)
    path.write_text(text, encoding="utf-8")

except Exception as exc:
    shutil.copy2(backup, path)
    print("❌ No se pudo instalar V6:", exc)
    print("✅ Restaurado:", backup)
    sys.exit(1)

print("===== VALIDANDO SOLO motor.ts =====")
result = subprocess.run(
    [
        "npx", "tsc", str(path),
        "--noEmit",
        "--pretty", "false",
        "--target", "ES2020",
        "--module", "ESNext",
        "--moduleResolution", "Bundler",
        "--skipLibCheck",
        "--lib", "ES2020,DOM",
    ],
    text=True,
)

if result.returncode != 0:
    shutil.copy2(backup, path)
    print("❌ El motor V6 tiene un error de TypeScript.")
    print("✅ Restaurado automáticamente:", backup)
    sys.exit(result.returncode)

print("✅ EMBRIÓN V6 INSTALADO")
print("✅ Gramática de operadores activa")
print("✅ No hay forma fija de siete fases")
print("✅ Pulso suspendido puede existir sin batería")
print("✅ Vacío elimina capas, no solo volumen")
print("✅ Validación aislada superada")
PY
