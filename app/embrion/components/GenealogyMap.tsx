"use client";

import type { GenealogyEdge, GenealogyNode, Period } from "@/lib/embrion/types";
import styles from "../embrion.module.css";

type Props = {
  periods: Period[];
  nodes: GenealogyNode[];
  edges: GenealogyEdge[];
  selectedPeriodId: string;
  onSelectPeriod: (id: string) => void;
  onOpenClaim: (id: string) => void;
};

const relationLabel: Record<GenealogyEdge["relation"], string> = {
  persistence: "persistencia", transformation: "transformación", rupture: "ruptura", reappearance: "reaparición", coexistence: "coexistencia",
};

export default function GenealogyMap({ periods, nodes, edges, selectedPeriodId, onSelectPeriod, onOpenClaim }: Props) {
  const visiblePeriods = periods.filter((period) => nodes.some((node) => node.periodId === period.id));
  const width = Math.max(980, visiblePeriods.length * 190);
  const height = 500;
  const position = (node: GenealogyNode) => {
    const xIndex = visiblePeriods.findIndex((period) => period.id === node.periodId);
    return { x: 90 + xIndex * ((width - 180) / Math.max(visiblePeriods.length - 1, 1)), y: 82 + node.lane * 104 };
  };

  return (
    <div className={styles.genealogyFrame}>
      <svg viewBox={`0 0 ${width} ${height}`} className={styles.genealogySvg} role="img" aria-label="Genealogía no lineal del concepto muerte">
        <g className={styles.genealogyGrid}>
          {visiblePeriods.map((period) => {
            const x = position(nodes.find((node) => node.periodId === period.id)!).x;
            return <line key={period.id} x1={x} x2={x} y1="52" y2="458" />;
          })}
        </g>
        <g className={styles.genealogyEdges}>
          {edges.map((edge) => {
            const fromNode = nodes.find((node) => node.id === edge.from);
            const toNode = nodes.find((node) => node.id === edge.to);
            if (!fromNode || !toNode) return null;
            const from = position(fromNode); const to = position(toNode); const mid = (from.x + to.x) / 2;
            return <path key={edge.id} d={`M ${from.x} ${from.y} C ${mid} ${from.y}, ${mid} ${to.y}, ${to.x} ${to.y}`} data-relation={edge.relation}><title>{`${relationLabel[edge.relation]} · ${Math.round(edge.confidence * 100)}%`}</title></path>;
          })}
        </g>
        <g>
          {nodes.map((node) => {
            const p = position(node);
            const isSelected = node.periodId === selectedPeriodId;
            return (
              <g key={node.id} className={`${styles.genealogyNode} ${isSelected ? styles.genealogyNodeActive : ""}`} transform={`translate(${p.x} ${p.y})`} onClick={() => { onSelectPeriod(node.periodId); onOpenClaim(node.claimId); }} role="button" tabIndex={0}>
                <circle r={7 + node.intensity * 7} />
                <text y="31" textAnchor="middle">{node.label}</text>
              </g>
            );
          })}
        </g>
        <g className={styles.genealogyLabels}>
          {visiblePeriods.map((period) => {
            const x = position(nodes.find((node) => node.periodId === period.id)!).x;
            return <text key={period.id} x={x} y="485" textAnchor="middle">{period.shortLabel}</text>;
          })}
        </g>
      </svg>
      <div className={styles.genealogyLegend}>
        {Object.entries(relationLabel).map(([key, label]) => <span key={key}><i data-relation={key} />{label}</span>)}
      </div>
      <p className={styles.mapNote}>Las líneas expresan hipótesis curatoriales inspeccionables, no causalidad histórica.</p>
    </div>
  );
}
