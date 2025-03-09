/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/app-build-manifest.json$/],
  fallbacks: {
    image: '/icons/icon-384x384.png'
  }
});

const nextConfig = {
  reactStrictMode: true,
  // Remove custom webpack configuration
};

module.exports = withPWA(nextConfig);
