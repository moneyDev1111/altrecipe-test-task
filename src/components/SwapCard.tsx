import { Card, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useState } from 'react';

const tokens = [
	{ symbol: 'ETH', decimals: '18', address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' },
	{ symbol: 'USDT', decimals: '6', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
	{ symbol: 'USDC', decimals: '6', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' },
	{ symbol: 'DAI', decimals: '18', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' },
	{ symbol: 'WBTC', decimals: '8', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' },
];
export const SwapCard = () => {
	const [tokenFrom, setTokenFrom] = useState('ETH');
	const [tokenTo, setTokenTo] = useState('USDT');

	const mappedTokensFrom = tokens
		.filter((token) => token.symbol !== tokenTo)
		.map((token, index) => (
			<MenuItem key={index} value={token.symbol}>
				{token.symbol}
			</MenuItem>
		));

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
				// maxWidth: 'fit-content',
				width: '10%',
				margin: '0 auto',
				gap: '2vh',
				borderRadius: '10px',
			}}
			className="card-swap"
		>
			<FormControl>
				<InputLabel id="from-select-label">From</InputLabel>
				<Select labelId="from-select-label" value={tokenFrom} label="From" onChange={(e) => setTokenFrom(e.target.value)}>
					{mappedTokensFrom}
				</Select>
			</FormControl>

			<FormControl>
				<InputLabel id="to-select-label">To</InputLabel>
				<Select labelId="to-select-label" value={tokenTo} label="To" onChange={(e) => setTokenTo(e.target.value)}>
					{mappedTokensTo}
				</Select>
			</FormControl>
		</Card>
	);
};
