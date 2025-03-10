/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/app-build-manifest.json$/, /_next\/static\/chunks\/218-cdcb19fb98f73709\.js$/, /_next\/static\/a5Xu7z2gdLc70Q3tru52n\/_buildManifest\.js$/],
  fallbacks: {
    image: 'favicon.png'
  }
});

const nextConfig = {
  reactStrictMode: true,
  // Remove custom webpack configuration
};

module.exports = withPWA(nextConfig);
