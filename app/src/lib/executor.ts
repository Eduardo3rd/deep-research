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

  // Write a runner script to avoid shell escaping issues with tmux
  const prompt = 'Read CLAUDE.md and execute the research workflow. Work through all stories in priority order.';
  const promptB64 = Buffer.from(prompt).toString('base64');
  const scriptPath = path.join(projectDir, 'run.sh');

  const script = `#!/bin/bash
set +e
cd "${projectDir}"
prompt=$(echo "${promptB64}" | base64 -d)
claude -p "$prompt" --dangerously-skip-permissions --output-format text 2>&1 | tee -a "${logFile}"
EC=\${PIPESTATUS[0]}
echo "" >> "${logFile}"
echo "=== Task completed with exit code: $EC ===" >> "${logFile}"
exit $EC
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
      // Session ended — check exit code from log
      const log = readOutputLog(slug, 20);
      const match = log.match(/=== Task completed with exit code: (\d+) ===/);
      const exitCode = match ? parseInt(match[1], 10) : -1;

      if (exitCode === 0) {
        updateProjectStatus(slug, 'completed', {
          completed_at: new Date().toISOString(),
        });
      } else {
        updateProjectStatus(slug, 'failed', {
          completed_at: new Date().toISOString(),
          error_message: `Exit code: ${exitCode}`,
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
