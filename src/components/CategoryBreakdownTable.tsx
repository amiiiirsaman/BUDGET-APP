/** Simple two-column totals table used in the Summary page. */
import React from "react";
import { formatUSD } from "../utils/money";

export type BreakdownRow = { category: string; total: number };

export default function CategoryBreakdownTable(props: {
  title: string;
  rows: BreakdownRow[];
}) {
  const { title, rows } = props;

  return (
    <section className="panel">
      <div className="panelHeader">
        <h3 className="panelTitle">{title}</h3>
      </div>

      <table className="sheet" aria-label={title}>
        <thead>
          <tr>
            <th>Category</th>
            <th className="colAmt">Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={2} className="emptyCell">
                No data for this month.
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.category}>
                <td>{r.category}</td>
                <td className="mono amtCell">{formatUSD(r.total)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
