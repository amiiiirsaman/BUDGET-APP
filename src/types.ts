/**
 * Shared application types.
 *
 * The app is local-only: `AppState` is persisted to `localStorage`.
 */

export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  type: TransactionType;
  date: string; // ISO date: YYYY-MM-DD
  amount: number; // positive
  description: string;
  category: string;
};

export type CategoriesState = {
  incomeCategories: string[];
  expenseCategories: string[];
};

export type AppState = {
  version: 1;
  transactions: Transaction[];
  categories: CategoriesState;
  selectedMonth: string; // YYYY-MM
  startingBalancesByMonth: Record<string, number>; // key: YYYY-MM
};

export type TabKey = "transactions" | "summary";
