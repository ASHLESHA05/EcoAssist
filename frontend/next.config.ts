/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable React Strict Mode
  compiler: {
    reactRemoveProperties: process.env.NODE_ENV === 'production' ? { properties: ['^data-suppress-hydration-warning$'] } : false,
  },
  env: {
    AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
    AUTH0_SECRET: process.env.AUTH0_SECRET,
  },
};

module.exports = nextConfig;

