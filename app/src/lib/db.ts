import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), '..', 'research.db');

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
    _db.pragma('foreign_keys = ON');
    initDb(_db);
  }
  return _db;
}

function initDb(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      slug TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      domain TEXT NOT NULL,
      mode TEXT NOT NULL,
      ceo TEXT DEFAULT '',
      status TEXT DEFAULT 'idle',
      created_at TEXT DEFAULT (datetime('now')),
      started_at TEXT,
      completed_at TEXT,
      tmux_session TEXT,
      error_message TEXT
    );
  `);
}

export interface Project {
  slug: string;
  name: string;
  domain: string;
  mode: string;
  ceo: string;
  status: string;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  tmux_session: string | null;
  error_message: string | null;
}

export function listProjects(): Project[] {
  const db = getDb();
  return db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all() as Project[];
}

export function getProject(slug: string): Project | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM projects WHERE slug = ?').get(slug) as Project | undefined;
}

export function createProject(project: {
  slug: string;
  name: string;
  domain: string;
  mode: string;
  ceo?: string;
}): Project {
  const db = getDb();
  db.prepare(
    'INSERT INTO projects (slug, name, domain, mode, ceo) VALUES (?, ?, ?, ?, ?)'
  ).run(project.slug, project.name, project.domain, project.mode, project.ceo || '');
  return getProject(project.slug)!;
}

export function updateProjectStatus(
  slug: string,
  status: string,
  extra?: { tmux_session?: string | null; started_at?: string; completed_at?: string; error_message?: string }
) {
  const db = getDb();
  const fields = ['status = ?'];
  const values: (string | null)[] = [status];

  if (extra?.tmux_session !== undefined) {
    fields.push('tmux_session = ?');
    values.push(extra.tmux_session);
  }
  if (extra?.started_at !== undefined) {
    fields.push('started_at = ?');
    values.push(extra.started_at);
  }
  if (extra?.completed_at !== undefined) {
    fields.push('completed_at = ?');
    values.push(extra.completed_at);
  }
  if (extra?.error_message !== undefined) {
    fields.push('error_message = ?');
    values.push(extra.error_message);
  }

  values.push(slug);
  db.prepare(`UPDATE projects SET ${fields.join(', ')} WHERE slug = ?`).run(...values);
}

export function projectExists(slug: string): boolean {
  const db = getDb();
  const row = db.prepare('SELECT 1 FROM projects WHERE slug = ?').get(slug);
  return !!row;
}
