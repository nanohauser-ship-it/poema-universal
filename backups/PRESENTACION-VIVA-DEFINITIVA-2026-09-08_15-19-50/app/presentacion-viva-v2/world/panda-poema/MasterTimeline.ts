export const MASTER_DURATION = 105;

type CinematicKey = {
  time: number;
  world: number;
};

const CINEMATIC_KEYS: CinematicKey[] = [
  {
    time: 0.000,
    world: 0.000,
  },

  {
    time: 0.100,
    world: 0.090,
  },

  /*
   * COCINA
   * Primera respiración.
   */
  {
    time: 0.180,
    world: 0.150,
  },

  {
    time: 0.250,
    world: 0.230,
  },

  /*
   * CAMBIO DE RUMBO
   */
  {
    time: 0.360,
    world: 0.340,
  },

  /*
   * LITERATURA
   * Movimiento más contemplativo.
   */
  {
    time: 0.460,
    world: 0.430,
  },

  {
    time: 0.560,
    world: 0.540,
  },

  /*
   * LA LLAMADA
   */
  {
    time: 0.620,
    world: 0.595,
  },

  {
    time: 0.660,
    world: 0.615,
  },

  /*
   * SILENCIO
   *
   * Durante unos segundos
   * casi no avanzamos.
   *
   * Estamos esperando
   * la primera respuesta.
   */
  {
    time: 0.700,
    world: 0.625,
  },

  /*
   * PRIMERAS RESPUESTAS
   *
   * Tras la espera,
   * el mundo vuelve a abrirse.
   */
  {
    time: 0.740,
    world: 0.675,
  },

  {
    time: 0.820,
    world: 0.790,
  },

  /*
   * 10 / 60
   */
  {
    time: 0.880,
    world: 0.845,
  },

  /*
   * APROXIMACIÓN
   * AL ÁRBOL BLANCO
   */
  {
    time: 0.930,
    world: 0.890,
  },

  /*
   * CONTEMPLACIÓN FINAL
   */
  {
    time: 0.970,
    world: 0.935,
  },

  {
    time: 1.000,
    world: 1.000,
  },
];

function clamp01(
  value: number,
) {
  return Math.max(
    0,
    Math.min(
      1,
      value,
    ),
  );
}

function smoothstep(
  value: number,
) {
  const t =
    clamp01(value);

  return (
    t *
    t *
    (
      3 -
      2 * t
    )
  );
}

export function cinematicProgress(
  timelineProgress: number,
) {
  const t =
    clamp01(
      timelineProgress,
    );

  if (t <= 0) {
    return 0;
  }

  if (t >= 1) {
    return 1;
  }

  for (
    let index = 0;
    index <
      CINEMATIC_KEYS.length - 1;
    index += 1
  ) {
    const current =
      CINEMATIC_KEYS[index];

    const next =
      CINEMATIC_KEYS[
        index + 1
      ];

    if (
      t >= current.time &&
      t <= next.time
    ) {
      const span =
        Math.max(
          0.000001,
          next.time -
            current.time,
        );

      const local =
        (
          t -
          current.time
        ) /
        span;

      const eased =
        smoothstep(local);

      return (
        current.world +
        (
          next.world -
          current.world
        ) *
          eased
      );
    }
  }

  return t;
}

export const masterTimeline = {
  playing: true,

  /*
   * Tiempo visible del player.
   * Siempre 0 → 1 lineal.
   */
  progress: 0,

  /*
   * Tiempo dramático del mundo.
   * Puede respirar.
   */
  worldProgress: 0,

  elapsed: 0,

  speed: 1,

  seekRequested:
    null as number | null,

  restartRequested:
    false,
};

export function masterPlay() {
  if (
    masterTimeline.progress >=
      0.999999
  ) {
    masterTimeline.progress = 0;
    masterTimeline.worldProgress = 0;
    masterTimeline.elapsed = 0;
    masterTimeline.seekRequested = 0;
  }

  masterTimeline.playing = true;
}

export function masterPause() {
  masterTimeline.playing = false;
}

export function masterToggle() {
  if (
    masterTimeline.playing
  ) {
    masterPause();
  } else {
    masterPlay();
  }
}

export function masterRestart() {
  masterTimeline.restartRequested =
    true;

  masterTimeline.playing = true;
}

export function masterSeek(
  progress: number,
) {
  const value =
    clamp01(progress);

  masterTimeline.progress =
    value;

  masterTimeline.worldProgress =
    cinematicProgress(value);

  masterTimeline.elapsed =
    value *
    MASTER_DURATION;

  masterTimeline.seekRequested =
    value;
}
