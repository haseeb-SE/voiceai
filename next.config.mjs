/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['fluent-ffmpeg', 'puppeteer', 'puppeteer-extra', 'puppeteer-extra-plugin-stealth'],
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
    if (!isServer) {
      // Exclude server-only packages from client bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        util: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        tty: false,
        net: false,
        child_process: false,
      };
      
      config.externals = config.externals || [];
      config.externals.push({
        'puppeteer': 'commonjs puppeteer',
        'puppeteer-extra': 'commonjs puppeteer-extra',
        'puppeteer-extra-plugin-stealth': 'commonjs puppeteer-extra-plugin-stealth',
        'fluent-ffmpeg': 'commonjs fluent-ffmpeg',
        'clone-deep': 'commonjs clone-deep',
        '@tootallnate/quickjs-emscripten': 'commonjs @tootallnate/quickjs-emscripten',
        'pac-proxy-agent': 'commonjs pac-proxy-agent',
        'proxy-agent': 'commonjs proxy-agent',
        '@puppeteer/browsers': 'commonjs @puppeteer/browsers',
      });
    }
    
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
