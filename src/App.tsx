import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { Button } from '@mui/material';

import { useWeb3Modal } from '@web3modal/ethers/react';
import { SwapCard } from './components/SwapCard';
// 1. Get projectId
const projectId = '6bb7a5f6-9b96-48f9-aef8-d24a655de07d';

// 2. Set chains
const mainnet = {
	chainId: 1,
	name: 'Ethereum',
	currency: 'ETH',
	explorerUrl: 'https://etherscan.io',
	rpcUrl: 'https://cloudflare-eth.com',
};

// 3. Create a metadata object
const metadata = {
	name: 'My Website',
	description: 'My Website description',
	url: 'https://mywebsite.com', // origin must match your domain & subdomain
	icons: ['https://avatars.mywebsite.com/'],
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
	/*Required*/
	metadata,

	/*Optional*/
	enableEIP6963: true, // true by default
	enableInjected: true, // true by default
	enableCoinbase: true, // true by default
	rpcUrl: '...', // used for the Coinbase SDK
	defaultChainId: 1, // used for the Coinbase SDK
});

// 5. Create a Web3Modal instance
createWeb3Modal({
	// themeVariables: {
	// 	'--w3m-color-mix': '#00BB7F',
	// 	'--w3m-color-mix-strength': 40,
	// 	'--w3m-border-radius-master': '1px',
	// },
	ethersConfig,
	chains: [mainnet],
	projectId,
	enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

export default function App() {
	const { open } = useWeb3Modal();
	return (
		<Container sx={{ minHeight: '100vh', width: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
			<Box>
				<Box display="flex" my={1} justifyContent={'flex-end'}>
					<Button variant="contained" onClick={() => open()} className="btn-wallet__connect">
						Connect Wallet
					</Button>
				</Box>
			</Box>
			<Box minHeight="90%" sx={{ overflow: 'visible' }}>
				<SwapCard />
			</Box>
			<Box textAlign={'center'} fontSize={12} color={'#514F53'}>
				{' '}
				{`DegenDex ${new Date().getFullYear()}`}
			</Box>
		</Container>
	);
}
