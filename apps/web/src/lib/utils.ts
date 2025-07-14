export interface DecodedToken {
  exp: number
  [key: string]: unknown
}

export function decodeJwt(token: string): DecodedToken | null {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}
