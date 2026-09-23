import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { useSession } from '@/App';
import BrandMark from '@/components/BrandMark';

const SPECIALTIES = [
  'pool service', 'lawn care', 'cleaning', 'pest control',
  'HVAC / plumbing', 'roofing', 'senior care', 'general',
];

export default function Register() {
  const { refresh } = useSession();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', city: '', specialty: '' });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  function set(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      if (api.isReal) {
        // Real mode: send magic link, show "check your email"
        setSent(true);
      } else {
        // Mock: register immediately and redirect
        await api.register(form);
        await refresh();
        navigate('/dashboard');
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen z-10 flex flex-col">
      <header className="border-b border-azure/20 px-4 h-14 flex items-center">
        <Link to="/" className="flex items-center gap-2 text-azure">
          <BrandMark size={22} />
          <span className="font-mono text-xs tracking-widest text-steel uppercase">ConnectClub</span>
        </Link>
      </header>
      <div className="grad-bar w-full" />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-azure/20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-azure" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="font-display text-2xl font-bold text-sky mb-3">Check your email</h2>
              <p className="text-steel">
                We sent a sign-in link to <span className="text-azure">{form.email}</span>.
                Tap it to open your dashboard — no password ever needed.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <p className="font-mono text-xs text-azure uppercase tracking-widest mb-2">Join ConnectClub</p>
                <h1 className="font-display text-3xl font-bold text-sky">Start referring,<br />start earning</h1>
                <p className="text-steel mt-2 text-sm">No password. No fees. Earnings start the moment your first nomination connects.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="field-label">Your name *</label>
                  <input className="field" type="text" value={form.name}
                    onChange={set('name')} placeholder="Virginia Ayers" required />
                </div>
                <div>
                  <label className="field-label">Email address *</label>
                  <input className="field" type="email" value={form.email}
                    onChange={set('email')} placeholder="virginia@example.com" required />
                </div>
                <div>
                  <label className="field-label">City (optional)</label>
                  <input className="field" type="text" value={form.city}
                    onChange={set('city')} placeholder="Tampa, FL" />
                </div>
                <div>
                  <label className="field-label">I mostly know people in… (optional)</label>
                  <select className="field" value={form.specialty} onChange={set('specialty')}>
                    <option value="">Choose a specialty</option>
                    {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button type="submit" disabled={submitting} className="btn-primary w-full mt-2">
                  {submitting ? 'Setting you up…' : api.isReal ? 'Send my sign-in link →' : 'Open my dashboard →'}
                </button>
              </form>

              {!api.isReal && (
                <div className="mt-6 p-4 bg-sun/10 border border-sun/20 rounded-xl text-center">
                  <p className="font-mono text-xs text-sun uppercase tracking-widest mb-1">Demo mode</p>
                  <p className="text-steel text-xs">You're using the mock dashboard. No email will be sent.</p>
                  <button
                    onClick={async () => {
                      await api.register({ name: 'Virginia Ayers', email: 'demo@example.com', specialty: 'pool service', city: 'Tampa, FL' });
                      await refresh();
                      navigate('/dashboard');
                    }}
                    className="mt-3 text-azure text-sm underline underline-offset-2"
                  >
                    Open demo dashboard instead
                  </button>
                </div>
              )}

              <p className="text-center text-steel text-xs mt-6">
                Already have an account?{' '}
                <Link to="/dashboard" className="text-azure underline underline-offset-2">Go to dashboard</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
