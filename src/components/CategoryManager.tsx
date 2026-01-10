/** Modal content for adding/removing income/expense categories. */
import React, { useMemo, useState } from "react";
import { CategoriesState, TransactionType } from "../types";

export default function CategoryManager(props: {
  categories: CategoriesState;
  onAdd: (type: TransactionType, name: string) => void;
  onRemove: (type: TransactionType, name: string) => void;
}) {
  const { categories, onAdd, onRemove } = props;

  const [incomeNew, setIncomeNew] = useState("");
  const [expenseNew, setExpenseNew] = useState("");

  const sections = useMemo(
    () => [
      { type: "income" as const, title: "Income categories", list: categories.incomeCategories },
      { type: "expense" as const, title: "Expense categories", list: categories.expenseCategories },
    ],
    [categories],
  );

  return (
    <div className="catManager">
      {sections.map((s) => (
        <section key={s.type} className="panel">
          <div className="panelHeader">
            <h3 className="panelTitle">{s.title}</h3>
          </div>

          <div className="inlineForm">
            <label className="field">
              <span className="labelText">Add</span>
              <input
                value={s.type === "income" ? incomeNew : expenseNew}
                onChange={(e) => (s.type === "income" ? setIncomeNew(e.target.value) : setExpenseNew(e.target.value))}
                className="input"
                placeholder="New category"
              />
            </label>
            <button
              type="button"
              className="btn btnPrimary"
              onClick={() => {
                const val = s.type === "income" ? incomeNew : expenseNew;
                onAdd(s.type, val);
                if (s.type === "income") setIncomeNew("");
                else setExpenseNew("");
              }}
            >
              Add
            </button>
          </div>

          <div className="tagGrid" role="list">
            {s.list.map((c) => (
              <div key={c} className="tag" role="listitem">
                <span className="tagText">{c}</span>
                <button type="button" className="tagBtn" onClick={() => onRemove(s.type, c)} aria-label={`Remove ${c}`}>
                  ✕
                </button>
              </div>
            ))}
          </div>

          <p className="muted">
            Removing a category won&apos;t change existing transactions; it just disappears from pickers.
          </p>
        </section>
      ))}
    </div>
  );
}
