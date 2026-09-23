import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useSession } from '@/App';
import Shell from '@/components/Shell';

const SERVICE_KEYWORDS = [
  'pool', 'lawn', 'landscap', 'clean', 'maid', 'pest', 'hvac', 'plumb',
  'electric', 'roof', 'care', 'senior', 'nurs', 'handyman', 'paint',
  'fence', 'pressure wash', 'gutter', 'tree', 'junk', 'moving',
];

const OWNER_TITLES = [
  'owner', 'co-owner', 'founder', 'president', 'ceo', 'principal',
  'operator', 'director', 'proprietor', 'managing partner',
];

type Contact = {
  id: string;
  name: string;
  company: string;
  title: string;
  email: string;
  signal: 'owner-service' | 'service' | 'owner' | 'none';
  selected: boolean;
};

function detectSignal(title: string, company: string): Contact['signal'] {
  const t = title.toLowerCase();
  const c = company.toLowerCase();
  const isOwner   = OWNER_TITLES.some(k => t.includes(k));
  const isService = SERVICE_KEYWORDS.some(k => c.includes(k) || t.includes(k));
  if (isOwner && isService) return 'owner-service';
  if (isService) return 'service';
  if (isOwner)   return 'owner';
  return 'none';
}

function parseCsv(text: string): Contact[] {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];

  function splitRow(row: string): string[] {
    const cols: string[] = [];
    let cur = '', inQ = false;
    for (const ch of row) {
      if (ch === '"') { inQ = !inQ; continue; }
      if (ch === ',' && !inQ) { cols.push(cur); cur = ''; continue; }
      cur += ch;
    }
    cols.push(cur);
    return cols.map(c => c.trim());
  }

  const headers = splitRow(lines[0]).map(h => h.toLowerCase());
  const idx = (key: string) => headers.findIndex(h => h.includes(key));
  const iName     = idx('first name') >= 0 ? idx('first name') : idx('name');
  const iLast     = idx('last name');
  const iCompany  = idx('company');
  const iPosition = idx('position');
  const iEmail    = idx('email');

  return lines.slice(1).map((line, i) => {
    const cols = splitRow(line);
    const firstName = iName >= 0 ? cols[iName] ?? '' : '';
    const lastName  = iLast >= 0 ? cols[iLast] ?? '' : '';
    const name      = [firstName, lastName].filter(Boolean).join(' ') || 'Unknown';
    const company   = iCompany >= 0 ? cols[iCompany] ?? '' : '';
    const title     = iPosition >= 0 ? cols[iPosition] ?? '' : '';
    const email     = iEmail >= 0 ? cols[iEmail] ?? '' : '';
    return { id: String(i), name, company, title, email, signal: detectSignal(title, company), selected: false };
  }).filter(c => c.company || c.title);
}

const SIGNAL_META = {
  'owner-service': { label: 'Owner at service biz ★★', cls: 'bg-money/10 text-green-400 border-money/30' },
  'service':       { label: 'Service business',         cls: 'bg-azure/10 text-azure border-azure/30' },
  'owner':         { label: 'Business owner',           cls: 'bg-sun/10 text-sun border-sun/30' },
  'none':          { label: 'Contact',                  cls: 'bg-steel/10 text-steel border-steel/30' },
};

export default function Import() {
  const { ambassador } = useSession();
  const navigate = useNavigate();
  const dropRef = useRef<HTMLDivElement>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(0);
  const [filter, setFilter] = useState<Contact['signal'] | 'all'>('all');

  if (!ambassador) return null;

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const parsed = parseCsv((e.target?.result as string) ?? '');
      setContacts(parsed.map(c => ({
        ...c,
        selected: c.signal === 'owner-service' || c.signal === 'service',
      })));
    };
    reader.readAsText(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function toggleSelect(id: string) {
    setContacts(cs => cs.map(c => c.id === id ? { ...c, selected: !c.selected } : c));
  }

  function toggleAll() {
    const visible = contacts.filter(c => filter === 'all' || c.signal === filter);
    const allSelected = visible.every(c => c.selected);
    const ids = new Set(visible.map(c => c.id));
    setContacts(cs => cs.map(c => ids.has(c.id) ? { ...c, selected: !allSelected } : c));
  }

  async function handleNominate() {
    const selected = contacts.filter(c => c.selected);
    if (!selected.length) return;
    setSubmitting(true);
    try {
      const count = await api.bulkNominate(selected.map(c => ({
        business_name: c.company || c.name,
        owner_name: c.company ? c.name : undefined,
        contact_email: c.email || undefined,
        business_type: c.signal === 'service' || c.signal === 'owner-service' ? 'service' : undefined,
        relationship: 'LinkedIn connection',
      })));
      setSubmitted(count);
      setTimeout(() => navigate('/dashboard'), 2000);
    } finally {
      setSubmitting(false);
    }
  }

  const visible = contacts.filter(c => filter === 'all' || c.signal === filter);
  const selectedCount = contacts.filter(c => c.selected).length;
  const signalCounts = {
    'owner-service': contacts.filter(c => c.signal === 'owner-service').length,
    'service':       contacts.filter(c => c.signal === 'service').length,
    'owner':         contacts.filter(c => c.signal === 'owner').length,
    'none':          contacts.filter(c => c.signal === 'none').length,
  };

  return (
    <Shell>
      <div className="mb-8">
        <p className="font-mono text-xs text-azure uppercase tracking-widest mb-1">LinkedIn import</p>
        <h1 className="font-display text-3xl font-bold text-sky">
          Find the <em>warm leads</em> hiding in your network
        </h1>
        <p className="text-steel mt-2 text-sm max-w-lg">
          Your LinkedIn connections CSV is parsed entirely in your browser — nothing is uploaded to any server.
        </p>
      </div>

      {/* Instructions */}
      {contacts.length === 0 && (
        <div className="tile mb-6">
          <h2 className="font-semibold text-sky mb-4">How to export your LinkedIn connections</h2>
          <ol className="space-y-3 text-sm text-steel">
            {[
              'Go to linkedin.com → click your profile photo → "Settings & Privacy"',
              'Click "Data Privacy" → "Get a copy of your data"',
              'Select "Connections" only and click "Request archive"',
              'LinkedIn emails you a link (usually within 10 minutes)',
              'Download the ZIP, open it, and find "Connections.csv"',
              'Drag and drop that file below — nothing leaves your device',
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-mono text-azure shrink-0">{String(i + 1).padStart(2, '0')}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Drop zone */}
      {contacts.length === 0 && (
        <div
          ref={dropRef}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer mb-6 ${
            isDragging ? 'border-azure bg-azure/10' : 'border-azure/30 hover:border-azure/60'
          }`}
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.csv';
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) handleFile(file);
            };
            input.click();
          }}
        >
          <div className="w-12 h-12 rounded-xl bg-azure/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-azure" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="text-sky font-medium">Drop your Connections.csv here</p>
          <p className="text-steel text-sm mt-1">or click to browse</p>
        </div>
      )}

      {/* Results */}
      {contacts.length > 0 && (
        <>
          {submitted > 0 ? (
            <div className="tile text-center py-10">
              <p className="font-display text-2xl font-bold text-money mb-2">
                {submitted} nomination{submitted !== 1 ? 's' : ''} submitted ✓
              </p>
              <p className="text-steel">Heading back to your dashboard…</p>
            </div>
          ) : (
            <>
              {/* Signal summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {(Object.entries(signalCounts) as [Contact['signal'], number][]).map(([sig, count]) => (
                  <button
                    key={sig}
                    onClick={() => setFilter(f => f === sig ? 'all' : sig)}
                    className={`tile text-left transition-all ${filter === sig ? 'border-azure' : ''}`}
                  >
                    <span className={`badge ${SIGNAL_META[sig].cls} mb-2 inline-block`}>
                      {SIGNAL_META[sig].label}
                    </span>
                    <p className="font-display text-xl font-bold text-sky">{count}</p>
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <button onClick={toggleAll} className="text-azure text-sm underline underline-offset-2">
                    Toggle all visible
                  </button>
                  <span className="text-steel text-sm">{selectedCount} selected</span>
                </div>
                <button
                  onClick={handleNominate}
                  disabled={selectedCount === 0 || submitting}
                  className="btn-primary text-sm py-2 px-5"
                >
                  {submitting ? 'Submitting…' : `Nominate ${selectedCount} contacts →`}
                </button>
              </div>

              {/* Contact list */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {visible.map(c => (
                  <label
                    key={c.id}
                    className={`tile flex items-center gap-4 cursor-pointer transition-colors ${
                      c.selected ? 'border-azure/50' : 'border-azure/10'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={c.selected}
                      onChange={() => toggleSelect(c.id)}
                      className="accent-azure w-4 h-4 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sky font-medium text-sm truncate">{c.name}</p>
                      <p className="text-steel text-xs truncate">{c.company}{c.title ? ` · ${c.title}` : ''}</p>
                    </div>
                    <span className={`badge ${SIGNAL_META[c.signal].cls} shrink-0 hidden sm:inline`}>
                      {SIGNAL_META[c.signal].label}
                    </span>
                  </label>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </Shell>
  );
}
