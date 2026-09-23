import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useSession } from '@/App';
import Shell from '@/components/Shell';

const BUSINESS_TYPES = [
  'pool service', 'lawn care', 'cleaning', 'pest control',
  'HVAC / plumbing', 'roofing', 'senior care', 'landscaping', 'other',
];

const RELATIONSHIPS = [
  'neighbor', 'close friend', 'longtime customer', 'colleague',
  'family member', 'church / community member', 'other',
];

type Form = {
  business_name: string;
  owner_name: string;
  contact_email: string;
  contact_phone: string;
  business_type: string;
  city: string;
  website: string;
  relationship: string;
  pain_points: string;
};

const EMPTY: Form = {
  business_name: '', owner_name: '', contact_email: '', contact_phone: '',
  business_type: '', city: '', website: '', relationship: '', pain_points: '',
};

export default function Nominate() {
  const { ambassador } = useSession();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!ambassador) return null;

  function set(k: keyof Form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.business_name.trim()) { setError('Business name is required.'); return; }
    setSubmitting(true);
    setError('');
    try {
      await api.submitNomination({ referral_code: ambassador.referral_code, ...form });
      navigate('/dashboard');
    } catch (err) {
      setError(String(err));
      setSubmitting(false);
    }
  }

  return (
    <Shell>
      <div className="max-w-2xl">
        <div className="mb-8">
          <p className="font-mono text-xs text-azure uppercase tracking-widest mb-1">New nomination</p>
          <h1 className="font-display text-3xl font-bold text-sky">
            Who should we <em>connect</em> with?
          </h1>
          <p className="text-steel mt-2 text-sm">
            The more context you give, the warmer the intro — and the faster it closes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Business */}
          <div className="tile">
            <h2 className="font-semibold text-sky mb-4">About the business</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="field-label">Business name *</label>
                <input className="field" type="text" value={form.business_name}
                  onChange={set('business_name')} placeholder="Rodriguez Pool Service" required />
              </div>
              <div>
                <label className="field-label">Owner / contact name</label>
                <input className="field" type="text" value={form.owner_name}
                  onChange={set('owner_name')} placeholder="Carlos Rodriguez" />
              </div>
              <div>
                <label className="field-label">Business type</label>
                <select className="field" value={form.business_type} onChange={set('business_type')}>
                  <option value="">Select type…</option>
                  {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">City</label>
                <input className="field" type="text" value={form.city}
                  onChange={set('city')} placeholder="Tampa, FL" />
              </div>
              <div>
                <label className="field-label">Website (optional)</label>
                <input className="field" type="url" value={form.website}
                  onChange={set('website')} placeholder="https://" />
              </div>
              <div>
                <label className="field-label">Their email</label>
                <input className="field" type="email" value={form.contact_email}
                  onChange={set('contact_email')} placeholder="owner@business.com" />
              </div>
              <div>
                <label className="field-label">Their phone</label>
                <input className="field" type="tel" value={form.contact_phone}
                  onChange={set('contact_phone')} placeholder="(813) 555-0100" />
              </div>
            </div>
          </div>

          {/* Warm intro context */}
          <div className="tile">
            <h2 className="font-semibold text-sky mb-4">The warm intro</h2>
            <div className="space-y-4">
              <div>
                <label className="field-label">How do you know them?</label>
                <select className="field" value={form.relationship} onChange={set('relationship')}>
                  <option value="">Select relationship…</option>
                  {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Why would Cobbled Works help them? (free text)</label>
                <textarea
                  className="field min-h-[100px] resize-y"
                  value={form.pain_points}
                  onChange={set('pain_points')}
                  placeholder="Their website is outdated. Customers can't book online. They lose jobs to bigger competitors who look more professional online…"
                />
              </div>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? 'Submitting…' : 'Submit nomination →'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-ghost px-5"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Shell>
  );
}
