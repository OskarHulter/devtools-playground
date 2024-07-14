import { RsdoctorWebpackPlugin } from '@rsdoctor/webpack-plugin';
import NextFederationPlugin from '@module-federation/nextjs-mf';
const { i18n } = require('./next-i18next.config')
// You can remove the following 2 lines when integrating our example.
const { loadCustomBuildParams } = require('./next-utils.config')
const { esmExternals = false, tsconfigPath } =
  loadCustomBuildParams()

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    protocol: 'https',
    hostname: 'localhost',
    domains: ['localhost'],
  },
  experimental: {
    esmExternals, // https://nextjs.org/blog/next-11-1#es-modules-support
  },
  i18n,
  webpack(config, options) {
    const { isServer } = options;
    config.plugins.push(
					new NextFederationPlugin({
						name: "main_app",
						remotes: {
							shop_app: `shop_app@http://localhost:3001/_next/static/${
								isServer ? "ssr" : "chunks"
							}/remoteEntry.js`,
						},
						filename: "static/chunks/remoteEntry.js",
						exposes: {
              './Products': './components/Products.js',
            },
						extraOptions: {
							debug: false,
							exposePages: false,
						},
						shared: {},
					}),
					new RsdoctorWebpackPlugin({
						// plugin options
					}),
				);

    return config;
  },
  reactStrictMode: true,
  typescript: {
    tsconfigPath,
  },
};

export default nextConfig;
