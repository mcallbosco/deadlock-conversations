/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Configure the base path if you're deploying to a subdirectory
  basePath: '/deadlock-conversations',
  // Set this to false because GitHub Pages doesn't support some features that would require trailing slash
  trailingSlash: false,
  // Disable image optimization since GitHub Pages doesn't support Next.js Image Optimization API
  images: {
    unoptimized: true,
  },
};

export default nextConfig; 