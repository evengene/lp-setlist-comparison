import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navItems = [
    { path: '/', label: 'Tour Songs' },
    { path: '/songs', label: 'Song Abbreviations' },
    { path: '/comparison', label: 'Setlist Comparison' },
    { path: '/stats', label: 'Tour Stats' },
  ];

  const lpSocials = [
    { href: 'https://www.youtube.com/@linkinpark', label: 'YouTube', icon: 'youtube' },
    { href: 'https://www.instagram.com/linkinpark/', label: 'Instagram', icon: 'instagram' },
    { href: 'https://x.com/linkinpark', label: 'X', icon: 'x' },
  ];

  const mySocials = [
    { href: 'https://github.com/evengene', label: 'GitHub', icon: 'github' },
    { href: 'https://x.com/elygills', label: 'X', icon: 'x' },
    // { href: 'https://www.instagram.com/elina_shelest/', label: 'Instagram', icon: 'instagram' },
    { href: 'https://www.elinashelest.com/', label: 'Website', icon: 'site' },
  ];

  React.useEffect(() => setMobileOpen(false), [location.pathname]);

  React.useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [mobileOpen]);

  React.useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  const SocialIcon = ({ name }: { name: string }) => {
    switch (name) {
      case 'youtube':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M23.498 6.186a2.994 2.994 0 00-2.103-2.116C19.63 3.5 12 3.5 12 3.5s-7.63 0-9.395.57A2.995 2.995 0 00.502 6.186 31.78 31.78 0 000 12a31.78 31.78 0 00.502 5.814 2.994 2.994 0 002.103 2.116C4.37 20.5 12 20.5 12 20.5s7.63 0 9.395-.57a2.994 2.994 0 002.103-2.116A31.78 31.78 0 0024 12a31.78 31.78 0 00-.502-5.814zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
          </svg>
        );
      case 'instagram':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
        );
      case 'x':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.906-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
          </svg>
        );
      case 'github':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.523 2 12 2z" clipRule="evenodd" />
          </svg>
        );
      case 'site':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm6.93 6h-2.95a15.65 15.65 0 00-1.38-3.56A8.014 8.014 0 0118.93 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 015.08 16zm2.95-8H5.08a7.987 7.987 0 014.33-3.56A15.65 15.65 0 008.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.65-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.35-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.014 8.014 0 01-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" />
          </svg>
        );
      default:
        return null;
    }
  };

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
          'md:hidden fixed left-0 right-0 top-16 bottom-0 z-40 transition-opacity duration-200',
          mobileOpen ? 'opacity-80 bg-black/70 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        aria-hidden="true"
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        className={[
          'md:hidden fixed left-0 right-0 top-16 bottom-0 z-50',
          mobileOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-95 pointer-events-none',
        ].join(' ')}
        aria-hidden={!mobileOpen}
      >
        <div className="h-full overflow-y-auto bg-slate-900 text-white flex flex-col">

          {/* Nav items */}
          <div className="px-4 py-8 space-y-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    active ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex-1" />

          {/* Footer area */}
          <div className="px-5 pb-8 pt-4 border-t border-white/10 space-y-5">

            {/* Resources */}
            <div>
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Resources</p>
              <div className="flex gap-2">
                <a href="https://www.setlist.fm/" target="_blank" rel="noreferrer"
                   className="px-3 py-1.5 rounded-lg text-sm text-white/80 bg-white/6 hover:bg-white/10 transition-colors">
                  setlist.fm
                </a>
              </div>
            </div>

            {/* Linkin Park socials */}
            <div>
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Linkin Park</p>
              <div className="flex gap-2">
                {lpSocials.map((s) => (
                  <a key={s.href} href={s.href} target="_blank" rel="noreferrer"
                     className="p-2.5 rounded-lg bg-white/6 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                     aria-label={s.label}>
                    <SocialIcon name={s.icon} />
                  </a>
                ))}
              </div>
            </div>

            {/* Dev socials */}
            <div>
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Site / Dev</p>
              <div className="flex gap-2">
                {mySocials.map((s) => (
                  <a key={s.href} href={s.href} target="_blank" rel="noreferrer"
                     className="p-2.5 rounded-lg bg-white/6 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                     aria-label={s.label}>
                    <SocialIcon name={s.icon} />
                  </a>
                ))}
              </div>
            </div>

            <p className="text-xs text-white/30">
              Press <span className="text-white/50 font-medium">Esc</span> to close
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
};
