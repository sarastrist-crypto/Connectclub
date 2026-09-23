import { createClient } from '@supabase/supabase-js';
import { env } from './env';

export const supabase = env.supabaseUrl && env.supabaseAnon
  ? createClient(env.supabaseUrl, env.supabaseAnon)
  : null;

export async function callEdge<T>(fn: string, body?: unknown): Promise<T> {
  const base = env.edgeBase ?? `${env.supabaseUrl}/functions/v1`;
  const res = await fetch(`${base}/${fn}`, {
    method: body !== undefined ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.supabaseAnon}` },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? res.statusText);
  }
  return res.json();
}
