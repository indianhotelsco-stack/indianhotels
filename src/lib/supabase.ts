import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/** Browser/server-safe client — read-only per Row Level Security policies. */
export const supabase = createClient(url, anonKey)

/** Server-only client using the service role key — bypasses RLS. Never import this in a Client Component. */
export function supabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_KEY
  if (!serviceKey) throw new Error('SUPABASE_SERVICE_KEY is not set')
  return createClient(url, serviceKey)
}
