'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button, Badge, StatusDot, Card } from '@/components/ui';
import { ProgressBar } from '@/components/ProgressBar';
import { StoryList } from '@/components/StoryList';

interface Story {
  id: string;
  title: string;
  file: string;
  phase: string;
  priority: string;
  passes: boolean;
}

interface ProjectDetail {
  slug: string;
  name: string;
  domain: string;
  mode: string;
  status: string;
  ceo: string;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  stories: Story[];
  totalStories: number;
  completedStories: number;
  logTail: string;
}

export default function ProjectDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLog, setShowLog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProject = useCallback(async () => {
    const res = await fetch(`/api/projects/${slug}`);
    if (res.ok) {
      const data = await res.json();
      setProject(data);
    }
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  // Poll while running
  useEffect(() => {
    if (project?.status !== 'running') return;
    const interval = setInterval(fetchProject, 5000);
    return () => clearInterval(interval);
  }, [project?.status, fetchProject]);

  const handleStart = async () => {
    setActionLoading(true);
    await fetch(`/api/projects/${slug}/start`, { method: 'POST' });
    await fetchProject();
    setActionLoading(false);
  };

  const handleStop = async () => {
    setActionLoading(true);
    await fetch(`/api/projects/${slug}/stop`, { method: 'POST' });
    await fetchProject();
    setActionLoading(false);
  };

  if (loading) {
    return <div className="p-8 text-text-dim">Loading...</div>;
  }

  if (!project) {
    return <div className="p-8 text-error">Project not found</div>;
  }

  const elapsed = project.started_at
    ? formatElapsed(new Date(project.started_at), project.completed_at ? new Date(project.completed_at) : new Date())
    : null;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-dim mb-6">
        <Link href="/" className="hover:text-text-primary transition-colors">Dashboard</Link>
        <span>/</span>
        <span className="text-text-primary">{project.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <StatusDot status={project.status} />
          </div>
          <div className="flex items-center gap-4 text-sm text-text-dim">
            <span>{project.domain}</span>
            <Badge label={project.mode} />
            <Badge label={project.status} />
            {elapsed && <span>{elapsed}</span>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(project.status === 'idle' || project.status === 'failed' || project.status === 'completed') && (
            <Button onClick={handleStart} disabled={actionLoading}>
              {actionLoading ? 'Starting...' : project.status === 'idle' ? 'Start Research' : 'Restart'}
            </Button>
          )}
          {project.status === 'running' && (
            <Button variant="danger" onClick={handleStop} disabled={actionLoading}>
              {actionLoading ? 'Stopping...' : 'Stop'}
            </Button>
          )}
        </div>
      </div>

      {/* Progress */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm text-text-dim">
            {project.completedStories} of {project.totalStories} stories
          </span>
        </div>
        <ProgressBar completed={project.completedStories} total={project.totalStories} />
      </Card>

      {/* Error message */}
      {project.error_message && (
        <div className="bg-error/10 border border-error/30 rounded-lg p-4 mb-6">
          <p className="text-error text-sm">{project.error_message}</p>
        </div>
      )}

      {/* Stories */}
      <Card className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Stories</h2>
        <StoryList stories={project.stories} slug={slug} />
      </Card>

      {/* Raw Log */}
      <div className="mb-6">
        <button
          onClick={() => setShowLog(!showLog)}
          className="flex items-center gap-2 text-sm text-text-dim hover:text-text-primary transition-colors mb-2"
        >
          <svg
            className={`w-4 h-4 transition-transform ${showLog ? 'rotate-90' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          Raw Log
        </button>
        {showLog && (
          <pre className="bg-bg-elevated border border-border rounded-lg p-4 text-xs text-text-dim overflow-x-auto max-h-96 overflow-y-auto font-mono whitespace-pre-wrap">
            {project.logTail || '(no output yet)'}
          </pre>
        )}
      </div>
    </div>
  );
}

function formatElapsed(start: Date, end: Date): string {
  const ms = end.getTime() - start.getTime();
  const mins = Math.floor(ms / 60000);
  const hours = Math.floor(mins / 60);
  if (hours > 0) return `${hours}h ${mins % 60}m`;
  if (mins > 0) return `${mins}m`;
  return '<1m';
}
