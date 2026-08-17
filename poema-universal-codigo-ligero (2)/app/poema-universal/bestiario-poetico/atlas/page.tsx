import Link from "next/link";
import Image from "next/image";
import { canonicalCreatures } from "@/lib/bestiario-poetico/canonicalCreatures";
import styles from "./atlas.module.css";

export const metadata = {
  title: "Atlas de Criaturas | Bestiario Poético",
  description: "Archivo público de criaturas nacidas de la escritura."
};

export default function BestiaryAtlasPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p>Bestiario Poético · Archivo fundacional</p>
        <h1>Atlas de Criaturas</h1>
        <blockquote>
          Presencias nacidas de aquello que la escritura no pudo decir de otra forma.
        </blockquote>
      </section>

      <section className={styles.grid}>
        {canonicalCreatures.map((creature) => (
          <Link
            className={styles.card}
            href={`/poema-universal/bestiario-poetico/atlas/${creature.slug}`}
            key={creature.slug}
          >
            <div className={styles.image}>
              <Image src={creature.image} alt={creature.name} fill priority sizes="100vw" />
            </div>
            <div className={styles.copy}>
              <span>Archivo {creature.number.toString().padStart(3, "0")}</span>
              <h2>{creature.name}</h2>
              <p>{creature.symbolicCore}</p>
              <blockquote>“{creature.oracle}”</blockquote>
              <strong>Entrar en su cámara →</strong>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
