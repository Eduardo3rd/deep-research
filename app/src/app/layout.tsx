import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Deep Research',
  description: 'Autonomous company research powered by Claude Code',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg-primary text-text-primary antialiased">
        <div className="flex h-screen">
          {/* Sidebar */}
          <aside className="w-56 flex-shrink-0 bg-bg-surface border-r border-border flex flex-col">
            <div className="p-4 border-b border-border">
              <Link href="/" className="flex items-center gap-2">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="font-bold text-lg">Deep Research</span>
              </Link>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-dim hover:text-text-primary hover:bg-bg-elevated transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>
              <Link
                href="/new"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-dim hover:text-text-primary hover:bg-bg-elevated transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                New Research
              </Link>
            </nav>
            <div className="p-3 border-t border-border">
              <p className="text-xs text-text-dim">Deep Research</p>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
