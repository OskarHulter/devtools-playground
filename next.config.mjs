import { RsdoctorWebpackPlugin } from '@rsdoctor/webpack-plugin';
import MillionLint from "@million/lint";


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

export default MillionLint.next({
  rsc: false,
  // filter: {
  //   include: "**/components/*.{mtsx,mjsx,tsx,jsx}",
  // },
})(nextConfig);


/*
 ? Limited to old WP? try this

const MillionLint = require("@million/lint");
module.exports = {
  plugins: [MillionLint.webpack()],
};

*/
