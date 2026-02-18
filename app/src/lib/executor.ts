import { execSync } from 'child_process';
import { updateProjectStatus, getProject, listProjects } from './db';
import { getProjectDir, readOutputLog } from './scaffold';
import path from 'path';
import fs from 'fs';

const SESSION_PREFIX = 'research-';

function sessionName(slug: string): string {
  return `${SESSION_PREFIX}${slug}`;
}

function sessionExists(name: string): boolean {
  try {
    execSync(`tmux has-session -t ${name} 2>/dev/null`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

export function startResearch(slug: string): { success: boolean; error?: string } {
  const project = getProject(slug);
  if (!project) return { success: false, error: 'Project not found' };
  if (project.status === 'running') return { success: false, error: 'Already running' };

  const projectDir = getProjectDir(slug);
  const logFile = path.join(projectDir, 'output.log');
  const session = sessionName(slug);

  if (sessionExists(session)) {
    return { success: false, error: 'tmux session already exists' };
  }

  // Ensure output.log exists
  if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, '');
  }

  // Write a Ralph-style runner script: loop until all stories pass or max retries hit
  const prompt = 'Read CLAUDE.md and execute the research workflow. Work through all stories in priority order.';
  const promptB64 = Buffer.from(prompt).toString('base64');
  const prdFile = path.join(projectDir, 'prd.json');
  const scriptPath = path.join(projectDir, 'run.sh');
  const maxIterations = 10;

  const script = `#!/bin/bash
set +e
cd "${projectDir}"

PROMPT=$(echo "${promptB64}" | base64 -d)
PRD_FILE="${prdFile}"
LOG_FILE="${logFile}"
MAX_ITERATIONS=${maxIterations}
ITERATION=0

while true; do
  ITERATION=$((ITERATION + 1))

  # Check if all stories pass
  REMAINING=$(grep -c '"passes": false' "$PRD_FILE" 2>/dev/null || echo "0")
  TOTAL=$(grep -c '"passes"' "$PRD_FILE" 2>/dev/null || echo "0")
  DONE=$((TOTAL - REMAINING))

  if [ "$REMAINING" -eq 0 ] && [ "$TOTAL" -gt 0 ]; then
    echo "" >> "$LOG_FILE"
    echo "=== ALL STORIES COMPLETE ($DONE/$TOTAL) ===" >> "$LOG_FILE"
    echo "=== Task completed with exit code: 0 ===" >> "$LOG_FILE"
    exit 0
  fi

  if [ "$ITERATION" -gt "$MAX_ITERATIONS" ]; then
    echo "" >> "$LOG_FILE"
    echo "=== MAX ITERATIONS REACHED ($MAX_ITERATIONS). $DONE/$TOTAL stories complete. ===" >> "$LOG_FILE"
    echo "=== Task completed with exit code: 1 ===" >> "$LOG_FILE"
    exit 1
  fi

  echo "" >> "$LOG_FILE"
  echo "=== RALPH LOOP: iteration $ITERATION/$MAX_ITERATIONS — $DONE/$TOTAL stories complete, $REMAINING remaining ===" >> "$LOG_FILE"
  echo "" >> "$LOG_FILE"

  claude -p "$PROMPT" --dangerously-skip-permissions --output-format text 2>&1 | tee -a "$LOG_FILE"

  # Brief pause between iterations
  sleep 5
done
`;

  fs.writeFileSync(scriptPath, script, { mode: 0o755 });

  try {
    execSync(`tmux new-session -d -s "${session}" "bash ${scriptPath}"`);

    updateProjectStatus(slug, 'running', {
      tmux_session: session,
      started_at: new Date().toISOString(),
    });

    // Start background monitoring
    startMonitoring(slug, session);

    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

export function stopResearch(slug: string): { success: boolean; error?: string } {
  const project = getProject(slug);
  if (!project) return { success: false, error: 'Project not found' };

  const session = sessionName(slug);

  try {
    execSync(`tmux kill-session -t "${session}" 2>/dev/null`, { stdio: 'ignore' });
  } catch {
    // Session may already be gone
  }

  updateProjectStatus(slug, 'idle', {
    tmux_session: null,
    completed_at: new Date().toISOString(),
  });

  return { success: true };
}

function startMonitoring(slug: string, session: string) {
  const check = () => {
    if (!sessionExists(session)) {
      // Session ended — check outcome from log
      const log = readOutputLog(slug, 30);

      if (log.includes('ALL STORIES COMPLETE')) {
        updateProjectStatus(slug, 'completed', {
          completed_at: new Date().toISOString(),
        });
      } else if (log.includes('MAX ITERATIONS REACHED')) {
        // Partial completion — mark failed with context
        const match = log.match(/(\d+)\/(\d+) stories complete/);
        const detail = match ? `${match[1]}/${match[2]} stories completed (max retries reached)` : 'Max retries reached';
        updateProjectStatus(slug, 'failed', {
          completed_at: new Date().toISOString(),
          error_message: detail,
        });
      } else {
        // Unexpected exit
        const match = log.match(/=== Task completed with exit code: (\d+) ===/);
        const exitCode = match ? parseInt(match[1], 10) : -1;
        updateProjectStatus(slug, 'failed', {
          completed_at: new Date().toISOString(),
          error_message: `Unexpected exit (code: ${exitCode})`,
        });
      }
      return; // Stop monitoring
    }

    // Still running — check again in 10 seconds
    setTimeout(check, 10000);
  };

  setTimeout(check, 10000);
}

export function cleanupStaleSessions() {
  const projects = listProjects();
  for (const project of projects) {
    if (project.status === 'running' && project.tmux_session) {
      if (!sessionExists(project.tmux_session)) {
        updateProjectStatus(project.slug, 'failed', {
          completed_at: new Date().toISOString(),
          error_message: 'Session lost (server restarted?)',
        });
      }
    }
  }
}
