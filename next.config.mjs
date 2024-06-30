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
        taint: false // This is the default, but taint: true breaks nextui dropdowns/modals
    }
  }
    ;
export default nextConfig;