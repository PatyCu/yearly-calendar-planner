# Yearly Calendar Planner — CLAUDE.md

## What this is

A webapp for two people (Paty and her husband) to plan days off across a calendar year.
Replacing a Google Sheet they currently use.

## Features (reference)

- Bank holidays for Barcelona marked per year
- Days off with certainty levels: tentative / planned / confirmed
- Half-days off supported
- Each person has their own PTO quota (configurable per year — it changes)
- Remote work days (Paty only: 9/year), shown in a distinct color
- Both people's calendars visible together

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **React 19**
- **Tailwind CSS v4** for styling
- **pnpm** as package manager

## Architecture principles

- Keep it as simple as possible
- No backend unless truly necessary
- Data storage preference: filesystem (GitHub repo or Google Drive) over a database
- Work iteratively — test manually at each step before moving on

## Development workflow

- Run dev server: `pnpm dev`
- Build: `pnpm build`
- Lint: `pnpm lint`

## Project structure

```
src/
  app/          # Next.js App Router pages and layouts
  components/   # Reusable React components
  lib/          # Utilities and data helpers
```

## Conventions

- Prefer editing existing files over creating new ones
- Don't add features beyond what's asked
- Don't add error handling for impossible scenarios
- Tailwind for all styling — no CSS modules or styled-components
- Components go in `src/components/`, one file per component

## Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (+3 steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately — don't keep pushing unless I explicitly tell you to iterate until fixed
- Write specs upfront for architectural or multi-file changes
- Use plan mode for verification steps, not just building

### 2. Self-improvement Loop
- At the start of every session: read `.agents/lessons.md` if it exists
- After ANY correction from the user: update `.agents/lessons.md` (create if missing)
- Entry format: `**Pattern:** <what went wrong> | **Rule:** <what to do instead>`
- Write rules that prevent the same mistake from recurring

### 3. Verification before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness
- Only after the task is demonstrably done and verified, update any relevant documentation

#### 4. PR Reviews

- When asked to address comments in a PR after a 3rd party's review (human on agent based), create a plan for yourself where each comment is a separate task
- Do not jump to the next comment / task until the current task can be considered done (verified, documentation updated, one commit per comment)
- Example: 4 files get updated when addressing one comment → 1 commit with all 4 with a one-liner as a commit message

## Task Management

- **In-session tasks:** Use the built-in TodoWrite tool
- **Multi-session / complex tasks:** Write a plan to `.agents/prompts/to-do.md` with checkable items; add a review section when done
- **Capture lessons:** Update `.agents/lessons.md` after any correction
