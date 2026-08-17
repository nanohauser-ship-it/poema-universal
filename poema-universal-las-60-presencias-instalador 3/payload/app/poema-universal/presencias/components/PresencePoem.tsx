import type { PoeticPresence } from "../../data/poeticPresences";
import styles from "../presence.module.css";

type PresencePoemProps = {
  poem: PoeticPresence["poem"];
};

export default function PresencePoem({
  poem,
}: PresencePoemProps) {
  if (!poem) {
    return (
      <section
        className={styles.poemEmpty}
        aria-labelledby="poem-pending-title"
      >
        <p className={styles.sectionIndex}>
          Poema original
        </p>
        <h2 id="poem-pending-title">
          Texto pendiente de incorporación
        </h2>
        <p>
          Este lugar permanecerá en silencio hasta que el
          poema forme parte del archivo.
        </p>
      </section>
    );
  }

  return (
    <section
      className={styles.poemSection}
      aria-labelledby="poem-title"
    >
      <header className={styles.poemHeading}>
        <p className={styles.sectionIndex}>
          Poema
        </p>
        <h2 id="poem-title">{poem.title}</h2>
      </header>

      <div className={styles.poemVersions}>
        {poem.texts.map((text) => (
          <article
            key={`${text.kind}-${text.languageCode}`}
            lang={text.languageCode}
          >
            <p className={styles.poemLabel}>
              {text.kind === "original"
                ? "Poema original"
                : "Traducción"}
              <span>{text.label}</span>
            </p>
            <p className={styles.poemText}>
              {text.text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
