/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/ConvoWebsite' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig; 