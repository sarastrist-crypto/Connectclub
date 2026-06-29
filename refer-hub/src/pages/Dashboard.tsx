import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, type Nomination } from '@/lib/api';
import { useSession } from '@/App';
import Shell from '@/components/Shell';
import EarningsSummary from '@/components/EarningsSummary';
import NominationCard from '@/components/NominationCard';

export default function Dashboard() {
  const { ambassador } = useSession();
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.listNominations().then(n => { setNominations(n); setLoading(false); });
  }, []);

  if (!ambassador) return null;

  const referralUrl = `${window.location.origin}/refer/${ambassador.referral_code}`;

  async function copyLink() {
    await navigator.clipboard.writeText(referralUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function shareLink() {
    if (navigator.share) {
      await navigator.share({ title: 'Refer a business to Cobbled Works', url: referralUrl });
    } else {
      await copyLink();
    }
  }

  return (
    <Shell>
      {/* Greeting */}
      <div className="mb-8">
        <p className="font-mono text-xs text-azure uppercase tracking-widest mb-1">Ambassador dashboard</p>
        <h1 className="font-display text-3xl font-bold text-sky">
          Welcome back, <em>{ambassador.name.split(' ')[0]}</em>
        </h1>
      </div>

      {/* Earnings */}
      <section className="mb-8">
        <div className="grad-bar w-12 mb-4" />
        <EarningsSummary amb={ambassador} />
      </section>

      {/* Share card */}
      <section className="mb-10">
        <div className="tile border-azure/30">
          <p className="font-mono text-xs text-steel uppercase tracking-widest mb-1">Your referral link</p>
          <p className="font-display text-lg text-sky mb-3">
            Share this link with business owners — or let them come to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <code className="flex-1 bg-ocean text-azure text-sm font-mono px-4 py-3 rounded-lg border border-azure/20 overflow-x-auto whitespace-nowrap">
              {referralUrl}
            </code>
            <button onClick={copyLink} className="btn-ghost text-sm py-2 px-4 whitespace-nowrap">
              {copied ? 'Copied ✓' : 'Copy'}
            </button>
            <button onClick={shareLink} className="btn-primary text-sm py-2 px-4 whitespace-nowrap">
              Share
            </button>
          </div>
          <p className="text-steel text-xs mt-2">
            Anyone who fills the form at that link is nominated under your code automatically.
          </p>
        </div>
      </section>

      {/* Nominations */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="grad-bar w-12 mb-2" />
            <h2 className="font-display text-xl font-bold text-sky">Your nominations</h2>
          </div>
          <div className="flex gap-2">
            <Link to="/import" className="btn-ghost text-sm py-2 px-4">Import contacts</Link>
            <Link to="/nominate" className="btn-primary text-sm py-2 px-4">+ Nominate</Link>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 rounded-full border-2 border-azure border-t-transparent animate-spin" />
          </div>
        ) : nominations.length === 0 ? (
          <div className="tile text-center py-12">
            <p className="text-steel mb-4">No nominations yet — every client you bring in earns you 10% ongoing.</p>
            <Link to="/nominate" className="btn-primary inline-block">Make your first nomination</Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {nominations.map(nom => <NominationCard key={nom.id} nom={nom} />)}
          </div>
        )}
      </section>
    </Shell>
  );
}
