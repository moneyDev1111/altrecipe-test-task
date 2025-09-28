import Container from '@mui/material/Container'
import Box from '@mui/material/Box'

import {
	createWeb3Modal,
	defaultConfig,
	useWeb3ModalAccount,
	useWeb3ModalProvider,
} from '@web3modal/ethers/react'

import { Button, Tooltip, useMediaQuery } from '@mui/material'

import { useWeb3Modal } from '@web3modal/ethers/react'
import { SwapCard } from './components/SwapCard'
import { useState } from 'react'
import { Token } from './utils/interfaces'
import { tokens } from './utils/evm'
import { shortenAddress } from './utils/helpers'

const projectId = 'b9e6d28dc1ad59a98ef17279b1f38bff'

const mainnet = {
	chainId: 1,
	name: 'Ethereum',
	currency: 'ETH',
	explorerUrl: 'https://etherscan.io',
	rpcUrl: 'https://cloudflare-eth.com',
}
const sepolia = {
	chainId: 11155111,
	name: 'Sepolia',
	currency: 'ETH',
	explorerUrl: 'https://sepolia.etherscan.io/',
	rpcUrl: 'https://1rpc.io/sepolia',
}

const metadata = {
	name: 'Alt recipe test task',
	description: 'Alt recipe test task description',
	url: 'https://dex-swap-nine.vercel.app/',
	icons: [],
}

const ethersConfig = defaultConfig({
	metadata,
})

createWeb3Modal({
	// themeVariables: {
	// 	'--w3m-color-mix': '#00BB7F',
	// 	'--w3m-color-mix-strength': 40,
	// 	'--w3m-border-radius-master': '1px',
	// },
	ethersConfig,
	chains: [sepolia],
	projectId,
	enableAnalytics: false, // Optional - defaults to your Cloud configuration
})

export default function App() {
	const { address, chainId, isConnected } = useWeb3ModalAccount()
	const { walletProvider } = useWeb3ModalProvider()
	const { open } = useWeb3Modal()
	const [tokenBalance, setTokenBalance] = useState('')
	const [ethBalance, setEthBalance] = useState('')
	const [wethBalance, setWethBalance] = useState('')
	const [tokenFrom, setTokenFrom] = useState<Token>(tokens[0])
	const [tokenTo, setTokenTo] = useState<Token>(tokens[1])
	const isMobile = useMediaQuery('(max-width:900px)')

	return (
		<Container
			sx={{
				minHeight: '100vh',
				width: isMobile ? '100%' : '80%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
			}}
		>
			<Box>
				<Box
					display="flex"
					my={1}
					justifyContent="space-between"
					alignItems={'center'}
					fontSize={'0.9rem'}
					marginTop={'0.7em'}
				>
					<Box>
						<a href="https://altrecipe.com/" target="_blank" rel="noopener noreferrer">
							<Tooltip title="Go to the company site">
								<img
									src={`${process.env.PUBLIC_URL}/logo.svg`}
									className="logo"
								></img>
							</Tooltip>
						</a>
					</Box>
					<Box display={'flex'} alignItems={'center'}>
						{/* {isConnected && tokenBalance && (
							<Box display={'flex'} flexDirection={'column'} marginRight={'1.3em'} className="balances">
								<Box>ETH: &nbsp;{ethBalance.slice(0, 5)}</Box>
								<Box>WETH: {wethBalance.slice(0, 5)}</Box>
							</Box>
						)} */}
						<Button
							variant="contained"
							onClick={() => open()}
							className="btn-wallet__connect"
						>
							{isConnected && address ? shortenAddress(address) : 'Connect Wallet'}
						</Button>
					</Box>
				</Box>
			</Box>
			<Box minHeight="90%" sx={{ overflow: 'visible' }}>
				<SwapCard
					isConnected={isConnected}
					walletProvider={walletProvider}
					accountAddress={address}
					tokenBalance={tokenBalance}
					setTokenBalance={setTokenBalance}
					setEthBalance={setEthBalance}
					setWethBalance={setWethBalance}
					tokenFrom={tokenFrom}
					setTokenFrom={setTokenFrom}
					tokenTo={tokenTo}
					setTokenTo={setTokenTo}
				/>
			</Box>
			<Box className="sign" textAlign={'center'} fontSize={12}>
				{`made by moneyDev1111 \u00A9 2024`}
			</Box>
		</Container>
	)
}
