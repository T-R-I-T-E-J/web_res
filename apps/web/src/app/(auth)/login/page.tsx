'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'


// Use Next.js proxy to ensure cookies are set on the same domain
const API_URL = '/api/v1'

const LoginPage = () => {
  console.log('LoginPage rendered, API_URL:', API_URL);
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted, preventing default');
    setIsLoading(true)
    setError('')
    setSuccessMessage('')

    // DEBUG: Log the password length and value
    console.log('Password length:', formData.password.length);
    console.log('Password value:', formData.password);
    console.log('Full form data:', formData);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Enable cookies for cross-origin requests
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const responseData = await res.json()

      // DEBUG: Log the full response
      console.log('Response status:', res.status);
      console.log('Response data:', responseData);

      if (!res.ok) {
        throw new Error(responseData.message || 'Login failed')
      }

      // Login Successful
      setSuccessMessage('Login successful! Redirecting...')
      
      // Login Successful - Backend wraps response in { success, data }
      // Login Successful - Backend sets HttpOnly cookie
      const { user } = responseData.data || responseData
      
      // DEBUG: Log user extraction
      console.log('Extracted user:', user);
      console.log('User roles:', user?.roles);
      
      if (!user) {
        console.error('No user in response! Response structure:', responseData);
        throw new Error('Invalid response from server')
      }

      // No need to set cookie manually anymore
      // Cookies are handled by the backend (HttpOnly)

      // Redirect based on role
      const roles = user.roles || []
      
      console.log('About to redirect with roles:', roles);
      
      // Determine redirect path
      let redirectPath = '/';
      if (roles.includes('admin')) {
        console.log('Redirecting to /admin');
        redirectPath = '/admin';
      } else if (roles.includes('shooter')) {
        console.log('Redirecting to /shooter');
        redirectPath = '/shooter';
      } else {
        console.log('Redirecting to /');
      }
      
      // Use router.push with window.location as fallback
      console.log('Attempting redirect to:', redirectPath);
      
      // Method 1: Try Next.js router first
      router.push(redirectPath);
      router.refresh();
      
      // Method 2: Fallback to window.location after a short delay
      setTimeout(() => {
        console.log('Fallback redirect executing...');
        window.location.href = redirectPath;
      }, 500);

    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'An unexpected error occurred. Please try again.')
    } finally {
      if(!successMessage) setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="card">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl font-bold text-primary mb-2">
            Welcome Back
          </h1>
          <p className="text-neutral-600">
            Sign in to access your portal
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-card flex items-start gap-3">
             <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
             <p className="text-sm text-green-600 font-medium">{successMessage}</p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-card flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="input pl-12"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className="input pl-12 pr-12"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 rounded border-neutral-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-neutral-600">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-interactive hover:text-primary"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                {successMessage ? 'Redirecting...' : 'Signing in...'}
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-neutral-500">or</span>
          </div>
        </div>

        {/* Register Link */}
        <p className="text-center text-neutral-600">
          Don't have an account?{' '}
          <Link
            href="/register"
            className="font-semibold text-primary hover:text-accent"
          >
            Register here
          </Link>
        </p>
      </div>
      
      {/* Demo Credentials Removed - Use real accounts */
      /* <div className="mt-6 p-4 bg-neutral-100 rounded-card text-center text-sm">
         ...
      </div> */
      }
    </div>
  )
}

export default LoginPage

