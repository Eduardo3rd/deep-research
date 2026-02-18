# Deep Research

Autonomous company research powered by [Claude Code](https://docs.anthropic.com/en/docs/claude-code). A web app that orchestrates Claude Code to produce institutional-grade research dossiers on any company.

You provide a company name and domain. Claude Code does the rest — working through a structured research workflow to produce 12-18 detailed markdown reports covering everything from financials to competitive landscape to leadership analysis.

## What It Does

**Research mode** (12 reports): Comprehensive company dossier covering overview, leadership, products, market, competition, business model, financials, customers, GTM, news, talent, and risks.

**Deep Dive mode** (18 reports): Everything in Research, plus investment due diligence — moat analysis, comparable analysis, scenario modeling, ESG review, diligence questions, and an executive summary.

Each report is sourced, cited, and structured with confidence levels. Research follows a tiered source hierarchy (SEC filings → financial press → triangulation sources) and requires 3+ independent sources for key metrics.

## How It Works

1. You create a project via the web UI (company name, domain, mode)
2. The app scaffolds a research workspace with a `CLAUDE.md` (agent instructions) and `prd.json` (story backlog)
3. Claude Code launches in a tmux session and works through the stories autonomously
4. The web UI polls for progress and renders completed reports as you go
5. When done, you have a full research package in markdown

The research engine uses a priority system (P0 → P1 → P2 → FINAL) so foundational research completes before synthesis and summary stories begin.

## Prerequisites

- **Node.js** 18+
- **tmux**
- **Claude Code** CLI installed and authenticated (`claude` command available in PATH)

## Setup

```bash
git clone <this-repo> deep-research
cd deep-research/app
npm install
```

## Running

```bash
# Development
cd app
npm run dev

# Production
cd app
npm run build
npm start
```

The app runs on port **3000** by default. Set `PORT` env var to change it:

```bash
PORT=8080 npm run dev
```

## Usage

1. Open `http://localhost:3000` in your browser
2. Click **New Research**
3. Enter the company name, slug, domain, and pick a mode
4. Click **Create & Start** — Claude Code begins researching immediately
5. Watch progress on the project page (auto-refreshes every 5 seconds)
6. Click any completed story to read the full report

## Project Structure

```
deep-research/
├── prompts/                    # Research prompt modules
│   ├── 00-research-methodology.md   # Source hierarchy, citation rules
│   ├── 01-phase1-research.md        # 12 research report specs
│   ├── 02-lens-deep-dive.md         # 6 due diligence report specs
│   └── 04-workflow-ralph.md         # Execution workflow
├── projects/                   # Research output (one dir per company)
│   └── {slug}/
│       ├── CLAUDE.md           # Generated agent instructions
│       ├── prd.json            # Story backlog with completion status
│       ├── progress.txt        # Running log of discoveries
│       ├── output.log          # Raw Claude Code output
│       └── *.md                # Research reports
├── app/                        # Next.js web application
│   └── src/
│       ├── lib/
│       │   ├── db.ts           # SQLite (project metadata)
│       │   ├── scaffold.ts     # Project scaffolding
│       │   └── executor.ts     # tmux execution engine
│       ├── components/         # React components
│       └── app/                # Pages + API routes
├── .env.example
└── README.md
```

## Customizing Prompts

The research workflow is defined by markdown prompt files in `prompts/`. You can edit these to change:

- **What gets researched** — modify `01-phase1-research.md` to add/remove report modules
- **Research standards** — modify `00-research-methodology.md` to change source requirements, citation format
- **Due diligence focus** — modify `02-lens-deep-dive.md` to adjust the investment analysis modules
- **Execution behavior** — modify `04-workflow-ralph.md` to change how Claude Code works through stories

After editing prompts, new projects will use the updated versions. Existing projects are unaffected (they have their own copy of CLAUDE.md).

## Architecture

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS — dark themed web UI
- **SQLite** via better-sqlite3 — tracks project metadata and execution state
- **tmux** — runs Claude Code in detached sessions so research continues even if you close the browser
- **Polling** — the frontend polls the API every 5 seconds for progress (reads `prd.json` from disk each time)
- **No API key needed** — runs Claude Code CLI directly, using your existing authentication

## License

MIT
