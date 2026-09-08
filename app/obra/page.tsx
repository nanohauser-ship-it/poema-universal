import Image from "next/image";
import Link from "next/link";
import CompactThreeWorldsBoard from "../tablero-de-los-tres-mundos/components/CompactThreeWorldsBoard";

const worlds = [
  {
    number: "I",
    concept: "Memoria",
    title: "No dejes que desaparezcamos",
    image: "/museo/desaparezcamos/maria-bajo-el-arbol-blanco.JPG",
    imageClass:
      "object-cover brightness-[1.06] saturate-[0.86] transition duration-[1600ms] group-hover:scale-[1.025]",
    overlay:
      "linear-gradient(to top, rgba(18,15,11,.78), rgba(18,15,11,.08) 62%, rgba(255,245,224,.06))",
    tone: "text-[#faf5ea]",
  },
  {
    number: "II",
    concept: "Hambre",
    title: "La Jerarquía del Hambre",
    image: "/museo/jerarquia/la-mesa-y-las-tres-cruces.JPG",
    imageClass:
      "object-cover brightness-[1.48] contrast-[0.88] saturate-[0.72] sepia-[0.18] transition duration-[1600ms] group-hover:scale-[1.025]",
    overlay:
      "linear-gradient(to top, rgba(67,35,5,.66), rgba(183,115,34,.08) 58%, rgba(255,226,167,.18))",
    tone: "text-[#fff8e9]",
  },
  {
    number: "III",
    concept: "Laberinto",
    title: "Memorias de Bielka",
    image: "/museo/bielka/laberinto-bielka.webp",
    imageClass:
      "object-cover brightness-[1.42] contrast-[0.82] saturate-[0.55] transition duration-[1600ms] group-hover:scale-[1.025]",
    overlay:
      "linear-gradient(to top, rgba(13,28,35,.67), rgba(40,74,87,.06) 58%, rgba(210,232,237,.16))",
    tone: "text-[#f3f8f8]",
  },
];

const books = [
  {
    number: "I",
    concept: "Memoria",
    title: "No dejes que desaparezcamos",
    image: "/museo/coleccion/no-desaparezcamos/el-arbol-blanco.webp",
    bg: "bg-[#ddd0b9]",
  },
  {
    number: "II",
    concept: "Hambre",
    title: "La Jerarquía del Hambre",
    image: "/museo/jerarquia/la-mesa-y-las-tres-cruces.JPG",
    bg: "bg-[#b9782a]",
  },
  {
    number: "III",
    concept: "Laberinto",
    title: "Memorias de Bielka",
    image: "/museo/bielka/laberinto-bielka.webp",
    bg: "bg-[#71838a]",
  },
];

export default function ObraPage() {
  return (
    <main className="min-h-screen bg-[#f2ede4] text-[#171513]">
      <header className="border-b border-black/10 bg-[#f5f0e8]/95">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-5 sm:px-10 lg:px-14">
          <Link
            href="/"
            className="font-serif text-xl tracking-[-0.03em] text-black"
          >
            Poema Universal
          </Link>

          <nav className="flex items-center gap-5 text-[8px] uppercase tracking-[0.25em] text-black/50 sm:gap-8">
            <Link href="/" className="transition hover:text-black">
              Inicio
            </Link>

            <Link href="/fundacion" className="transition hover:text-black">
              Fundación
            </Link>

            <Link href="/artistas" className="transition hover:text-black">
              Artistas
            </Link>

            <Link href="/duelo" className="transition hover:text-black">
              Duelo
            </Link>

            <Link
              href="/obra"
              className="border-b border-black pb-1 text-black"
            >
              Obra
            </Link>
          </nav>
        </div>
      </header>

      {/* APERTURA */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(circle at 13% 26%, rgba(188,149,87,.14), transparent 28%), radial-gradient(circle at 85% 34%, rgba(114,141,151,.12), transparent 27%)",
          }}
        />

        <div className="relative mx-auto max-w-[1260px] px-6 pb-20 pt-24 text-center sm:px-10 sm:pb-24 sm:pt-28">
          <p className="text-[8px] uppercase tracking-[0.6em] text-[#8b693d]">
            José Naveiro · Obra de autor
          </p>

          <h1 className="mx-auto mt-8 max-w-5xl font-serif text-5xl leading-[0.98] tracking-[-0.055em] sm:text-7xl lg:text-[92px]">
            Tres mundos construidos
            <br />
            alrededor de una misma{" "}
            <em className="font-normal">ausencia.</em>
          </h1>

          <p className="mt-8 text-[9px] uppercase tracking-[0.36em] text-black/45">
            Memoria · Hambre · Laberinto
          </p>

          <p className="mx-auto mt-8 max-w-2xl font-serif text-lg leading-8 text-black/58">
            Tres novelas independientes que dialogan entre sí a través de la
            memoria, la pérdida, la violencia, la supervivencia y la
            reconstrucción. Cada historia es un mundo. Juntas forman un mapa.
          </p>

          <Link
            href="/tienda"
            className="mt-10 inline-flex border-b border-[#8b693d]/55 pb-2 text-[8px] uppercase tracking-[0.36em] text-[#79582f] transition hover:border-[#79582f] hover:text-black"
          >
            Comprar obra →
          </Link>
        </div>
      </section>

      {/* LOS TRES MUNDOS */}
      <section className="grid lg:grid-cols-3">
        {worlds.map((world) => (
          <article
            key={world.number}
            className="group relative min-h-[570px] overflow-hidden lg:min-h-[660px]"
          >
            <Image
              src={world.image}
              alt={world.title}
              fill
              priority
              className={world.imageClass}
              sizes="(max-width: 1024px) 100vw, 33vw"
            />

            <div
              className="absolute inset-0"
              style={{
                background: world.overlay,
              }}
            />

            <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10 lg:p-12">
              <p
                className={`text-5xl font-light leading-none ${world.tone}`}
              >
                {world.number}
              </p>

              <p
                className={`mt-5 text-[8px] uppercase tracking-[0.48em] ${world.tone} opacity-75`}
              >
                {world.concept}
              </p>

              <h2
                className={`mt-4 max-w-sm font-serif text-3xl italic leading-[1.04] tracking-[-0.03em] sm:text-4xl ${world.tone}`}
              >
                {world.title}
              </h2>
            </div>
          </article>
        ))}
      </section>

      {/* TABLERO */}
      <section className="border-b border-black/10 bg-[#f4efe7]">
        <div className="mx-auto grid max-w-[1460px] gap-16 px-6 py-24 sm:px-10 lg:grid-cols-[0.32fr_0.68fr] lg:px-14 lg:py-32">
          <div className="self-center">
            <p className="text-[8px] uppercase tracking-[0.48em] text-[#8b693d]">
              El tablero de los tres mundos
            </p>

            <h2 className="mt-8 max-w-sm font-serif text-5xl leading-[0.98] tracking-[-0.045em] sm:text-6xl">
              No es una partida.
              <br />
              <em>Es un mapa.</em>
            </h2>

            <div className="mt-10 h-px w-14 bg-[#a27740]" />

            <p className="mt-9 max-w-sm font-serif text-lg leading-8 text-black/62">
              Cada tablero representa un mundo. Cada pieza encarna una fuerza,
              un personaje, un recuerdo o una estructura que atraviesa las
              tres novelas bajo formas diferentes.
            </p>

            <p className="mt-8 max-w-sm text-[8px] uppercase leading-6 tracking-[0.26em] text-black/38">
              Piedra · madera · ceniza
              <br />
              Memoria · hambre · laberinto
            </p>
          </div>

          <div className="self-center">
            <div className="overflow-hidden border border-black/10 bg-[#07090c] shadow-[0_45px_100px_rgba(52,38,20,0.15)]">
              <CompactThreeWorldsBoard />
            </div>
          </div>
        </div>
      </section>

      {/* MEMORIA */}
      <section className="grid min-h-[720px] lg:grid-cols-2">
        <div className="relative min-h-[520px] lg:min-h-full">
          <Image
            src="/museo/coleccion/no-desaparezcamos/el-arbol-blanco.webp"
            alt="El Árbol Blanco"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div className="flex items-center bg-[#f4efe7] px-8 py-20 sm:px-14 lg:px-20">
          <div className="max-w-xl">
            <p className="text-[8px] uppercase tracking-[0.5em] text-[#947043]">
              I · Memoria
            </p>

            <h2 className="mt-7 font-serif text-5xl leading-[0.96] tracking-[-0.05em] sm:text-7xl">
              No dejes que
              <br />
              desaparezcamos
            </h2>

            <p className="mt-10 max-w-lg font-serif text-xl leading-9 text-black/62">
              Una casa todavía reconocible. Una amistad. Un árbol bajo el que
              la memoria aprende a resistir.
            </p>

            <blockquote className="mt-12 border-l border-[#a77c45] pl-6 font-serif text-2xl italic leading-9 text-black/76">
              El tronco conserva la memoria.
            </blockquote>

            <p className="mt-12 text-[8px] uppercase tracking-[0.32em] text-black/35">
              Árbol · infancia · promesa · ausencia
            </p>
          </div>
        </div>
      </section>

      {/* HAMBRE */}
      <section className="grid min-h-[720px] bg-[#d59b45] lg:grid-cols-2">
        <div className="order-2 flex items-center bg-[#d59b45] px-8 py-20 text-[#251507] sm:px-14 lg:order-1 lg:px-20">
          <div className="max-w-xl">
            <p className="text-[8px] uppercase tracking-[0.5em] text-[#5e360e]/75">
              II · Hambre
            </p>

            <h2 className="mt-7 font-serif text-5xl leading-[0.96] tracking-[-0.05em] sm:text-7xl">
              La Jerarquía
              <br />
              del Hambre
            </h2>

            <p className="mt-10 max-w-lg font-serif text-xl leading-9 text-[#321c0b]/72">
              Comer, amar y recordar dejan de ser actos privados. El hambre
              organiza los cuerpos, establece rangos y decide quién puede
              continuar.
            </p>

            <blockquote className="mt-12 border-l border-[#5d3510]/45 pl-6 font-serif text-2xl italic leading-9">
              Las raíces atraviesan el hambre.
            </blockquote>

            <p className="mt-12 text-[8px] uppercase tracking-[0.32em] text-[#4a290c]/55">
              Mesa · sistema · jerarquía · supervivencia
            </p>
          </div>
        </div>

        <div className="relative order-1 min-h-[520px] lg:order-2 lg:min-h-full">
          <Image
            src="/museo/jerarquia/la-mesa-y-las-tres-cruces.JPG"
            alt="La mesa y las tres cruces"
            fill
            className="object-cover brightness-[1.28] saturate-[0.82]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-[#d49a45]/10 mix-blend-screen" />
        </div>
      </section>

      {/* LABERINTO */}
      <section className="grid min-h-[720px] bg-[#dbe6e8] lg:grid-cols-2">
        <div className="relative min-h-[520px] lg:min-h-full">
          <Image
            src="/museo/bielka/laberinto.JPG"
            alt="El laberinto de Bielka"
            fill
            className="object-cover brightness-[1.35] contrast-[0.88] saturate-[0.62]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-[#bed4da]/10 mix-blend-screen" />
        </div>

        <div className="flex items-center bg-[#dbe6e8] px-8 py-20 text-[#17252a] sm:px-14 lg:px-20">
          <div className="max-w-xl">
            <p className="text-[8px] uppercase tracking-[0.5em] text-[#54747d]">
              III · Laberinto
            </p>

            <h2 className="mt-7 font-serif text-5xl leading-[0.96] tracking-[-0.05em] sm:text-7xl">
              Memorias
              <br />
              de Bielka
            </h2>

            <p className="mt-10 max-w-lg font-serif text-xl leading-9 text-[#17252a]/68">
              Una niña despierta en un carro de paja. Una ciudad conserva los
              nombres perdidos alrededor de un laberinto que todos deberán
              aceptar atravesar.
            </p>

            <blockquote className="mt-12 border-l border-[#5b7c85]/55 pl-6 font-serif text-2xl italic leading-9">
              Las ramas entran en el laberinto.
            </blockquote>

            <p className="mt-12 text-[8px] uppercase tracking-[0.32em] text-[#27434b]/48">
              Ciudad · nombre · pérdida · reconstrucción
            </p>
          </div>
        </div>
      </section>

      {/* CONVERGENCIA */}
      <section className="overflow-hidden bg-[#f4efe7] px-6 py-28 sm:px-10 lg:py-36">
        <div className="mx-auto max-w-[1280px]">
          <p className="text-[8px] uppercase tracking-[0.5em] text-[#8b693d]">
            Tres novelas · una misma pregunta
          </p>

          <div className="mt-10 grid gap-20 lg:grid-cols-[0.48fr_0.52fr] lg:items-end">
            <div>
              <h2 className="max-w-2xl font-serif text-5xl italic leading-[1.02] tracking-[-0.045em] sm:text-7xl">
                ¿Qué hacemos con aquello que no queremos que desaparezca?
              </h2>

              <div className="mt-14 grid grid-cols-3 border-y border-black/12">
                <div className="py-7 text-center">
                  <p className="font-serif text-2xl">Árbol</p>
                  <p className="mt-2 text-[6px] uppercase tracking-[0.35em] text-black/38">
                    Memoria
                  </p>
                </div>

                <div className="border-x border-black/12 py-7 text-center">
                  <p className="font-serif text-2xl">Mesa</p>
                  <p className="mt-2 text-[6px] uppercase tracking-[0.35em] text-black/38">
                    Supervivencia
                  </p>
                </div>

                <div className="py-7 text-center">
                  <p className="font-serif text-2xl">Laberinto</p>
                  <p className="mt-2 text-[6px] uppercase tracking-[0.35em] text-black/38">
                    Reconstrucción
                  </p>
                </div>
              </div>

              <p className="mt-10 max-w-xl font-serif text-lg leading-8 text-black/55">
                Tres territorios independientes. Tres maneras de nombrar una
                pérdida. Una arquitectura común que reaparece bajo formas
                distintas.
              </p>

              <Link
                href="/tienda"
                className="mt-9 inline-flex border border-black/20 px-6 py-4 text-[8px] uppercase tracking-[0.34em] text-black/65 transition hover:border-black hover:bg-black hover:text-[#f4efe7]"
              >
                Comprar obra →
              </Link>
            </div>

            {/* LOS LIBROS COMO OBJETOS */}
            <div className="grid grid-cols-3 items-end gap-5 sm:gap-9">
              {books.map((book, index) => (
                <article
                  key={book.number}
                  className={`relative ${index === 1 ? "-translate-y-5" : ""}`}
                >
                  <div
                    className={`relative aspect-[0.64] overflow-hidden border border-black/15 ${book.bg} shadow-[12px_22px_40px_rgba(43,31,18,.16)]`}
                  >
                    <Image
                      src={book.image}
                      alt={book.title}
                      fill
                      className={`object-cover ${
                        book.number === "II"
                          ? "brightness-[1.32] saturate-[0.75]"
                          : book.number === "III"
                            ? "brightness-[1.24] saturate-[0.60]"
                            : "brightness-[1.08] saturate-[0.78]"
                      }`}
                      sizes="20vw"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-6">
                      <p className="text-[6px] uppercase tracking-[0.34em] text-white/60">
                        {book.number} · {book.concept}
                      </p>

                      <h3 className="mt-3 font-serif text-base italic leading-[1.08] sm:text-xl lg:text-[22px]">
                        {book.title}
                      </h3>
                    </div>
                  </div>

                  <div className="mx-auto h-3 w-[92%] border-x border-b border-black/10 bg-[#e2d9ca]" />
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/10 bg-[#f4efe7]">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-10 sm:px-10 lg:px-14">
          <p className="text-[7px] uppercase tracking-[0.4em] text-black/35">
            Memoria · Hambre · Laberinto
          </p>

          <p className="text-[7px] uppercase tracking-[0.4em] text-black/35">
            Poema Universal · José Naveiro
          </p>
        </div>
      </footer>
    </main>
  );
}
