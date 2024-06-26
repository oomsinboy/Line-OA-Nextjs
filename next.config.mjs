/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  // distDir: "dist",
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  reactStrictMode: false,
  // async redirects() {
  //   return [
  //     {
  //       source: "/",
  //       destination: "/login",
  //       permanent: false,
  //     },
  //   ];
  // },
};

export default nextConfig;
