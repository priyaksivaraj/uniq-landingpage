/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    const base = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
    ]
    // X-Frame-Options: DENY breaks in-IDE previews (iframe). Skip in dev; in prod allow opt-out.
    const denyFrame =
      process.env.NODE_ENV === 'production' &&
      process.env.ALLOW_EMBEDDED_PREVIEW !== 'true'
    if (denyFrame) {
      base.unshift({ key: 'X-Frame-Options', value: 'DENY' })
    }
    return [{ source: '/:path*', headers: base }]
  },
}

export default nextConfig
