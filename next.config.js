/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["api.wasteof.money"],
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
