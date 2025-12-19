/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'http',
        hostname: '142.93.172.35',
        port: '1337',
      },
    ],
    // Allow unoptimized images for HTTP sources (required for production)
    // This prevents Next.js from trying to optimize HTTP images which can cause issues
    unoptimized: false,
  },
}

module.exports = nextConfig

