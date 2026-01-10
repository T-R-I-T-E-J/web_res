/** @type {import('next').NextConfig} */
// Force rebuild timestamp: 2026-01-08T14:24:00
const nextConfig = {
  reactStrictMode: true,
  output: process.env.VERCEL ? undefined : 'standalone',
  async rewrites() {
    let backendUrl = (process.env.API_URL && process.env.API_URL.startsWith('http')) ? process.env.API_URL : 'http://localhost:4000';
    // Remove trailing slash and /api/v1 suffix to avoid duplication in rewrites
    backendUrl = backendUrl.replace(/\/$/, '').replace(/\/api\/v1$/, '');
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendUrl}/api/v1/:path*`,
      },
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
}

module.exports = nextConfig

