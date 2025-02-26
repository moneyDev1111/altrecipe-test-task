import Container from '@mui/material/Container'
import Box from '@mui/material/Box'

import {
	createWeb3Modal,
	defaultConfig,
	useWeb3ModalAccount,
	useWeb3ModalProvider,
} from '@web3modal/ethers/react'
import { Button, Tooltip } from '@mui/material'

import { useWeb3Modal } from '@web3modal/ethers/react'
import { SwapCard } from './components/SwapCard'
import { useState } from 'react'
import { Token } from './data/interfaces'
import { tokens } from './data/evm'
// 1. Get projectId
const projectId = '6bb7a5f6-9b96-48f9-aef8-d24a655de07d'

// 2. Set chains
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
	rpcUrl: 'https://rpc.ankr.com/eth_sepolia',
}
// 3. Create a metadata object
const metadata = {
	name: 'My Website',
	description: 'My Website description',
	url: 'https://mywebsite.com', // origin must match your domain & subdomain
	icons: ['https://avatars.mywebsite.com/'],
}

// 4. Create Ethers config
const ethersConfig = defaultConfig({
	/*Required*/
	metadata,

	/*Optional*/
	enableEIP6963: true, // true by default
	enableInjected: true, // true by default
	enableCoinbase: true, // true by default
})

// 5. Create a Web3Modal instance
createWeb3Modal({
	// themeVariables: {
	// 	'--w3m-color-mix': '#00BB7F',
	// 	'--w3m-color-mix-strength': 40,
	// 	'--w3m-border-radius-master': '1px',
	// },
	ethersConfig,
	chains: [sepolia],
	projectId,
	enableAnalytics: true, // Optional - defaults to your Cloud configuration
})

const shortenAddress = (address: string) => {
	const firstPart = address.slice(0, 5)
	const secondPart = address.slice(35, -1)
	return firstPart + '...' + secondPart
}
export default function App() {
	const { address, chainId, isConnected } = useWeb3ModalAccount()
	const { walletProvider } = useWeb3ModalProvider()
	const { open } = useWeb3Modal()
	const [tokenBalance, setTokenBalance] = useState('')
	const [ethBalance, setEthBalance] = useState('')
	const [wethBalance, setWethBalance] = useState('')
	const [tokenFrom, setTokenFrom] = useState<Token>(tokens[0])
	const [tokenTo, setTokenTo] = useState<Token>(tokens[1])

	return (
		<Container
			sx={{
				minHeight: '100vh',
				width: '80%',
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
				{`made by moneyDev1111 \u00A9 ${new Date().getFullYear()}`}
			</Box>
		</Container>
	)
}
