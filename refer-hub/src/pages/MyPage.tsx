import { useSession } from '@/App';
import Shell from '@/components/Shell';
import { Link } from 'react-router-dom';

export default function MyPage() {
  const { ambassador } = useSession();
  if (!ambassador) return null;

  const url = `${window.location.origin}/refer/${ambassador.referral_code}`;

  async function share() {
    const text = `I thought of you! Cobbled Works builds websites and software for local service businesses. I can introduce you — tap my link: ${url}`;
    if (navigator.share) {
      await navigator.share({ title: 'Cobbled Works introduction', text, url });
    } else {
      await navigator.clipboard.writeText(`${text}`).catch(() => {});
    }
  }

  return (
    <Shell>
      <div className="max-w-xl">
        <div className="mb-8">
          <p className="font-mono text-xs text-azure uppercase tracking-widest mb-1">Your referral page</p>
          <h1 className="font-display text-3xl font-bold text-sky">Preview your personal link</h1>
          <p className="text-steel mt-2 text-sm">
            This is what a business owner sees when you share your link. Send it to anyone.
          </p>
        </div>

        {/* Link card */}
        <div className="tile mb-6">
          <p className="font-mono text-xs text-steel uppercase tracking-widest mb-2">Your link</p>
          <code className="text-azure text-sm font-mono break-all">{url}</code>

          <div className="mt-4 flex gap-3">
            <button onClick={share} className="btn-primary flex-1">
              Share with a business owner
            </button>
            <Link to={`/${ambassador.referral_code}`} target="_blank" className="btn-ghost px-4">
              Preview
            </Link>
          </div>
        </div>

        {/* Preview card */}
        <div className="tile border border-azure/30 bg-ocean-light">
          <p className="font-mono text-xs text-azure uppercase tracking-widest mb-4">Page preview</p>

          <div className="mb-4 pb-4 border-b border-azure/20">
            <p className="text-steel text-xs font-mono mb-1">REFERRED BY</p>
            <p className="font-display text-xl font-bold text-sky">{ambassador.name}</p>
            {ambassador.specialty && <p className="text-azure text-sm mt-0.5">{ambassador.specialty}</p>}
            {ambassador.city && <p className="text-steel text-xs mt-0.5">{ambassador.city}</p>}
          </div>

          <p className="text-steel text-sm mb-4 leading-relaxed">
            {ambassador.name} thought of you. Cobbled Works builds modern software for local
            {ambassador.specialty ? ` ${ambassador.specialty}` : ' service'} businesses — websites,
            proof-of-service apps, and AI lead tools that help you win more jobs and keep clients longer.
          </p>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {['Look professional online', 'Prove every visit', 'Never lose a lead'].map((v) => (
              <div key={v} className="bg-ocean border border-azure/20 rounded-lg p-2 text-center">
                <p className="text-xs text-steel leading-tight">{v}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-azure/20 pt-3">
            <p className="text-steel text-xs text-center">
              A form appears here — pre-tagged with your referral code
            </p>
          </div>
        </div>

        <p className="text-steel text-xs mt-4 text-center">
          Anyone who fills the form on your page becomes your nomination automatically.
          You don't have to do anything else.
        </p>
      </div>
    </Shell>
  );
}
