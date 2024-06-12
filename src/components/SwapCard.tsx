import {
	Alert,
	Box,
	Button,
	Card,
	CircularProgress,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Slider,
	Snackbar,
	TextField,
	Tooltip,
} from '@mui/material';
import { BrowserProvider, Contract, Eip1193Provider, formatEther, formatUnits, parseUnits } from 'ethers';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Erc20_ABI, WETH_ABI, tokens } from '../data/evm';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SwapVerticalCircleOutlinedIcon from '@mui/icons-material/SwapVerticalCircleOutlined';
import { checkPriceImpact, inUSD } from '../data/helpers';

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
	const debounceRef = useRef<NodeJS.Timeout>();

	const [isLoading, setIsLoading] = useState(false);
	const [openSnack, setOpenSnack] = useState(false);

	const [amountFrom, setAmountFrom] = useState('0');
	const [amountTo, setAmountTo] = useState('');
	// const { enqueueSnackbar } = useSnackbar();
	const [feeUSD, setFeeUSD] = useState('');
	const [AmountOutUSD, setAmountOutUSD] = useState('');

	const sendTx = async () => {
		setIsLoading(true);

		try {
			const provider = new BrowserProvider(walletProvider!);
			const signer = await provider.getSigner();

			const tokenAddress = tokens.find((token) => token.symbol === 'WETH')?.address;
			const WETH_Contract = new Contract(tokenAddress!, WETH_ABI);

			if (tokenFrom === 'ETH' && tokenTo === 'WETH' && walletProvider) {
				//@ts-ignore
				const res = await WETH_Contract.connect(signer).deposit({ value: parseUnits(amountFrom, 18) });

				const txRes = await res.wait();

				console.log(txRes);

				if (txRes.status === 1) {
					setIsLoading(false);

					setOpenSnack(true);
					setOpenSnack(false);
				}
			} else {
				//@ts-ignore
				const res = await WETH_Contract.connect(signer).withdraw(parseUnits(amountFrom, 18));

				const txRes = await res.wait();

				console.log(txRes);

				if (txRes.status === 1) {
					setIsLoading(false);

					setOpenSnack(true);
					setOpenSnack(false);
				}
			}
		} catch (error) {
			setIsLoading(false);

			console.log(error);
		}
	};

	const estimateFees = async () => {
		try {
			if (walletProvider) {
				const provider = new BrowserProvider(walletProvider!);
				const signer = await provider.getSigner();

				const tokenParams = tokens.find((token) => token.symbol === 'WETH');
				if (tokenParams) {
					const { address, decimals } = tokenParams;
					const WETH_Contract = new Contract(address, WETH_ABI, signer);

					const tx = {
						to: WETH_Contract.target,
						data: WETH_Contract.interface.encodeFunctionData(tokenFrom === 'ETH' && tokenTo === 'WETH' ? 'deposit' : 'withdraw'),
					};

					const fee = await provider.estimateGas(tx);

					console.log('FEE', fee);

					const amountOut = parseUnits(amountFrom, decimals) - fee;
					return { fee, amountOut, decimals };
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

	useEffect(() => {
		debounceRef.current && clearTimeout(debounceRef.current);

		if (+amountFrom > 0) {
			debounceRef.current = setTimeout(async () => {
				const res = await estimateFees();
				if (res) {
					const { fee, amountOut, decimals } = res;
					setAmountTo(formatUnits(amountOut, decimals));

					setAmountOutUSD(await checkPriceImpact(formatEther(amountOut - fee)));
					// setFeeUSD((await inUSD(formatUnits(fee, decimals))) ?? '');
					// await new Promise((r) => setTimeout(r, 1000));
					// setAmountOutUSD((await inUSD(formatUnits(amountOut, decimals))) ?? '');
					// console.log('IN USD', (await inUSD(formatUnits(amountOut, decimals))) ?? '');
				}
			}, 300);
		} else {
			setAmountTo(amountFrom);
		}
		return () => clearTimeout(debounceRef.current);
	}, [amountFrom]);

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
					setAmountFrom(amountTo);
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
					value={amountTo !== '0' ? amountTo : ''}
					onChange={(e) => {
						if (e.target.value > tokenBalance) setAmountTo(tokenBalance);
						else setAmountTo(e.target.value);
					}}
				/>
				<FormControl sx={{ width: '10vw' }}>
					<InputLabel id="to-select-label">To</InputLabel>

					<Select labelId="to-select-label" value={tokenTo} label="To" onChange={(e) => setTokenTo(e.target.value)}>
						{mappedTokensTo}
					</Select>
				</FormControl>
			</Box>

			{amountFrom !== '0' && (
				<Tooltip title="No rate limit ( 1inch price aggregator smart contract )" placement="top">
					<Box component={'p'} padding={0} margin={0} fontSize={'0.75rem'} textAlign={'center'} paddingTop={'0.3em'}>
						The receive tokens amount is ~ <span className="amount-out__usd">${(+AmountOutUSD).toFixed(2)}</span>
					</Box>
				</Tooltip>
			)}

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
				disabled={isLoading || amountFrom === '0'}
				variant="outlined"
				endIcon={!isLoading ? <AccountBalanceWalletIcon /> : null}
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
						<Box component={'span'} marginRight={'0.7em'}>
							Sending Tx...
						</Box>
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
			<Snackbar open={openSnack} autoHideDuration={6000}>
				<Alert severity="success" variant="filled" sx={{ width: '100%' }}>
					Tx sent successfully
				</Alert>
			</Snackbar>
		</Card>
	);
};
