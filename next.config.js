/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
    serverActions: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uyiqxkpetrujkobtyyzl.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/public/**',
      },
      {
        protocol: 'http',
        hostname: 'bwipjs-api.metafloor.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
