'use client';

import { type ReactNode, type ButtonHTMLAttributes } from 'react';

// --- Badge ---
const badgeColors: Record<string, string> = {
  P0: 'bg-error/20 text-error',
  P1: 'bg-warning/20 text-warning',
  P2: 'bg-accent/20 text-accent',
  FINAL: 'bg-success/20 text-success',
  idle: 'bg-bg-elevated text-text-dim',
  running: 'bg-accent/20 text-accent',
  completed: 'bg-success/20 text-success',
  failed: 'bg-error/20 text-error',
  research: 'bg-accent/20 text-accent',
  'deep-dive': 'bg-warning/20 text-warning',
};

export function Badge({ label, className = '' }: { label: string; className?: string }) {
  const color = badgeColors[label] || 'bg-bg-elevated text-text-dim';
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${color} ${className}`}>
      {label}
    </span>
  );
}

// --- Button ---
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md';
  children: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', children, className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-accent text-white hover:bg-accent/90',
    secondary: 'bg-bg-elevated text-text-primary border border-border hover:bg-bg-surface',
    danger: 'bg-error/20 text-error hover:bg-error/30',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}

// --- Card ---
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-bg-surface border border-border rounded-xl p-5 ${className}`}>
      {children}
    </div>
  );
}

// --- Input ---
export function Input({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-text-dim mb-1.5 block">{label}</span>
      <input
        className="w-full bg-bg-elevated border border-border rounded-lg px-3 py-2 text-text-primary placeholder-text-dim/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
        {...props}
      />
    </label>
  );
}

// --- Select ---
export function Select({
  label,
  options,
  ...props
}: { label: string; options: { value: string; label: string }[] } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-text-dim mb-1.5 block">{label}</span>
      <select
        className="w-full bg-bg-elevated border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
        {...props}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

// --- Status Dot ---
export function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    idle: 'bg-text-dim',
    running: 'bg-accent animate-pulse',
    completed: 'bg-success',
    failed: 'bg-error',
  };

  return (
    <span className={`inline-block w-2.5 h-2.5 rounded-full ${colors[status] || 'bg-text-dim'}`} />
  );
}
