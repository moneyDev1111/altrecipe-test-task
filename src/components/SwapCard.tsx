import {
	Alert,
	Box,
	Button,
	Card,
	CircularProgress,
	FormControl,
	InputLabel,
	Link,
	MenuItem,
	Select,
	Slider,
	Snackbar,
	TextField,
	Tooltip,
} from '@mui/material';
import { BrowserProvider, Contract, Eip1193Provider, TransactionReceipt, formatEther, formatUnits, parseUnits } from 'ethers';
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
	setEthBalance,
	setWethBalance,
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
	setEthBalance: Dispatch<SetStateAction<string>>;
	setWethBalance: Dispatch<SetStateAction<string>>;
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

	const [txHashLink, setTxHashLink] = useState('');

	const sendTx = async () => {
		setIsLoading(true);

		try {
			const provider = new BrowserProvider(walletProvider!);
			const signer = await provider.getSigner();

			const tokenAddress = tokens.find((token) => token.symbol === 'WETH')?.address;
			const WETH_Contract = new Contract(tokenAddress!, WETH_ABI);

			if (tokenFrom === 'ETH' && tokenTo === 'WETH' && walletProvider) {
				//@ts-ignore
				const res = await WETH_Contract.connect(signer).deposit({ value: parseUnits(amountTo, 18) });

				const txRes: TransactionReceipt = await res.wait();

				console.log(txRes);

				if (txRes.status === 1) {
					setIsLoading(false);
					setTxHashLink(`https://sepolia.etherscan.io/tx/${txRes.hash}`);

					setOpenSnack(true);
				}
			} else {
				//@ts-ignore
				const res = await WETH_Contract.connect(signer).withdraw(parseUnits(amountFrom, 18));

				const txRes = await res.wait();

				console.log(txRes);

				if (txRes.status === 1) {
					setIsLoading(false);
					setTxHashLink(`https://sepolia.etherscan.io/tx/${txRes.hash}`);

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
				const ethBalance = formatUnits(await provider.getBalance(accountAddress!), 18);
				setTokenBalance(ethBalance);
				setEthBalance(ethBalance);
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
	const getWethBalance = async () => {
		try {
			const provider = new BrowserProvider(walletProvider!);

			const tokenAddress = tokens.find((token) => token.symbol === 'WETH')?.address;

			if (tokenAddress) {
				const tokenContract = new Contract(tokenAddress, WETH_ABI, provider);
				setWethBalance(formatUnits(await tokenContract.balanceOf(accountAddress)));
			}
		} catch (error: any) {
			console.log(error);
		}
	};

	const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpenSnack(false);
	};

	useEffect(() => {
		isConnected && getBalance();
		isConnected && getWethBalance();
	}, [isConnected, tokenFrom, txHashLink]);

	const estimateFees = async () => {
		try {
			if (walletProvider) {
				const provider = new BrowserProvider(walletProvider!);
				const signer = await provider.getSigner();
				let gasFetched = false;
				let gasPrice: bigint = BigInt(0);

				while (!gasFetched) {
					try {
						const res = await provider.getBlock('latest');
						const res2 = await provider.getFeeData();
						if (res?.baseFeePerGas && res2?.maxPriorityFeePerGas) {
							console.log(res.baseFeePerGas);
							console.log(res2.maxPriorityFeePerGas);

							const fees = res.baseFeePerGas + res2.maxPriorityFeePerGas;
							gasPrice = fees;
							gasFetched = true;
						}
					} catch (error) {
						console.log(error);
						await new Promise((r) => setTimeout(r, 1000));
					}
				}

				const tokenParams = tokens.find((token) => token.symbol === 'WETH');
				if (tokenParams) {
					const { address, decimals } = tokenParams;
					const WETH_Contract = new Contract(address, WETH_ABI);

					const tx = {
						to: WETH_Contract.target,
						data:
							tokenFrom === 'ETH' && tokenTo === 'WETH'
								? WETH_Contract.interface.encodeFunctionData('deposit')
								: WETH_Contract.interface.encodeFunctionData('withdraw', [parseUnits(amountFrom, decimals)]),
						from: signer.address,
					};

					console.log(await provider.estimateGas(tx));

					const fee = (await provider.estimateGas(tx)) * gasPrice;

					const amountOut = parseUnits(amountFrom, decimals) - fee;
					return { fee, amountOut, decimals };
				}
			}
		} catch (error) {
			setIsLoading(false);

			console.log(error);
		}
	};
	console.log('AMOUNT FROM', amountFrom);
	console.log('AMOUNT TO', amountTo);

	useEffect(() => {
		debounceRef.current && clearTimeout(debounceRef.current);

		if (+amountFrom > 0 && !/e\-\d*/.test(amountFrom)) {
			debounceRef.current = setTimeout(async () => {
				const res = await estimateFees();

				if (res) {
					const { fee, amountOut, decimals } = res;
					setAmountTo(formatUnits(amountOut, decimals));
					console.log('FEE', formatEther(fee));

					checkPriceImpact(formatEther(fee)).then((res) => setFeeUSD(res));
					checkPriceImpact(formatEther(amountOut - fee)).then((res) => setAmountOutUSD(res));

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
				width: '44%',
				margin: '0 auto',
				gap: '1.2vh',
				borderRadius: '10px',
			}}
			className="card-swap"
		>
			<Box style={{ position: 'relative', display: 'flex', gap: '1em', flexDirection: 'column' }}>
				<Box display="flex" flexDirection="row" component="form" noValidate autoComplete="off">
					<TextField
						InputProps={{
							inputProps: { min: 0, max: tokenBalance, step: '0.0001' },
						}}
						fullWidth
						id="outlined-from"
						label="Amount From"
						type="number"
						value={amountFrom !== '0' && amountFrom ? amountFrom : ''}
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
				<SwapVerticalCircleOutlinedIcon
					onClick={(e) => {
						setTokenTo(tokenFrom);
						setTokenFrom(tokenTo);
						setAmountFrom(amountTo);
					}}
					className="swap-icon"
				/>

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
						value={amountTo !== '0' && amountFrom ? amountTo : ''}
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
			</Box>
			{amountFrom !== '0' && amountFrom && !/e\-\d*/.test(amountFrom) && (
				<Tooltip title="No rate limits and fee is already deducted" placement="top">
					<Box component={'section'} padding={0} margin={0} fontSize={'0.75rem'} textAlign={'center'} paddingTop={'0.3em'}>
						<p style={{ margin: 0, padding: 0 }}>
							The receive tokens amount is ~ <span className="amount-out__usd">${(+AmountOutUSD).toFixed(2)}</span>
						</p>
						<p style={{ margin: 0, padding: 0 }}>
							Fee is ~ <span className="amount-out__usd">${(+feeUSD).toFixed(2)}</span>
						</p>
					</Box>
				</Tooltip>
			)}

			<Box display="flex" justifyContent="center" alignItems={'center'} gap={'1em'} mt={'1em'}>
				<Box component={'span'} width={'70%'}>
					<Slider
						disabled={!isConnected}
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
						color="primary"
					/>
				</Box>
				<Button
					disabled={!isConnected}
					onClick={() => {
						setAmountFrom(tokenBalance);
					}}
					variant="contained"
				>
					Max
				</Button>
			</Box>
			<Button
				disabled={isLoading || amountFrom === '0' || !amountFrom || /\-/.test(amountTo) || /e\-\d*/.test(amountFrom)}
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
			<Snackbar open={openSnack} autoHideDuration={6000} onClose={handleClose}>
				<Alert
					severity="success"
					variant="filled"
					sx={{ width: '100%', fontSize: '1.115rem', color: 'rgb(224, 224, 224)', display: 'flex', alignContent: 'center' }}
				>
					Tx sent successfully
					<br />
					<Link href={txHashLink} target={'_blank'}>
						Open in explorer
					</Link>
				</Alert>
			</Snackbar>
		</Card>
	);
};
