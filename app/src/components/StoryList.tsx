'use client';

import Link from 'next/link';
import { Badge } from './ui';

interface Story {
  id: string;
  title: string;
  file: string;
  phase: string;
  priority: string;
  passes: boolean;
}

export function StoryList({ stories, slug }: { stories: Story[]; slug: string }) {
  // Group by phase
  const phases = new Map<string, Story[]>();
  for (const story of stories) {
    const list = phases.get(story.phase) || [];
    list.push(story);
    phases.set(story.phase, list);
  }

  const phaseLabels: Record<string, string> = {
    research: 'Phase 1: Research',
    'deep-dive': 'Phase 2: Deep Dive',
  };

  return (
    <div className="space-y-6">
      {Array.from(phases.entries()).map(([phase, phaseStories]) => (
        <div key={phase}>
          <h3 className="text-sm font-semibold text-text-dim uppercase tracking-wider mb-3">
            {phaseLabels[phase] || phase}
          </h3>
          <div className="space-y-1">
            {phaseStories.map(story => (
              <StoryRow key={story.id} story={story} slug={slug} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function StoryRow({ story, slug }: { story: Story; slug: string }) {
  const icon = story.passes ? (
    <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ) : (
    <svg className="w-5 h-5 text-text-dim flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="9" />
    </svg>
  );

  const content = (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-bg-elevated transition-colors group">
      {icon}
      <span className="text-xs font-mono text-text-dim w-10">{story.id}</span>
      <span className={`flex-1 text-sm ${story.passes ? 'text-text-primary' : 'text-text-dim'}`}>
        {story.title}
      </span>
      <Badge label={story.priority} />
      {story.passes && (
        <svg className="w-4 h-4 text-text-dim opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      )}
    </div>
  );

  if (story.passes) {
    return (
      <Link href={`/${slug}/${story.id}`}>
        {content}
      </Link>
    );
  }

  return content;
}
