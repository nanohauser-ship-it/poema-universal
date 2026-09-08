"use client";

import {
  FormEvent,
  useState,
} from "react";

import styles from
  "./PrivateLogin.module.css";

export default function
PrivateLogin() {
  const [
    password,
    setPassword,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  async function submit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!password) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response =
        await fetch(
          "/api/poema-universal/corazon-auth/login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                password,
              }),
          },
        );

      if (!response.ok) {
        setError(
          "La puerta permanece cerrada.",
        );

        setPassword("");
        return;
      }

      setPassword("");

      /*
       * Recarga completa:
       * garantiza que el servidor
       * recibe inmediatamente
       * la nueva cookie privada.
       */
      window.location.reload();

      return;
    } catch {
      setError(
        "No se pudo comprobar el acceso.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className={
        styles.page
      }
    >
      <div
        className={
          styles.glow
        }
      />

      <section
        className={
          styles.door
        }
      >
        <span
          className={
            styles.eyebrow
          }
        >
          POEMA UNIVERSAL
        </span>

        <div
          className={
            styles.symbol
          }
        >
          ◦
        </div>

        <h1>
          Sala del
          <br />
          Corazón Vivo
        </h1>

        <p>
          Esta estancia
          no es pública.
        </p>

        <form
          onSubmit={submit}
        >
          <input
            type="password"
            value={password}
            onChange={(
              event,
            ) =>
              setPassword(
                event.target
                  .value,
              )
            }
            placeholder="Clave de acceso"
            autoComplete="current-password"
            autoFocus
            aria-label="Clave de acceso"
          />

          <button
            type="submit"
            disabled={
              loading ||
              !password
            }
          >
            {loading
              ? "Abriendo…"
              : "Entrar"}
          </button>
        </form>

        {error && (
          <small>
            {error}
          </small>
        )}

        <footer>
          ESTANCIA PRIVADA
        </footer>
      </section>
    </main>
  );
}
