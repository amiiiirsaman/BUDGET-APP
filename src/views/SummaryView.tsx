/** Summary page: month picker, starting balance, and category breakdown charts/tables. */
import React, { useMemo } from "react";
import { AppState, TransactionType } from "../types";
import { monthKeyFromISODate, monthLabel } from "../utils/dates";
import SummaryCards from "../components/SummaryCards";
import CategoryBreakdownTable, { BreakdownRow } from "../components/CategoryBreakdownTable";
import BarCompare from "../components/BarCompare";

/** Groups transactions by category and returns rows sorted by total (desc). */
function groupByCategory(rows: AppState["transactions"]): BreakdownRow[] {
  const map = new Map<string, number>();
  for (const r of rows) map.set(r.category, (map.get(r.category) ?? 0) + r.amount);
  return [...map.entries()]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total || a.category.localeCompare(b.category));
}

export default function SummaryView(props: {
  state: AppState;
  actions: {
    setSelectedMonth: (yyyyMm: string) => void;
    setStartingBalanceForMonth: (yyyyMm: string, value: number) => void;
    addCategory: (type: TransactionType, name: string) => void; // not used here, but kept consistent
  };
}) {
  const { state, actions } = props;

  const month = state.selectedMonth;
  const startingBalance = state.startingBalancesByMonth[month] ?? 0;

  const monthTx = useMemo(() => {
    return state.transactions.filter((t) => monthKeyFromISODate(t.date) === month);
  }, [state.transactions, month]);

  const income = useMemo(() => monthTx.filter((t) => t.type === "income"), [monthTx]);
  const expenses = useMemo(() => monthTx.filter((t) => t.type === "expense"), [monthTx]);

  const incomeTotal = useMemo(() => income.reduce((sum, t) => sum + t.amount, 0), [income]);
  const expenseTotal = useMemo(() => expenses.reduce((sum, t) => sum + t.amount, 0), [expenses]);

  const net = incomeTotal - expenseTotal;
  const ending = startingBalance + net;

  const incomeByCat = useMemo(() => groupByCategory(income), [income]);
  const expenseByCat = useMemo(() => groupByCategory(expenses), [expenses]);

  return (
    <div className="page">
      <section className="sectionCard">
        <div className="sectionHeader">
          <div>
            <h2 className="sectionTitle">Summary</h2>
            <p className="sectionHint">Pick a month to see “how much money I could end up with”.</p>
          </div>
        </div>

        <div className="summaryInputs">
          <label className="field">
            <span className="labelText">Month</span>
            <input
              className="input"
              type="month"
              value={month}
              onChange={(e) => actions.setSelectedMonth(e.target.value)}
            />
            <div className="helpText">{monthLabel(month)}</div>
          </label>

          <label className="field">
            <span className="labelText">Starting balance</span>
            <input
              className="input"
              type="number"
              step="0.01"
              inputMode="decimal"
              value={startingBalance}
              onChange={(e) => actions.setStartingBalanceForMonth(month, Number(e.target.value))}
            />
            <div className="helpText">Saved per month.</div>
          </label>
        </div>
      </section>

      <SummaryCards startingBalance={startingBalance} incomeTotal={incomeTotal} expenseTotal={expenseTotal} />

      <div className="grid2">
        <BarCompare
          title="Income vs Expenses"
          aLabel="Income"
          aValue={incomeTotal}
          aTone="income"
          bLabel="Expenses"
          bValue={expenseTotal}
          bTone="expense"
        />
        <BarCompare
          title="Start vs End"
          aLabel="Start"
          aValue={Math.max(0, startingBalance)}
          aTone="neutral"
          bLabel="End"
          bValue={Math.max(0, ending)}
          bTone={ending >= startingBalance ? "income" : "expense"}
        />
      </div>

      <div className="grid2">
        <CategoryBreakdownTable title="Expenses by category" rows={expenseByCat} />
        <CategoryBreakdownTable title="Income by source" rows={incomeByCat} />
      </div>

      <section className="panel">
        <div className="panelHeader">
          <h3 className="panelTitle">Quick notes</h3>
        </div>
        <ul className="bullets">
          <li>
            Net for {month}: <strong>{net.toFixed(2)}</strong>
          </li>
          <li>
            Transactions counted: <strong>{monthTx.length}</strong>
          </li>
        </ul>
      </section>
    </div>
  );
}
