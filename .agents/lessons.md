# Agent Lessons

**Pattern:** Committed to a repo without a `.gitignore` that excludes `.claude/` | **Rule:** Before the first commit on any repo, verify that `.gitignore` exists and explicitly includes `.claude/`. The `.claude/` directory contains hooks, session data, worktree metadata, and potentially sensitive configuration — it must never be committed. If `.gitignore` is missing or incomplete, create/update it before staging anything else.
