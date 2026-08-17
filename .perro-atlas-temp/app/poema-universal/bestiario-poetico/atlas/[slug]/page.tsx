import { notFound } from "next/navigation";
import { canonicalCreatures, getCanonicalCreature } from "@/lib/bestiario-poetico/canonicalCreatures";
import { CreatureChamber } from "./CreatureChamber";
import styles from "./creature.module.css";

export function generateStaticParams() {
  return canonicalCreatures.map((creature) => ({ slug: creature.slug }));
}

export default async function CreaturePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const creature = getCanonicalCreature(slug);
  if (!creature) notFound();

  return (
    <main className={styles.page}>
      <CreatureChamber creature={creature} />
      <section className={styles.sheet}>
        <p className={styles.archive}>Archivo {creature.number.toString().padStart(3, "0")}</p>
        <h1>{creature.name}</h1>
        <p className={styles.lineage}>{creature.lineage} · {creature.element}</p>
        <div className={styles.core}>
          <p>{creature.symbolicCore}</p>
          <blockquote>“{creature.oracle}”</blockquote>
        </div>
        <dl className={styles.data}>
          <div><dt>Herida</dt><dd>{creature.wound}</dd></div>
          <div><dt>Deseo</dt><dd>{creature.desire}</dd></div>
          <div><dt>Contradicción</dt><dd>{creature.contradiction}</dd></div>
          <div><dt>Función</dt><dd>{creature.function}</dd></div>
          <div><dt>Hábitat</dt><dd>{creature.habitat}</dd></div>
          <div><dt>Gesto</dt><dd>{creature.gesture}</dd></div>
          <div><dt>Reliquia</dt><dd>{creature.relic}</dd></div>
          <div><dt>Materia</dt><dd>{creature.materials.join(" · ")}</dd></div>
          <div><dt>Constelación</dt><dd>{creature.symbols.join(" · ")}</dd></div>
        </dl>
      </section>
    </main>
  );
}
