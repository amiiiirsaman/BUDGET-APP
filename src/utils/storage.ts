/**
 * Local-only persistence helpers.
 *
 * The app stores all state in `localStorage` and never calls a backend.
 */
import { AppState } from "../types";
import { currentMonthKey } from "./dates";

const KEY = "budget-app:v1";

/**
 * Generates an ID for a new entity (transactions, etc.).
 *
 * Uses `crypto.randomUUID()` when available, with a timestamp+random fallback.
 */
export function newId(): string {
  // `crypto` is not guaranteed to exist in every environment; access via globalThis
  // to avoid a ReferenceError if it is missing.
  const cryptoObj = (globalThis as unknown as { crypto?: Crypto }).crypto;
  return typeof cryptoObj?.randomUUID === "function"
    ? cryptoObj.randomUUID()
    : `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

/** Creates a fresh in-memory state for first run or corrupted storage. */
export function defaultState(): AppState {
  const month = currentMonthKey();
  return {
    version: 1,
    transactions: [],
    categories: {
      incomeCategories: ["Paycheck", "Interest", "Other"],
      expenseCategories: ["Rent", "Groceries", "Utilities", "Transport", "Fun", "Other"],
    },
    selectedMonth: month,
    startingBalancesByMonth: { [month]: 0 },
  };
}

/**
 * Loads state from `localStorage`.
 * Falls back to `defaultState()` on missing/invalid data.
 */
export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed || parsed.version !== 1) return defaultState();
    const base = defaultState();
    return {
      ...base,
      ...parsed,
      categories: {
        ...base.categories,
        ...(parsed.categories ?? {}),
      },
      startingBalancesByMonth: parsed.startingBalancesByMonth ?? base.startingBalancesByMonth,
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
      selectedMonth: typeof parsed.selectedMonth === "string" ? parsed.selectedMonth : base.selectedMonth,
    };
  } catch {
    return defaultState();
  }
}

/** Saves state to `localStorage`. Errors are ignored (quota, private mode, etc.). */
export function saveState(state: AppState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Ignore persistence failures; the UI should continue functioning.
  }
}
