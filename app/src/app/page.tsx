'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ProjectCard } from '@/components/ProjectCard';
import { Button } from '@/components/ui';

interface ProjectSummary {
  slug: string;
  name: string;
  domain: string;
  mode: string;
  status: string;
  created_at: string;
  totalStories: number;
  completedStories: number;
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  const fetchProjects = useCallback(async () => {
    const res = await fetch('/api/projects');
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProjects();
    // Auto-refresh every 10s if any project is running
    const interval = setInterval(() => {
      fetchProjects();
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchProjects]);

  const filtered = filter === 'all' ? projects : projects.filter(p => p.status === filter);

  const counts = {
    all: projects.length,
    running: projects.filter(p => p.status === 'running').length,
    completed: projects.filter(p => p.status === 'completed').length,
    idle: projects.filter(p => p.status === 'idle').length,
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Research Dashboard</h1>
          <p className="text-text-dim mt-1">{projects.length} projects</p>
        </div>
        <Link href="/new">
          <Button>New Research</Button>
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-6 bg-bg-surface rounded-lg p-1 w-fit">
        {(['all', 'running', 'completed', 'idle'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              filter === f
                ? 'bg-bg-elevated text-text-primary'
                : 'text-text-dim hover:text-text-primary'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="ml-1.5 text-xs opacity-60">{counts[f]}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-text-dim text-center py-20">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-text-dim mb-4">No projects found</p>
          <Link href="/new">
            <Button>Create your first research project</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(project => (
            <ProjectCard key={project.slug} {...project} />
          ))}
        </div>
      )}
    </div>
  );
}
