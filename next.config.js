/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.wasteof.money",
        port: "",
        pathname: "/users/**/picture",
      },
    ],
    dangerouslyAllowSVG: true
  },
};

module.exports = nextConfig;
