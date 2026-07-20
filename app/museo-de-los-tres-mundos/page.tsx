import Link from "next/link";

import MuseumVestibule from "./components/MuseumVestibule";
import MuseumRoomGallery from "./components/MuseumRoomGallery";
import { museumRooms } from "./data/rooms";

export default function MuseumPage() {
  return (
    <main className="min-h-screen bg-[#07080a] text-[#f0e8dc]">
      <header className="relative z-50 border-b border-white/10 bg-[#07080a]/92 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[72px] max-w-[1550px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="font-serif text-xl tracking-[-0.025em]"
          >
            Poema Universal
          </Link>

          <p className="hidden text-[8px] uppercase tracking-[0.33em] text-white/32 sm:block">
            Museo interior · tres mundos
          </p>

          <Link
            href="/"
            className="border border-white/15 px-5 py-2.5 text-[8px] uppercase tracking-[0.3em] text-white/55 transition hover:border-white/35 hover:text-white"
          >
            Volver a la casa
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-white/10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 70% 22%, rgba(185,220,226,0.09), transparent 29%), radial-gradient(circle at 22% 78%, rgba(139,61,48,0.12), transparent 34%)",
          }}
        />

        <div className="relative mx-auto max-w-[1550px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          <p className="text-[9px] uppercase tracking-[0.52em] text-[#c7a467]">
            Archivo visual del tríptico
          </p>

          <h1 className="mt-9 max-w-6xl font-serif text-6xl leading-[0.88] tracking-[-0.065em] sm:text-8xl lg:text-[126px]">
            Museo de los
            <span className="block italic text-white/34">
              Tres Mundos.
            </span>
          </h1>

          <p className="mt-12 max-w-3xl font-serif text-2xl leading-[1.42] text-white/66 sm:text-3xl">
            Hay imágenes que no ilustran una historia.
            La recuerdan antes de que haya sucedido.
          </p>

          <p className="mt-6 max-w-2xl text-sm leading-8 text-white/40">
            Este museo conservará las escenas, reliquias,
            rostros y lugares nacidos alrededor de las tres
            novelas.
          </p>

          <div className="mt-11 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <Link
              href="/museo-de-los-tres-mundos/recorrido"
              className="inline-flex border border-[#c7a467]/45 px-7 py-4 text-[8px] uppercase tracking-[0.34em] text-[#c7a467] transition hover:border-[#c7a467] hover:bg-[#c7a467]/[0.06]"
            >
              Recorrido 3D
            </Link>

            <Link
              href="#vestibulo"
              className="inline-flex border-b border-white/20 pb-2 text-[8px] uppercase tracking-[0.34em] text-white/48 transition hover:border-white/50 hover:text-white"
            >
              Ver colección ↓
            </Link>
          </div>
        </div>
      </section>

      <div id="vestibulo">
        <MuseumVestibule />
      </div>

      {museumRooms.map((room) => (
        <section
          key={room.id}
          id={`sala-${room.id}`}
          className="scroll-mt-20 border-t border-white/10"
          style={{
            background: `radial-gradient(circle at 75% 30%, ${room.glow}12, transparent 30%), #090b0e`,
          }}
        >
          <div className="mx-auto grid min-h-[620px] max-w-[1550px] items-center gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[0.55fr_1.45fr] lg:px-12">
            <div>
              <p
                className="text-[8px] uppercase tracking-[0.42em]"
                style={{ color: room.accent }}
              >
                Sala {room.number}
              </p>

              <h2 className="mt-7 font-serif text-5xl leading-[0.95] tracking-[-0.055em] sm:text-7xl">
                {room.title}
              </h2>

              <p className="mt-7 text-[8px] uppercase tracking-[0.27em] text-white/32">
                {room.subtitle}
              </p>

              <p className="mt-10 max-w-lg font-serif text-2xl italic leading-9 text-white/52">
                {room.sentence}
              </p>
            </div>

            <MuseumRoomGallery room={room} />
          </div>
        </section>
      ))}

      <section className="border-t border-white/10 bg-[#07080a]">
        <div className="mx-auto grid max-w-[1550px] gap-10 px-5 py-24 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:px-12">
          <p className="text-[8px] uppercase tracking-[0.42em] text-[#c7a467]">
            La Cámara Clara
          </p>

          <div>
            <p className="max-w-4xl font-serif text-4xl leading-[1.2] tracking-[-0.04em] text-white/68 sm:text-6xl">
              Una imagen ocupará toda la habitación.
            </p>

            <p className="mt-7 max-w-2xl text-sm leading-8 text-white/38">
              El resto del museo desaparecerá para que cada
              obra tenga tiempo, silencio y una distancia
              propia de contemplación.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1550px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-serif text-lg">
            Museo de los Tres Mundos
          </p>

          <p className="text-[7px] uppercase tracking-[0.32em] text-white/26">
            Vestíbulo fundacional · fase I
          </p>
        </div>
      </footer>
    </main>
  );
}
