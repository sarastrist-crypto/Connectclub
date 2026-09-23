import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/lib/api';
import BrandMark from '@/components/BrandMark';

type PageData = {
  referral_code: string;
  ambassador_name: string;
  specialty: string | null;
  city: string | null;
};

type Pitch = {
  intro: string;
  values: string[];
};

function getVerticalPitch(specialty: string | null): Pitch {
  const s = (specialty ?? '').toLowerCase();
  if (s.includes('pool')) return {
    intro: 'Cobbled Works builds modern software for pool service companies — so your clients can see proof of every visit, book online, and trust you completely.',
    values: ['GPS-verified visit photos clients can view anytime', 'Professional booking page that closes jobs while you sleep', 'AI-powered follow-up that keeps your pipeline full'],
  };
  if (s.includes('lawn') || s.includes('landscap')) return {
    intro: 'Cobbled Works makes lawn and landscaping crews look as polished as the properties they maintain — with software that proves your work and wins you more HOA contracts.',
    values: ['Before/after photo logs clients keep forever', 'Branded site that beats every Craigslist competitor', 'Automated follow-up that resurrects cold leads'],
  };
  if (s.includes('clean') || s.includes('maid')) return {
    intro: 'Cobbled Works helps cleaning businesses win recurring clients and eliminate "did you even show up?" disputes with time-stamped, GPS-verified service proof.',
    values: ['Timestamped photo proof on every clean', 'Online booking that fills your schedule automatically', 'Professional look that justifies premium pricing'],
  };
  return {
    intro: 'Cobbled Works builds modern websites, booking systems, and proof-of-service tools for local service businesses — the kind of software that used to cost $50k, now available at a fraction of the price.',
    values: ['Look like the obvious choice online', 'Prove your work with GPS-verified photos', 'Keep your pipeline full without cold calling'],
  };
}

type Form = {
  business_name: string;
  owner_name: string;
  contact_email: string;
  contact_phone: string;
  relationship: string;
  pain_points: string;
};

const EMPTY: Form = {
  business_name: '', owner_name: '', contact_email: '',
  contact_phone: '', relationship: '', pain_points: '',
};

export default function PublicReferralPage() {
  const { code } = useParams<{ code: string }>();
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState<Form>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!code) { setNotFound(true); setLoading(false); return; }
    api.getReferralPage(code.toUpperCase())
      .then(d => { setPage(d); setLoading(false); })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [code]);

  function set(k: keyof Form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.business_name.trim()) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      await api.submitNomination({ referral_code: code!.toUpperCase(), ...form });
      setSubmitted(true);
      setForm(EMPTY);
    } catch (err) {
      setSubmitError(String(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function shareThisPage() {
    const url = window.location.href;
    const text = `${page?.ambassador_name} thought you'd want to see this — Cobbled Works software for local businesses: ${url}`;
    if (navigator.share) {
      await navigator.share({ title: 'Cobbled Works — local business software', text, url });
    } else {
      await navigator.clipboard.writeText(url).catch(() => {});
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-ocean z-10 relative">
      <div className="w-8 h-8 rounded-full border-2 border-azure border-t-transparent animate-spin" />
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center bg-ocean z-10 relative">
      <div className="text-center">
        <p className="text-steel mb-4">This referral link doesn't exist.</p>
        <Link to="/" className="text-azure underline">Learn about ConnectClub</Link>
      </div>
    </div>
  );

  const pitch = getVerticalPitch(page!.specialty);

  return (
    <div className="relative min-h-screen z-10">
      {/* Header */}
      <header className="border-b border-azure/20 px-4 h-14 flex items-center justify-between max-w-3xl mx-auto">
        <div className="flex items-center gap-2 text-azure">
          <BrandMark size={22} />
          <span className="font-mono text-xs tracking-widest text-steel uppercase">Cobbled Works</span>
        </div>
        <button onClick={shareThisPage} className="btn-ghost text-xs py-1.5 px-3">
          Share this page
        </button>
      </header>
      <div className="grad-bar w-full" />

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Referrer badge */}
        <div className="tile mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-azure/20 flex items-center justify-center text-azure shrink-0">
            <BrandMark size={24} />
          </div>
          <div>
            <p className="font-mono text-xs text-steel uppercase tracking-widest">Referred by</p>
            <p className="font-display text-xl font-bold text-sky">{page!.ambassador_name}</p>
            {(page!.specialty || page!.city) && (
              <p className="text-steel text-sm">
                {[page!.specialty, page!.city].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
        </div>

        {/* Headline */}
        <div className="mb-8">
          <p className="font-mono text-xs text-azure uppercase tracking-widest mb-3">
            A personal introduction
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-sky leading-tight mb-4">
            {page!.ambassador_name.split(' ')[0]} thinks you're<br />ready to <em>level up</em>.
          </h1>
          <p className="text-steel text-lg leading-relaxed max-w-xl">{pitch.intro}</p>
        </div>

        {/* Value props */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {pitch.values.map((v, i) => (
            <div key={i} className="tile reveal">
              <p className="font-mono text-xs text-azure mb-2">0{i + 1}</p>
              <p className="text-sky text-sm leading-relaxed">{v}</p>
            </div>
          ))}
        </div>

        {/* Nomination form */}
        <div className="tile border-azure/30">
          <h2 className="font-display text-xl font-bold text-sky mb-2">
            Interested? Let's talk.
          </h2>
          <p className="text-steel text-sm mb-5">
            {page!.ambassador_name} will make the intro. We'll reach out with a quick, no-pressure overview.
          </p>

          {submitted ? (
            <div className="bg-money/10 border border-money/30 rounded-xl p-6 text-center">
              <p className="font-display text-xl font-bold text-green-400 mb-2">You're on our list ✓</p>
              <p className="text-steel text-sm">
                We'll be in touch within 1 business day. {page!.ambassador_name} will be cc'd.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="field-label">Your business name *</label>
                  <input className="field" type="text" value={form.business_name}
                    onChange={set('business_name')} placeholder="Rodriguez Pool Service" required />
                </div>
                <div>
                  <label className="field-label">Your name</label>
                  <input className="field" type="text" value={form.owner_name}
                    onChange={set('owner_name')} placeholder="Carlos Rodriguez" />
                </div>
                <div>
                  <label className="field-label">Best email</label>
                  <input className="field" type="email" value={form.contact_email}
                    onChange={set('contact_email')} placeholder="you@yourbusiness.com" />
                </div>
                <div className="sm:col-span-2">
                  <label className="field-label">Best phone</label>
                  <input className="field" type="tel" value={form.contact_phone}
                    onChange={set('contact_phone')} placeholder="(813) 555-0100" />
                </div>
                <div className="sm:col-span-2">
                  <label className="field-label">How do you know {page!.ambassador_name.split(' ')[0]}? (optional)</label>
                  <input className="field" type="text" value={form.relationship}
                    onChange={set('relationship')} placeholder="neighbor, customer, colleague…" />
                </div>
                <div className="sm:col-span-2">
                  <label className="field-label">What's the biggest challenge your business faces right now? (optional)</label>
                  <textarea
                    className="field min-h-[80px] resize-none"
                    value={form.pain_points}
                    onChange={set('pain_points')}
                    placeholder="Getting new customers, looking professional online, proving we show up when promised…"
                  />
                </div>
              </div>

              {submitError && <p className="text-red-400 text-sm">{submitError}</p>}

              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? 'Sending…' : `Let ${page!.ambassador_name.split(' ')[0]} make the introduction →`}
              </button>
              <p className="text-steel text-xs text-center">
                No spam. No cold calls. {page!.ambassador_name} vouched for us — we won't waste your time.
              </p>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <div className="flex items-center justify-center gap-2 text-azure mb-2">
            <BrandMark size={16} />
            <span className="font-mono text-xs text-steel uppercase tracking-widest">Cobbled Works</span>
          </div>
          <p className="text-steel text-xs">cobbledworks.com</p>
          <p className="text-steel/50 text-xs mt-1">
            This page was shared by {page!.ambassador_name} via ConnectClub.
          </p>
        </div>
      </div>
    </div>
  );
}
