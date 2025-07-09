import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // If user is authenticated, continue to the requested page
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Return true if user has a valid token (is logged in)
        return !!token
      }
    },
    pages: {
      signIn: '/login', // Redirect unauthenticated users to login page
    }
  }
)

// Specify which routes to protect
export const config = {
  matcher: [
    '/dashboard/:path*',     // Protect all dashboard routes
    '/api/dashboard/:path*', // Protect dashboard API routes
    '/api/roadmap/:path*',   // Protect roadmap API routes
    // Add other protected routes here
  ]
}