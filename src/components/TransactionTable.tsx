/** Table for listing transactions with optional category filter. */
import React, { useMemo, useState } from "react";
import { Transaction } from "../types";
import { compareISODateDesc } from "../utils/dates";
import { formatUSD } from "../utils/money";

export default function TransactionTable(props: {
  rows: Transaction[];
  categories: string[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}) {
  const { rows, categories, onEdit, onDelete } = props;
  const [filterCat, setFilterCat] = useState<string>("");

  const filtered = useMemo(() => {
    const sorted = [...rows].sort((a, b) => compareISODateDesc(a.date, b.date));
    if (!filterCat) return sorted;
    return sorted.filter((r) => r.category === filterCat);
  }, [rows, filterCat]);

  return (
    <div className="tableWrap">
      <div className="tableToolbar">
        <label className="field fieldInline">
          <span className="labelText">Filter</span>
          <select className="input" value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <div className="muted">Sorted by date (newest first)</div>
      </div>

      <table className="sheet" aria-label="Transactions table">
        <thead>
          <tr>
            <th className="colDate">Date</th>
            <th className="colAmt">Amount</th>
            <th>Description</th>
            <th className="colCat">Category</th>
            <th className="colActions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={5} className="emptyCell">
                No transactions yet.
              </td>
            </tr>
          ) : (
            filtered.map((r) => (
              <tr key={r.id}>
                <td className="mono">{r.date}</td>
                <td className="mono amtCell">{formatUSD(r.amount)}</td>
                <td>{r.description}</td>
                <td>{r.category}</td>
                <td className="actionsCell">
                  <button type="button" className="btn btnSmall" onClick={() => onEdit(r)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btnSmall btnDanger"
                    onClick={() => onDelete(r.id)}
                    aria-label={`Delete transaction ${r.description}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
