"use client";

import Link from "next/link";

type TypewriterComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onGenerate?: () => void;
  onSave?: () => void;
  onClear?: () => void;
  loading?: boolean;
};

export default function TypewriterComposer({
  value,
  onChange,
  onGenerate,
  onSave,
  onClear,
  loading = false,
}: TypewriterComposerProps) {
  return (
    <section className="relative mx-auto mt-10 w-full max-w-4xl px-4">
      <div className="absolute -inset-1 rounded-[2.2rem] bg-gradient-to-br from-amber-200/50 via-stone-200/40 to-stone-950/10 blur-2xl" />

      <div className="relative overflow-hidden rounded-[2.2rem] border border-stone-300/80 bg-[#e8dcc6]/95 shadow-[0_30px_80px_rgba(68,52,36,0.28)]">
        <div className="flex items-center justify-between border-b border-stone-400/40 bg-gradient-to-b from-[#d8c5a7] to-[#bda987] px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-stone-700/80 shadow-inner" />
            <span className="h-3 w-3 rounded-full bg-stone-600/70 shadow-inner" />
            <span className="h-3 w-3 rounded-full bg-stone-500/70 shadow-inner" />
          </div>

          <p className="font-serif text-xs uppercase tracking-[0.35em] text-stone-700">
            Poema Universal
          </p>

          <div className="h-3 w-14 rounded-full bg-stone-700/40 shadow-inner" />
        </div>

        <div className="mx-auto mt-6 h-6 w-[82%] rounded-full border border-stone-800/30 bg-gradient-to-b from-stone-800 to-stone-950 shadow-[0_10px_25px_rgba(0,0,0,0.35)]" />

        <div className="px-5 py-7 sm:px-8">
          <div className="relative mx-auto max-w-3xl">
            <div className="absolute -top-4 left-1/2 z-10 h-8 w-44 -translate-x-1/2 rounded-b-xl border border-stone-400/40 bg-[#c7b18d] shadow-md" />

            <div className="relative rounded-[1.4rem] border border-stone-300 bg-[#fbf4df] p-3 shadow-[0_18px_40px_rgba(78,58,35,0.22)]">
              <div className="pointer-events-none absolute inset-x-8 top-0 h-8 rounded-b-full bg-white/30 blur-md" />

              <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Escribe aquí el primer verso..."
                className="paper-lines min-h-[230px] w-full resize-none rounded-[1rem] border border-stone-200/80 bg-[#fff8e8] px-5 py-6 font-serif text-[1.08rem] leading-8 text-stone-800 shadow-inner outline-none transition placeholder:text-stone-400 focus:border-amber-700/30 focus:ring-4 focus:ring-amber-900/10"
              />

              <div className="mt-3 flex items-center justify-between px-1 font-serif text-xs italic text-stone-500">
                <span>papel vivo</span>
                <span>{value.length} caracteres</span>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-3xl rounded-[1.8rem] border border-stone-500/25 bg-gradient-to-b from-[#80684f] to-[#49392c] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_20px_35px_rgba(51,35,24,0.35)]">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <button
                type="button"
                onClick={onGenerate}
                disabled={loading}
                className="type-key"
              >
                <span className="block text-[0.7rem] uppercase tracking-[0.25em] text-stone-500">
                  tecla I
                </span>
                <span>{loading ? "Escribiendo..." : "Crear poema"}</span>
              </button>

              <button
                type="button"
                onClick={onSave}
                disabled={loading || !value.trim()}
                className="type-key"
              >
                <span className="block text-[0.7rem] uppercase tracking-[0.25em] text-stone-500">
                  tecla II
                </span>
                <span>Guardar</span>
              </button>

              <button
                type="button"
                onClick={onClear}
                disabled={loading || !value.trim()}
                className="type-key"
              >
                <span className="block text-[0.7rem] uppercase tracking-[0.25em] text-stone-500">
                  tecla III
                </span>
                <span>Limpiar papel</span>
              </button>

              <Link href="/antologia" className="type-key text-center">
                <span className="block text-[0.7rem] uppercase tracking-[0.25em] text-stone-500">
                  archivo
                </span>
                <span>Antología</span>
              </Link>
            </div>

            <div className="mx-auto mt-5 h-9 w-2/3 rounded-full border border-stone-950/30 bg-gradient-to-b from-[#d9c7a9] to-[#9e8461] shadow-[inset_0_2px_1px_rgba(255,255,255,0.35),0_7px_0_rgba(54,38,26,0.75)]" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .paper-lines {
          background-image: linear-gradient(
            to bottom,
            transparent 31px,
            rgba(120, 91, 58, 0.16) 32px
          );
          background-size: 100% 32px;
        }

        .type-key {
          min-height: 76px;
          border-radius: 999px;
          border: 1px solid rgba(82, 61, 41, 0.28);
          background: radial-gradient(circle at 50% 18%, #fff9ec, #d8c4a4 72%);
          padding: 0.9rem 1rem;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 0.98rem;
          color: #3f3125;
          box-shadow:
            inset 0 2px 1px rgba(255, 255, 255, 0.65),
            inset 0 -4px 8px rgba(91, 66, 42, 0.22),
            0 7px 0 rgba(67, 45, 30, 0.85),
            0 13px 18px rgba(31, 22, 15, 0.28);
          transition:
            transform 180ms ease,
            box-shadow 180ms ease,
            filter 180ms ease;
        }

        .type-key:hover {
          transform: translateY(2px);
          filter: brightness(1.03);
          box-shadow:
            inset 0 2px 1px rgba(255, 255, 255, 0.7),
            inset 0 -4px 8px rgba(91, 66, 42, 0.2),
            0 5px 0 rgba(67, 45, 30, 0.85),
            0 10px 15px rgba(31, 22, 15, 0.25);
        }

        .type-key:active {
          transform: translateY(6px);
          box-shadow:
            inset 0 2px 1px rgba(255, 255, 255, 0.55),
            inset 0 -3px 7px rgba(91, 66, 42, 0.24),
            0 1px 0 rgba(67, 45, 30, 0.9),
            0 5px 10px rgba(31, 22, 15, 0.24);
        }

        .type-key:disabled {
          cursor: not-allowed;
          opacity: 0.55;
          filter: grayscale(0.25);
        }
      `}</style>
    </section>
  );
}