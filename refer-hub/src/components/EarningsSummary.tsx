import type { Ambassador } from '@/lib/api';

export default function EarningsSummary({ amb }: { amb: Ambassador }) {
  const monthsActive = Math.max(1, Math.floor(
    (Date.now() - new Date(amb.created_at).getTime()) / (30 * 86400000)
  ));
  const projectedLifetime = amb.total_setup_earned_usd + (amb.monthly_recurring_usd * 12);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <MetricTile
        label="Setup Earned"
        value={`$${amb.total_setup_earned_usd.toFixed(2)}`}
        sub="one-time"
        color="text-money"
      />
      <MetricTile
        label="Monthly Recurring"
        value={`$${amb.monthly_recurring_usd.toFixed(2)}/mo`}
        sub={`${amb.active_commissions} active client${amb.active_commissions !== 1 ? 's' : ''}`}
        color="text-azure"
      />
      <MetricTile
        label="Nominations"
        value={String(amb.total_nominations)}
        sub={`${amb.connected_nominations} connected`}
        color="text-sky"
      />
      <MetricTile
        label="12-mo Projection"
        value={`$${projectedLifetime.toFixed(0)}`}
        sub="at current rate"
        color="text-sun"
      />
    </div>
  );
}

function MetricTile({ label, value, sub, color }: {
  label: string; value: string; sub: string; color: string;
}) {
  return (
    <div className="tile text-center">
      <p className="font-mono text-xs text-steel uppercase tracking-widest">{label}</p>
      <p className={`font-display text-2xl font-bold mt-1 ${color}`}>{value}</p>
      <p className="text-xs text-steel mt-1">{sub}</p>
    </div>
  );
}
