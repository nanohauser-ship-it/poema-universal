import styles from './threshold.module.css';

const BASE =
  '/poema-universal/umbral-v2/world/layers';

type Props = {
  part: 'back' | 'front';
};

export default function SuspendedStudy({ part }: Props) {
  if (part === 'back') {
    return (
      <div
        className={`${styles.realWorld} ${styles.realWorldBack}`}
        aria-hidden="true"
      >
        <div className={styles.realWorldGlow} />

        <div className={`${styles.realLayer} ${styles.realSky}`}>
          <img
            src={`${BASE}/00-sky.png`}
            alt=""
            draggable="false"
          />
        </div>

        <div className={`${styles.realLayer} ${styles.realDistant}`}>
          <img
            src={`${BASE}/01-distant-world.png`}
            alt=""
            draggable="false"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.realWorld} ${styles.realWorldFront}`}
      role="img"
      aria-label="Territorio suspendido de Poema Universal: una reunión de voces entre ruinas, árbol, niebla, poemas y piedra."
    >
      <div className={`${styles.realLayer} ${styles.realIsland}`}>
        <img
          src={`${BASE}/02-central-island.png`}
          alt=""
          draggable="false"
        />
      </div>

      {/* Microvida 2.5D · visible solo durante la pausa interior */}
      <div
        className={styles.poetsLife}
        aria-hidden="true"
      >
        <img
          src={`${BASE}/02-central-island.png`}
          alt=""
          draggable="false"
          className={`${styles.poetPatch} ${styles.poetSpeaker}`}
        />

        <img
          src={`${BASE}/02-central-island.png`}
          alt=""
          draggable="false"
          className={`${styles.poetPatch} ${styles.poetLeft}`}
        />

        <img
          src={`${BASE}/02-central-island.png`}
          alt=""
          draggable="false"
          className={`${styles.poetPatch} ${styles.poetRight}`}
        />

        <img
          src={`${BASE}/02-central-island.png`}
          alt=""
          draggable="false"
          className={`${styles.poetPatch} ${styles.poetStandingRight}`}
        />

        <span
          className={`${styles.passingPaper} ${styles.paperA}`}
        />

        <span
          className={`${styles.passingPaper} ${styles.paperB}`}
        />
      </div>

      <div className={`${styles.realLayer} ${styles.realMist}`}>
        <img
          src={`${BASE}/03-mist-waterfalls.png`}
          alt=""
          draggable="false"
        />
      </div>

      <div className={`${styles.realLayer} ${styles.realPapers}`}>
        <img
          src={`${BASE}/04-papers-birds.png`}
          alt=""
          draggable="false"
        />
      </div>

      <div className={`${styles.realLayer} ${styles.realForeground}`}>
        <img
          src={`${BASE}/05-foreground-frame.png`}
          alt=""
          draggable="false"
        />
      </div>
    </div>
  );
}
