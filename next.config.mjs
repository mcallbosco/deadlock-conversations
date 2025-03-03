/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/deadlock-conversations' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig; 