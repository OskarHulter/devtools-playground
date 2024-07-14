import "@/styles/globals.css";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import type { AppProps } from "next/app";
import React from "react";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { appWithTranslation } from 'next-i18next'
import type { UserConfig } from 'next-i18next';
import nextI18NextConfig from '@sln/next-i18next.config.js'

const emptyInitialI18NextConfig: UserConfig = {
  i18n: {
    defaultLocale: nextI18NextConfig.i18n.defaultLocale,
    locales: nextI18NextConfig.i18n.locales,
  },
};
// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ["latin"] });

function App({ Component, pageProps }: AppProps) {
	const [parent] = useAutoAnimate();

	return (
		<main className={`${styles.main} ${inter.className}`} ref={parent}>
			<Component {...pageProps} />
		</main>
	);
}

export default appWithTranslation(App, emptyInitialI18NextConfig); // Makes sure the initial i18n instance is not undefined
