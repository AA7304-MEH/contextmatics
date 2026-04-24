import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
  output: 'standalone',
  swcMinify: true,
  experimental: {
    workerThreads: false,
    cpus: 1,
    serverComponentsExternalPackages: [
      'fluent-ffmpeg',
      'ffmpeg-static',
      '@ffmpeg-installer/ffmpeg',
      'ytdl-core',
      'groq-sdk',
      '@sparticuz/chromium',
      'puppeteer-core',
    ],
  },
  productionBrowserSourceMaps: false,
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        'fluent-ffmpeg',
        'ffmpeg-static',
        '@ffmpeg-installer/ffmpeg',
      ];
    }
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      child_process: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

export default nextConfig;
