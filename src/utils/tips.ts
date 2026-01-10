/** Tip-of-the-day utilities.
 *
 * Tips are selected deterministically per local day using `todayISODate()`.
 */

import { todayISODate } from "./dates";

export type FinanceTip = {
  id: string;
  text: string;
  links?: Array<{ label: string; href: string }>;
};

/** Stable, curated tips list. Keep tips short (1–2 sentences). */
export const FINANCE_TIPS: FinanceTip[] = [
  {
    id: "pay-yourself-first",
    text: "Automate a small transfer to savings on payday—even $10 builds the habit.",
  },
  {
    id: "track-subscriptions",
    text: "Review subscriptions monthly; cancel anything you haven’t used in the last 30 days.",
  },
  {
    id: "three-bucket-budget",
    text: "Try a simple split: essentials, goals (savings/debt), and fun—then adjust after one month.",
  },
  {
    id: "sinking-funds",
    text: "Use sinking funds for irregular bills (car repairs, gifts) so surprises don’t hit your monthly budget.",
  },
  {
    id: "emergency-fund",
    text: "Aim for a starter emergency fund of $500–$1,000 before optimizing investments.",
  },
  {
    id: "high-interest-first",
    text: "If you’re paying down debt, prioritize the highest-interest balance first (avalanche method).",
  },
  {
    id: "increase-savings-rate",
    text: "When income rises, increase your savings rate before your lifestyle expands.",
  },
  {
    id: "needs-wants",
    text: "When deciding on a purchase, ask: is it a need, a want, or a future goal? Labeling helps reduce impulse buys.",
  },
  {
    id: "check-cashflow",
    text: "Compare this month’s income vs expenses early; small corrections are easier than end-of-month surprises.",
  },
  {
    id: "buffer-category",
    text: "Add a small “buffer” category. It keeps minor overspends from breaking your whole plan.",
  },
];

function stableStringHash(input: string): number {
  // Simple deterministic hash (not crypto). Suitable for stable tip selection.
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function tipForISODate(isoDate: string): FinanceTip {
  if (!FINANCE_TIPS.length) {
    return { id: "empty", text: "Track your spending for a week—awareness is the first win." };
  }
  const idx = stableStringHash(isoDate) % FINANCE_TIPS.length;
  return FINANCE_TIPS[idx];
}

export function tipOfTheDay(): { isoDate: string; tip: FinanceTip } {
  const isoDate = todayISODate();
  return { isoDate, tip: tipForISODate(isoDate) };
}

// Optional: separate key (not `budget-app:v1`) for "show once per day" UX later.
export const TIP_OF_THE_DAY_LAST_SHOWN_KEY = "budget-app:tip-of-day:last-shown";
