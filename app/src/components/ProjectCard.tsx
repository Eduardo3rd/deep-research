'use client';

import Link from 'next/link';
import { Badge, StatusDot } from './ui';
import { ProgressBar } from './ProgressBar';

interface ProjectCardProps {
  slug: string;
  name: string;
  domain: string;
  mode: string;
  status: string;
  totalStories: number;
  completedStories: number;
  created_at: string;
}

export function ProjectCard({
  slug,
  name,
  domain,
  mode,
  status,
  totalStories,
  completedStories,
  created_at,
}: ProjectCardProps) {
  return (
    <Link
      href={`/${slug}`}
      className="block bg-bg-surface border border-border rounded-xl p-5 hover:border-accent/50 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary truncate">{name}</h3>
          <p className="text-sm text-text-dim mt-0.5">{domain}</p>
        </div>
        <StatusDot status={status} />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Badge label={mode} />
        <Badge label={status} />
      </div>

      <ProgressBar completed={completedStories} total={totalStories} className="mb-2" />

      <p className="text-xs text-text-dim">
        {new Date(created_at).toLocaleDateString()}
      </p>
    </Link>
  );
}
