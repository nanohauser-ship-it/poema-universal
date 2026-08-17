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
backup = path.with_name(f"motor.before-v7-nucleo-numerico-{stamp}.ts")
shutil.copy2(path, backup)
print("✅ Copia de seguridad:", backup)

text = path.read_text(encoding="utf-8")

MARK_START = "// === EMBRION V7 · NUCLEO NUMERICO ==="
MARK_END = "// === FIN EMBRION V7 · NUCLEO NUMERICO ==="

# Reinstalación segura: elimina únicamente un V7 anterior.
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
// === EMBRION V7 · NUCLEO NUMERICO ===

type ADNNumericoV7 = {
  firma: string;
  tempo: number;
  vacio: number;
  pulso: number;
  densidad: number;
  ruptura: number;
  retorno: number;
  memoria: number;
  tension: number;
  simetria: number;
  persistencia: number;
  centroMidi: number;
  duraciones: number[];
  ataques: number[];
  intervalos: number[];
  presion: number[];
  erosion: number[];
  registros: number[];
  retornos: Array<[number, number]>;
  noResuelto: boolean;
};

type EscenaNumericaV7 = {
  duracion: number;
  patronMidi: number[];
  ataques: number[];
  presion: number;
  vacio: number;
  erosion: number;
  registro: number;
  retornoDe: number | null;
};

type PartituraNumericaV7 = {
  escenas: EscenaNumericaV7[];
  osciladorPrimario: "sine" | "triangle" | "sawtooth" | "square";
  osciladorSombra: "sine" | "triangle" | "sawtooth" | "square";
  usaPercusion: boolean;
  usaSubgrave: boolean;
  usaSombra: boolean;
};

function clamp01V7(valor: number): number {
  return Math.max(0, Math.min(1, valor));
}

function clampV7(valor: number, minimo: number, maximo: number): number {
  return Math.max(minimo, Math.min(maximo, valor));
}

function mediaV7(valores: number[]): number {
  if (!valores.length) return 0;
  return valores.reduce((a, b) => a + b, 0) / valores.length;
}

function desviacionV7(valores: number[]): number {
  if (valores.length < 2) return 0;
  const m = mediaV7(valores);
  return Math.sqrt(mediaV7(valores.map((v) => (v - m) ** 2)));
}

function porcentajeV7(valor: number): number {
  return Math.round(clamp01V7(valor) * 100);
}

function midiANotaV7(midi: number): string {
  const nombres = ["c", "cs", "d", "ds", "e", "f", "fs", "g", "gs", "a", "as", "b"];
  const m = Math.round(clampV7(midi, 24, 96));
  const nombre = nombres[((m % 12) + 12) % 12];
  const octava = Math.floor(m / 12) - 1;
  return `${nombre}${octava}`;
}

function numeroDesdeLineaV7(linea: string, modulo: number, minimo = 0): number {
  const base = Math.abs(hashTexto(normalizar(linea) || "silencio"));
  return minimo + (base % Math.max(1, modulo));
}

function extraerADNNumericoV7(texto: string): ADNNumericoV7 {
  const limpio = texto.trim() || "silencio";
  const analisis = analizarPoema(limpio);
  const lineas = limpio
    .split(/\n+/)
    .map((linea) => linea.trim())
    .filter(Boolean);

  const lineasSeguras = lineas.length ? lineas : ["silencio"];
  const longitudes = lineasSeguras.map((linea) => Math.max(1, palabras(linea).length));
  const totalPalabras = Math.max(1, palabras(limpio).length);
  const tokens = relevantes(limpio).map(normalizar).filter(Boolean);
  const frecuencia = new Map<string, number>();

  tokens.forEach((token) => {
    frecuencia.set(token, (frecuencia.get(token) ?? 0) + 1);
  });

  const repetidas = [...frecuencia.values()].reduce(
    (total, cantidad) => total + Math.max(0, cantidad - 1),
    0,
  );

  const repeticion = clamp01V7(tokens.length ? repetidas / tokens.length : 0);
  const signosFuertes = (limpio.match(/[.!?…—]/g) ?? []).length;
  const signosTodos = (limpio.match(/[,.!?;:…—-]/g) ?? []).length;
  const blancos = (limpio.match(/\n\s*\n/g) ?? []).length;
  const breves = longitudes.filter((n) => n <= 3).length / lineasSeguras.length;
  const variacion = clamp01V7(desviacionV7(longitudes) / Math.max(2, mediaV7(longitudes)));
  const normal = normalizar(limpio);

  const memoriaSemantica = /memoria|recuerda|recordar|olvido|eco|antes|ayer|huella|resto/.test(normal) ? 1 : 0;
  const retornoSemantico = /vuelve|volver|regresa|regresar|retorna|retornar|otra vez|de nuevo/.test(normal) ? 1 : 0;
  const rupturaSemantica = /rompe|roto|fractura|herida|corte|marca|cicatriz|cae|apaga|desaparece/.test(normal) ? 1 : 0;
  const negacion = (normal.match(/\bno\b|\bnadie\b|\bnunca\b|\bsin\b/g) ?? []).length;

  const densidad = clamp01V7(
    0.18 +
      Math.min(1, totalPalabras / 110) * 0.38 +
      (1 - breves) * 0.20 +
      repeticion * 0.16 +
      analisis.habitats.pulso / 100 * 0.08,
  );

  const vacio = clamp01V7(
    0.18 +
      blancos * 0.055 +
      breves * 0.34 +
      negacion / totalPalabras * 2.2 +
      analisis.habitats.espectral / 100 * 0.18 -
      densidad * 0.20,
  );

  const ruptura = clamp01V7(
    signosFuertes / totalPalabras * 2.5 +
      breves * 0.26 +
      variacion * 0.28 +
      rupturaSemantica * 0.22,
  );

  const retorno = clamp01V7(
    repeticion * 0.58 + retornoSemantico * 0.30 + memoriaSemantica * 0.12,
  );

  const memoria = clamp01V7(
    analisis.habitats.memoria / 100 * 0.34 +
      analisis.habitats.espectral / 100 * 0.16 +
      repeticion * 0.26 +
      memoriaSemantica * 0.24,
  );

  const pulso = clamp01V7(
    analisis.habitats.pulso / 100 * 0.40 +
      analisis.habitats.maquina / 100 * 0.18 +
      repeticion * 0.25 +
      (1 - vacio) * 0.17,
  );

  const tension = clamp01V7(
    ruptura * 0.34 +
      negacion / totalPalabras * 2.0 +
      variacion * 0.22 +
      retorno * 0.18 +
      analisis.habitats.fractura / 100 * 0.18,
  );

  const simetria = clamp01V7(1 - variacion * 0.72 - ruptura * 0.24 + repeticion * 0.20);
  const persistencia = clamp01V7(0.22 + repeticion * 0.38 + memoria * 0.24 + retorno * 0.16);

  const tempo = Math.round(clampV7(
    50 + pulso * 58 + densidad * 18 + tension * 12 - vacio * 24,
    44,
    138,
  ));

  const semilla = Math.abs(hashTexto(limpio));
  const centroMidi = 43 + (semilla % 13); // G2..G#3, sin escalas predefinidas.

  const maxEscenas = Math.min(9, Math.max(4, Math.round(lineasSeguras.length / 2)));
  const paso = Math.max(1, Math.ceil(lineasSeguras.length / maxEscenas));
  const grupos: string[][] = [];

  for (let i = 0; i < lineasSeguras.length; i += paso) {
    grupos.push(lineasSeguras.slice(i, i + paso));
  }

  const duraciones = grupos.map((grupo) => {
    const palabrasGrupo = grupo.reduce((n, linea) => n + palabras(linea).length, 0);
    return Math.round(clampV7(3 + palabrasGrupo * 0.72 + grupo.length * 0.6, 3, 13));
  });

  const ataquesBase = Math.max(8, Math.min(24, lineasSeguras.length + 6));
  const ataques = Array.from({ length: ataquesBase }, (_, i) => {
    const linea = lineasSeguras[i % lineasSeguras.length];
    const fuerte = /[.!?…—]$/.test(linea) ? 1 : 0;
    const repetida = (frecuencia.get(normalizar(palabras(linea)[0] ?? "")) ?? 0) > 1 ? 1 : 0;
    const numero = numeroDesdeLineaV7(`${linea}|${i}`, 100);
    const umbral = 22 + densidad * 38 + pulso * 20 + fuerte * 12 + repetida * 10 - vacio * 28;
    return numero < umbral ? 1 : 0;
  });

  if (!ataques.some(Boolean)) ataques[0] = 1;

  const intervalos: number[] = [];
  for (let i = 0; i < lineasSeguras.length; i++) {
    const actual = longitudes[i];
    const anterior = i === 0 ? longitudes[0] : longitudes[i - 1];
    const diferencia = actual - anterior;
    const linea = normalizar(lineasSeguras[i]);

    let intervalo = clampV7(Math.round(diferencia / 2), -5, 5);
    if (/no |nadie|nunca|sin /.test(linea)) intervalo -= 2;
    if (/vuelve|regresa|retorna|recuerda/.test(linea)) intervalo = i > 1 ? -intervalos[Math.max(0, i - 2)] : 0;
    if (/\?$/.test(lineasSeguras[i])) intervalo += 2;
    if (/!$/.test(lineasSeguras[i])) intervalo += intervalo >= 0 ? 2 : -2;

    intervalo = Math.round(clampV7(intervalo, -7, 7));

    // Ley estética: un salto grande obliga a compensación posterior.
    if (intervalos.length && Math.abs(intervalos[intervalos.length - 1]) >= 6 && Math.sign(intervalo) === Math.sign(intervalos[intervalos.length - 1])) {
      intervalo = -Math.sign(intervalo || 1) * Math.min(3, Math.abs(intervalo));
    }

    intervalos.push(intervalo);
  }

  if (intervalos.every((n) => Math.abs(n) < 0.001)) {
    intervalos[Math.min(1, intervalos.length - 1)] = 2;
    intervalos[Math.min(2, intervalos.length - 1)] = -3;
  }

  const presion = grupos.map((grupo, i) => {
    const longitud = grupo.reduce((n, linea) => n + palabras(linea).length, 0);
    const signos = grupo.join(" ").match(/[.!?…—]/g)?.length ?? 0;
    const repet = grupo.reduce((n, linea) => {
      const primera = normalizar(palabras(linea)[0] ?? "");
      return n + ((frecuencia.get(primera) ?? 0) > 1 ? 1 : 0);
    }, 0);
    const curva = grupos.length <= 1 ? 0.5 : i / (grupos.length - 1);
    return Math.round(clampV7(
      12 + longitud * 2.0 + signos * 6 + repet * 8 + tension * 24 + curva * persistencia * 22 - vacio * 16,
      4,
      96,
    ));
  });

  // Suaviza saltos para evitar crescendos arbitrarios y conserva respiración.
  for (let i = 1; i < presion.length; i++) {
    const maxSalto = 24;
    presion[i] = Math.round(clampV7(presion[i], presion[i - 1] - maxSalto, presion[i - 1] + maxSalto));
  }

  const erosion = grupos.map((grupo, i) => {
    const linea = normalizar(grupo.join(" "));
    const sem = /borra|apaga|desaparece|olvido|pierde|erosiona|cae|resto/.test(linea) ? 22 : 0;
    return Math.round(clampV7(100 - i * (6 + ruptura * 7) - sem - vacio * 12, 14, 100));
  });

  const registros = grupos.map((grupo, i) => {
    const base = numeroDesdeLineaV7(grupo.join("|") + i, 5, 0);
    return Math.round(clampV7(base + (presion[i] > 68 ? 1 : 0) - (vacio > 0.7 ? 1 : 0), 0, 5));
  });

  const vistos = new Map<string, number>();
  const retornos: Array<[number, number]> = [];
  lineasSeguras.forEach((linea, i) => {
    const clave = normalizar(linea);
    if (!clave) return;
    const anterior = vistos.get(clave);
    if (anterior !== undefined && anterior !== i) retornos.push([anterior, i]);
    else vistos.set(clave, i);
  });

  if (!retornos.length && retorno > 0.48 && grupos.length >= 4) {
    retornos.push([0, grupos.length - 2]);
  }

  const ultima = normalizar(lineasSeguras[lineasSeguras.length - 1]);
  const noResuelto = /\bno\b|nadie|nunca|sin |espera|queda|permanece|pero|ausencia/.test(ultima) || /\?$/.test(limpio);

  const firma = `OE-${String(semilla % 100000).padStart(5, "0")}`;

  return {
    firma,
    tempo,
    vacio: porcentajeV7(vacio),
    pulso: porcentajeV7(pulso),
    densidad: porcentajeV7(densidad),
    ruptura: porcentajeV7(ruptura),
    retorno: porcentajeV7(retorno),
    memoria: porcentajeV7(memoria),
    tension: porcentajeV7(tension),
    simetria: porcentajeV7(simetria),
    persistencia: porcentajeV7(persistencia),
    centroMidi,
    duraciones,
    ataques,
    intervalos,
    presion,
    erosion,
    registros,
    retornos,
    noResuelto,
  };
}

function construirPartituraNumericaV7(adn: ADNNumericoV7): PartituraNumericaV7 {
  const cantidad = adn.duraciones.length;
  const escenas: EscenaNumericaV7[] = [];
  const pitchPool: number[] = [adn.centroMidi];

  for (let i = 0; i < Math.max(8, adn.intervalos.length * 2); i++) {
    const intervalo = adn.intervalos[i % adn.intervalos.length] ?? 0;
    let siguiente = pitchPool[pitchPool.length - 1] + intervalo;

    // Ley estética: rango compacto, con memoria de centro.
    if (siguiente > adn.centroMidi + 14) siguiente -= 12;
    if (siguiente < adn.centroMidi - 9) siguiente += 12;

    pitchPool.push(Math.round(siguiente));
  }

  for (let i = 0; i < cantidad; i++) {
    const longitudMotivo = clampV7(
      2 + Math.round(adn.densidad / 34) + (adn.presion[i] > 70 ? 1 : 0) - (adn.vacio > 70 ? 1 : 0),
      1,
      5,
    );

    const inicio = (i * 2 + adn.registros[i]) % Math.max(1, pitchPool.length - longitudMotivo);
    let patronMidi = pitchPool.slice(inicio, inicio + longitudMotivo);

    // Retorno: recupera material anterior, pero nunca idéntico si ya hubo transformación.
    let retornoDe: number | null = null;
    const relacion = adn.retornos.find(([, destino]) => destino === i || destino % cantidad === i);
    if (relacion && escenas.length) {
      retornoDe = Math.min(escenas.length - 1, relacion[0] % escenas.length);
      const origen = escenas[retornoDe].patronMidi;
      const alteracion = Math.max(1, Math.round((100 - adn.erosion[i]) / 24));
      patronMidi = origen.map((nota, j) =>
        j === origen.length - 1
          ? nota + (adn.noResuelto ? alteracion : (j % 2 === 0 ? alteracion : -alteracion))
          : nota,
      );
    }

    const ataquesEscena = Array.from({ length: 8 }, (_, j) =>
      adn.ataques[(i * 5 + j) % adn.ataques.length] ?? 0,
    );

    // Vacio alto: fuerza respiraciones reales.
    if (adn.vacio > 68) {
      for (let j = 1; j < ataquesEscena.length; j += 2) ataquesEscena[j] = 0;
    }
    if (!ataquesEscena.some(Boolean)) ataquesEscena[0] = 1;

    escenas.push({
      duracion: adn.duraciones[i],
      patronMidi,
      ataques: ataquesEscena,
      presion: adn.presion[i],
      vacio: Math.round(clampV7(adn.vacio + (i % 3 === 1 ? 8 : -4), 0, 100)),
      erosion: adn.erosion[i],
      registro: adn.registros[i],
      retornoDe,
    });
  }

  const osciladores = ["sine", "triangle", "sawtooth", "square"] as const;
  const firmaNumero = Math.abs(hashTexto(adn.firma));
  const osciladorPrimario = osciladores[firmaNumero % osciladores.length];
  let osciladorSombra = osciladores[Math.floor(firmaNumero / 7) % osciladores.length];
  if (osciladorSombra === osciladorPrimario) {
    osciladorSombra = osciladores[(osciladores.indexOf(osciladorPrimario) + 1) % osciladores.length];
  }

  return {
    escenas,
    osciladorPrimario,
    osciladorSombra,
    usaPercusion: adn.pulso >= 47 && adn.vacio < 76,
    usaSubgrave: adn.densidad >= 44 && adn.vacio < 82,
    usaSombra: adn.memoria >= 38 || adn.retorno >= 40,
  };
}

function patronNotasV7(notas: number[], ataques: number[]): string {
  if (!notas.length) return "~";
  const eventos: string[] = [];
  let cursor = 0;

  for (let i = 0; i < ataques.length; i++) {
    if (ataques[i]) {
      eventos.push(midiANotaV7(notas[cursor % notas.length]));
      cursor += 1;
    } else {
      eventos.push("~");
    }
  }

  return eventos.join(" ");
}

function desplazarNotasV7(notas: number[], semitonos: number): number[] {
  return notas.map((nota) => Math.round(clampV7(nota + semitonos, 24, 96)));
}

function patronPercusionV7(ataques: number[], ruptura: number, presion: number): string {
  const activos = ataques.reduce((n, a) => n + a, 0);
  if (activos <= 1) return "bd ~ ~ ~";
  if (ruptura >= 65) return presion >= 70 ? "bd(5,12)" : "bd(3,8)";
  if (presion >= 72) return "bd*4";
  if (activos >= 5) return "bd ~ bd ~";
  return "bd ~ ~ bd";
}

// === FIN EMBRION V7 · NUCLEO NUMERICO ===
'''

codigo_v7 = r'''
export function codigoStrudel(organismo: Organismo): string {
  const textoVivo = [organismo.poema, ...organismo.injertos]
    .filter(Boolean)
    .join("\n");

  const adn = extraerADNNumericoV7(textoVivo);
  const partitura = construirPartituraNumericaV7(adn);

  const declaraciones = partitura.escenas.map((escena, indice) => {
    const presion01 = escena.presion / 100;
    const vacio01 = escena.vacio / 100;
    const erosion01 = escena.erosion / 100;

    const patronPrincipal = patronNotasV7(escena.patronMidi, escena.ataques);
    const sombraAtaques = escena.ataques.map((a, i) => (i % 2 === 0 ? a : 0));
    const patronSombra = patronNotasV7(
      desplazarNotasV7(escena.patronMidi, adn.memoria >= 58 ? 12 : 7),
      sombraAtaques,
    );

    const capas: string[] = [];

    // Voz principal: el ritmo nace de la matriz de ataques del texto.
    capas.push(`note("${patronPrincipal}")
      .s("${partitura.osciladorPrimario}")
      .slow(${Math.max(1, Math.round(6 - presion01 * 3 + vacio01 * 3))})
      .gain(${decimal(0.07 + presion01 * 0.17 - vacio01 * 0.035)})
      .room(${decimal(0.28 + vacio01 * 0.58)})
      .delay(${decimal(0.03 + adn.memoria / 100 * 0.22)})
      .lpf(${Math.round(520 + erosion01 * 2900 + presion01 * 900)})`);

    // Sombra/memoria: aparece solo cuando el texto contiene retorno o memoria suficiente.
    if (partitura.usaSombra && escena.vacio < 88) {
      capas.push(`note("${patronSombra}")
        .s("${partitura.osciladorSombra}")
        .slow(${Math.max(2, Math.round(9 - adn.retorno / 100 * 3))})
        .gain(${decimal(0.025 + adn.memoria / 100 * 0.08)})
        .room(${decimal(0.56 + adn.memoria / 100 * 0.30)})
        .delay(${decimal(0.08 + adn.retorno / 100 * 0.24)})`);
    }

    // Subgrave: no es obligatorio; sigue centro y presión, no un patrón fijo de canción.
    if (partitura.usaSubgrave && escena.presion >= 38 && escena.vacio < 78) {
      const raiz = midiANotaV7(escena.patronMidi[0] - 12);
      const segunda = midiANotaV7((escena.patronMidi[1] ?? escena.patronMidi[0]) - 12);
      const patronSub = escena.presion >= 68 ? `${raiz} ~ ${segunda} ~` : `${raiz} ~ ~ ~`;
      capas.push(`note("${patronSub}")
        .s("sine")
        .slow(${escena.presion >= 68 ? 2 : 4})
        .gain(${decimal(0.045 + presion01 * 0.16)})
        .lpf(${Math.round(360 + presion01 * 760)})`);
    }

    // Percusión: puede no existir. El vacío alto la elimina por completo.
    if (partitura.usaPercusion && escena.presion >= 46 && escena.vacio < 68) {
      const patronBd = patronPercusionV7(escena.ataques, adn.ruptura, escena.presion);
      capas.push(`s("${patronBd}").gain(${decimal(0.07 + presion01 * 0.20)})`);

      if (escena.presion >= 64 && adn.densidad >= 52) {
        const hat = adn.ruptura >= 60 ? "[~ hh]*8" : escena.presion >= 82 ? "hh*8" : "~ hh ~ hh";
        capas.push(`s("${hat}")
          .gain(${decimal(0.025 + presion01 * 0.055)})
          .hpf(${Math.round(4300 + adn.ruptura * 22)})`);
      }
    }

    // Vacío extremo: desnuda la escena a una sola capa, aunque la presión sea alta.
    const capasFinales = escena.vacio >= 82 ? capas.slice(0, 1) : capas;

    return `const escena${indice} = stack(\n${capasFinales.join(",\n")}\n)`;
  }).join("\n\n");

  const arreglo = partitura.escenas
    .map((escena, indice) => `  [${escena.duracion}, escena${indice}]`)
    .join(",\n");

  const retornosTexto = adn.retornos.length
    ? adn.retornos.map(([a, b]) => `${a}→${b}`).join(" · ")
    : "—";

  return `/*
EMBRIÓN V7 · NÚCLEO NUMÉRICO 1.0
${adn.firma} · ${organismo.nombre}

ADN LITERARIO
TEMPO        ${adn.tempo}
VACÍO        ${adn.vacio}
PULSO        ${adn.pulso}
DENSIDAD     ${adn.densidad}
RUPTURA      ${adn.ruptura}
RETORNO      ${adn.retorno}
MEMORIA      ${adn.memoria}
TENSIÓN      ${adn.tension}
SIMETRÍA     ${adn.simetria}
PERSISTENCIA ${adn.persistencia}

PARTITURA NUMÉRICA
DURACIONES [${adn.duraciones.join(", ")}]
ATAQUES    [${adn.ataques.join(",")}]
INTERVALOS [${adn.intervalos.join(", ")}]
PRESIÓN    [${adn.presion.join(", ")}]
EROSIÓN    [${adn.erosion.join(", ")}]
REGISTRO   [${adn.registros.join(", ")}]
RETORNOS   ${retornosTexto}

GRAMÁTICA ESTÉTICA
idea mínima · transformación · respiración · memoria · presión sin saturación
percusión opcional · retorno alterado · rango armónico limitado · no-resolución textual
*/

setcpm(${adn.tempo}/4)

${declaraciones}

arrange(
${arreglo}
)
`;
}
'''

try:
    text = replace_function(text, "export function codigoStrudel", codigo_v7)

    anchor = "export function codigoStrudel"
    if anchor not in text:
        raise RuntimeError("No encuentro el punto de inserción para V7")

    text = text.replace(anchor, helpers.strip() + "\n\n" + anchor, 1)
    path.write_text(text, encoding="utf-8")

except Exception as exc:
    shutil.copy2(backup, path)
    print("❌ No se pudo instalar V7:", exc)
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
    print("❌ El Núcleo Numérico V7 tiene un error de TypeScript.")
    print("✅ Restaurado automáticamente:", backup)
    sys.exit(result.returncode)

print("✅ EMBRIÓN V7 INSTALADO")
print("✅ Núcleo Numérico 1.0 activo")
print("✅ El poema genera ADN y partitura numérica")
print("✅ Sin escalas musicales predefinidas como fundamento")
print("✅ Percusión y subgrave son opcionales")
print("✅ Retornos reaparecen transformados")
print("✅ Gramática estética activa")
print("✅ Validación aislada superada")
PY
