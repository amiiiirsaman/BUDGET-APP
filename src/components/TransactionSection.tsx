/** A full section: header + TransactionForm + TransactionTable for one type. */
import React, { useMemo, useState } from "react";
import { Transaction, TransactionType } from "../types";
import TransactionForm from "./TransactionForm";
import TransactionTable from "./TransactionTable";

export default function TransactionSection(props: {
  type: TransactionType;
  title: string;
  hint: string;
  tone: "income" | "expense";
  transactions: Transaction[];
  categories: string[];
  onAddCategory: (type: TransactionType, name: string) => void;
  onUpsert: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  onManageCategories: () => void;
}) {
  const { type, title, hint, tone, transactions, categories, onAddCategory, onUpsert, onDelete, onManageCategories } =
    props;

  const [editing, setEditing] = useState<Transaction | null>(null);

  const headerRight = useMemo(() => {
    return (
      <div className="sectionHeaderRight">
        <button type="button" className="btn" onClick={onManageCategories}>
          Manage Categories
        </button>
      </div>
    );
  }, [onManageCategories]);

  return (
    <section className={`sectionCard ${tone === "income" ? "toneIncome" : "toneExpense"}`}>
      <div className="sectionHeader">
        <div>
          <h2 className="sectionTitle">{title}</h2>
          <p className="sectionHint">{hint}</p>
        </div>
        {headerRight}
      </div>

      <TransactionForm
        type={type}
        categories={categories}
        editing={editing}
        onCancelEdit={() => setEditing(null)}
        onAddCategory={onAddCategory}
        onSubmit={(tx) => {
          onUpsert(tx);
          setEditing(null);
        }}
      />

      <TransactionTable rows={transactions} categories={categories} onEdit={setEditing} onDelete={onDelete} />
    </section>
  );
}
