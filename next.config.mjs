/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "**",
        },
      ]
    },
    experimental: {
      taint: true,
    },
  }
    ;
export default nextConfig;