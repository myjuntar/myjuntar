export interface DecodedJwt {
  id: string
  email: string
  role: 'super_admin' | 'venue_owner' | 'support' | 'user'
  exp: number
}

export function decodeJwt(token: string): DecodedJwt | null {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}
