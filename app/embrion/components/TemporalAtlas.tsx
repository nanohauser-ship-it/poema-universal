"use client";

import type { Period, Work } from "@/lib/embrion/types";
import styles from "../embrion.module.css";

type Props = { periods: Period[]; works: Work[]; selectedId: string; onSelect: (id: string) => void };

export default function TemporalAtlas({ periods, works, selectedId, onSelect }: Props) {
  return (
    <div className={styles.timelineWrap}>
      <div className={styles.centuries} aria-hidden="true">
        {[1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2026].map((year) => <span key={year}>{year}</span>)}
      </div>
      <div className={styles.timeline} role="list" aria-label="Periodos históricos">
        {periods.map((period) => {
          const count = works.filter((work) => work.periodId === period.id).length;
          return (
            <button
              key={period.id}
              role="listitem"
              type="button"
              className={`${styles.periodTick} ${selectedId === period.id ? styles.periodTickActive : ""}`}
              onClick={() => onSelect(period.id)}
              style={{ "--period-color": period.color } as React.CSSProperties}
              aria-pressed={selectedId === period.id}
            >
              <span className={styles.periodDot} />
              <span className={styles.periodDates}>{period.startYear}–{period.endYear}</span>
              <strong>{period.shortLabel}</strong>
              <small>{count ? `${count} ${count === 1 ? "obra" : "obras"}` : "sin muestra"}</small>
            </button>
          );
        })}
      </div>
    </div>
  );
}
