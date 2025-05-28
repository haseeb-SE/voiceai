/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['fluent-ffmpeg'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude problematic packages from server-side bundling
      config.externals = config.externals || [];
      config.externals.push({
        'puppeteer-extra': 'commonjs puppeteer-extra',
        'puppeteer-extra-plugin-stealth': 'commonjs puppeteer-extra-plugin-stealth',
        'clone-deep': 'commonjs clone-deep',
      });
    }
    
    // Handle binary files
    config.module.rules.push({
      test: /\.(node|exe)$/,
      use: 'file-loader',
    });

    return config;
  },
};

export default nextConfig;
