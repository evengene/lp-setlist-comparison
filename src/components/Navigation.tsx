import { Link, useLocation } from 'react-router-dom';

export const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/songs', label: 'Song Abbreviations' },
    { path: '/comparison', label: 'Setlist Comparison' },
    { path: '/stats', label: 'Tour Stats' },
  ];

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 text-xl font-semibold text-slate-900">
            <img src="/lp-logo-navy.png" alt="Linkin Park Logo" className="w-12 h-12 mx-auto mr-3" />
            <span>LP Setlists</span>
          </Link>

          {/* Nav Links */}
          <div className="flex space-x-1">
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
        </div>
      </div>
    </nav>
  );
};
