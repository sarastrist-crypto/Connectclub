/**
 * Refer-hub API layer.
 *
 * In mock mode (env.isReal === false) all state lives in localStorage under the
 * key `cw-connectclub:v1`.  In real mode every call hits the cobbled-control
 * Supabase project via the Edge Functions / RLS-scoped table reads.
 *
 * The shape of mock data is intentionally identical to real data so pages can
 * be written once.
 */

import { env } from './env';
import { supabase, callEdge } from './supabase';

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export type Ambassador = {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  city?: string | null;
  specialty?: string | null;
  referral_code: string;
  public_referral_id: string;
  status: 'active' | 'paused' | 'removed';
  total_setup_earned_usd: number;
  total_monthly_earned_usd: number;
  total_paid_usd: number;
  total_nominations: number;
  pending_nominations: number;
  in_progress_nominations: number;
  connected_nominations: number;
  lost_nominations: number;
  active_commissions: number;
  monthly_recurring_usd: number;
  created_at: string;
};

export type Nomination = {
  id: string;
  ambassador_id: string;
  business_name: string;
  owner_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  business_type?: string | null;
  city?: string | null;
  website?: string | null;
  relationship?: string | null;
  pain_points?: string | null;
  status: 'submitted' | 'contacted' | 'engaged' | 'demo' | 'proposal' | 'connected' | 'lost';
  status_note?: string | null;
  assigned_rep?: string | null;
  created_at: string;
  connected_at?: string | null;
};

export type Commission = {
  id: string;
  ambassador_id: string;
  nomination_id: string;
  setup_amount_usd: number;
  monthly_amount_usd: number;
  setup_commission_usd: number;
  monthly_commission_usd: number;
  status: 'accruing' | 'setup_paid' | 'active' | 'paused' | 'closed';
  client_since: string;
  created_at: string;
  nominations?: { business_name: string };
};

// ---------------------------------------------------------------------------
// Mock store
// ---------------------------------------------------------------------------

const STORE_KEY = 'cw-connectclub:v1';

type Store = {
  ambassador: Ambassador | null;
  nominations: Nomination[];
  commissions: Commission[];
};

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

function genCode(name: string): string {
  const prefix = name.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase() || 'CW';
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${suffix}`;
}

function loadStore(): Store {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return seedStore();
}

function saveStore(s: Store) {
  localStorage.setItem(STORE_KEY, JSON.stringify(s));
}

function seedStore(): Store {
  const ambassadorId = 'demo-amb-001';
  const store: Store = {
    ambassador: {
      id: ambassadorId,
      email: 'virginia@example.com',
      name: 'Virginia Ayers',
      phone: '(813) 555-0142',
      city: 'Tampa, FL',
      specialty: 'pool service',
      referral_code: 'VA-2026',
      public_referral_id: 'va2026public',
      status: 'active',
      total_setup_earned_usd: 99.70,
      total_monthly_earned_usd: 19.80,
      total_paid_usd: 0,
      total_nominations: 3,
      pending_nominations: 0,
      in_progress_nominations: 1,
      connected_nominations: 1,
      lost_nominations: 0,
      active_commissions: 1,
      monthly_recurring_usd: 9.90,
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
    nominations: [
      {
        id: 'nom-001',
        ambassador_id: ambassadorId,
        business_name: 'Rodriguez Pool Service',
        owner_name: 'Carlos Rodriguez',
        contact_email: 'carlos@rodriguezpools.com',
        contact_phone: '(813) 555-0198',
        business_type: 'pool service',
        city: 'Tampa, FL',
        relationship: 'neighbor',
        pain_points: 'No online booking. Customers call to complain they can\'t see service photos.',
        status: 'connected',
        created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
        connected_at: new Date(Date.now() - 10 * 86400000).toISOString(),
      },
      {
        id: 'nom-002',
        ambassador_id: ambassadorId,
        business_name: 'GreenScape Lawn Care',
        owner_name: 'Marcus Green',
        contact_email: 'marcus@greenscapelawn.com',
        business_type: 'lawn care',
        city: 'Brandon, FL',
        relationship: 'longtime customer',
        pain_points: 'Lost a big HOA contract because their website looked outdated.',
        status: 'engaged',
        created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
      },
      {
        id: 'nom-003',
        ambassador_id: ambassadorId,
        business_name: 'Sparkle Maids LLC',
        owner_name: 'Diane Torres',
        contact_phone: '(813) 555-0233',
        business_type: 'cleaning',
        city: 'Clearwater, FL',
        relationship: 'close friend',
        pain_points: 'Entirely word-of-mouth, no digital presence, wants to grow.',
        status: 'contacted',
        created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
      },
    ],
    commissions: [
      {
        id: 'comm-001',
        ambassador_id: ambassadorId,
        nomination_id: 'nom-001',
        setup_amount_usd: 997,
        monthly_amount_usd: 99,
        setup_commission_usd: 99.70,
        monthly_commission_usd: 9.90,
        status: 'accruing',
        client_since: new Date(Date.now() - 10 * 86400000).toISOString(),
        created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
        nominations: { business_name: 'Rodriguez Pool Service' },
      },
    ],
  };
  saveStore(store);
  return store;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const api = {
  isReal: env.isReal,

  // ---- Ambassador auth / registration ------------------------------------

  async register(data: {
    name: string;
    email: string;
    city?: string;
    specialty?: string;
  }): Promise<Ambassador> {
    if (env.isReal) {
      const res = await callEdge<{ ok: boolean; ambassador: Ambassador }>('ambassador-auth', data);
      return res.ambassador;
    }
    const store = loadStore();
    const amb: Ambassador = {
      id: genId(),
      email: data.email,
      name: data.name,
      city: data.city ?? null,
      specialty: data.specialty ?? null,
      referral_code: genCode(data.name),
      public_referral_id: genId() + genId(),
      status: 'active',
      total_setup_earned_usd: 0,
      total_monthly_earned_usd: 0,
      total_paid_usd: 0,
      total_nominations: 0,
      pending_nominations: 0,
      in_progress_nominations: 0,
      connected_nominations: 0,
      lost_nominations: 0,
      active_commissions: 0,
      monthly_recurring_usd: 0,
      created_at: new Date().toISOString(),
    };
    store.ambassador = amb;
    saveStore(store);
    return amb;
  },

  async getSession(): Promise<Ambassador | null> {
    if (env.isReal) {
      if (!supabase) return null;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase.from('ambassador_dashboard').select('*')
        .eq('email', user.email!).maybeSingle();
      return data as Ambassador | null;
    }
    return loadStore().ambassador;
  },

  async signOut() {
    if (env.isReal && supabase) await supabase.auth.signOut();
    const store = loadStore();
    store.ambassador = null;
    saveStore(store);
  },

  // ---- Nominations -------------------------------------------------------

  async listNominations(): Promise<Nomination[]> {
    if (env.isReal && supabase) {
      const { data, error } = await supabase
        .from('nominations')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Nomination[];
    }
    return loadStore().nominations;
  },

  async submitNomination(data: {
    referral_code: string;
    business_name: string;
    owner_name?: string;
    contact_email?: string;
    contact_phone?: string;
    business_type?: string;
    city?: string;
    website?: string;
    relationship?: string;
    pain_points?: string;
  }): Promise<{ ok: boolean; nomination_id: string; message: string }> {
    if (env.isReal) {
      return callEdge('submit-nomination', data);
    }
    const store = loadStore();
    if (!store.ambassador) throw new Error('Not registered');
    const nom: Nomination = {
      id: genId(),
      ambassador_id: store.ambassador.id,
      business_name: data.business_name,
      owner_name: data.owner_name ?? null,
      contact_email: data.contact_email ?? null,
      contact_phone: data.contact_phone ?? null,
      business_type: data.business_type ?? null,
      city: data.city ?? null,
      website: data.website ?? null,
      relationship: data.relationship ?? null,
      pain_points: data.pain_points ?? null,
      status: 'submitted',
      created_at: new Date().toISOString(),
    };
    store.nominations.unshift(nom);
    store.ambassador.total_nominations = store.nominations.length;
    store.ambassador.pending_nominations = store.nominations.filter(n => n.status === 'submitted').length;
    saveStore(store);
    return { ok: true, nomination_id: nom.id, message: `Thanks! We'll reach out to ${data.business_name}.` };
  },

  async bulkNominate(items: Array<{
    business_name: string;
    owner_name?: string;
    contact_email?: string;
    business_type?: string;
    city?: string;
    relationship?: string;
  }>): Promise<number> {
    const store = loadStore();
    if (!store.ambassador) throw new Error('Not registered');
    let count = 0;
    for (const item of items) {
      if (env.isReal) {
        await this.submitNomination({ referral_code: store.ambassador.referral_code, ...item }).catch(() => {});
      } else {
        const nom: Nomination = {
          id: genId(),
          ambassador_id: store.ambassador.id,
          business_name: item.business_name,
          owner_name: item.owner_name ?? null,
          contact_email: item.contact_email ?? null,
          contact_phone: null,
          business_type: item.business_type ?? null,
          city: item.city ?? null,
          website: null,
          relationship: item.relationship ?? 'LinkedIn connection',
          pain_points: null,
          status: 'submitted',
          created_at: new Date().toISOString(),
        };
        store.nominations.unshift(nom);
        count++;
      }
    }
    if (!env.isReal) {
      store.ambassador.total_nominations = store.nominations.length;
      store.ambassador.pending_nominations = store.nominations.filter(n => n.status === 'submitted').length;
      saveStore(store);
    }
    return count;
  },

  // ---- Commissions -------------------------------------------------------

  async listCommissions(): Promise<Commission[]> {
    if (env.isReal && supabase) {
      const { data, error } = await supabase
        .from('commissions')
        .select('*, nominations(business_name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Commission[];
    }
    return loadStore().commissions;
  },

  // ---- Public referral page (unauthenticated) ----------------------------

  async getReferralPage(code: string): Promise<{
    referral_code: string;
    ambassador_name: string;
    specialty: string | null;
    city: string | null;
  }> {
    if (env.isReal) {
      const base = env.edgeBase ?? `${env.supabaseUrl}/functions/v1`;
      const res = await fetch(`${base}/get-referral-page?code=${encodeURIComponent(code)}`, {
        headers: { Authorization: `Bearer ${env.supabaseAnon}` },
      });
      if (!res.ok) throw new Error('Not found');
      return res.json();
    }
    // Mock: match the demo ambassador or any registered one
    const store = loadStore();
    if (store.ambassador && store.ambassador.referral_code === code) {
      return {
        referral_code: code,
        ambassador_name: store.ambassador.name,
        specialty: store.ambassador.specialty ?? null,
        city: store.ambassador.city ?? null,
      };
    }
    if (code === 'VA-2026') {
      return { referral_code: 'VA-2026', ambassador_name: 'Virginia Ayers', specialty: 'pool service', city: 'Tampa, FL' };
    }
    throw new Error('Not found');
  },
};
