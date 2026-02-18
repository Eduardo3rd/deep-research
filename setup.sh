#!/bin/bash
set -e

echo "================================"
echo "  Deep Research — Setup"
echo "================================"
echo ""

# --- Check prerequisites ---
MISSING=0

if ! command -v node &>/dev/null; then
  echo "ERROR: Node.js is not installed. Install Node.js 18+ from https://nodejs.org"
  MISSING=1
else
  NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
  if [ "$NODE_VERSION" -lt 18 ]; then
    echo "ERROR: Node.js $NODE_VERSION found, but 18+ is required"
    MISSING=1
  else
    echo "  Node.js $(node -v)"
  fi
fi

if ! command -v tmux &>/dev/null; then
  echo "ERROR: tmux is not installed."
  echo "  macOS:  brew install tmux"
  echo "  Ubuntu: sudo apt install tmux"
  echo "  Fedora: sudo dnf install tmux"
  MISSING=1
else
  echo "  tmux $(tmux -V)"
fi

if ! command -v claude &>/dev/null; then
  echo "ERROR: Claude Code CLI is not installed."
  echo "  Install: npm install -g @anthropic-ai/claude-code"
  echo "  Then run: claude to authenticate"
  MISSING=1
else
  echo "  claude CLI found"
fi

if [ "$MISSING" -eq 1 ]; then
  echo ""
  echo "Fix the errors above and re-run ./setup.sh"
  exit 1
fi

echo ""

# --- Install dependencies ---
echo "Installing dependencies..."
cd "$(dirname "$0")/app"
npm install --silent
echo "  Dependencies installed"

# --- Create projects directory ---
cd "$(dirname "$0")"
mkdir -p projects
echo "  Projects directory ready"

echo ""
echo "================================"
echo "  Setup complete!"
echo "================================"
echo ""
echo "  Start the app:"
echo ""
echo "    cd app && npm run dev"
echo ""
echo "  Then open http://localhost:3000"
echo ""
