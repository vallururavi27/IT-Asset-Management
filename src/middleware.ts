import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken } from '@/lib/session'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const pathname = request.nextUrl.pathname

  console.log(`Middleware: ${pathname}, Token: ${token ? 'present' : 'missing'}`)

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/api/auth/login', '/api/auth/register']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  if (isPublicRoute) {
    console.log(`Public route: ${pathname}`)
    return NextResponse.next()
  }

  // Check if user is authenticated
  if (!token) {
    console.log(`No token, redirecting to login from: ${pathname}`)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const user = verifySessionToken(token)
  if (!user) {
    console.log(`Invalid token, redirecting to login from: ${pathname}`)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  console.log(`Authenticated user: ${user.email} (${user.role})`)

  // Add user info to headers for API routes
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-email', user.email)
  requestHeaders.set('x-user-role', user.role)
  requestHeaders.set('x-user-id', user.email) // Use email as user ID for now

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
