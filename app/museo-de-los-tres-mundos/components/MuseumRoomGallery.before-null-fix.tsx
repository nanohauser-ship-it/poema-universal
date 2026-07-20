"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import {
  getArtworksByRoom,
  type MuseumArtwork,
} from "../data/artworks";

import type { MuseumRoom } from "../data/rooms";

type MuseumRoomGalleryProps = {
  room: MuseumRoom;
};

function ArtworkVisual({
  artwork,
  priority = false,
}: {
  artwork: MuseumArtwork;
  priority?: boolean;
}) {
  if (artwork.imageUrl) {
    return (
      <Image
        src={artwork.imageUrl}
        alt={artwork.title}
        fill
        priority={priority}
        sizes="(max-width: 768px) 90vw, 55vw"
        className="object-cover"
      />
    );
  }

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        background: artwork.background,
      }}
    >
      <span
        aria-hidden="true"
        className="font-serif text-[120px] leading-none opacity-[0.16] sm:text-[180px]"
        style={{
          color: artwork.accent,
          textShadow: `0 0 60px ${artwork.accent}45`,
        }}
      >
        {artwork.symbol}
      </span>

      <div
        aria-hidden="true"
        className="absolute inset-[8%] border"
        style={{
          borderColor: `${artwork.accent}22`,
        }}
      />

      <div
        aria-hidden="true"
        className="absolute bottom-[12%] left-[12%] h-px w-[38%]"
        style={{
          backgroundColor: `${artwork.accent}55`,
        }}
      />
    </div>
  );
}

export default function MuseumRoomGallery({
  room,
}: MuseumRoomGalleryProps) {
  const artworks = getArtworksByRoom(room.id);

  const [selectedArtwork, setSelectedArtwork] =
    useState<MuseumArtwork | null>(null);

  useEffect(() => {
    if (!selectedArtwork) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedArtwork(null);
      }

      const currentIndex = artworks.findIndex(
        (artwork) =>
          artwork.id === selectedArtwork.id
      );

      if (event.key === "ArrowRight") {
        const next =
          artworks[
            (currentIndex + 1) %
              artworks.length
          ];

        setSelectedArtwork(next);
      }

      if (event.key === "ArrowLeft") {
        const previous =
          artworks[
            (currentIndex -
              1 +
              artworks.length) %
              artworks.length
          ];

        setSelectedArtwork(previous);
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [artworks, selectedArtwork]);

  function moveSelection(direction: -1 | 1) {
    if (!selectedArtwork) {
      return;
    }

    const currentIndex = artworks.findIndex(
      (artwork) =>
        artwork.id === selectedArtwork.id
    );

    const nextIndex =
      (currentIndex +
        direction +
        artworks.length) %
      artworks.length;

    setSelectedArtwork(artworks[nextIndex]);
  }

  return (
    <>
      <div className="relative">
        <div className="mb-8 flex items-end justify-between gap-8 border-b border-white/10 pb-5">
          <div>
            <p className="text-[7px] uppercase tracking-[0.34em] text-white/28">
              Colección permanente
            </p>

            <p className="mt-3 font-serif text-2xl text-white/66">
              {artworks.length} obras en esta sala
            </p>
          </div>

          <p className="hidden text-[7px] uppercase tracking-[0.28em] text-white/24 sm:block">
            Pulsa una obra para contemplarla
          </p>
        </div>

        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {artworks.map((artwork, index) => {
            const aspectClass =
              artwork.aspect === "portrait"
                ? "aspect-[4/5]"
                : artwork.aspect === "square"
                  ? "aspect-square"
                  : "aspect-[4/3]";

            return (
              <button
                key={artwork.id}
                type="button"
                onClick={() =>
                  setSelectedArtwork(artwork)
                }
                className="group text-left"
              >
                <article>
                  <div
                    className={`relative overflow-hidden border border-white/10 bg-black/30 ${aspectClass}`}
                    style={{
                      boxShadow: `0 28px 70px rgba(0,0,0,0.34), 0 0 46px ${artwork.accent}0c`,
                    }}
                  >
                    <ArtworkVisual
                      artwork={artwork}
                      priority={index === 0}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-60 transition duration-700 group-hover:opacity-30" />

                    <div
                      className="absolute inset-0 border opacity-0 transition duration-700 group-hover:inset-3 group-hover:opacity-100"
                      style={{
                        borderColor: `${artwork.accent}50`,
                      }}
                    />

                    <p
                      className="absolute left-5 top-5 text-[7px] uppercase tracking-[0.3em]"
                      style={{
                        color: artwork.accent,
                      }}
                    >
                      Obra {artwork.number}
                    </p>

                    <p className="absolute bottom-5 right-5 text-[7px] uppercase tracking-[0.25em] text-white/32 opacity-0 transition duration-500 group-hover:opacity-100">
                      Contemplar ↗
                    </p>
                  </div>

                  <div className="border-b border-white/10 px-1 py-5">
                    <h3 className="font-serif text-2xl leading-tight tracking-[-0.025em] text-white/74 transition group-hover:text-white">
                      {artwork.title}
                    </h3>

                    <p className="mt-3 text-[7px] uppercase tracking-[0.25em] text-white/28">
                      {artwork.subtitle}
                    </p>
                  </div>
                </article>
              </button>
            );
          })}
        </div>
      </div>

      {selectedArtwork && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedArtwork.title}
          className="fixed inset-0 z-[100] bg-[#050608]/95 backdrop-blur-xl"
        >
          <div className="flex min-h-screen flex-col">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-8 lg:px-12">
              <div>
                <p
                  className="text-[7px] uppercase tracking-[0.34em]"
                  style={{
                    color:
                      selectedArtwork.accent,
                  }}
                >
                  Obra {selectedArtwork.number}
                </p>

                <p className="mt-2 font-serif text-xl text-white/72">
                  {selectedArtwork.title}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedArtwork(null)
                }
                className="border border-white/15 px-5 py-3 text-[7px] uppercase tracking-[0.3em] text-white/50 transition hover:border-white/35 hover:text-white"
              >
                Cerrar
              </button>
            </div>

            <div className="grid flex-1 lg:grid-cols-[1.35fr_0.65fr]">
              <div className="relative flex min-h-[58vh] items-center justify-center overflow-hidden border-b border-white/10 p-5 sm:p-10 lg:min-h-0 lg:border-b-0 lg:border-r">
                <div
                  className={`relative max-h-[76vh] w-full max-w-5xl overflow-hidden border border-white/12 ${
                    selectedArtwork.aspect ===
                    "portrait"
                      ? "aspect-[4/5] max-w-2xl"
                      : selectedArtwork.aspect ===
                          "square"
                        ? "aspect-square max-w-3xl"
                        : "aspect-[4/3]"
                  }`}
                  style={{
                    boxShadow: `0 40px 120px rgba(0,0,0,0.65), 0 0 90px ${selectedArtwork.accent}18`,
                  }}
                >
                  <ArtworkVisual
                    artwork={selectedArtwork}
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    moveSelection(-1)
                  }
                  aria-label="Obra anterior"
                  className="absolute bottom-5 left-5 border border-white/12 bg-black/30 px-5 py-3 text-sm text-white/48 backdrop-blur transition hover:text-white sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2"
                >
                  ←
                </button>

                <button
                  type="button"
                  onClick={() =>
                    moveSelection(1)
                  }
                  aria-label="Obra siguiente"
                  className="absolute bottom-5 right-5 border border-white/12 bg-black/30 px-5 py-3 text-sm text-white/48 backdrop-blur transition hover:text-white sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2"
                >
                  →
                </button>
              </div>

              <aside className="flex items-center px-6 py-12 sm:px-10 lg:px-14">
                <div className="max-w-xl">
                  <p
                    className="text-[8px] uppercase tracking-[0.4em]"
                    style={{
                      color:
                        selectedArtwork.accent,
                    }}
                  >
                    {selectedArtwork.chapter}
                  </p>

                  <h2 className="mt-7 font-serif text-5xl leading-[0.95] tracking-[-0.05em] text-white sm:text-6xl">
                    {selectedArtwork.title}
                  </h2>

                  <p className="mt-6 text-[8px] uppercase tracking-[0.27em] text-white/30">
                    {selectedArtwork.subtitle}
                  </p>

                  <blockquote className="mt-10 border-l border-white/12 pl-6 font-serif text-2xl italic leading-10 text-white/58">
                    {
                      selectedArtwork.curatorialText
                    }
                  </blockquote>

                  <p className="mt-12 text-[7px] uppercase tracking-[0.25em] text-white/22">
                    Usa ← → para recorrer la colección
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
