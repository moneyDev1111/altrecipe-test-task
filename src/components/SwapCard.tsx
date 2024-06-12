import { Alert, Box, Button, Card, CircularProgress, FormControl, InputLabel, MenuItem, Select, Slider, TextField } from '@mui/material';
import { BrowserProvider, Contract, Eip1193Provider, formatUnits } from 'ethers';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Erc20_ABI, WETH_ABI, tokens } from '../data/evm';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SwapVerticalCircleOutlinedIcon from '@mui/icons-material/SwapVerticalCircleOutlined';
import Snackbar from '@mui/material/Snackbar';

export const SwapCard = ({
	isConnected,
	walletProvider,
	accountAddress,
	tokenBalance,
	setTokenBalance,
	tokenFrom,
	setTokenFrom,
	tokenTo,
	setTokenTo,
}: {
	isConnected: boolean;
	walletProvider: Eip1193Provider | undefined;
	accountAddress: string | undefined;
	tokenBalance: string;
	setTokenBalance: Dispatch<SetStateAction<string>>;
	tokenFrom: string;
	setTokenFrom: Dispatch<SetStateAction<string>>;
	tokenTo: string;
	setTokenTo: Dispatch<SetStateAction<string>>;
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [openSnack, setOpenSnack] = useState(false);

	const [amountFrom, setAmountFrom] = useState('');
	// const { enqueueSnackbar } = useSnackbar();

	const mappedTokensFrom = tokens
		.filter((token) => token.symbol !== tokenTo)
		.map((token, index) => (
			<MenuItem key={index} value={token.symbol}>
				{token.symbol}
			</MenuItem>
		));

	const sendTx = async () => {
		setIsLoading(true);

		try {
			if (tokenFrom === 'ETH' && tokenTo === 'WETH' && walletProvider) {
				const provider = new BrowserProvider(walletProvider!);
				const tokenAddress = tokens.find((token) => token.symbol === tokenFrom)?.address;

				const WETH_Contract = new Contract(tokenAddress!, WETH_ABI, provider);

				const res = await WETH_Contract.deposit({ value: amountFrom, from: await provider.getSigner() });

				const txRes = await res.wait();

				console.log(txRes);

				if (txRes.status === '1') {
					setIsLoading(false);

					setOpenSnack(true);
				}
			} else {
				const provider = new BrowserProvider(walletProvider!);
				const tokenAddress = tokens.find((token) => token.symbol === tokenFrom)?.address;

				const WETH_Contract = new Contract(tokenAddress!, WETH_ABI, provider);

				const res = await WETH_Contract.withdraw({ value: amountFrom, from: await provider.getSigner() });

				const txRes = await res.wait();

				console.log(txRes);

				if (txRes.status === '1') {
					setIsLoading(false);

					setOpenSnack(true);
				}
			}
		} catch (error) {
			setIsLoading(false);

			console.log(error);
		}
	};
	const getBalance = async () => {
		try {
			const provider = new BrowserProvider(walletProvider!);

			if (tokenFrom === 'ETH') {
				setTokenBalance(formatUnits(await provider.getBalance(accountAddress!), 18));
			} else {
				const tokenAddress = tokens.find((token) => token.symbol === tokenFrom)?.address;

				if (tokenAddress) {
					const tokenContract = new Contract(tokenAddress, tokenFrom === 'WETH' ? WETH_ABI : Erc20_ABI, provider);
					setTokenBalance(formatUnits(await tokenContract.balanceOf(accountAddress)));
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
				gap: '1.2vh',
				borderRadius: '10px',
				position: 'relative',
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
					onChange={(e) => {
						if (e.target.value > tokenBalance) setAmountFrom(tokenBalance);
						else setAmountFrom(e.target.value);
					}}
				/>
				<FormControl sx={{ width: '10vw' }}>
					<InputLabel id="from-select-label">From</InputLabel>
					<Select labelId="from-select-label" value={tokenFrom} label="From" onChange={(e) => setTokenFrom(e.target.value)}>
						{mappedTokensFrom}
					</Select>
				</FormControl>
			</Box>
			<span
				onClick={(e) => {
					setTokenTo(tokenFrom);
					setTokenFrom(tokenTo);
				}}
			>
				<SwapVerticalCircleOutlinedIcon className="swap-icon" />
			</span>

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
				<FormControl sx={{ width: '10vw' }}>
					<InputLabel id="to-select-label">To</InputLabel>
					<Select labelId="to-select-label" value={tokenTo} label="To" onChange={(e) => setTokenTo(e.target.value)}>
						{mappedTokensTo}
					</Select>
				</FormControl>
			</Box>

			<Box display="flex" justifyContent="center" alignItems={'center'} gap={'1em'} mt={'1em'}>
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

			<Button
				variant="outlined"
				endIcon={<AccountBalanceWalletIcon />}
				sx={{ fontSize: '1.25rem', width: '75%', margin: '1em auto 0 auto' }}
				onClick={(e) => sendTx()}
			>
				{!isLoading ? (
					tokenFrom === 'ETH' && tokenTo === 'WETH' ? (
						'Wrap'
					) : tokenFrom === 'WETH' && tokenTo === 'ETH' ? (
						'Unwrap'
					) : (
						'Swap'
					)
				) : (
					<>
						<svg width={0} height={0}>
							<defs>
								<linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
									<stop offset="0%" stopColor="#e01cd5" />
									<stop offset="100%" stopColor="#1CB5E0" />
								</linearGradient>
							</defs>
						</svg>
						<CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
					</>
				)}
			</Button>
		</Card>
	);
};
