import fs from 'fs';
import path from 'path';

const PROJECTS_DIR = path.join(process.cwd(), '..', 'projects');
const PROMPTS_DIR = path.join(process.cwd(), '..', 'prompts');

export type ResearchMode = 'research' | 'deep-dive';

interface ScaffoldOptions {
  name: string;
  slug: string;
  domain: string;
  mode: ResearchMode;
  ceo?: string;
}

const MODE_HEADERS: Record<ResearchMode, string> = {
  research: `# {{COMPANY_NAME}} — Comprehensive Research Dossier

You are a senior research analyst building a comprehensive, institutional-grade research dossier on **{{COMPANY_NAME}}**. Your research must be thorough enough to support investment decisions, strategic partnerships, or sales planning.

---

`,
  'deep-dive': `# {{COMPANY_NAME}} — Institutional-Grade Due Diligence

You are a senior research analyst at a top-tier investment firm conducting comprehensive due diligence on **{{COMPANY_NAME}}**. Your research must meet the standards expected by:

- A growth equity fund considering a $50-100M investment
- A strategic acquirer preparing a $500M+ acquisition offer
- A public market analyst initiating coverage with a price target
- A board member evaluating competitive positioning

**Be relentlessly thorough, ruthlessly skeptical, and obsessively sourced.**

---

`,
};

// Base research stories (always included)
const RESEARCH_STORIES = [
  { id: 'R01', title: 'Company Overview', file: '01-company-overview.md', phase: 'research', priority: 'P0' },
  { id: 'R02', title: 'Leadership & Organization', file: '02-leadership-org.md', phase: 'research', priority: 'P0' },
  { id: 'R03', title: 'Products & Technology', file: '03-products-technology.md', phase: 'research', priority: 'P0' },
  { id: 'R04', title: 'Market Landscape', file: '04-market-landscape.md', phase: 'research', priority: 'P0' },
  { id: 'R05', title: 'Competitive Landscape', file: '05-competitive-landscape.md', phase: 'research', priority: 'P0' },
  { id: 'R06', title: 'Business Model', file: '06-business-model.md', phase: 'research', priority: 'P0' },
  { id: 'R07', title: 'Financial Analysis', file: '07-financial-analysis.md', phase: 'research', priority: 'P1' },
  { id: 'R08', title: 'Customers & Segments', file: '08-customers-segments.md', phase: 'research', priority: 'P1' },
  { id: 'R09', title: 'Go-to-Market', file: '09-go-to-market.md', phase: 'research', priority: 'P1' },
  { id: 'R10', title: 'News & Sentiment', file: '10-news-sentiment.md', phase: 'research', priority: 'P1' },
  { id: 'R11', title: 'Talent & Culture', file: '11-talent-culture.md', phase: 'research', priority: 'P2' },
  { id: 'R12', title: 'Risks & Opportunities', file: '12-risks-opportunities.md', phase: 'research', priority: 'P2' },
];

const DEEP_DIVE_STORIES = [
  { id: 'DD01', title: 'Moat Analysis', file: 'dd-01-moat-analysis.md', phase: 'deep-dive', priority: 'P1' },
  { id: 'DD02', title: 'Comparable Analysis', file: 'dd-02-comparable-analysis.md', phase: 'deep-dive', priority: 'P1' },
  { id: 'DD03', title: 'Scenario Modeling', file: 'dd-03-scenario-modeling.md', phase: 'deep-dive', priority: 'P1' },
  { id: 'DD04', title: 'ESG & Governance', file: 'dd-04-esg-governance.md', phase: 'deep-dive', priority: 'P2' },
  { id: 'DD05', title: 'Diligence Questions', file: 'dd-05-diligence-questions.md', phase: 'deep-dive', priority: 'FINAL' },
  { id: 'DD00', title: 'Executive Summary', file: 'dd-00-executive-summary.md', phase: 'deep-dive', priority: 'FINAL' },
];

function getStoriesForMode(mode: ResearchMode) {
  const stories = [...RESEARCH_STORIES];
  if (mode === 'deep-dive') {
    stories.push(...DEEP_DIVE_STORIES);
  }
  return stories.map(s => ({ ...s, passes: false }));
}

function readPrompt(filename: string): string {
  return fs.readFileSync(path.join(PROMPTS_DIR, filename), 'utf-8');
}

function replacePlaceholders(text: string, opts: ScaffoldOptions): string {
  const ceo = opts.ceo || '[CEO not specified]';
  return text
    .replace(/\{\{COMPANY_NAME\}\}/g, opts.name)
    .replace(/\{\{COMPANY_SLUG\}\}/g, opts.slug)
    .replace(/\{\{COMPANY_DOMAIN\}\}/g, opts.domain)
    .replace(/\{\{CEO_NAME\}\}/g, ceo);
}

export function scaffoldProject(opts: ScaffoldOptions): { projectDir: string; storyCount: number } {
  const projectDir = path.join(PROJECTS_DIR, opts.slug);
  fs.mkdirSync(projectDir, { recursive: true });

  // --- Assemble CLAUDE.md ---
  let claude = MODE_HEADERS[opts.mode];

  // Shared methodology
  claude += readPrompt('00-research-methodology.md') + '\n\n---\n\n';

  // Phase 1 research modules
  claude += readPrompt('01-phase1-research.md') + '\n\n---\n\n';

  // Deep dive lens
  if (opts.mode === 'deep-dive') {
    claude += readPrompt('02-lens-deep-dive.md') + '\n\n---\n\n';
  }

  // Workflow
  claude += readPrompt('04-workflow-ralph.md');

  // Replace placeholders
  claude = replacePlaceholders(claude, opts);

  fs.writeFileSync(path.join(projectDir, 'CLAUDE.md'), claude);

  // --- Generate prd.json ---
  const stories = getStoriesForMode(opts.mode);
  const prd = {
    company: opts.name,
    slug: opts.slug,
    domain: opts.domain,
    ceo: opts.ceo || '[CEO not specified]',
    mode: opts.mode,
    created: new Date().toISOString().split('T')[0],
    stories,
  };

  fs.writeFileSync(path.join(projectDir, 'prd.json'), JSON.stringify(prd, null, 2));

  // --- Create progress.txt ---
  const ceo = opts.ceo || '[CEO not specified]';
  let progress = `# ${opts.name} — Research Progress Log\n\n`;
  progress += `**Initialized:** ${new Date().toISOString()}\n`;
  progress += `**Company:** ${opts.name}\n`;
  progress += `**Domain:** ${opts.domain}\n`;
  progress += `**Mode:** ${opts.mode}\n`;

  if (ceo !== '[CEO not specified]') {
    progress += `**CEO:** ${ceo}\n`;
  }

  progress += `\n---\n\n## Research Patterns\n\n(Reusable patterns discovered during research — add here for future iterations)\n\n---\n\n## Progress Log\n\n(Entries appended below as research proceeds)\n\n---\n`;

  fs.writeFileSync(path.join(projectDir, 'progress.txt'), progress);

  return { projectDir, storyCount: stories.length };
}

export function getProjectDir(slug: string): string {
  return path.join(PROJECTS_DIR, slug);
}

export interface PrdJson {
  company: string;
  slug: string;
  domain: string;
  ceo: string;
  mode: string;
  created: string;
  stories: Array<{
    id: string;
    title: string;
    file: string;
    phase: string;
    priority: string;
    passes: boolean;
  }>;
}

export function readPrd(slug: string): PrdJson | null {
  const prdPath = path.join(PROJECTS_DIR, slug, 'prd.json');
  if (!fs.existsSync(prdPath)) return null;
  return JSON.parse(fs.readFileSync(prdPath, 'utf-8'));
}

export function readStoryContent(slug: string, storyFile: string): string | null {
  const filePath = path.join(PROJECTS_DIR, slug, storyFile);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf-8');
}

export function readOutputLog(slug: string, lines?: number): string {
  const logPath = path.join(PROJECTS_DIR, slug, 'output.log');
  if (!fs.existsSync(logPath)) return '';
  const content = fs.readFileSync(logPath, 'utf-8');
  if (lines) {
    const allLines = content.split('\n');
    return allLines.slice(-lines).join('\n');
  }
  return content;
}
