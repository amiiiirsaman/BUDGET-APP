/** Transaction add/edit form used in each TransactionSection. */
import React, { useEffect, useMemo, useState } from "react";
import { Transaction, TransactionType } from "../types";
import { todayISODate } from "../utils/dates";
import { newId } from "../utils/storage";

type Draft = {
  id?: string;
  date: string;
  amount: string;
  description: string;
  category: string;
  categoryNew: string;
};

const NEW_CAT = "__new__";

export default function TransactionForm(props: {
  type: TransactionType;
  categories: string[];
  editing?: Transaction | null;
  onCancelEdit?: () => void;
  onAddCategory: (type: TransactionType, name: string) => void;
  onSubmit: (tx: Transaction) => void;
}) {
  const { type, categories, editing, onCancelEdit, onAddCategory, onSubmit } = props;

  const [draft, setDraft] = useState<Draft>(() => ({
    date: todayISODate(),
    amount: "",
    description: "",
    category: categories[0] ?? "Other",
    categoryNew: "",
  }));

  const isEdit = Boolean(editing?.id);

  useEffect(() => {
    if (!editing) return;
    setDraft({
      id: editing.id,
      date: editing.date,
      amount: String(editing.amount),
      description: editing.description,
      category: categories.includes(editing.category) ? editing.category : editing.category || (categories[0] ?? "Other"),
      categoryNew: "",
    });
  }, [editing, categories]);

  useEffect(() => {
    if (isEdit) return;
    setDraft((d) => ({
      ...d,
      category: categories.includes(d.category) ? d.category : categories[0] ?? "Other",
    }));
  }, [categories, isEdit]);

  const errors = useMemo(() => {
    const e: string[] = [];
    if (!draft.date) e.push("Date is required.");
    const amt = Number(draft.amount);
    if (!Number.isFinite(amt) || amt <= 0) e.push("Amount must be > 0.");
    if (!draft.description.trim()) e.push("Description is required.");
    const cat = draft.category === NEW_CAT ? draft.categoryNew.trim() : draft.category.trim();
    if (!cat) e.push("Category is required.");
    return e;
  }, [draft]);

  const submitLabel = isEdit ? "Save" : "Add";

  return (
    <form
      className="txForm"
      onSubmit={(e) => {
        e.preventDefault();
        if (errors.length) return;

        const amount = Number(draft.amount);
        const category = (draft.category === NEW_CAT ? draft.categoryNew.trim() : draft.category.trim()) || "Other";

        if (draft.category === NEW_CAT) onAddCategory(type, category);

        onSubmit({
          id: draft.id ?? newId(),
          type,
          date: draft.date,
          amount,
          description: draft.description.trim(),
          category,
        });

        if (!isEdit) {
          setDraft((d) => ({
            ...d,
            date: d.date,
            amount: "",
            description: "",
            category: categories.includes(category) ? category : categories[0] ?? "Other",
            categoryNew: "",
          }));
        }
      }}
    >
      <div className="txFormGrid">
        <label className="field">
          <span className="labelText">Date</span>
          <input
            className="input"
            type="date"
            value={draft.date}
            onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
            required
          />
        </label>

        <label className="field">
          <span className="labelText">Amount</span>
          <input
            className="input"
            type="number"
            min={0}
            step="0.01"
            inputMode="decimal"
            value={draft.amount}
            onChange={(e) => setDraft((d) => ({ ...d, amount: e.target.value }))}
            required
          />
        </label>

        <label className="field fieldSpan2">
          <span className="labelText">Description</span>
          <input
            className="input"
            type="text"
            value={draft.description}
            onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            required
          />
        </label>

        <label className="field">
          <span className="labelText">Category</span>
          <select
            className="input"
            value={draft.category}
            onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            <option value={NEW_CAT}>Add new…</option>
          </select>
        </label>

        {draft.category === NEW_CAT ? (
          <label className="field">
            <span className="labelText">New category</span>
            <input
              className="input"
              type="text"
              value={draft.categoryNew}
              onChange={(e) => setDraft((d) => ({ ...d, categoryNew: e.target.value }))}
              placeholder="e.g. Freelance"
            />
          </label>
        ) : (
          <div className="field" />
        )}
      </div>

      {errors.length ? (
        <div className="formErrors" role="alert">
          <ul className="formErrorList">
            {errors.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="txFormActions">
        <button className="btn btnPrimary" type="submit">
          {submitLabel}
        </button>
        {isEdit && onCancelEdit ? (
          <button className="btn" type="button" onClick={onCancelEdit}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
