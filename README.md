# Budget App

A small, local-first budget tracker built with React + TypeScript + Vite.

- Spreadsheet-style transactions
- Monthly summary view
- Category management
- Local-only persistence (browser `localStorage`)
- Tip of the Day: a deterministic finance tip that rotates at local midnight

## Getting started

### Prereqs

- Node.js (LTS recommended)

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Then open the URL Vite prints (typically `http://localhost:5173`).

### Production build

```bash
npm run build
npm run preview
```

## Usage

1. Add income/expense transactions (date, amount, category, note).
2. Switch to **Summary** to see totals and a category breakdown for the selected month.
3. Use **Tip of the Day** in the header to view today’s tip.

## Tip of the Day behavior

Tips live in a stable list and selection is deterministic per day:

- The app uses the local ISO date (YYYY-MM-DD) as the selector seed.
- The tip changes at local midnight.

Implementation:
- Tip utilities: `src/utils/tips.ts`
- Modal UI: `src/components/TipOfTheDayModal.tsx`

## Data & privacy

All data is stored locally in your browser via `localStorage`. There is no server and no network sync.

## Tech stack

- React 18
- TypeScript
- Vite
