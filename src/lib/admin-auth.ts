import 'server-only'
import { createHash } from 'crypto'
import { NextRequest } from 'next/server'

export const ADMIN_COOKIE = 'admin_session'

export function adminSessionToken(): string | null {
  const secret = process.env.ADMIN_PASSWORD
  if (!secret) return null
  return createHash('sha256').update(secret).digest('hex')
}

export function hasValidAdminSession(request: NextRequest): boolean {
  const expected = adminSessionToken()
  if (!expected) return false
  return request.cookies.get(ADMIN_COOKIE)?.value === expected
}
