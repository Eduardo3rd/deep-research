'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button, Badge } from '@/components/ui';
import { MarkdownViewer, extractHeadings } from '@/components/MarkdownViewer';

interface StoryData {
  story: {
    id: string;
    title: string;
    file: string;
    phase: string;
    priority: string;
    passes: boolean;
  };
  content: string | null;
  prev: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
}

export default function StoryViewerPage() {
  const params = useParams<{ slug: string; storyId: string }>();
  const { slug, storyId } = params;

  const [data, setData] = useState<StoryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch_story() {
      const res = await fetch(`/api/projects/${slug}/stories/${storyId}`);
      if (res.ok) {
        setData(await res.json());
      }
      setLoading(false);
    }
    fetch_story();
  }, [slug, storyId]);

  const headings = useMemo(() => {
    if (!data?.content) return [];
    return extractHeadings(data.content);
  }, [data?.content]);

  if (loading) return <div className="p-8 text-text-dim">Loading...</div>;
  if (!data) return <div className="p-8 text-error">Story not found</div>;

  return (
    <div className="flex h-full">
      {/* TOC Sidebar */}
      {headings.length > 0 && (
        <aside className="w-64 flex-shrink-0 border-r border-border p-4 overflow-y-auto hidden lg:block">
          <h3 className="text-xs font-semibold text-text-dim uppercase tracking-wider mb-3">
            Contents
          </h3>
          <nav className="space-y-1">
            {headings.map((h, i) => (
              <a
                key={i}
                href={`#${h.id}`}
                className="block text-sm text-text-dim hover:text-text-primary transition-colors truncate"
                style={{ paddingLeft: `${(h.level - 1) * 0.75}rem` }}
              >
                {h.text}
              </a>
            ))}
          </nav>
        </aside>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-8 max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-text-dim mb-6">
          <Link href="/" className="hover:text-text-primary transition-colors">Dashboard</Link>
          <span>/</span>
          <Link href={`/${slug}`} className="hover:text-text-primary transition-colors">{slug}</Link>
          <span>/</span>
          <span className="text-text-primary">{data.story.id}</span>
        </div>

        {/* Story header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-mono text-text-dim">{data.story.id}</span>
            <Badge label={data.story.priority} />
            <Badge label={data.story.phase} />
          </div>
          <h1 className="text-2xl font-bold">{data.story.title}</h1>
        </div>

        {/* Content */}
        {data.content ? (
          <MarkdownViewer content={data.content} />
        ) : (
          <div className="text-text-dim text-center py-20">
            <p>This story hasn&apos;t been completed yet.</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-border">
          {data.prev ? (
            <Link href={`/${slug}/${data.prev.id}`}>
              <Button variant="secondary" size="sm">
                &larr; {data.prev.id}: {data.prev.title}
              </Button>
            </Link>
          ) : <div />}
          {data.next ? (
            <Link href={`/${slug}/${data.next.id}`}>
              <Button variant="secondary" size="sm">
                {data.next.id}: {data.next.title} &rarr;
              </Button>
            </Link>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
