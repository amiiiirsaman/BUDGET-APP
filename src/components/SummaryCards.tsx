/** Summary metric cards (start, totals, net, ending). */
import React from "react";
import { formatUSD } from "../utils/money";

export default function SummaryCards(props: {
  startingBalance: number;
  incomeTotal: number;
  expenseTotal: number;
}) {
  const { startingBalance, incomeTotal, expenseTotal } = props;
  const net = incomeTotal - expenseTotal;
  const ending = startingBalance + net;

  return (
    <div className="cards">
      <div className="card">
        <div className="cardLabel">Starting balance</div>
        <div className="cardValue mono">{formatUSD(startingBalance)}</div>
      </div>
      <div className="card cardIncome">
        <div className="cardLabel">Total income</div>
        <div className="cardValue mono">{formatUSD(incomeTotal)}</div>
      </div>
      <div className="card cardExpense">
        <div className="cardLabel">Total expenses</div>
        <div className="cardValue mono">{formatUSD(expenseTotal)}</div>
      </div>
      <div className="card">
        <div className="cardLabel">Net (income − expenses)</div>
        <div className={`cardValue mono ${net >= 0 ? "pos" : "neg"}`}>{formatUSD(net)}</div>
      </div>
      <div className="card cardHighlight">
        <div className="cardLabel">Ending balance (Start + Net)</div>
        <div className={`cardValue mono ${ending >= 0 ? "pos" : "neg"}`}>{formatUSD(ending)}</div>
        <div className="cardHint">This is “how much money I could end up with”.</div>
      </div>
    </div>
  );
}
