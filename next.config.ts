import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Preserves your original behavior of ignoring type errors during builds
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;