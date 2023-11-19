import NProgress from 'nprogress'
import { useRouter } from 'next/router'
import '@/styles/style.css'
import { useEffect } from 'react'
import { initSilk } from '@silk-wallet/silk-wallet-sdk'
import Layout from '@/components/Layout'
import * as Fathom from 'fathom-client'
import { configureChains, mainnet, createConfig, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()],
)

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
})

function MyApp({ Component, pageProps }) {
	const router = useRouter()

	NProgress.configure({ showSpinner: false })

	useEffect(() => {
		// Fathom.load('STJUQNYD', {
		// 	includedDomains: ['m1guelpf.blog'],
		// 	url: 'https://hyena.m1guelpf.blog/script.js',
		// })

		// // Record a pageview when route changes
		// router.events.on('routeChangeComplete', () => Fathom.trackPageview())

		// // Unassign event listener
		// return () => {
		// 	router.events.off('routeChangeComplete', () => Fathom.trackPageview())
		// }
		// // eslint-disable-next-line react-hooks/exhaustive-deps

		const silk = initSilk()
		window.ethereum = silk
	}, [])

	useEffect(() => {
		router.events.on('routeChangeStart', () => NProgress.start())
		router.events.on('routeChangeComplete', () => NProgress.done())
		router.events.on('routeChangeError', () => NProgress.done())

		return () => {
			router.events.off('routeChangeStart', () => NProgress.start())
			router.events.off('routeChangeComplete', () => NProgress.done())
			router.events.off('routeChangeError', () => NProgress.done())
		}
	})

	if (Component.hasLayout === false) return <Component {...pageProps} />

	return (
		<WagmiConfig config={config}>
			<Layout {...pageProps}>
				<Component {...pageProps} />
			</Layout>
		</WagmiConfig>
	)
}

export default MyApp
