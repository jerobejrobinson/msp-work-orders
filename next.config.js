/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
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
