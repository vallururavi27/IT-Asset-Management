'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Redirect to dashboard
        router.push('/dashboard')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header Section */}
        <div className="text-center animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <span className="text-white font-bold text-3xl">IT</span>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            IT Asset Management System
          </h2>
          <p className="mt-3 text-lg text-gray-600 font-medium">
            Professional Asset Tracking & Management
          </p>
          <p className="text-sm text-blue-600 font-medium">
            Streamline Your IT Operations
          </p>

          {/* Support Banner */}
          <div className="mt-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              💖 <span className="font-semibold text-green-600">Free & Open Source</span> -
              <a href="https://github.com/sponsors/vallururavi27" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 ml-1 underline font-medium">
                Support This Project
              </a>
            </p>
          </div>
          <p className="mt-1 text-center text-xs text-gray-500">
            Sign in to your account
          </p>
        </div>
        {/* Login Form */}
        <form className="mt-8 space-y-6 card" onSubmit={handleSubmit}>
          <div className="card-body">
            {error && (
              <div className="bg-gradient-to-r from-red-100 to-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">⚠️</span>
                  {error}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="spinner mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  'Sign in to Dashboard'
                )}
              </button>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Demo Credentials:</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Admin:</strong> admin@example.com / admin123</p>
                <p><strong>Manager:</strong> manager@example.com / manager123</p>
                <p><strong>User:</strong> user@example.com / user123</p>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Built with ❤️ for the community -
            <a href="https://github.com/sponsors/vallururavi27" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 ml-1 underline">
              Support this project
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}