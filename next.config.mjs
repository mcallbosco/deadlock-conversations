/** @type {import('next').NextConfig} */
import os from 'os';

const nextConfig = {
  output: 'export',
  // Remove the basePath for local development
  basePath: '',
  images: {
    unoptimized: true,
  },
  // Add trailingSlash for better compatibility with static hosting
  trailingSlash: true,
  // Disable strict mode for static export
  reactStrictMode: false,
  // Configure environment variables
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NODE_ENV === 'production' 
      ? 'https://yourdomain.com/ConvoWebsite' 
      : 'http://localhost:3000',
  },
  // Increase the static generation concurrency for better performance with many pages
  staticPageGenerationTimeout: 180, // 3 minutes
  experimental: {
    // Enable concurrent features for better performance
    cpus: Math.max(1, Math.min(8, os.cpus().length - 1)),
    // Disable the build indicator in production
    disableOptimizedLoading: true,
  },
  // Configure webpack to handle JSON imports
  webpack: (config) => {
    // This allows importing JSON files directly
    config.module.rules.push({
      test: /\.json$/,
      type: 'json',
    });
    
    return config;
  },
};

export default nextConfig; 