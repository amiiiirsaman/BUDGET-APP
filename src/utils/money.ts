/** Currency formatting helpers. */

const usd = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

/** Formats a number as USD; non-finite values render as $0.00. */
export function formatUSD(value: number): string {
  return usd.format(Number.isFinite(value) ? value : 0);
}
