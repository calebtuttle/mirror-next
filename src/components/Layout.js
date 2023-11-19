import Link from 'next/link'
import Head from 'next/head'
import { initSilk } from '@silk-wallet/silk-wallet-sdk'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import ThemeContext from '@/context/theme'

const Layout = ({ publication, children }) => {
	if (publication.theme.colorMode === 'DARK' && typeof document !== 'undefined') document.body.classList.add('dark')

	const { connector: activeConnector, isConnected, address } = useAccount()
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
	const { disconnect } = useDisconnect()

	return (
		<>
			<Head>
				<title>{publication.displayName} — Mirror</title>
				<meta name="og:title" content={`${publication.displayName} — Mirror`} />
				{publication.description && (
					<>
						<meta name="description" content={publication.description} />
						<meta name="og:description" content={publication.description} />
					</>
				)}
				<meta name="twitter:card" content="summary" />
				<meta name="og:image" content={publication.avatarURL} />
				<meta name="twitter:image" content={publication.avatarURL} />
				<link rel="alternate" type="application/rss+xml" title={`${publication.displayName} — Mirror`} href="/feed.xml" />
			</Head>
			<ThemeContext.Provider value={{ theme: publication.theme.colorMode === 'DARK' ? 'dark' : 'light', accentColor: publication.theme.accent.toLowerCase() }}>
				<div className={publication.theme.colorMode === 'DARK' ? 'dark' : ''}>
					<div className="dark:bg-gray-900 min-h-screen">
						<header className="p-4">
							<div className="flex justify-between items-center space-x-4">
								<Link href="/">
									<div className="hover:cursor-pointer flex items-center space-x-4">
										<img className="ring-1 ring-gray-200 dark:ring-gray-700 rounded-full w-14 h-14 hover:ring-4 transition ease-in-out" src={publication.avatarURL} />
										<div>
											<a>
												<h1 className="text-xl font-medium dark:text-gray-200">{publication.displayName}</h1>
												<div className="flex items-center space-x-2">
													<span className="rounded-full bg-gray-200 dark:bg-gray-800 px-1 text-sm text-gray-500 font-medium">ENS</span>
													<p className="text-gray-400 dark:text-gray-600 pb-0.5">{process.env.NEXT_PUBLIC_AUTHOR_ENS}</p>
												</div>
											</a>
										</div>
									</div>
								</Link>
								{isConnected && address ? (
									<div>
										<p className="text-sm font-medium dark:text-gray-200">{address}</p>
										<hr />
										<button 
											className="float-right text-gray-300 hover:underline font-bold rounded"
											onClick={() => disconnect()}
										>
											Disconnect
										</button>
									</div>
								) : (
									<button 
										className="bg-gray-300 text-gray-900 hover:bg-gray-200 font-bold py-2 px-4 rounded"
										onClick={async () => {
											try {
												await window.ethereum.login()
												connect({
													connector: connectors[0],
													chainId: 1,
												})
											} catch (err) {
												console.error(err)
											}
										}}
									>
										Login
									</button>
								)}
							</div>
						</header>
						<main className="max-w-3xl mx-auto py-16 px-4 sm:px-0">{children}</main>
					</div>
				</div>
			</ThemeContext.Provider>
		</>
	)
}

export default Layout
