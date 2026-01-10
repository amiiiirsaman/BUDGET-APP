/** Top-level app shell: tabs + state persistence + cross-view actions. */
import React, { useEffect, useMemo, useState } from "react";
import { AppState, TabKey, Transaction, TransactionType } from "./types";
import { loadState, saveState } from "./utils/storage";
import Tabs from "./components/Tabs";
import TransactionsView from "./views/TransactionsView";
import SummaryView from "./views/SummaryView";
import TipOfTheDayModal from "./components/TipOfTheDayModal";

export default function App() {
  const [tab, setTab] = useState<TabKey>("transactions");
  const [state, setState] = useState<AppState>(() => loadState());
  const [isTipOpen, setIsTipOpen] = useState(false);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const actions = useMemo(() => {
    return {
      upsertTransaction: (tx: Transaction) => {
        setState((s) => {
          const idx = s.transactions.findIndex((t) => t.id === tx.id);
          const next = [...s.transactions];
          if (idx >= 0) next[idx] = tx;
          else next.push(tx);
          return { ...s, transactions: next };
        });
      },
      deleteTransaction: (id: string) => {
        setState((s) => ({ ...s, transactions: s.transactions.filter((t) => t.id !== id) }));
      },
      addCategory: (type: TransactionType, name: string) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        setState((s) => {
          const key = type === "income" ? "incomeCategories" : "expenseCategories";
          const list = s.categories[key];
          if (list.some((c) => c.toLowerCase() === trimmed.toLowerCase())) return s;
          return { ...s, categories: { ...s.categories, [key]: [...list, trimmed].sort() } };
        });
      },
      removeCategory: (type: TransactionType, name: string) => {
        setState((s) => {
          const key = type === "income" ? "incomeCategories" : "expenseCategories";
          return { ...s, categories: { ...s.categories, [key]: s.categories[key].filter((c) => c !== name) } };
        });
      },
      setSelectedMonth: (yyyyMm: string) => {
        setState((s) => ({ ...s, selectedMonth: yyyyMm }));
      },
      setStartingBalanceForMonth: (yyyyMm: string, value: number) => {
        setState((s) => ({
          ...s,
          startingBalancesByMonth: { ...s.startingBalancesByMonth, [yyyyMm]: value },
        }));
      },
    };
  }, []);

  return (
    <div className="app">
      <header className="appHeader">
        <div className="appTitleBlock">
          <h1 className="appTitle">Budget</h1>
          <p className="appSubtitle">Spreadsheet-style transactions + monthly summary (local-only)</p>
        </div>
        <div className="appHeaderRight">
          <button type="button" className="btn" onClick={() => setIsTipOpen(true)}>
            Tip of the Day
          </button>
          <Tabs
            value={tab}
            onChange={setTab}
            items={[
              { key: "transactions", label: "Transactions" },
              { key: "summary", label: "Summary" },
            ]}
          />
        </div>
      </header>

      <main className="appMain" role="main">
        {tab === "transactions" ? (
          <TransactionsView state={state} actions={actions} />
        ) : (
          <SummaryView state={state} actions={actions} />
        )}
      </main>

      <footer className="appFooter">
        <span>Data is stored only in your browser (localStorage).</span>
      </footer>

      <TipOfTheDayModal isOpen={isTipOpen} onClose={() => setIsTipOpen(false)} />
    </div>
  );
}
