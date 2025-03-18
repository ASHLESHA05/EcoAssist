const nextConfig = {
  reactStrictMode: false, // Disable React Strict Mode
  compiler: {
    reactRemoveProperties: process.env.NODE_ENV === 'production' ? { properties: ['^data-suppress-hydration-warning$'] } : false,
  },
};

module.exports = nextConfig;