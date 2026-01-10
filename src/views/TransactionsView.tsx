/** Transactions page: income + expense sections, with category management modal. */
import React, { useMemo, useState } from "react";
import { AppState, TransactionType } from "../types";
import Modal from "../components/Modal";
import CategoryManager from "../components/CategoryManager";
import TransactionSection from "../components/TransactionSection";

export default function TransactionsView(props: {
  state: AppState;
  actions: {
    upsertTransaction: (tx: AppState["transactions"][number]) => void;
    deleteTransaction: (id: string) => void;
    addCategory: (type: TransactionType, name: string) => void;
    removeCategory: (type: TransactionType, name: string) => void;
  };
}) {
  const { state, actions } = props;
  const [catsOpen, setCatsOpen] = useState(false);

  const incomeTx = useMemo(() => state.transactions.filter((t) => t.type === "income"), [state.transactions]);
  const expenseTx = useMemo(() => state.transactions.filter((t) => t.type === "expense"), [state.transactions]);

  return (
    <div className="page">
      <div className="grid2">
        <TransactionSection
          type="expense"
          title="Expenses"
          hint="Money out (positive amounts)."
          tone="expense"
          transactions={expenseTx}
          categories={state.categories.expenseCategories}
          onAddCategory={actions.addCategory}
          onUpsert={actions.upsertTransaction}
          onDelete={actions.deleteTransaction}
          onManageCategories={() => setCatsOpen(true)}
        />

        <TransactionSection
          type="income"
          title="Income"
          hint="Money in (positive amounts)."
          tone="income"
          transactions={incomeTx}
          categories={state.categories.incomeCategories}
          onAddCategory={actions.addCategory}
          onUpsert={actions.upsertTransaction}
          onDelete={actions.deleteTransaction}
          onManageCategories={() => setCatsOpen(true)}
        />
      </div>

      <Modal title="Manage Categories" isOpen={catsOpen} onClose={() => setCatsOpen(false)}>
        <CategoryManager categories={state.categories} onAdd={actions.addCategory} onRemove={actions.removeCategory} />
      </Modal>
    </div>
  );
}
