"use client";

type AccionesArtistaProps = {
  artistaId?: string;
};

export default function AccionesArtista({ artistaId }: AccionesArtistaProps) {
  return (
    <div className="mt-4 flex flex-wrap gap-3">
      <button
        type="button"
        className="rounded-full border border-stone-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-600 transition hover:bg-stone-100 hover:text-black"
      >
        Editar
      </button>

      <button
        type="button"
        className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-700 transition hover:bg-red-100"
      >
        Eliminar
      </button>

      {artistaId && (
        <span className="hidden text-xs text-stone-400">
          {artistaId}
        </span>
      )}
    </div>
  );
}
