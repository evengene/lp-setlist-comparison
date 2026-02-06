import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navigation = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/songs', label: 'Song Abbreviations' },
    { path: '/comparison', label: 'Setlist Comparison' },
    { path: '/stats', label: 'Tour Stats' },
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

  // Close the mobile menu when route changes (e.g., back/forward navigation)
  React.useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent background scroll while the menu is open (mobile UX polish)
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
    <nav className="border-b border-gray-200 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 text-xl font-semibold text-slate-900">
            <img src="/lp-logo-navy.png" alt="Linkin Park Logo" className="w-12 h-12 mx-auto mr-3" />
            <span>LP Setlists</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-3xl text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-slate-900"
            aria-controls="mobile-menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileOpen ? (
              // X icon
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              // Hamburger icon
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Backdrop overlay (full-screen below header, tap outside to close) */}
      <div
        className={[
          'md:hidden fixed left-0 right-0 top-16 bottom-0 z-40 bg-black/40 transition-opacity duration-200',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        aria-hidden="true"
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile menu panel (full width + full height below header) */}
      <div
        id="mobile-menu"
        className={[
          'md:hidden fixed left-0 right-0 top-16 bottom-0 z-50 bg-white',
          'origin-top transition-[transform,opacity] duration-200 ease-out',
          mobileOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-95 pointer-events-none',
        ].join(' ')}
      >
        <div className="h-full px-4 sm:px-6 py-4 flex flex-col">
          {/* Top: primary nav */}
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const active = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    active ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Spacer pushes extras to the bottom */}
          <div className="flex-1" />

          {/* Bottom: quick links + socials */}
          <div className="pt-4 border-t border-gray-200">
            <div className="text-xs font-semibold tracking-wide text-slate-500 mb-2">Quick links</div>
            <div className="flex flex-col gap-2">
              {quickLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-gray-100"
                >
                  {l.label}
                </a>
              ))}
            </div>

            <div className="text-xs font-semibold tracking-wide text-slate-500 mt-5 mb-2">Social</div>
            <div className="flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-gray-100 text-center"
                >
                  {s.label}
                </a>
              ))}
            </div>

            <div className="mt-4 text-xs text-slate-400 px-1">
              Tip: press <span className="font-medium text-slate-500">Esc</span> to close.
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
