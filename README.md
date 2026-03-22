# Yearly Calendar Planner

A personal vacation planning webapp for two people, replacing a Google Sheet. Shows a full-year calendar grid per person with Barcelona public holidays, PTO tracking, and remote work days.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4**
- **pnpm**

## Getting started

```bash
pnpm install
pnpm dev
```

## Project structure

```
src/
  app/            # Next.js pages and layout
  components/
    MonthGrid.tsx       # Single month grid with day interaction
    PersonCalendar.tsx  # 12-month view + stats for one person
  lib/
    types.ts      # All shared TypeScript types
    data.ts       # Fetch helpers, stat computation, localStorage utils

public/data/
  holidays-YYYY.json          # Barcelona public holidays for the year
  config-YYYY.json            # Per-person quotas and remote config
  calendar-YYYY-{person}.json # Day entries (written by the user, persisted to localStorage)
```

## Data model

**`holidays-YYYY.json`** — array of ISO date strings.

**`config-YYYY.json`**
```json
{
  "year": 2026,
  "people": [
    { "id": "paty", "name": "Paty", "ptoQuota": 28.5, "remote": { "kind": "days", "quota": 9 } },
    { "id": "oriol", "name": "Oriol", "ptoQuota": 23, "remote": { "kind": "weeks", "weekStarts": ["2026-01-05"] } }
  ]
}
```

**`calendar-YYYY-{person}.json`**
```json
{
  "year": 2026,
  "personId": "paty",
  "days": {
    "2026-07-14": { "type": "vacation-confirmed" },
    "2026-07-15": { "type": "vacation-confirmed", "half": true }
  }
}
```

`type` is one of `vacation-possible` · `vacation-confirmed` · `remote`.
`half: true` counts the day as 0.5 PTO instead of 1.

## Interactions

| Action | Effect |
|---|---|
| Click a weekday | Cycles: empty → possible (orange) → confirmed (red) → remote (cyan, if applicable) → empty |
| Shift+click a vacation day | Toggles half-day (fades the cell, counts 0.5) |
| Click a holiday or weekend | No-op |

State is persisted to `localStorage` on every change and loaded on startup (falls back to the JSON file).

## Adding a new year

1. Add `public/data/holidays-YYYY.json` with that year's BCN public holidays.
2. Add `public/data/config-YYYY.json` with updated quotas and Oriol's remote weeks.
3. Add empty `public/data/calendar-YYYY-paty.json` and `calendar-YYYY-oriol.json`.
4. Update `const YEAR = YYYY` in `src/app/page.tsx`.
