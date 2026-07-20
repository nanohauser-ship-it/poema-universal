"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, PointerEvent } from "react";

type Retrato = {
  id: number;
  nombre: string | null;
  mensaje: string | null;
  foto: string;
  created_at?: string;
  creado_en?: string;
};

type Herramienta = "lapiz" | "rotulador" | "oleo" | "goma";

export default function RetratosPage() {
  const fotoCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const dibujoCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const dibujandoRef = useRef(false);
  const ultimoPuntoRef = useRef<{ x: number; y: number } | null>(null);
  const imagenMascotaRef = useRef<HTMLImageElement | null>(null);

  const historialRef = useRef<string[]>([]);
  const indiceHistorialRef = useRef(0);

  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [previewMascota, setPreviewMascota] = useState<string | null>(null);

  const [herramienta, setHerramienta] = useState<Herramienta>("lapiz");
  const [color, setColor] = useState("#2f241c");
  const [grosor, setGrosor] = useState(5);
  const [opacidadFoto, setOpacidadFoto] = useState(0.38);

  const [guardando, setGuardando] = useState(false);
  const [retratos, setRetratos] = useState<Retrato[]>([]);
  const [hayContenido, setHayContenido] = useState(false);
  const [puedeDeshacer, setPuedeDeshacer] = useState(false);
  const [puedeRehacer, setPuedeRehacer] = useState(false);

  useEffect(() => {
    prepararLienzos();
    cargarRetratos();

    window.addEventListener("resize", prepararLienzos);

    return () => {
      window.removeEventListener("resize", prepararLienzos);
    };
  }, []);

  useEffect(() => {
    if (imagenMascotaRef.current) {
      dibujarFotoDeFondo(imagenMascotaRef.current);
    }
  }, [opacidadFoto]);

  async function cargarRetratos() {
    const response = await fetch("/api/retratos");
    const data = await response.json();

    if (Array.isArray(data)) {
      setRetratos(data);
    }
  }

  function prepararLienzos() {
    const fotoCanvas = fotoCanvasRef.current;
    const dibujoCanvas = dibujoCanvasRef.current;

    if (!fotoCanvas || !dibujoCanvas) return;

    const contenedor = fotoCanvas.parentElement;
    if (!contenedor) return;

    const ratio = window.devicePixelRatio || 1;
    const ancho = contenedor.clientWidth;
    const alto = Math.round(ancho * 1.18);

    [fotoCanvas, dibujoCanvas].forEach((canvas) => {
      canvas.width = ancho * ratio;
      canvas.height = alto * ratio;
      canvas.style.width = `${ancho}px`;
      canvas.style.height = `${alto}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    });

    const fotoCtx = fotoCanvas.getContext("2d");
    if (fotoCtx) {
      fotoCtx.fillStyle = "#fff8ea";
      fotoCtx.fillRect(0, 0, ancho, alto);
    }

    limpiarSoloDibujo(false);

    if (imagenMascotaRef.current) {
      dibujarFotoDeFondo(imagenMascotaRef.current);
      setHayContenido(true);
    }

    reiniciarHistorial();
  }

  function limpiarSoloDibujo(actualizar = true) {
    const canvas = dibujoCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    if (actualizar) {
      reiniciarHistorial();
      setHayContenido(Boolean(imagenMascotaRef.current));
    }
  }

  function dibujarFotoDeFondo(img: HTMLImageElement) {
    const canvas = fotoCanvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();

    ctx.fillStyle = "#fff8ea";
    ctx.fillRect(0, 0, rect.width, rect.height);

    const escala = Math.min(rect.width / img.width, rect.height / img.height);
    const ancho = img.width * escala;
    const alto = img.height * escala;
    const x = (rect.width - ancho) / 2;
    const y = (rect.height - alto) / 2;

    ctx.globalAlpha = opacidadFoto;
    ctx.drawImage(img, x, y, ancho, alto);
    ctx.globalAlpha = 1;
  }

  function subirFotoMascota(e: ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    const url = URL.createObjectURL(archivo);
    setPreviewMascota(url);

    const img = new Image();

    img.onload = () => {
      imagenMascotaRef.current = img;
      dibujarFotoDeFondo(img);
      limpiarSoloDibujo(false);
      reiniciarHistorial();
      setHayContenido(true);
    };

    img.src = url;
  }

  function obtenerPunto(e: PointerEvent<HTMLCanvasElement>) {
    const canvas = dibujoCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function aplicarHerramienta(ctx: CanvasRenderingContext2D) {
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";

    if (herramienta === "lapiz") {
      ctx.strokeStyle = color;
      ctx.lineWidth = grosor;
      ctx.globalAlpha = 0.92;
    }

    if (herramienta === "rotulador") {
      ctx.strokeStyle = color;
      ctx.lineWidth = grosor * 2.1;
      ctx.globalAlpha = 0.42;
    }

    if (herramienta === "oleo") {
      ctx.strokeStyle = color;
      ctx.lineWidth = grosor * 2.7;
      ctx.globalAlpha = 0.74;
      ctx.shadowColor = color;
      ctx.shadowBlur = grosor * 0.55;
    }

    if (herramienta === "goma") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = grosor * 2.4;
      ctx.globalAlpha = 1;
    }
  }

  function empezarDibujo(e: PointerEvent<HTMLCanvasElement>) {
    const canvas = dibujoCanvasRef.current;
    if (!canvas) return;

    canvas.setPointerCapture(e.pointerId);

    dibujandoRef.current = true;
    ultimoPuntoRef.current = obtenerPunto(e);
    setHayContenido(true);
  }

  function dibujar(e: PointerEvent<HTMLCanvasElement>) {
    if (!dibujandoRef.current) return;

    const canvas = dibujoCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    const ultimo = ultimoPuntoRef.current;

    if (!canvas || !ctx || !ultimo) return;

    const punto = obtenerPunto(e);

    aplicarHerramienta(ctx);

    ctx.beginPath();
    ctx.moveTo(ultimo.x, ultimo.y);
    ctx.lineTo(punto.x, punto.y);
    ctx.stroke();

    if (herramienta === "oleo") {
      ctx.beginPath();
      ctx.arc(punto.x, punto.y, grosor * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.35;
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";

    ultimoPuntoRef.current = punto;
  }

  function terminarDibujo(e: PointerEvent<HTMLCanvasElement>) {
    const canvas = dibujoCanvasRef.current;

    if (canvas) {
      canvas.releasePointerCapture(e.pointerId);
    }

    if (dibujandoRef.current) {
      guardarEstadoHistorial();
    }

    dibujandoRef.current = false;
    ultimoPuntoRef.current = null;
  }

  function reiniciarHistorial() {
    historialRef.current = [];
    indiceHistorialRef.current = 0;
    guardarEstadoHistorial();
    actualizarBotonesHistorial();
  }

  function guardarEstadoHistorial() {
    const canvas = dibujoCanvasRef.current;
    if (!canvas) return;

    const estado = canvas.toDataURL("image/png");

    const historialCortado = historialRef.current.slice(
      0,
      indiceHistorialRef.current + 1,
    );

    historialCortado.push(estado);

    if (historialCortado.length > 30) {
      historialCortado.shift();
    }

    historialRef.current = historialCortado;
    indiceHistorialRef.current = historialRef.current.length - 1;

    actualizarBotonesHistorial();
  }

  function actualizarBotonesHistorial() {
    setPuedeDeshacer(indiceHistorialRef.current > 0);
    setPuedeRehacer(
      indiceHistorialRef.current < historialRef.current.length - 1,
    );
  }

  function restaurarDibujo(dataUrl: string) {
    const canvas = dibujoCanvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const img = new Image();

    img.onload = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.drawImage(img, 0, 0, rect.width, rect.height);
      actualizarBotonesHistorial();
    };

    img.src = dataUrl;
  }

  function deshacer() {
    if (indiceHistorialRef.current <= 0) return;

    indiceHistorialRef.current -= 1;
    restaurarDibujo(historialRef.current[indiceHistorialRef.current]);
  }

  function rehacer() {
    if (indiceHistorialRef.current >= historialRef.current.length - 1) return;

    indiceHistorialRef.current += 1;
    restaurarDibujo(historialRef.current[indiceHistorialRef.current]);
  }

  function limpiarDibujo() {
    limpiarSoloDibujo(true);
  }

  function borrarTodo() {
    imagenMascotaRef.current = null;
    setPreviewMascota(null);
    setHayContenido(false);

    const fotoCanvas = fotoCanvasRef.current;
    const fotoCtx = fotoCanvas?.getContext("2d");

    if (fotoCanvas && fotoCtx) {
      const rect = fotoCanvas.getBoundingClientRect();
      fotoCtx.fillStyle = "#fff8ea";
      fotoCtx.fillRect(0, 0, rect.width, rect.height);
    }

    limpiarSoloDibujo(false);
    reiniciarHistorial();
  }

  function convertirLienzoEnArchivo(): Promise<File> {
    return new Promise((resolve, reject) => {
      const fotoCanvas = fotoCanvasRef.current;
      const dibujoCanvas = dibujoCanvasRef.current;

      if (!fotoCanvas || !dibujoCanvas) {
        reject(new Error("No hay lienzo."));
        return;
      }

      const lienzoFinal = document.createElement("canvas");
      lienzoFinal.width = fotoCanvas.width;
      lienzoFinal.height = fotoCanvas.height;

      const ctx = lienzoFinal.getContext("2d");

      if (!ctx) {
        reject(new Error("No se pudo crear la imagen final."));
        return;
      }

      ctx.drawImage(fotoCanvas, 0, 0);
      ctx.drawImage(dibujoCanvas, 0, 0);

      lienzoFinal.toBlob((blob) => {
        if (!blob) {
          reject(new Error("No se pudo generar la imagen."));
          return;
        }

        const archivo = new File([blob], `mascota-${Date.now()}.png`, {
          type: "image/png",
        });

        resolve(archivo);
      }, "image/png");
    });
  }

  async function guardarRetrato() {
    if (!hayContenido) {
      alert("Sube una foto o dibuja algo antes de guardar el retrato.");
      return;
    }

    try {
      setGuardando(true);

      const archivo = await convertirLienzoEnArchivo();

      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("mensaje", mensaje);
      formData.append("foto", archivo);

      const response = await fetch("/api/retratos", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "No se pudo guardar el retrato.");
        return;
      }

      setNombre("");
      setMensaje("");
      borrarTodo();

      await cargarRetratos();

      alert("🐾 El retrato de tu mascota ha quedado guardado.");
    } catch (error) {
      console.error(error);
      alert("Ha ocurrido un error.");
    } finally {
      setGuardando(false);
    }
  }

  const colores = [
    "#2f241c",
    "#6b3f2a",
    "#8b3a2e",
    "#d86f45",
    "#b9854d",
    "#e3b75f",
    "#355c3a",
    "#5f8f4e",
    "#2f4f75",
    "#5d79b8",
    "#7b4f91",
    "#d58ac8",
    "#ffffff",
    "#111111",
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#ead7bd] px-5 py-8 text-[#2f241c]">
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center opacity-35"
        style={{
          backgroundImage: "url('/cartas.jpg')",
        }}
      />

      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(circle_at_top,rgba(255,250,238,0.86),transparent_42%),linear-gradient(180deg,rgba(239,227,210,0.92),rgba(178,126,72,0.58))]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <nav className="mb-8 flex items-center justify-between rounded-full border border-[#d8bea0]/70 bg-[#fff8ed]/82 px-5 py-3 shadow-[0_16px_42px_rgba(80,55,30,0.13)] backdrop-blur-md">
          <Link href="/" className="font-serif text-lg">
            Poema Universal
          </Link>

          <div className="flex gap-5 text-sm text-[#6d5846]">
            <Link href="/" className="hover:text-black">
              Inicio
            </Link>

            <Link href="/cartas" className="hover:text-black">
              Cartas
            </Link>

            <Link href="/rinconcito" className="hover:text-black">
              El Rinconcito
            </Link>

            <Link href="/noches-en-paz" className="hover:text-black">
              Noches en Paz
            </Link>

            <Link href="/retratos" className="font-medium text-black">
              Mascotas
            </Link>
          </div>
        </nav>

        <header className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mx-auto mb-5 inline-flex rounded-full border border-[#cdb18f]/70 bg-[#fff8ed]/80 px-4 py-1.5 text-[11px] uppercase tracking-[0.34em] text-[#7b6047]">
            Archivo de amor animal
          </p>

          <h1 className="font-serif text-6xl leading-tight text-[#2f241c]">
            Retrato de mi amiga mascota
          </h1>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#6d5846]">
            Sube la foto de tu perro, tu gato o cualquier animal amado. Puedes
            pintarlo encima, dibujarle un retrato y dejarle un mensaje de amor.
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-[440px_1fr]">
          <aside className="rounded-[42px] border border-[#e5cdb2]/80 bg-[#fff8ed]/86 p-7 shadow-[0_28px_80px_rgba(80,55,30,0.16)] backdrop-blur-md">
            <h2 className="font-serif text-4xl">Herramientas</h2>

            <p className="mt-3 text-sm leading-7 text-[#6d5846]">
              Sube una foto, ajusta su transparencia y pinta encima con lápiz,
              rotulador, óleo o goma.
            </p>

            <label className="mt-7 block cursor-pointer rounded-[28px] border border-[#d6b895] bg-[#fffaf2]/80 p-5 text-center shadow-sm transition hover:bg-white">
              <span className="font-serif text-2xl text-[#2f241c]">
                {previewMascota ? "Cambiar foto" : "Subir foto de mi mascota"}
              </span>

              <p className="mt-2 text-sm text-[#6d5846]">
                Perro, gato, conejo, caballo, pájaro... cualquier compañero.
              </p>

              <input
                type="file"
                accept="image/*"
                onChange={subirFotoMascota}
                className="hidden"
              />
            </label>

            {previewMascota && (
              <div className="mt-5 overflow-hidden rounded-[24px] border border-[#d6b895] bg-[#ead6bd] shadow-md">
                <img
                  src={previewMascota}
                  alt="Foto de la mascota"
                  className="h-44 w-full object-cover"
                />
              </div>
            )}

            <div className="mt-7 rounded-[28px] border border-[#d6b895] bg-[#fffaf2]/80 p-5">
              <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-[#8a6f56]">
                Herramienta
              </p>

              <div className="grid grid-cols-4 gap-3">
                <button
                  onClick={() => setHerramienta("lapiz")}
                  className={`rounded-full px-3 py-3 text-sm transition ${
                    herramienta === "lapiz"
                      ? "bg-[#2f241c] text-[#fff1d4]"
                      : "bg-white/75 text-[#6d5846]"
                  }`}
                >
                  ✏️ Lápiz
                </button>

                <button
                  onClick={() => setHerramienta("rotulador")}
                  className={`rounded-full px-3 py-3 text-sm transition ${
                    herramienta === "rotulador"
                      ? "bg-[#2f241c] text-[#fff1d4]"
                      : "bg-white/75 text-[#6d5846]"
                  }`}
                >
                  🖍️ Rotu
                </button>

                <button
                  onClick={() => setHerramienta("oleo")}
                  className={`rounded-full px-3 py-3 text-sm transition ${
                    herramienta === "oleo"
                      ? "bg-[#2f241c] text-[#fff1d4]"
                      : "bg-white/75 text-[#6d5846]"
                  }`}
                >
                  🎨 Óleo
                </button>

                <button
                  onClick={() => setHerramienta("goma")}
                  className={`rounded-full px-3 py-3 text-sm transition ${
                    herramienta === "goma"
                      ? "bg-[#2f241c] text-[#fff1d4]"
                      : "bg-white/75 text-[#6d5846]"
                  }`}
                >
                  🧽 Goma
                </button>
              </div>

              <p className="mt-6 mb-3 text-[11px] uppercase tracking-[0.28em] text-[#8a6f56]">
                Colores
              </p>

              <div className="flex flex-wrap gap-3">
                {colores.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setColor(c);
                      if (herramienta === "goma") setHerramienta("lapiz");
                    }}
                    className={`h-9 w-9 rounded-full border-2 transition ${
                      color === c && herramienta !== "goma"
                        ? "scale-110 border-black"
                        : "border-white/80"
                    }`}
                    style={{ backgroundColor: c }}
                    aria-label={`Color ${c}`}
                  />
                ))}

                <label className="flex h-9 w-16 cursor-pointer items-center justify-center rounded-full border-2 border-white/80 bg-white text-xs text-[#6d5846]">
                  Otro
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => {
                      setColor(e.target.value);
                      setHerramienta("lapiz");
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="mt-6">
                <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-[#8a6f56]">
                  Grosor del trazo
                </p>

                <input
                  type="range"
                  min="2"
                  max="28"
                  value={grosor}
                  onChange={(e) => setGrosor(Number(e.target.value))}
                  className="w-full"
                />

                <p className="mt-2 text-sm text-[#6d5846]">
                  Grosor actual: {grosor}
                </p>
              </div>

              <div className="mt-6">
                <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-[#8a6f56]">
                  Opacidad de la foto
                </p>

                <input
                  type="range"
                  min="0.12"
                  max="0.9"
                  step="0.02"
                  value={opacidadFoto}
                  onChange={(e) => setOpacidadFoto(Number(e.target.value))}
                  className="w-full"
                />

                <p className="mt-2 text-sm text-[#6d5846]">
                  Foto al {Math.round(opacidadFoto * 100)}%
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={deshacer}
                  disabled={!puedeDeshacer}
                  className="rounded-full border border-[#b99b79] bg-white/70 px-4 py-3 text-sm text-[#6d5846] transition hover:bg-white disabled:opacity-40"
                >
                  Deshacer
                </button>

                <button
                  onClick={rehacer}
                  disabled={!puedeRehacer}
                  className="rounded-full border border-[#b99b79] bg-white/70 px-4 py-3 text-sm text-[#6d5846] transition hover:bg-white disabled:opacity-40"
                >
                  Rehacer
                </button>

                <button
                  onClick={limpiarDibujo}
                  className="rounded-full border border-[#b99b79] bg-white/70 px-4 py-3 text-sm text-[#6d5846] transition hover:bg-white"
                >
                  Limpiar dibujo
                </button>

                <button
                  onClick={borrarTodo}
                  className="rounded-full border border-[#b99b79] bg-white/70 px-4 py-3 text-sm text-[#6d5846] transition hover:bg-white"
                >
                  Borrar todo
                </button>
              </div>
            </div>

            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre de tu mascota..."
              className="mt-7 w-full rounded-[22px] border border-[#d6b895] bg-[#fffaf2]/90 px-5 py-4 text-[#2f241c] outline-none placeholder:text-[#9c8064] focus:border-[#7b6047]"
            />

            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Mensaje de amor para tu mascota..."
              className="mt-4 h-40 w-full resize-none rounded-[22px] border border-[#d6b895] bg-[#fffaf2]/90 p-5 leading-7 text-[#2f241c] outline-none placeholder:text-[#9c8064] focus:border-[#7b6047]"
            />

            <button
              onClick={guardarRetrato}
              disabled={guardando}
              className="mt-6 w-full rounded-full bg-[#2f241c] px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#fff1d4] shadow-[0_16px_36px_rgba(47,36,28,0.28)] transition hover:-translate-y-0.5 hover:bg-[#4a382b] disabled:opacity-60"
            >
              {guardando ? "Guardando..." : "Guardar retrato"}
            </button>
          </aside>

          <section className="rounded-[42px] border border-[#e5cdb2]/80 bg-[#fff8ed]/78 p-7 shadow-[0_28px_80px_rgba(80,55,30,0.14)] backdrop-blur-md">
            <h2 className="font-serif text-4xl">Lienzo de tu mascota</h2>

            <p className="mt-3 text-sm leading-7 text-[#6d5846]">
              Dibuja encima de la foto o empieza desde cero. Puede ser un
              retrato, una huella, una oreja, una cola o simplemente una forma
              de decir: “te quiero”.
            </p>

            <div className="relative mt-7 overflow-hidden rounded-[34px] border-4 border-[#caa783] bg-[#fff8ea] shadow-[0_18px_50px_rgba(80,55,30,0.18)]">
              <canvas ref={fotoCanvasRef} className="block" />

              <canvas
                ref={dibujoCanvasRef}
                onPointerDown={empezarDibujo}
                onPointerMove={dibujar}
                onPointerUp={terminarDibujo}
                onPointerCancel={terminarDibujo}
                className="absolute left-0 top-0 block touch-none cursor-crosshair"
              />
            </div>
          </section>
        </section>

        <section className="mt-10 rounded-[42px] border border-[#e5cdb2]/80 bg-[#fff8ed]/78 p-7 shadow-[0_28px_80px_rgba(80,55,30,0.14)] backdrop-blur-md">
          <h2 className="font-serif text-4xl">Mascotas guardadas</h2>

          <p className="mt-3 text-sm leading-7 text-[#6d5846]">
            Aquí quedan los retratos dibujados y los mensajes de amor para tus
            animales queridos.
          </p>

          <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {retratos.length === 0 ? (
              <p className="text-[#6d5846]">
                Todavía no hay retratos de mascotas.
              </p>
            ) : (
              retratos.map((retrato) => {
                const fecha = retrato.created_at || retrato.creado_en;

                return (
                  <article
                    key={retrato.id}
                    className="overflow-hidden rounded-[30px] border border-[#ddc3a4] bg-[#fffaf2]/88 shadow-[0_18px_45px_rgba(80,55,30,0.12)]"
                  >
                    <div className="aspect-[4/5] overflow-hidden bg-[#ead6bd]">
                      <img
                        src={retrato.foto}
                        alt={retrato.nombre || "Retrato de mascota"}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="p-5">
                      {retrato.nombre && (
                        <h3 className="font-serif text-2xl text-[#2f241c]">
                          {retrato.nombre}
                        </h3>
                      )}

                      {retrato.mensaje && (
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#6d5846]">
                          {retrato.mensaje}
                        </p>
                      )}

                      {fecha && (
                        <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-[#9a7a5c]">
                          {new Date(fecha).toLocaleDateString("es-ES")}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>
      </div>
    </main>
  );
}