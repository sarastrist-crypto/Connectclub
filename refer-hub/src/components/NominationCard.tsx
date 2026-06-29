import type { Nomination } from '@/lib/api';

const STATUS_LABELS: Record<Nomination['status'], string> = {
  submitted:  'Submitted',
  contacted:  'Contacted',
  engaged:    'Engaged',
  demo:       'Demo',
  proposal:   'Proposal',
  connected:  'Connected',
  lost:       'Not a fit',
};

export default function NominationCard({ nom }: { nom: Nomination }) {
  const daysAgo = Math.floor((Date.now() - new Date(nom.created_at).getTime()) / 86400000);

  return (
    <div className="tile hover:border-azure/40 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display font-bold text-sky">{nom.business_name}</p>
          {nom.owner_name && (
            <p className="text-steel text-sm mt-0.5">{nom.owner_name}</p>
          )}
        </div>
        <span className={`badge badge-${nom.status} shrink-0`}>
          {STATUS_LABELS[nom.status]}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-steel">
        {nom.business_type && <span className="font-mono">{nom.business_type}</span>}
        {nom.city && <span>{nom.city}</span>}
        {nom.relationship && <span>"{nom.relationship}"</span>}
      </div>

      {nom.pain_points && (
        <p className="mt-2 text-xs text-steel line-clamp-2 italic">"{nom.pain_points}"</p>
      )}

      <p className="mt-3 text-xs text-steel/60 font-mono">
        {daysAgo === 0 ? 'today' : `${daysAgo}d ago`}
        {nom.connected_at && ' · Connected ✓'}
      </p>
    </div>
  );
}
