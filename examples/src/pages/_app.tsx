import "@/styles/globals.css";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import type { AppProps } from "next/app";
import React from "react";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
	const [parent] = useAutoAnimate();

	return (
		<main className={`${styles.main} ${inter.className}`} ref={parent}>
			<Component {...pageProps} />
		</main>
	);
}
