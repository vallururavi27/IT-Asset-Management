// Edge Runtime compatible session management
export interface SessionUser {
  email: string
  role: string
  userId: string
  name: string
}

// Simple Edge Runtime compatible token verification
export function verifySessionToken(token: string): SessionUser | null {
  try {
    console.log('Verifying token:', token.substring(0, 20) + '...')

    // Simple JWT decode without verification for Edge Runtime
    // In production, you'd want to use Web Crypto API for verification
    const parts = token.split('.')
    if (parts.length !== 3) {
      console.log('Invalid token format')
      return null
    }

    const payload = JSON.parse(atob(parts[1]))
    console.log('Token decoded successfully:', payload.email)

    // Check if token is expired
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      console.log('Token expired')
      return null
    }

    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      name: payload.name
    }

  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}
