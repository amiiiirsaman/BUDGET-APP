/** Horizontal bar comparison used in the Summary page (e.g., income vs expenses). */
import React from "react";
import { formatUSD } from "../utils/money";

/** Returns a clamped percentage (0..100). */
function pct(part: number, whole: number): number {
  if (whole <= 0) return 0;
  return Math.max(0, Math.min(100, (part / whole) * 100));
}

export default function BarCompare(props: {
  title: string;
  aLabel: string;
  aValue: number;
  aTone?: "income" | "expense" | "neutral";
  bLabel: string;
  bValue: number;
  bTone?: "income" | "expense" | "neutral";
}) {
  const { title, aLabel, aValue, aTone = "neutral", bLabel, bValue, bTone = "neutral" } = props;

  const max = Math.max(aValue, bValue, 0);

  return (
    <section className="panel">
      <div className="panelHeader">
        <h3 className="panelTitle">{title}</h3>
      </div>

      <div className="barRows">
        <div className="barRow">
          <div className="barMeta">
            <span className="barLabel">{aLabel}</span>
            <span className="barValue mono">{formatUSD(aValue)}</span>
          </div>
          <div className="barTrack" aria-hidden="true">
            <div className={`barFill tone-${aTone}`} style={{ width: `${pct(aValue, max)}%` }} />
          </div>
        </div>

        <div className="barRow">
          <div className="barMeta">
            <span className="barLabel">{bLabel}</span>
            <span className="barValue mono">{formatUSD(bValue)}</span>
          </div>
          <div className="barTrack" aria-hidden="true">
            <div className={`barFill tone-${bTone}`} style={{ width: `${pct(bValue, max)}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}
