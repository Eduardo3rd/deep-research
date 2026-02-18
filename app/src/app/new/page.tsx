'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Select, Card } from '@/components/ui';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [domain, setDomain] = useState('');
  const [mode, setMode] = useState('research');
  const [ceo, setCeo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);

  const handleNameChange = useCallback((val: string) => {
    setName(val);
    if (autoSlug) {
      setSlug(slugify(val));
    }
  }, [autoSlug]);

  const handleSlugChange = useCallback((val: string) => {
    setAutoSlug(false);
    setSlug(val);
  }, []);

  const needsCeo = mode === 'deep-dive';

  const handleSubmit = async (startImmediately: boolean) => {
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, domain, mode, ceo: ceo || undefined }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create project');
        setSubmitting(false);
        return;
      }

      if (startImmediately) {
        await fetch(`/api/projects/${slug}/start`, { method: 'POST' });
      }

      router.push(`/${slug}`);
    } catch {
      setError('Failed to create project');
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">New Research Project</h1>
      <p className="text-text-dim mb-8">Create a new company research project</p>

      <Card>
        <div className="space-y-5">
          <Input
            label="Company Name"
            placeholder="e.g. Acme Corporation"
            value={name}
            onChange={e => handleNameChange(e.target.value)}
            required
          />

          <Input
            label="Slug"
            placeholder="e.g. acme-corporation"
            value={slug}
            onChange={e => handleSlugChange(e.target.value)}
            required
          />

          <Input
            label="Domain"
            placeholder="e.g. acme.com"
            value={domain}
            onChange={e => setDomain(e.target.value)}
            required
          />

          <Select
            label="Research Mode"
            value={mode}
            onChange={e => setMode(e.target.value)}
            options={[
              { value: 'research', label: 'Research (12 stories) — comprehensive company dossier' },
              { value: 'deep-dive', label: 'Deep Dive (18 stories) — research + investment due diligence' },
            ]}
          />

          {needsCeo && (
            <Input
              label="CEO Name"
              placeholder="e.g. Jane Smith"
              value={ceo}
              onChange={e => setCeo(e.target.value)}
              required
            />
          )}

          {error && (
            <p className="text-error text-sm">{error}</p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={() => handleSubmit(true)}
              disabled={submitting || !name || !slug || !domain || (needsCeo && !ceo)}
            >
              {submitting ? 'Creating...' : 'Create & Start'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleSubmit(false)}
              disabled={submitting || !name || !slug || !domain || (needsCeo && !ceo)}
            >
              Create Only
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
