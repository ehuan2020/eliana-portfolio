import 'server-only'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Service-role client — bypasses RLS. Only ever import this from route
// handlers (src/app/api/**). Never import from a 'use client' component.
export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  serviceRoleKey || 'placeholder',
  { auth: { autoRefreshToken: false, persistSession: false } }
)
