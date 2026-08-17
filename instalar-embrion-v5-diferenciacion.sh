#!/usr/bin/env bash
set -euo pipefail
cd "$HOME/poema-universal"

python3 - <<'PY'
from pathlib import Path
from datetime import datetime
import shutil, subprocess, sys

p = Path('app/laboratorio/verso-tecno/organismo/motor.ts')
if not p.exists():
    print('❌ No encuentro', p)
    sys.exit(1)

stamp = datetime.now().strftime('%Y%m%d-%H%M%S')
backup = p.with_name(f'motor.before-v5-diferenciacion-{stamp}.ts')
shutil.copy2(p, backup)
print('✅ Copia de seguridad:', backup)

text = p.read_text(encoding='utf-8')
start_marker = '// === EMBRION V5 · PERFIL COMPOSITIVO ==='
end_marker = '// === FIN EMBRION V5 · PERFIL COMPOSITIVO ==='

if start_marker in text and end_marker in text:
    a = text.index(start_marker)
    b = text.index(end_marker) + len(end_marker)
    text = text[:a] + text[b:]

perfil = r'''
// === EMBRION V5 · PERFIL COMPOSITIVO ===
type PerfilCompositivoV5 = {
  repeticion: number;
  fragmentacion: number;
  suspension: number;
  cuerpo: number;
  densidad: number;
  vacio: number;
  pulso: "suspendido" | "intermitente" | "roto" | "estable";
};

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function perfilCompositivoV5(texto: string): PerfilCompositivoV5 {
  const lista = relevantes(texto).map(normalizar);
  const todas = palabras(texto);
  const lineas = texto.split(/\n+/).map(x => x.trim()).filter(Boolean);
  const freq = new Map<string, number>();
  lista.forEach(p => freq.set(p, (freq.get(p) ?? 0) + 1));
  const extras = [...freq.values()].reduce((n, v) => n + Math.max(0, v - 1), 0);
  const repeticion = clamp01(lista.length ? extras / lista.length : 0);
  const breves = lineas.filter(l => palabras(l).length <= 3).length;
  const signos = (texto.match(/[,.…;:!?—-]/g) ?? []).length;
  const fragmentacion = clamp01(
    (lineas.length ? breves / lineas.length : 0) * 0.55 +
    (todas.length ? signos / todas.length : 0) * 1.45
  );
  const a = analizarPoema(texto);
  const cuerpo = clamp01((a.habitats.pulso * 0.52 + a.habitats.maquina * 0.30) / 100 + repeticion * 0.30);
  const suspension = clamp01((a.habitats.deriva * 0.48 + a.habitats.espectral * 0.28) / 100 + fragmentacion * 0.20 - cuerpo * 0.18);
  const densidad = clamp01(0.14 + Math.min(0.42, todas.length / 90) + cuerpo * 0.25 + repeticion * 0.35 - suspension * 0.10);
  const vacio = clamp01(0.82 - densidad * 0.72 + suspension * 0.28 - repeticion * 0.20);

  let pulso: PerfilCompositivoV5['pulso'];
  if (repeticion >= 0.15) pulso = 'estable';
  else if (suspension >= 0.56) pulso = 'suspendido';
  else if (fragmentacion >= 0.58) pulso = 'roto';
  else pulso = 'intermitente';

  return { repeticion, fragmentacion, suspension, cuerpo, densidad, vacio, pulso };
}
// === FIN EMBRION V5 · PERFIL COMPOSITIVO ===
'''.strip()

bpm = r'''
export function bpmActual(organismo: Organismo): number {
  const texto = [organismo.poema, ...organismo.injertos].filter(Boolean).join("\n");
  const p = perfilCompositivoV5(texto);
  return limitar(
    organismo.bpmBase +
      p.repeticion * 34 +
      p.cuerpo * 10 +
      p.fragmentacion * 5 -
      p.suspension * 24 -
      p.vacio * 8,
    48,
    150,
  );
}
'''.strip()

codigo = r'''
export function codigoStrudel(organismo: Organismo): string {
  const texto = [organismo.poema, ...organismo.injertos].filter(Boolean).join("\n");
  const a = analizarPoema(texto);
  const p = perfilCompositivoV5(texto);
  const base = organismo.notas.length ? organismo.notas : a.notas;
  const notas = rotar(base.length ? base : ["c2", "eb2", "g2", "bb2"], organismo.edad + organismo.diario.length);
  const n = p.densidad > 0.65 ? 5 : p.vacio > 0.60 ? 2 : 3;
  const mA = notas.slice(0, n).join(" ");
  const mB = rotar(notas, 2).slice(0, Math.max(2, n)).join(" ");
  const mC = rotar(notas, 4).slice(0, Math.max(2, n - 1)).join(" ");
  const bajo = notas.slice(0, 3).map(x => x.replace(/[3-7]$/, "2")).join(" ");
  const reliquia = notas[hashTexto(organismo.reliquia) % notas.length] ?? "c2";
  const final = notas[notas.length - 1] ?? reliquia;
  const seed = a.semilla;
  const oscs = ["sine", "triangle", "sawtooth"] as const;
  const o1 = oscs[seed % 3];
  const o2 = oscs[Math.floor(seed / 7) % 3];
  const bpm = bpmActual(organismo);

  const kick = p.pulso === "estable" ? "bd*4" : p.pulso === "roto" ? "bd(3,8)" : p.pulso === "intermitente" ? "bd ~ ~ bd" : "bd ~ ~ ~";
  const hats = p.densidad > 0.68 ? "hh*8" : p.densidad > 0.42 ? "[~ hh]*4" : "~ hh ~ ~";
  const clap = p.repeticion > 0.15 || p.cuerpo > 0.55 ? "~ cp ~ cp" : "~ ~ cp ~";

  const mel = (motivo: string, osc: string, slow: number, gain: number, room: number) => `note("<${motivo}>").s("${osc}").slow(${slow}).gain(${decimal(gain)}).room(${decimal(room)})`;
  const sub = (slow: number, gain: number) => `note("<${bajo}>").s("sine").slow(${slow}).gain(${decimal(gain)}).lpf(${Math.round(500 + p.cuerpo * 1200)})`;
  const bd = (gain: number, patron = kick) => `s("${patron}").gain(${decimal(gain)})`;
  const hh = (gain: number, patron = hats) => `s("${patron}").gain(${decimal(gain)}).hpf(${Math.round(4400 + p.fragmentacion * 1800)})`;
  const cp = `s("${clap}").gain(${decimal(0.04 + p.cuerpo * 0.14)}).room(${decimal(0.08 + p.suspension * 0.20)})`;
  const eco = `note("<${reliquia} ~ ${final} ~>").s("triangle").slow(${p.repeticion > 0.15 ? 5 : 9}).gain(${decimal(0.04 + p.repeticion * 0.14)}).room(${decimal(0.55 + p.suspension * 0.28)}).delay(${decimal(0.10 + p.repeticion * 0.25)})`;
  const stack = (...xs: string[]) => `stack(\n  ${xs.filter(Boolean).join(",\n  ")}\n)`;

  const incubacion = stack(
    mel(mA, o1, p.vacio > 0.60 ? 12 : 9, 0.07 + p.densidad * 0.10, 0.58 + p.suspension * 0.28),
    eco,
  );

  const germinacion = stack(
    mel(mA, o1, p.suspension > 0.55 ? 8 : 6, 0.09 + p.densidad * 0.13, 0.42 + p.suspension * 0.26),
    sub(p.cuerpo > 0.55 ? 4 : 7, 0.06 + p.cuerpo * 0.16),
    p.pulso === "suspendido" ? "" : bd(0.08 + p.cuerpo * 0.18),
  );

  const formacion = stack(
    mel(mB, o2, p.repeticion > 0.15 ? 3 : 5, 0.10 + p.densidad * 0.16, 0.30 + p.suspension * 0.24),
    sub(p.repeticion > 0.15 ? 2 : 4, 0.09 + p.cuerpo * 0.22),
    bd(0.12 + p.cuerpo * 0.25),
    p.densidad > 0.40 ? hh(0.03 + p.fragmentacion * 0.10) : "",
  );

  const cuerpo = stack(
    mel(mB, o2, p.cuerpo > 0.60 ? 1 : 3, 0.09 + p.cuerpo * 0.20, 0.18 + p.suspension * 0.14),
    sub(p.pulso === "estable" ? 1 : 2, 0.13 + p.cuerpo * 0.28),
    bd(0.18 + p.cuerpo * 0.36),
    p.cuerpo > 0.38 ? cp : "",
    p.densidad > 0.48 ? hh(0.04 + p.fragmentacion * 0.10) : "",
  );

  const fractura = stack(
    mel(mC, "triangle", p.fragmentacion > 0.58 ? 2 : 5, 0.07 + p.fragmentacion * 0.15, 0.52 + p.suspension * 0.25),
    p.vacio > 0.64 ? "" : bd(0.09 + p.fragmentacion * 0.20, p.fragmentacion > 0.58 ? "bd(5,12)" : kick),
    p.fragmentacion > 0.38 ? hh(0.03 + p.fragmentacion * 0.10, "[~ hh]*8") : "",
  );

  const expansion = stack(
    p.repeticion > 0.15
      ? `note("<${reliquia} ${reliquia} ~ ${reliquia}>").s("${o2}").slow(2).gain(${decimal(0.06 + p.repeticion * 0.22)}).room(${decimal(0.36 + p.suspension * 0.24)})`
      : mel(mC, o1, 3, 0.11 + p.densidad * 0.17, 0.32 + p.suspension * 0.18),
    sub(p.cuerpo > 0.52 ? 1 : 3, 0.14 + p.cuerpo * 0.32),
    bd(0.20 + p.cuerpo * 0.38, p.repeticion > 0.15 ? "bd*4" : kick),
    p.cuerpo > 0.42 ? cp : "",
    p.densidad > 0.44 ? hh(0.04 + p.fragmentacion * 0.11, p.densidad > 0.62 ? "hh*16" : hats) : "",
    eco,
  );

  const memoria = stack(
    mel(mA, "sine", p.suspension > 0.55 ? 11 : 8, 0.06 + p.suspension * 0.08, 0.68 + p.suspension * 0.20),
    eco,
    p.repeticion > 0.28 ? bd(0.05 + p.cuerpo * 0.07, "bd ~ ~ ~") : "",
  );

  const pesos = [
    5 + p.vacio * 5,
    5 + p.suspension * 3,
    7 + p.densidad * 4,
    8 + p.cuerpo * 6,
    4 + p.fragmentacion * 5,
    7 + p.repeticion * 8 + p.cuerpo * 2,
    6 + p.suspension * 3,
  ];
  const total = pesos.reduce((s, x) => s + x, 0);
  const ciclos = pesos.map(x => Math.max(2, Math.floor((x / total) * CICLOS_COMPOSICION)));
  let dif = CICLOS_COMPOSICION - ciclos.reduce((s, x) => s + x, 0);
  let i = 0;
  while (dif > 0) { ciclos[i++ % ciclos.length] += 1; dif -= 1; }
  i = ciclos.length - 1;
  while (dif < 0) {
    const k = ((i % ciclos.length) + ciclos.length) % ciclos.length;
    if (ciclos[k] > 2) { ciclos[k] -= 1; dif += 1; }
    i -= 1;
  }

  return `/*\nORGANISMO · MOTOR COMPOSITIVO V5\n${organismo.codigo} · ${organismo.nombre}\nPulso: ${p.pulso}\nRepetición: ${Math.round(p.repeticion * 100)}\nFragmentación: ${Math.round(p.fragmentacion * 100)}\nSuspensión: ${Math.round(p.suspension * 100)}\nDensidad: ${Math.round(p.densidad * 100)}\nVacío: ${Math.round(p.vacio * 100)}\nCiclos: ${ciclos.join(" · ")}\n*/\n\nsetcpm(${bpm}/4)\n\nconst incubacion = ${incubacion}\nconst germinacion = ${germinacion}\nconst formacion = ${formacion}\nconst cuerpo = ${cuerpo}\nconst fractura = ${fractura}\nconst expansion = ${expansion}\nconst memoria = ${memoria}\n\narrange(\n  [${ciclos[0]}, incubacion],\n  [${ciclos[1]}, germinacion],\n  [${ciclos[2]}, formacion],\n  [${ciclos[3]}, cuerpo],\n  [${ciclos[4]}, fractura],\n  [${ciclos[5]}, expansion],\n  [${ciclos[6]}, memoria]\n)\n`;
}
'''.strip()

try:
    a = text.index('export function bpmActual')
    b = text.index('export function duracionComposicionMinutos', a)
    text = text[:a] + perfil + '\n\n' + bpm + '\n\n' + text[b:]

    c = text.index('export function codigoStrudel')
    text = text[:c] + codigo + '\n'
    p.write_text(text, encoding='utf-8')
except Exception as exc:
    shutil.copy2(backup, p)
    print('❌ No se pudo aplicar V5:', exc)
    print('✅ Restaurado:', backup)
    sys.exit(1)

print('===== VALIDANDO SOLO motor.ts =====')
cmd = [
    'npx', 'tsc', str(p), '--noEmit', '--pretty', 'false',
    '--target', 'ES2020', '--module', 'ESNext',
    '--moduleResolution', 'Bundler', '--skipLibCheck', '--lib', 'ES2020,DOM'
]
result = subprocess.run(cmd)
if result.returncode != 0:
    shutil.copy2(backup, p)
    print('❌ V5 tiene un error propio. Restaurado automáticamente.')
    print('✅ Restaurado:', backup)
    sys.exit(result.returncode)

print('✅ EMBRIÓN V5 INSTALADO')
print('✅ Validación aislada superada')
print('✅ La interfaz V4.9.1 no se ha tocado')
PY
