/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "replicate.delivery",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "pbxt.replicate.delivery",
        pathname: "/**"
      }
    ]
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["*"]
    }
  }
};

module.exports = nextConfig;
