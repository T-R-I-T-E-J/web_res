/** @type {import('next').NextConfig} */
// Force rebuild timestamp: 2026-01-08T14:24:00
const nextConfig = {
  reactStrictMode: true,
  output: process.env.VERCEL ? undefined : 'standalone',
  async rewrites() {
    // Only proxy uploads, not API calls (API calls go directly to Render)
    const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://web-res.onrender.com';
    let backendUrl = apiUrl.startsWith('http') ? apiUrl : 'http://localhost:4000';
    // Remove trailing slash and /api/v1 suffix to avoid duplication
    backendUrl = backendUrl.replace(/\/$/, '').replace(/\/api\/v1$/, '');
    
    return [
      // Proxy ALL API calls to Render backend
      // This ensures cookies are set on the Vercel domain
      {
        source: '/api/v1/:path*',
        destination: `${backendUrl}/api/v1/:path*`,
      },
      // Proxy uploads only (images, documents, etc.)
      {
        source: '/uploads/:path*',
        destination: `${backendUrl}/uploads/:path*`,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
        ],
      },
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig

