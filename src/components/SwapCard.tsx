import { Box, Button, Card, FormControl, InputLabel, MenuItem, Select, Slider, TextField } from '@mui/material';
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { BrowserProvider, Contract, formatUnits } from 'ethers';
import { useEffect, useState } from 'react';
import { Wallet } from '../data/interfaces';
import { Erc20_ABI, tokens } from '../data/evm';

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

			if (tokenFrom === 'ETH') {
				setTokenBalance(formatUnits(await provider.getBalance(address!), 18));
			} else {
				const tokenAddress = tokens.find((token) => token.symbol === tokenFrom)?.address;

				if (tokenAddress) {
					const tokenContract = new Contract(tokenAddress, Erc20_ABI, provider);
					setTokenBalance(formatUnits(await tokenContract.balanceOf(address)));
				}
			}
		} catch (error: any) {
			console.log(error);
		}
	};

	useEffect(() => {
		isConnected && getBalance();
	}, [isConnected, tokenFrom]);

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
					InputProps={{
						inputProps: { min: 0, max: tokenBalance, step: '0.0001' },
					}}
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
				<TextField
					InputProps={
						{
							// inputProps: { min: 0, max: tokenBalance, step: '0.0001' },
						}
					}
					fullWidth
					id="outlined-to"
					label="Amount To"
					type="number"
				/>
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
