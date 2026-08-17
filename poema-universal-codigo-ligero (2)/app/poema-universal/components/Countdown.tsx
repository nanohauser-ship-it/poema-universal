"use client";

type Props = {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
};

function Item({
  valor,
  titulo,
}: {
  valor: number;
  titulo: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-44 w-44 items-center justify-center rounded-[36px] border border-stone-200 bg-gradient-to-b from-white to-[#f5eee5] shadow-[0_25px_70px_rgba(0,0,0,.08)]">
        <span className="font-serif text-7xl text-stone-900">
          {String(valor).padStart(2, "0")}
        </span>
      </div>

      <p className="mt-6 text-xs uppercase tracking-[0.45em] text-stone-500">
        {titulo}
      </p>
    </div>
  );
}

export default function Countdown({
  dias,
  horas,
  minutos,
  segundos,
}: Props) {
  return (
    <section className="mt-28">

      <div className="mx-auto max-w-6xl rounded-[56px] border border-stone-200 bg-gradient-to-b from-[#fffdfa] to-[#f4ece1] px-12 py-20 shadow-[0_35px_100px_rgba(0,0,0,.08)]">

        <p className="text-center text-xs uppercase tracking-[0.55em] text-[#ab8d58]">
          Cuenta atrás
        </p>

        <h2 className="mt-8 text-center font-serif text-6xl md:text-7xl">
          1 de enero de 2027
        </h2>

        <p className="mx-auto mt-8 max-w-3xl text-center text-lg leading-9 text-stone-600">
          El Poema Universal 2026 permanecerá oculto durante todo un año.
          <br />
          La obra completa será revelada el primer día de 2027.
        </p>

        <div className="mt-20 grid grid-cols-2 gap-10 lg:grid-cols-4">

          <Item valor={dias} titulo="Días" />

          <Item valor={horas} titulo="Horas" />

          <Item valor={minutos} titulo="Minutos" />

          <Item valor={segundos} titulo="Segundos" />

        </div>

      </div>

    </section>
  );
}