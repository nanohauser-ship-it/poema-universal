"use client";

import {
  useRef,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

type SubmissionStatus =
  | "idle"
  | "sending"
  | "success"
  | "error";

type ApiResponse = {
  ok?: boolean;
  message?: string;
};

export default function BabelSubmissionForm() {
  const [status, setStatus] =
    useState<SubmissionStatus>("idle");

  const [feedback, setFeedback] =
    useState("");

  const startedAt = useRef(Date.now());

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(
        formData.get("name") ?? ""
      ).trim(),

      email: String(
        formData.get("email") ?? ""
      ).trim(),

      country: String(
        formData.get("country") ?? ""
      ).trim(),

      language: String(
        formData.get("language") ?? ""
      ).trim(),

      title: String(
        formData.get("title") ?? ""
      ).trim(),

      poem: String(
        formData.get("poem") ?? ""
      ).trim(),

      translation: String(
        formData.get("translation") ?? ""
      ).trim(),

      authorship:
        formData.get("authorship") === "on",

      website: String(
        formData.get("website") ?? ""
      ).trim(),

      startedAt: startedAt.current,
    };

    setStatus("sending");
    setFeedback("");

    try {
      const response = await fetch(
        "/api/poema-universal/babel",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result =
        (await response
          .json()
          .catch(() => null)) as
          | ApiResponse
          | null;

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "No se pudo enviar el poema."
        );
      }

      form.reset();
      startedAt.current = Date.now();

      setStatus("success");
      setFeedback(
        result?.message ||
          "Tu voz ha llegado a la Torre de Babel."
      );
    } catch (error) {
      setStatus("error");

      setFeedback(
        error instanceof Error
          ? error.message
          : "No se pudo completar el envío."
      );
    }
  }

  const isSending =
    status === "sending";

  return (
    <form
      onSubmit={handleSubmit}
      className="relative mt-16 border border-[#6e4c2c]/18 bg-white/38 p-7 shadow-[0_35px_90px_rgba(83,53,27,0.1)] backdrop-blur-xl sm:p-10 lg:p-14"
    >
      <div
        className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
        aria-hidden="true"
      >
        <label>
          No completar
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <label className="block">
          <span className="text-[8px] uppercase tracking-[0.32em] text-[#5c4026]/58">
            Nombre o seudónimo
          </span>

          <input
            type="text"
            name="name"
            maxLength={120}
            autoComplete="name"
            placeholder="También puedes participar de forma anónima"
            className="mt-3 w-full border-b border-[#5d4027]/22 bg-transparent py-3 text-base outline-none transition placeholder:text-[#5d4027]/24 focus:border-[#5d4027]/60"
          />
        </label>

        <label className="block">
          <span className="text-[8px] uppercase tracking-[0.32em] text-[#5c4026]/58">
            Correo electrónico
          </span>

          <input
            type="email"
            name="email"
            required
            maxLength={254}
            autoComplete="email"
            className="mt-3 w-full border-b border-[#5d4027]/22 bg-transparent py-3 text-base outline-none transition focus:border-[#5d4027]/60"
          />
        </label>

        <label className="block">
          <span className="text-[8px] uppercase tracking-[0.32em] text-[#5c4026]/58">
            País o territorio
          </span>

          <input
            type="text"
            name="country"
            required
            maxLength={100}
            autoComplete="country-name"
            className="mt-3 w-full border-b border-[#5d4027]/22 bg-transparent py-3 text-base outline-none transition focus:border-[#5d4027]/60"
          />
        </label>

        <label className="block">
          <span className="text-[8px] uppercase tracking-[0.32em] text-[#5c4026]/58">
            Idioma del poema
          </span>

          <input
            type="text"
            name="language"
            required
            maxLength={100}
            className="mt-3 w-full border-b border-[#5d4027]/22 bg-transparent py-3 text-base outline-none transition focus:border-[#5d4027]/60"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="text-[8px] uppercase tracking-[0.32em] text-[#5c4026]/58">
            Título
          </span>

          <input
            type="text"
            name="title"
            maxLength={200}
            placeholder="Puede quedar vacío si el poema no tiene título"
            className="mt-3 w-full border-b border-[#5d4027]/22 bg-transparent py-3 text-base outline-none transition placeholder:text-[#5d4027]/24 focus:border-[#5d4027]/60"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="text-[8px] uppercase tracking-[0.32em] text-[#5c4026]/58">
            Poema original
          </span>

          <textarea
            name="poem"
            required
            rows={14}
            maxLength={30000}
            className="mt-4 w-full resize-y border border-[#5d4027]/16 bg-[#f9f1e5]/60 p-5 font-serif text-lg leading-8 outline-none transition focus:border-[#5d4027]/45"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="text-[8px] uppercase tracking-[0.32em] text-[#5c4026]/58">
            Traducción opcional
          </span>

          <textarea
            name="translation"
            rows={8}
            maxLength={30000}
            className="mt-4 w-full resize-y border border-[#5d4027]/16 bg-[#f9f1e5]/60 p-5 font-serif text-lg leading-8 outline-none transition focus:border-[#5d4027]/45"
          />
        </label>
      </div>

      <label className="mt-8 flex cursor-pointer items-start gap-4 border-t border-[#5d4027]/12 pt-7">
        <input
          type="checkbox"
          name="authorship"
          required
          className="mt-1 h-4 w-4 accent-[#6f4b28]"
        />

        <span className="max-w-2xl text-xs leading-6 text-[#4a321f]/56">
          Declaro que el poema es original
          y que tengo derecho a presentarlo
          a la convocatoria de Poema Universal.
        </span>
      </label>

      <div className="mt-10 flex flex-col items-start justify-between gap-7 border-t border-[#5d4027]/14 pt-8 sm:flex-row sm:items-center">
        <div className="max-w-xl">
          <p className="text-xs leading-6 text-[#4a321f]/48">
            La obra será recibida por el
            equipo de la edición fundacional.
            El envío no implica su selección
            automática entre las sesenta voces.
          </p>

          <div
            aria-live="polite"
            className={`mt-4 min-h-6 text-sm leading-6 ${
              status === "success"
                ? "text-[#41633c]"
                : status === "error"
                  ? "text-[#8a342d]"
                  : "text-transparent"
            }`}
          >
            {feedback || "Estado del envío"}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSending}
          className="min-w-[210px] border border-[#684725]/34 bg-[#684725]/[0.04] px-7 py-4 text-[8px] uppercase tracking-[0.34em] text-[#684725] transition hover:border-[#684725]/65 hover:bg-[#684725]/[0.09] disabled:cursor-wait disabled:opacity-45"
        >
          {isSending
            ? "Enviando la voz…"
            : status === "success"
              ? "Voz recibida"
              : "Enviar poema"}
        </button>
      </div>
    </form>
  );
}
