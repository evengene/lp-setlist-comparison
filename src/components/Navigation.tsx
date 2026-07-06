import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navigation = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // NOTE: labels/targets are provisional — "Setlists" points at the comparison
  // page for now; these firm up as the real Setlists + Data pages get built.
  const navItems = [
    { path: '/', label: 'Retrospective' },
    { path: '/comparison', label: 'Setlists' },
    { path: '/songs', label: 'Songs' },
    { path: '/stats', label: 'Data' },
  ];

  const quickLinks = [
    { href: 'https://www.linkinpark.com/', label: 'Official Site' },
    { href: 'https://www.setlist.fm/', label: 'Setlist.fm' },
  ];

  const socials = [
    { href: 'https://www.youtube.com/@linkinpark', label: 'YouTube' },
    { href: 'https://www.instagram.com/linkinpark/', label: 'Instagram' },
    { href: 'https://x.com/linkinpark', label: 'X' },
  ];

  // Close the mobile menu on route change
  React.useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent background scroll while the menu is open
  React.useEffect(() => {
    if (!mobileOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileOpen]);

  // Close on Escape
  React.useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  return (
    <nav className="relative border-b border-line bg-ink font-body">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="font-mono text-sm font-medium tracking-[0.16em] text-bone">
            LP&nbsp;SETLISTS
          </Link>

          {/* Desktop nav */}
          <div className="hidden gap-7 md:flex">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`font-mono text-xs uppercase tracking-[0.14em] transition-colors ${
                    active ? 'text-ember' : 'text-ash hover:text-bone'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-ash hover:text-bone focus:outline-none focus:ring-1 focus:ring-ember md:hidden"
            aria-controls="mobile-menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileOpen ? (
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Backdrop */}
      <div
        className={[
          'fixed left-0 right-0 top-16 bottom-0 z-40 bg-black/60 transition-opacity duration-200 md:hidden',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        aria-hidden="true"
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile panel */}
      <div
        id="mobile-menu"
        className={[
          'fixed left-0 right-0 top-16 bottom-0 z-50 bg-ink md:hidden',
          'origin-top transition-[transform,opacity] duration-200 ease-out',
          mobileOpen ? 'scale-y-100 opacity-100' : 'pointer-events-none scale-y-95 opacity-0',
        ].join(' ')}
      >
        <div className="flex h-full flex-col px-4 py-5 sm:px-6">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-md px-3 py-3 font-mono text-sm uppercase tracking-[0.14em] transition-colors ${
                    active ? 'text-ember' : 'text-bone hover:bg-ink-2'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex-1" />

          <div className="border-t border-line pt-4">
            <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ash">Quick links</div>
            <div className="flex flex-col gap-1">
              {quickLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md px-3 py-2 text-sm text-bone-dim hover:text-bone"
                >
                  {l.label}
                </a>
              ))}
            </div>

            <div className="mb-2 mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-ash">Social</div>
            <div className="flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 rounded-md border border-line px-3 py-2 text-center text-sm text-bone-dim hover:border-ash-2 hover:text-bone"
                >
                  {s.label}
                </a>
              ))}
            </div>

            <div className="mt-4 px-1 font-mono text-[11px] text-ash-2">Press ESC to close.</div>
          </div>
        </div>
      </div>
    </nav>
  );
};
