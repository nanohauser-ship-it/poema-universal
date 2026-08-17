"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { avatarVoiceSignal } from "../lib/avatarVoiceSignal";

import type {
  AvatarBodyHandle,
  AvatarLifeState,
  AvatarMediaConfig,
  AvatarPresenceState,
} from "../types";

import styles from "../gran-avatar.module.css";

type SynchronizedAvatarBodyProps = {
  media: AvatarMediaConfig;
  state: AvatarPresenceState;
  onLifeStateChange?: (state: AvatarLifeState) => void;
};

type CameraShot =
  | "bust"
  | "portrait"
  | "intimate"
  | "left"
  | "right";

/*
 * ============================================================
 * GRAN AVATAR · V5.4
 * CUERPO CONTINUO + ILUMINACIÓN FACIAL
 * ============================================================
 */

const MASTER_VIDEO =
  "/poema-universal/gran-avatar/v5/avatar-master-continuous.mp4";

/*
 * Los cambios de plano son deliberadamente lentos.
 * No queremos sensación de montaje.
 */

const READING_SHOTS: CameraShot[] = [
  "bust",
  "portrait",
  "right",
  "portrait",
  "intimate",
  "left",
];

const SPEAKING_SHOTS: CameraShot[] = [
  "portrait",
  "right",
  "portrait",
  "left",
  "intimate",
];

/*
 * ============================================================
 * ESTADOS
 * ============================================================
 */

function isSpeakingState(
  state: AvatarPresenceState,
) {
  return (
    state === "reading" ||
    state === "speaking"
  );
}

function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.max(
    min,
    Math.min(max, value),
  );
}

/*
 * Velocidad corporal.
 *
 * Nunca detenemos completamente al avatar.
 * Incluso en silencio permanece respirando.
 */

function baseRateForState(
  state: AvatarPresenceState,
) {
  switch (state) {
    case "reading":
      return 0.91;

    case "speaking":
      return 0.94;

    case "listening":
      return 0.79;

    case "thinking":
      return 0.67;

    case "paused":
      return 0.58;

    case "receiving":
      return 0.73;

    case "error":
      return 0.54;

    default:
      return 0.76;
  }
}

/*
 * Plano dominante cuando no habla.
 */

function staticShotForState(
  state: AvatarPresenceState,
): CameraShot {
  switch (state) {
    case "listening":
      return "left";

    case "thinking":
      return "right";

    case "paused":
      return "portrait";

    case "receiving":
      return "portrait";

    default:
      return "bust";
  }
}

/*
 * ============================================================
 * LUZ DEL VÍDEO
 * ============================================================
 *
 * Importante:
 * no estamos aplicando un filtro blanco general.
 *
 * Levantamos ligeramente el vídeo y después añadimos
 * una iluminación localizada sobre:
 *
 * frente
 * ojos
 * pómulos
 * nariz
 *
 * Manteniendo traje y fondo oscuros.
 */

function videoFilterForState(
  state: AvatarPresenceState,
) {
  switch (state) {
    /*
     * Pensamiento:
     * sigue algo más oscuro.
     */
    case "thinking":
      return (
        "brightness(1.035) " +
        "contrast(1.025) " +
        "saturate(0.9)"
      );

    /*
     * Silencio:
     * intimidad, pero sin perder la cara.
     */
    case "paused":
      return (
        "brightness(1.025) " +
        "contrast(1.025) " +
        "saturate(0.88)"
      );

    /*
     * Escucha:
     * ligeramente más visible.
     */
    case "listening":
      return (
        "brightness(1.06) " +
        "contrast(1.025) " +
        "saturate(0.92)"
      );

    /*
     * Cuando habla:
     * los ojos y la boca deben verse con claridad.
     */
    case "reading":
    case "speaking":
      return (
        "brightness(1.085) " +
        "contrast(1.02) " +
        "saturate(0.95)"
      );

    /*
     * Reposo.
     */
    default:
      return (
        "brightness(1.07) " +
        "contrast(1.025) " +
        "saturate(0.93)"
      );
  }
}

/*
 * ============================================================
 * COMPONENTE
 * ============================================================
 */

const SynchronizedAvatarBody =
  forwardRef<
    AvatarBodyHandle,
    SynchronizedAvatarBodyProps
  >(
    function SynchronizedAvatarBody(
      {
        media,
        state,
        onLifeStateChange,
      },
      ref,
    ) {
      /*
       * ------------------------------------------------------
       * ESTADO
       * ------------------------------------------------------
       */

      const [awake, setAwake] =
        useState(true);

      const [voiceLevel, setVoiceLevel] =
        useState(0);

      const [shot, setShot] =
        useState<CameraShot>("bust");

      /*
       * ------------------------------------------------------
       * REFERENCIAS
       * ------------------------------------------------------
       */

      const videoRef =
        useRef<HTMLVideoElement>(null);

      const stateRef =
        useRef(state);

      const shotIndexRef =
        useRef(0);

      const previousLevelRef =
        useRef(0);

      const initializedRef =
        useRef(false);

      stateRef.current = state;

      /*
       * ------------------------------------------------------
       * DESPERTAR
       * ------------------------------------------------------
       */

      const wake =
        useCallback(async () => {
          setAwake(true);

          onLifeStateChange?.(
            "synchronized",
          );

          const video =
            videoRef.current;

          if (video) {
            void video
              .play()
              .catch(() => undefined);
          }

          return true;
        }, [onLifeStateChange]);

      /*
       * ------------------------------------------------------
       * DORMIR
       * ------------------------------------------------------
       */

      const sleep =
        useCallback(async () => {
          setAwake(false);

          videoRef.current?.pause();

          onLifeStateChange?.(
            "sleeping",
          );
        }, [onLifeStateChange]);

      /*
       * ------------------------------------------------------
       * API IMPERATIVA
       * ------------------------------------------------------
       */

      useImperativeHandle(
        ref,
        () => ({
          /*
           * La interrupción del audio NO interrumpe
           * el cuerpo.
           *
           * El personaje sigue existiendo.
           */
          interrupt: () => {
            // Intencionadamente vacío.
          },

          sleep,

          /*
           * La voz sigue siendo reproducida
           * desde GranAvatarExperience.
           */
          speak: async () => false,

          wake,
        }),
        [sleep, wake],
      );

      /*
       * ------------------------------------------------------
       * CICLO DE VIDA
       * ------------------------------------------------------
       */

      useEffect(() => {
        onLifeStateChange?.(
          "synchronized",
        );

        return () => {
          onLifeStateChange?.(
            "sleeping",
          );
        };
      }, [onLifeStateChange]);

      /*
       * ------------------------------------------------------
       * PREPARACIÓN DEL VÍDEO
       * ------------------------------------------------------
       */

      useEffect(() => {
        const video =
          videoRef.current;

        if (!video) return;

        const prepare = () => {
          if (
            !initializedRef.current &&
            Number.isFinite(
              video.duration,
            )
          ) {
            /*
             * Entramos en una zona tranquila
             * del vídeo maestro.
             *
             * Este es el único seek.
             */
            video.currentTime =
              clamp(
                12.2,
                0,
                Math.max(
                  0,
                  video.duration - 1,
                ),
              );

            initializedRef.current =
              true;
          }

          video.playbackRate =
            baseRateForState(
              stateRef.current,
            );

          if (awake) {
            void video
              .play()
              .catch(() => undefined);
          }
        };

        if (video.readyState >= 1) {
          prepare();
        } else {
          video.addEventListener(
            "loadedmetadata",
            prepare,
            {
              once: true,
            },
          );
        }

        return () => {
          video.removeEventListener(
            "loadedmetadata",
            prepare,
          );
        };
      }, [awake]);

      /*
       * ------------------------------------------------------
       * PLAY / PAUSE
       * ------------------------------------------------------
       */

      useEffect(() => {
        const video =
          videoRef.current;

        if (!video) return;

        if (awake) {
          void video
            .play()
            .catch(() => undefined);
        } else {
          video.pause();
        }
      }, [awake]);

      /*
       * ------------------------------------------------------
       * DIRECCIÓN DE CÁMARA
       * ------------------------------------------------------
       */

      useEffect(() => {
        if (!awake) return;

        /*
         * Cuando no habla:
         * un único plano estable.
         */
        if (
          !isSpeakingState(state)
        ) {
          shotIndexRef.current = 0;

          setShot(
            staticShotForState(
              state,
            ),
          );

          return;
        }

        /*
         * Cuando recita / habla:
         * cambios extremadamente lentos.
         */

        const sequence =
          state === "reading"
            ? READING_SHOTS
            : SPEAKING_SHOTS;

        shotIndexRef.current = 0;

        setShot(
          sequence[0],
        );

        const interval =
          window.setInterval(
            () => {
              shotIndexRef.current =
                (
                  shotIndexRef.current +
                  1
                ) %
                sequence.length;

              setShot(
                sequence[
                  shotIndexRef.current
                ],
              );
            },

            state === "reading"
              ? 10_800
              : 9_100,
          );

        return () => {
          window.clearInterval(
            interval,
          );
        };
      }, [awake, state]);

      /*
       * ------------------------------------------------------
       * ENERGÍA DE VOZ
       * ------------------------------------------------------
       */

      useEffect(() => {
        let frame = 0;

        const animate = () => {
          const video =
            videoRef.current;

          const currentState =
            stateRef.current;

          const speaking =
            isSpeakingState(
              currentState,
            );

          const level =
            speaking &&
            avatarVoiceSignal.active
              ? avatarVoiceSignal.level
              : 0;

          /*
           * Evitamos actualizar React
           * en cada frame.
           */
          if (
            Math.abs(
              level -
                previousLevelRef.current,
            ) > 0.04
          ) {
            previousLevelRef.current =
              level;

            setVoiceLevel(level);
          }

          if (
            video &&
            awake
          ) {
            /*
             * La voz influye mínimamente
             * en la velocidad corporal.
             */

            const baseRate =
              baseRateForState(
                currentState,
              );

            const voiceNudge =
              speaking
                ? level * 0.12
                : 0;

            const targetRate =
              clamp(
                baseRate +
                  voiceNudge,
                0.54,
                1.08,
              );

            /*
             * Interpolación extremadamente
             * lenta.
             *
             * Nada de saltos.
             */
            video.playbackRate +=
              (
                targetRate -
                video.playbackRate
              ) * 0.025;

            if (video.paused) {
              void video
                .play()
                .catch(
                  () => undefined,
                );
            }
          }

          frame =
            window.requestAnimationFrame(
              animate,
            );
        };

        frame =
          window.requestAnimationFrame(
            animate,
          );

        return () => {
          window.cancelAnimationFrame(
            frame,
          );
        };
      }, [awake]);

      /*
       * ------------------------------------------------------
       * INTENSIDAD DE LA LUZ FACIAL
       * ------------------------------------------------------
       */

      const facialLightOpacity =
        isSpeakingState(state)
          ? 0.27 +
            voiceLevel * 0.055
          : state === "listening"
            ? 0.255
            : state === "thinking"
              ? 0.205
              : 0.24;

      /*
       * ------------------------------------------------------
       * RENDER
       * ------------------------------------------------------
       */

      return (
        <div
          className={
            styles.avatarBody
          }
          data-live={
            awake
              ? "synchronized"
              : "sleeping"
          }
          data-state={state}
          data-shot={shot}
          style={
            {
              /*
               * Conservamos la variable
               * original de V5.
               */
              "--avatar-voice-level":
                voiceLevel.toFixed(3),

              /*
               * Un poco más de luz ambiental
               * que antes.
               */
              "--avatar-light-opacity":
                (
                  0.31 +
                  voiceLevel * 0.07
                ).toFixed(3),
            } as CSSProperties
          }
        >
          {/*
           * ==================================================
           * CUERPO CONTINUO
           * ==================================================
           */}

          <div
            className={
              styles.v5ContinuousLayer
            }
          >
            <div
              className={
                styles.v5CameraRig
              }
            >
              <video
                ref={videoRef}
                className={
                  styles.v5MasterVideo
                }
                src={
                  MASTER_VIDEO
                }
                muted
                loop
                playsInline
                preload="auto"
                poster={
                  media.posterUrl
                }
                aria-label="El Gran Avatar permanece vivo de forma continua"

                /*
                 * IMPORTANTE:
                 *
                 * Este estilo inline
                 * gana al filter anterior
                 * del CSS.
                 *
                 * Levantamos sombras
                 * sin quemar altas luces.
                 */
                style={{
                  filter:
                    videoFilterForState(
                      state,
                    ),
                }}
              />
            </div>
          </div>

          {/*
           * ==================================================
           * LUZ FACIAL LOCALIZADA
           * ==================================================
           *
           * Esta es la mejora principal.
           *
           * El gradiente está situado
           * sobre la cabeza y la cara,
           * no sobre toda la pantalla.
           */}

          <div
            aria-hidden="true"
            style={{
              position:
                "absolute",

              inset: 0,

              zIndex: 2,

              pointerEvents:
                "none",

              opacity:
                facialLightOpacity,

              transition:
                "opacity 1200ms ease",

              /*
               * Luz cálida y muy suave.
               *
               * El primer gradiente
               * ilumina ojos / pómulos.
               *
               * El segundo introduce
               * separación alrededor
               * del cabello.
               */
              background: `
                radial-gradient(
                  ellipse 28% 31%
                  at 50% 31%,
                  rgba(255, 225, 184, 0.38) 0%,
                  rgba(235, 181, 116, 0.22) 34%,
                  rgba(208, 142, 76, 0.08) 55%,
                  rgba(0, 0, 0, 0) 76%
                ),
                radial-gradient(
                  ellipse 37% 41%
                  at 50% 29%,
                  rgba(205, 126, 58, 0.11) 0%,
                  rgba(0, 0, 0, 0) 72%
                )
              `,

              mixBlendMode:
                "screen",
            }}
          />

          {/*
           * ==================================================
           * LUZ ATMOSFÉRICA V5
           * ==================================================
           */}

          <div
            className={
              styles.v5Light
            }
            aria-hidden="true"
          />

          {/*
           * ==================================================
           * VIÑETA
           * ==================================================
           *
           * Mantiene negros los extremos
           * y evita que la nueva iluminación
           * convierta el vídeo en una imagen plana.
           */}

          <div
            className={
              styles.v5Vignette
            }
            aria-hidden="true"
          />
        </div>
      );
    },
  );

SynchronizedAvatarBody.displayName =
  "SynchronizedAvatarBody";

export default SynchronizedAvatarBody;