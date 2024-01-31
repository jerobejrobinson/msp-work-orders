/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uyiqxkpetrujkobtyyzl.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/public/**',
      },
    ],
  },
}

module.exports = nextConfig
