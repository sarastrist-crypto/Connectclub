import { z } from 'zod';

const schema = z.object({
  VITE_SUPABASE_URL:      z.string().url().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().min(10).optional(),
  VITE_EDGE_BASE:         z.string().url().optional(),
});

const parsed = schema.safeParse(import.meta.env);
if (!parsed.success) {
  console.warn('[refer-hub] Env validation warnings:', parsed.error.flatten());
}

export const env = {
  supabaseUrl:    import.meta.env.VITE_SUPABASE_URL  as string | undefined,
  supabaseAnon:   import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined,
  edgeBase:       import.meta.env.VITE_EDGE_BASE as string | undefined,
  /** True only when both Supabase creds are present */
  isReal: !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY),
};
