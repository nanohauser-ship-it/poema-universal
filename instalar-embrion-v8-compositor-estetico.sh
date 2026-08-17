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

text = path.read_text(encoding="utf-8")
if "// === EMBRION V7 · NUCLEO NUMERICO ===" not in text:
    print("❌ No encuentro el Núcleo Numérico V7. No toco nada.")
    sys.exit(1)

stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
backup = path.with_name(f"motor.before-v8-compositor-estetico-{stamp}.ts")
shutil.copy2(path, backup)
print("✅ Copia de seguridad:", backup)

MARK_START = "// === EMBRION V8 · COMPOSITOR ESTETICO ==="
MARK_END = "// === FIN EMBRION V8 · COMPOSITOR ESTETICO ==="

# Reinstalación segura.
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
// === EMBRION V8 · COMPOSITOR ESTETICO ===

/**
 * V8 separa tres capas:
 * 1) ADN numérico: qué hace el texto.
 * 2) Compositor estético: convierte relaciones en frase, armonía, pulso y forma.
 * 3) Strudel: interpreta la partitura terminada.
 *
 * No hay estilos/presets elegibles. Hay leyes de escritura:
 * motivo reconocible, economía, retorno transformado, presión por capas,
 * grave tardío, silencio estructural y clímax como consecuencia.
 */

type PulsoV8 = "ausente" | "latido" | "motor" | "fracturado";

type PlanEsteticoV8 = {
  centro: number;
  campo: number[];
  motivoA: number[];
  motivoB: number[];
  motivoMemoria: number[];
  ataquesA: number[];
  ataquesB: number[];
  pulso: PulsoV8;
  escenaClimax: number;
  entradaBajo: number;
  entradaPulso: number;
  retiradaFinal: boolean;
  nombreCampo: string;
};

function pcV8(n: number): number {
  return ((Math.round(n) % 12) + 12) % 12;
}

function uniqV8(valores: number[]): number[] {
  const salida: number[] = [];
  for (const n of valores) if (!salida.includes(n)) salida.push(n);
  return salida;
}

function campoRelacionalV8(adn: ADNNumericoV7): number[] {
  // El texto determina relaciones interválicas; no elige una escala preescrita.
  // La gramática estética limita el resultado a relaciones con voz conductora clara.
  const segunda = adn.vacio >= 68 ? 2 : adn.tension >= 62 ? 1 : 2;
  const tercera = adn.memoria >= adn.pulso ? 3 : (adn.tension < 46 ? 4 : 3);
  const sexta = adn.noResuelto ? 8 : (adn.memoria >= 58 ? 9 : 10);
  const color = adn.ruptura >= 68 ? 6 : (adn.retorno >= 56 ? 10 : sexta);

  const base = uniqV8([0, segunda, tercera, 5, 7, sexta, color, 12]).sort((a, b) => a - b);

  // Una cicatriz cromática es un acontecimiento excepcional, nunca el campo entero.
  if (adn.tension >= 78 && !base.includes(11)) base.splice(Math.max(1, base.length - 1), 0, 11);
  return uniqV8(base).sort((a, b) => a - b);
}

function notaPorGradoV8(centro: number, campo: number[], grado: number): number {
  const gradosPorOctava = Math.max(1, campo.length - 1);
  const oct = Math.floor(grado / gradosPorOctava);
  const idx = ((grado % gradosPorOctava) + gradosPorOctava) % gradosPorOctava;
  const ajusteOct = grado < 0 && grado % gradosPorOctava !== 0 ? oct : oct;
  return Math.round(centro + campo[idx] + ajusteOct * 12);
}

function limitarMelodiaV8(n: number): number {
  let nota = Math.round(n);
  while (nota < 55) nota += 12;
  while (nota > 79) nota -= 12;
  return nota;
}

function construirMotivoV8(adn: ADNNumericoV7, campo: number[], centro: number): number[] {
  const longitud = Math.round(clampV7(
    3 + (adn.densidad >= 62 ? 1 : 0) + (adn.persistencia >= 74 ? 1 : 0) - (adn.vacio >= 76 ? 1 : 0),
    3,
    5,
  ));

  let grado = Math.abs(hashTexto(`${adn.firma}|motivo`)) % Math.max(2, campo.length - 2);
  const grados: number[] = [grado];

  for (let i = 1; i < longitud; i++) {
    const raw = adn.intervalos[(i - 1) % Math.max(1, adn.intervalos.length)] ?? 0;
    let paso = raw === 0 ? (i % 2 ? 1 : -1) : Math.sign(raw) * Math.max(1, Math.min(2, Math.ceil(Math.abs(raw) / 3)));

    // La repetición literaria favorece permanencia; la ruptura permite un salto único.
    if (adn.persistencia >= 72 && i === 1) paso = 0;
    if (adn.ruptura >= 72 && i === longitud - 1) paso += paso >= 0 ? 1 : -1;

    grado += paso;
    grado = Math.round(clampV7(grado, -2, Math.max(3, campo.length + 1)));
    grados.push(grado);
  }

  const notas = grados.map((g) => limitarMelodiaV8(notaPorGradoV8(centro, campo, g)));

  // Voice leading: un salto grande debe responder en dirección contraria.
  for (let i = 1; i < notas.length; i++) {
    const salto = notas[i] - notas[i - 1];
    if (Math.abs(salto) > 9) notas[i] += salto > 0 ? -12 : 12;
  }

  return notas;
}

function transformarMotivoV8(motivo: number[], adn: ADNNumericoV7, tipo: "respuesta" | "memoria"): number[] {
  if (!motivo.length) return motivo;
  const salida = [...motivo];

  if (tipo === "respuesta") {
    // Conserva identidad: misma cabeza, contorno desplazado y última nota nueva.
    const giro = motivo.length >= 4 ? 1 : 0;
    const rotado = [...motivo.slice(giro), ...motivo.slice(0, giro)];
    return rotado.map((n, i) => limitarMelodiaV8(n + (i === rotado.length - 1 ? (adn.noResuelto ? 2 : -2) : 0)));
  }

  // Memoria = material reconocido, erosionado; nunca copia literal.
  salida[0] = limitarMelodiaV8(salida[0] - 12);
  salida[salida.length - 1] = limitarMelodiaV8(
    salida[salida.length - 1] + (adn.noResuelto ? 1 : -1),
  );
  return salida;
}

function ataquesEsteticosV8(adn: ADNNumericoV7, desplazamiento = 0): number[] {
  const fuente = adn.ataques.length ? adn.ataques : [1, 0, 0, 0, 1, 0, 0, 0];
  const salida = Array.from({ length: 8 }, (_, i) => fuente[(i + desplazamiento) % fuente.length] ? 1 : 0);

  const minimo = adn.vacio >= 76 ? 2 : adn.densidad >= 64 ? 4 : 3;
  const maximo = adn.densidad >= 72 ? 5 : 4;
  const orden = [0, 4, 3, 6, 2, 7, 5, 1];

  let activos = salida.reduce((a, b) => a + b, 0);
  for (const p of orden) {
    if (activos >= minimo) break;
    if (!salida[p]) { salida[p] = 1; activos += 1; }
  }

  // Economía: nunca metralla continua en la voz principal.
  for (let i = 1; i < salida.length - 1; i++) {
    if (salida[i - 1] && salida[i] && salida[i + 1] && activos > minimo) {
      salida[i] = 0;
      activos -= 1;
    }
  }
  for (let i = salida.length - 1; i >= 0 && activos > maximo; i--) {
    if (salida[i] && i !== 0 && i !== 4) { salida[i] = 0; activos -= 1; }
  }

  if (adn.vacio >= 84) {
    return [1, 0, 0, 0, 1, 0, 0, 0];
  }
  return salida;
}

function patronNotasV8(notas: number[], ataques: number[]): string {
  const eventos: string[] = [];
  let cursor = 0;
  for (let i = 0; i < 8; i++) {
    if (ataques[i]) {
      eventos.push(midiANotaV7(notas[cursor % notas.length]));
      cursor += 1;
    } else eventos.push("~");
  }
  return eventos.join(" ");
}

function patronArmonicoV8(centro: number, campo: number[], escena: number, adn: ADNNumericoV7): string {
  const gradosPorOctava = Math.max(1, campo.length - 1);
  const g0 = (escena + (adn.retorno >= 58 ? 0 : 1)) % gradosPorOctava;
  const g1 = (g0 + (adn.tension >= 66 ? 2 : 3)) % gradosPorOctava;
  const n0 = limitarMelodiaV8(notaPorGradoV8(centro - 12, campo, g0));
  const n1 = limitarMelodiaV8(notaPorGradoV8(centro - 12, campo, g1));
  return `${midiANotaV7(n0)} ~ ~ ~ ${midiANotaV7(n1)} ~ ~ ~`;
}

function patronBajoV8(centro: number, campo: number[], escena: number, presion: number): string {
  const gradosPorOctava = Math.max(1, campo.length - 1);
  const g = escena % Math.min(4, gradosPorOctava);
  let raiz = notaPorGradoV8(36 + pcV8(centro), campo, g);
  while (raiz > 47) raiz -= 12;
  while (raiz < 33) raiz += 12;
  const quinta = Math.min(52, raiz + 7);
  if (presion >= 78) return `${midiANotaV7(raiz)} ~ ${midiANotaV7(quinta)} ${midiANotaV7(raiz)}`;
  return `${midiANotaV7(raiz)} ~ ~ ${presion >= 58 ? midiANotaV7(quinta) : "~"}`;
}

function tipoPulsoV8(adn: ADNNumericoV7): PulsoV8 {
  if (adn.pulso < 40 || adn.vacio >= 80) return "ausente";
  if (adn.ruptura >= 70) return "fracturado";
  if (adn.pulso >= 68 && adn.simetria >= 45) return "motor";
  return "latido";
}

function patronPulsoV8(tipo: PulsoV8, presion: number): string | null {
  if (tipo === "ausente") return null;
  if (tipo === "motor") return presion >= 78 ? "bd*4" : "bd ~ bd ~";
  if (tipo === "fracturado") return presion >= 72 ? "bd(5,12)" : "bd ~ ~ bd";
  return presion >= 72 ? "bd ~ bd ~" : "bd ~ ~ ~";
}

function escenaClimaxV8(adn: ADNNumericoV7, cantidad: number): number {
  if (cantidad <= 1) return 0;
  let indice = 0;
  let valor = -Infinity;
  for (let i = 0; i < cantidad; i++) {
    const posicion = i / Math.max(1, cantidad - 1);
    // El texto manda; una suave preferencia evita clímax absurdamente prematuros.
    const puntuacion = (adn.presion[i] ?? 30) + (posicion >= 0.45 && posicion <= 0.85 ? 8 : 0);
    if (puntuacion > valor) { valor = puntuacion; indice = i; }
  }
  return indice;
}

function presionEsteticaV8(adn: ADNNumericoV7, indice: number, cantidad: number, climax: number): number {
  const textual = adn.presion[indice] ?? 32;
  const distancia = Math.abs(indice - climax);
  const arco = clampV7(82 - distancia * 18, 18, 82);
  const mezcla = textual * 0.68 + arco * 0.32;

  // Contracción justo antes del clímax cuando hay tensión/memoria: intensidad por sustracción.
  if (indice === climax - 1 && climax > 0 && (adn.tension >= 54 || adn.memoria >= 58)) {
    return Math.round(clampV7(mezcla - 16, 12, 88));
  }
  // Retirada final: no terminar siempre arriba.
  if (indice === cantidad - 1 && cantidad >= 4) {
    return Math.round(clampV7(mezcla - 20 - adn.vacio * 0.08, 10, 76));
  }
  return Math.round(clampV7(mezcla, 10, 92));
}

function construirPlanV8(adn: ADNNumericoV7): PlanEsteticoV8 {
  const campo = campoRelacionalV8(adn);
  const centro = 58 + pcV8(adn.centroMidi); // registro de frase: Bb3..A4 aprox.
  const motivoA = construirMotivoV8(adn, campo, centro);
  const motivoB = transformarMotivoV8(motivoA, adn, "respuesta");
  const motivoMemoria = transformarMotivoV8(motivoA, adn, "memoria");
  const ataquesA = ataquesEsteticosV8(adn, 0);
  const ataquesB = ataquesEsteticosV8(adn, Math.max(1, adn.ruptura % 5));
  const cantidad = Math.max(1, adn.duraciones.length);
  const climax = escenaClimaxV8(adn, cantidad);

  return {
    centro,
    campo,
    motivoA,
    motivoB,
    motivoMemoria,
    ataquesA,
    ataquesB,
    pulso: tipoPulsoV8(adn),
    escenaClimax: climax,
    entradaBajo: Math.min(cantidad - 1, Math.max(1, Math.floor(cantidad * (adn.densidad >= 60 ? 0.28 : 0.40)))),
    entradaPulso: Math.min(cantidad - 1, Math.max(1, Math.floor(cantidad * (adn.pulso >= 68 ? 0.34 : 0.48)))),
    retiradaFinal: adn.vacio >= 42 || adn.memoria >= 45 || adn.noResuelto,
    nombreCampo: `relacional-${campo.join(".")}`,
  };
}

// === FIN EMBRION V8 · COMPOSITOR ESTETICO ===
'''

codigo = r'''
export function codigoStrudel(organismo: Organismo): string {
  const textoVivo = [organismo.poema, ...organismo.injertos]
    .filter(Boolean)
    .join("\n");

  const adn = extraerADNNumericoV7(textoVivo);
  const plan = construirPlanV8(adn);
  const cantidad = Math.max(1, adn.duraciones.length);

  const escenas = Array.from({ length: cantidad }, (_, indice) => {
    const presion = presionEsteticaV8(adn, indice, cantidad, plan.escenaClimax);
    const p = presion / 100;
    const vacioLocal = clampV7(adn.vacio + (indice % 3 === 1 ? 7 : -3), 0, 100);
    const v = vacioLocal / 100;
    const esClimax = indice === plan.escenaClimax;
    const esFinal = indice === cantidad - 1;
    const esRetorno = adn.retornos.some(([, destino]) => destino % cantidad === indice)
      || (adn.retorno >= 54 && indice === Math.max(1, cantidad - 2));

    let motivo = indice === 0 ? plan.motivoA : (indice % 2 === 0 ? plan.motivoA : plan.motivoB);
    if (esRetorno || (esFinal && adn.memoria >= 48)) motivo = plan.motivoMemoria;

    const ataques = indice % 2 === 0 ? plan.ataquesA : plan.ataquesB;
    const patron = patronNotasV8(motivo, ataques);
    const patronRespuesta = patronNotasV8(
      plan.motivoB.map((n, i) => limitarMelodiaV8(n + (esClimax && i === plan.motivoB.length - 1 ? 12 : 0))),
      ataques.map((a, i) => (i % 2 === 0 ? a : 0)),
    );
    const patronArmonia = patronArmonicoV8(plan.centro, plan.campo, indice, adn);

    const capas: string[] = [];

    // 1. IDEA. Siempre debe poder tararearse/reconocerse: frase corta, no dron.
    capas.push(`note("${patron}")
      .s("gm_epiano1:1")
      .gain(${decimal(0.13 + p * 0.10 - v * 0.025)})
      .room(${decimal(0.28 + v * 0.30)})
      .delay(${decimal(0.06 + adn.memoria / 100 * 0.11)})
      .lpf(${Math.round(1700 + p * 2500)})
      .release(${decimal(0.30 + v * 0.46)})`);

    // 2. ARMONÍA. Aparece como sostén discontinuo, nunca como pad permanente.
    const armoniaActiva = indice >= 1 && vacioLocal < 82 && (adn.densidad >= 38 || adn.memoria >= 48);
    if (armoniaActiva) {
      capas.push(`note("${patronArmonia}")
        .s("triangle")
        .attack(.015).decay(.20).sustain(.035).release(${decimal(0.34 + v * 0.32)})
        .gain(${decimal(0.026 + p * 0.038)})
        .room(${decimal(0.44 + v * 0.24)})
        .lpf(${Math.round(1200 + p * 1800)})`);
    }

    // 3. RESPUESTA. Entra después de que la idea ya exista; nunca duplica exactamente A.
    const respuestaActiva = indice >= Math.max(1, Math.floor(cantidad * 0.25))
      && vacioLocal < 78
      && (adn.memoria >= 42 || adn.retorno >= 38 || presion >= 62);
    if (respuestaActiva) {
      capas.push(`note("${patronRespuesta}")
        .s("triangle")
        .attack(.008).decay(.16).sustain(.025).release(.32)
        .gain(${decimal(0.026 + p * 0.045)})
        .room(.36).delay(${decimal(0.10 + adn.retorno / 100 * 0.10)})
        .lpf(${Math.round(2100 + p * 2100)})`);
    }

    // 4. GRAVE. Llega tarde y articula; jamás es una nota infinita.
    const bajoActivo = indice >= plan.entradaBajo
      && adn.densidad >= 38
      && vacioLocal < 76
      && presion >= 40
      && !(esFinal && plan.retiradaFinal);
    if (bajoActivo) {
      capas.push(`note("${patronBajoV8(plan.centro, plan.campo, indice, presion)}")
        .s("gm_acoustic_bass")
        .gain(${decimal(0.075 + p * 0.095)})
        .lpf(${Math.round(720 + p * 520)})
        .release(.24)`);
    }

    // 5. PULSO. Puede no existir. Si existe, aparece cuando la obra ya tiene identidad.
    const pulso = patronPulsoV8(plan.pulso, presion);
    const pulsoActivo = pulso
      && indice >= plan.entradaPulso
      && vacioLocal < 72
      && presion >= 48
      && !(esFinal && plan.retiradaFinal);
    if (pulsoActivo && pulso) {
      capas.push(`s("${pulso}")
        .gain(${decimal(0.095 + p * 0.13)})`);

      if (presion >= 66 && adn.densidad >= 46) {
        const hats = plan.pulso === "fracturado"
          ? "[~ hh]*8"
          : presion >= 80 ? "~ hh hh ~ hh ~ hh ~" : "~ hh ~ hh";
        capas.push(`s("${hats}")
          .decay(.035).sustain(0)
          .gain(${decimal(0.018 + p * 0.026)})
          .hpf(6100)`);
      }
    }

    // 6. CLÍMAX. No sube el BPM: abre registro y revela una versión elevada del motivo.
    if (esClimax && presion >= 58) {
      const alto = patronNotasV8(
        plan.motivoA.map((n, i) => limitarMelodiaV8(n + (i % 2 === 0 ? 12 : 7))),
        plan.ataquesA.map((a, i) => (i === 6 ? 1 : a)),
      );
      capas.push(`note("${alto}")
        .s("gm_epiano1:1")
        .gain(.070)
        .room(.42).delay(.12)
        .lpf(4700)
        .release(.38)`);
    }

    // 7. FRACTURA. Un acontecimiento raro: aire microscópico, nunca una capa constante.
    if (adn.ruptura >= 72 && presion >= 60 && indice !== 0 && !esFinal) {
      capas.push(`s("pink*4")
        .decay(.018).sustain(0)
        .gain(.010)
        .hpf(6900)`);
    }

    // Vacío extremo elimina capas. Intensidad por sustracción.
    let finales = capas;
    if (vacioLocal >= 86) finales = capas.slice(0, 1);
    else if (esFinal && plan.retiradaFinal) finales = capas.slice(0, Math.min(2, capas.length));

    return {
      codigo: `const escena${indice} = stack(\n${finales.join(",\n")}\n)`,
      presion,
      vacioLocal,
    };
  });

  const declaraciones = escenas.map((e) => e.codigo).join("\n\n");
  const arreglo = adn.duraciones
    .map((duracion, indice) => `  [${Math.max(3, duracion)}, escena${indice}]`)
    .join(",\n");

  const retornosTexto = adn.retornos.length
    ? adn.retornos.map(([a, b]) => `${a}→${b}`).join(" · ")
    : "—";

  return `/*
EMBRIÓN V8 · COMPOSITOR ESTÉTICO
${adn.firma} · ${organismo.nombre}

TESIS
La literatura decide la partitura. El compositor estético busca belleza.
Strudel interpreta; no compone.

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

COMPOSITOR
CAMPO        ${plan.nombreCampo}
MOTIVO A     [${plan.motivoA.map(midiANotaV7).join(", ")}]
RESPUESTA B  [${plan.motivoB.map(midiANotaV7).join(", ")}]
MEMORIA A'   [${plan.motivoMemoria.map(midiANotaV7).join(", ")}]
PULSO        ${plan.pulso}
ENTRA BAJO   escena ${plan.entradaBajo}
ENTRA PULSO  escena ${plan.entradaPulso}
CLÍMAX       escena ${plan.escenaClimax}
RETORNOS     ${retornosTexto}

LEYES
idea pequeña > exceso · armonía discontinua · grave tardío · pulso opcional
contracción antes del clímax · retorno transformado · retirada final · no drop EDM
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
    text = replace_function(text, "export function codigoStrudel", codigo)
    anchor = "export function codigoStrudel"
    if anchor not in text:
        raise RuntimeError("No encuentro el punto de inserción")
    text = text.replace(anchor, helpers.strip() + "\n\n" + anchor, 1)
    path.write_text(text, encoding="utf-8")
except Exception as exc:
    shutil.copy2(backup, path)
    print("❌ No se pudo instalar V8:", exc)
    print("✅ Restaurado:", backup)
    sys.exit(1)

print("===== VALIDANDO SOLO motor.ts =====")
result = subprocess.run(
    [
        "npx", "tsc", str(path),
        "--noEmit", "--pretty", "false",
        "--target", "ES2020", "--module", "ESNext",
        "--moduleResolution", "Bundler", "--skipLibCheck",
        "--lib", "ES2020,DOM",
    ],
    text=True,
)

if result.returncode != 0:
    shutil.copy2(backup, path)
    print("❌ V8 tiene un error de TypeScript.")
    print("✅ Restaurado automáticamente:", backup)
    sys.exit(result.returncode)

print("✅ EMBRIÓN V8 INSTALADO")
print("✅ Núcleo numérico V7 conservado")
print("✅ Compositor estético activo")
print("✅ Motivo A + respuesta B + memoria A' generados desde el texto")
print("✅ Armonía relacional, no cesta fija de escalas")
print("✅ Bajo tardío y articulado")
print("✅ Pulso opcional y posterior a la identidad melódica")
print("✅ Clímax por revelación/registro, no por BPM")
print("✅ Vacío elimina capas")
print("✅ Retorno transformado y retirada final")
print("✅ Validación aislada superada")
PY
