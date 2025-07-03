import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ❌ Removed 'output: export' — not compatible with dynamic routes
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
