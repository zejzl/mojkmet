import { withSentryConfig } from '@sentry/nextjs/config'
import type { NextConfig } from 'next'

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), payment=()',
  },
]

// Pages that must never appear in search results: private/transactional flows, plus /deals
// (hard-coded placeholder promotions with expired dates).
const noindexPaths = [
  '/dashboard/:path*',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/cart',
  '/checkout',
  '/order-confirmation/:path*',
  '/payment/:path*',
  '/deals',
]

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      ...noindexPaths.map((source) => ({
        source,
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      })),
    ]
  },
}

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  telemetry: false,
  // Source maps are deleted after upload by default (SentryBuildSourceMapsOptions), so they
  // aren't served publicly without needing an explicit `hideSourceMaps` option.
  silent: !process.env.SENTRY_AUTH_TOKEN,
})
