import { RsdoctorWebpackPlugin } from '@rsdoctor/webpack-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.plugins.push(
      new RsdoctorWebpackPlugin({
        // plugin options
      }),
    );

    return config;
  },
  reactStrictMode: true,
};

export default nextConfig;
