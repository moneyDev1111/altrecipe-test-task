import { Box, Button, Card, FormControl, InputLabel, MenuItem, Select, Slider, TextField } from '@mui/material';
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { BrowserProvider, formatUnits } from 'ethers';
import { useEffect, useState } from 'react';

const tokens = [
	{ symbol: 'ETH', decimals: '18', address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' },
	{ symbol: 'USDT', decimals: '6', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
	{ symbol: 'USDC', decimals: '6', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' },
	{ symbol: 'DAI', decimals: '18', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' },
	{ symbol: 'WBTC', decimals: '8', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' },
];

interface Wallet {
	address: string;
	balance: bigint | string;
}
export const SwapCard = () => {
	const { address, chainId, isConnected } = useWeb3ModalAccount();
	const { walletProvider } = useWeb3ModalProvider();

	const [tokenFrom, setTokenFrom] = useState('ETH');
	const [tokenTo, setTokenTo] = useState('USDT');
	const [amountFrom, setAmountFrom] = useState('');
	const [tokenBalance, setTokenBalance] = useState('');
	const [wallet, setWallet] = useState<Wallet>();
	const [isWalletConnected, setIsWalletConnected] = useState(false);
	const mappedTokensFrom = tokens
		.filter((token) => token.symbol !== tokenTo)
		.map((token, index) => (
			<MenuItem key={index} value={token.symbol}>
				{token.symbol}
			</MenuItem>
		));

	const getBalance = async () => {
		try {
			const provider = new BrowserProvider(walletProvider!);
			const signer = await provider.getSigner();

			const balance = await provider.getBalance(address!);

			setTokenBalance(formatUnits(balance, 18));
		} catch (error: any) {
			console.log(error);
		}
	};

	useEffect(() => {
		isConnected && getBalance();
	}, [isConnected]);

	const mappedTokensTo = tokens
		.filter((token) => token.symbol !== tokenFrom)
		.map((token, index) => (
			<MenuItem key={index} value={token.symbol}>
				{token.symbol}
			</MenuItem>
		));

	return (
		<Card
			sx={{
				padding: '1em',
				display: 'flex',
				flexDirection: 'column',
				width: '40%',
				margin: '0 auto',
				gap: '2vh',
				borderRadius: '10px',
			}}
			className="card-swap"
		>
			<Box display="flex" flexDirection="row" component="form" noValidate autoComplete="off">
				<TextField
					InputProps={{ inputProps: { min: 0, max: tokenBalance, step: '0.0001' } }}
					fullWidth
					id="outlined-from"
					label="Amount From"
					type="number"
					value={amountFrom !== '0' ? amountFrom : ''}
					onChange={(e) => setAmountFrom(e.target.value)}
				/>
				<FormControl sx={{ width: '7vw' }}>
					<InputLabel id="from-select-label">From</InputLabel>
					<Select labelId="from-select-label" value={tokenFrom} label="From" onChange={(e) => setTokenFrom(e.target.value)}>
						{mappedTokensFrom}
					</Select>
				</FormControl>
			</Box>

			<Box display="flex" flexDirection="row" component="form" noValidate autoComplete="off">
				<TextField fullWidth id="outlined-to" label="Amount To" type="number" />
				<FormControl sx={{ width: '7vw' }}>
					<InputLabel id="to-select-label">To</InputLabel>
					<Select labelId="to-select-label" value={tokenTo} label="To" onChange={(e) => setTokenTo(e.target.value)}>
						{mappedTokensTo}
					</Select>
				</FormControl>
			</Box>

			<Box display="flex" justifyContent="center" alignItems={'center'} gap={'1em'} mt={'0.5em'}>
				<Box component={'span'} width={'70%'}>
					<Slider
						onChange={(e, value) => {
							setAmountFrom(String(value));
						}}
						sx={{ width: '90%', margin: '0 auto', display: 'table' }}
						aria-label="amount"
						valueLabelDisplay="auto"
						min={0}
						step={0.000000000000000001}
						value={amountFrom ? parseFloat(amountFrom) : 0}
						max={tokenBalance ? parseFloat(tokenBalance) : 0}
					/>
				</Box>
				<Button
					onClick={() => {
						setAmountFrom(tokenBalance);
					}}
					variant="contained"
				>
					Max
				</Button>
			</Box>
		</Card>
	);
};
