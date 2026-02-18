# Deep Research — Claude Code Instructions

This is a Next.js web app that orchestrates Claude Code to autonomously research companies. Read `README.md` for full details.

## Quick Setup

Run the setup script to install dependencies and verify prerequisites:

```bash
./setup.sh
```

Then start the app:

```bash
cd app && npm run dev
```

The app will be available at `http://localhost:3000`.

## Project Structure

- `app/` — Next.js 15 application (TypeScript, Tailwind CSS 4, SQLite)
- `prompts/` — Research prompt modules (methodology, report specs, workflow)
- `projects/` — Research output directory (created by setup, one subdirectory per company)

## Key Source Files

- `app/src/lib/db.ts` — SQLite schema and queries (projects table)
- `app/src/lib/scaffold.ts` — Project scaffolding (generates CLAUDE.md, prd.json, progress.txt per company)
- `app/src/lib/executor.ts` — tmux execution engine (launches Claude Code in background sessions)
- `app/src/app/api/` — REST API routes
- `app/src/app/` — React pages (dashboard, new project form, project detail, story viewer)
- `prompts/` — Modular prompt templates assembled into each project's CLAUDE.md

## How It Works

1. User creates a project via web UI (company name, domain, research mode)
2. `scaffold.ts` generates a project directory with CLAUDE.md (agent instructions) and prd.json (story backlog)
3. `executor.ts` launches Claude Code in a tmux session pointed at the project directory
4. Claude Code reads the project's CLAUDE.md and works through stories autonomously
5. The web UI polls prd.json for completion status and renders finished reports

## Modes

- **research** — 12 stories: comprehensive company dossier
- **deep-dive** — 18 stories: research + investment due diligence (requires CEO name)

## Design Decisions

- Story completion status lives in `projects/{slug}/prd.json` (not the database) — single source of truth
- The database only tracks project-level metadata and execution state
- tmux sessions persist independently of the web server
- Prompts use `{{PLACEHOLDER}}` syntax replaced at scaffold time
- Runner scripts are written to disk (`run.sh`) to avoid shell escaping issues with tmux
