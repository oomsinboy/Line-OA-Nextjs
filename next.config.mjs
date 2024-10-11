/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  distDir: "dist",
  trailingSlash: true,
  images: {
    unoptimized: true,
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

  // webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  // ) => {

  //   if(dev) {
  //     config.watchOptions = {
  //       followSymlinks: true,
  //     }

  //     config.snapshot.managedPaths = [];

  //   }

  //   return config;
  // },
};

export default nextConfig;
