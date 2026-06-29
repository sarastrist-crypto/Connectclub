import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSession } from '@/App';
import { api } from '@/lib/api';
import BrandMark from './BrandMark';

const NAV = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/nominate',  label: 'Nominate' },
  { to: '/import',    label: 'Import Contacts' },
  { to: '/my-page',   label: 'My Page' },
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const { ambassador, refresh } = useSession();
  const location = useLocation();
  const navigate = useNavigate();

  async function handleSignOut() {
    await api.signOut();
    await refresh();
    navigate('/');
  }

  return (
    <div className="relative min-h-screen z-10">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-ocean/90 backdrop-blur-md border-b border-azure/20">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-azure">
            <BrandMark size={24} />
            <span className="font-mono text-xs tracking-widest text-steel uppercase">ConnectClub</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-1 ml-4">
            {NAV.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === to
                    ? 'bg-azure/20 text-azure'
                    : 'text-steel hover:text-sky hover:bg-white/5'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            {ambassador && (
              <span className="hidden sm:block font-mono text-xs text-steel">
                {ambassador.referral_code}
              </span>
            )}
            <button
              onClick={handleSignOut}
              className="text-steel hover:text-sky text-sm transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="sm:hidden border-t border-azure/10 px-4 pb-2 pt-1 flex gap-1 overflow-x-auto">
          {NAV.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`shrink-0 px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                location.pathname === to
                  ? 'bg-azure/20 text-azure'
                  : 'text-steel hover:text-sky'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Gradient bar */}
      <div className="grad-bar w-full" />

      <main className="max-w-5xl mx-auto px-4 py-8 relative z-10">
        {children}
      </main>
    </div>
  );
}
