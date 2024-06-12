const getPrice = async () => {
	return await (await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`)).json();
};

// let prevPrice = 0;

export const inUSD = async (amount: string) => {
	try {
		// txfee is wei amount paid for tx
		if (amount === '0.00') return '0';
		else {
			// const theAmount = formatEther(amount.toString());

			const thePrice = await getPrice();
			// if (!prevPrice) prevPrice = thePrice?.ethereum?.usd;
			return thePrice?.ethereum?.usd ? (+amount * thePrice.ethereum?.usd).toFixed(2) : 'ERROR FETCHING COIN PRICE';
			// return thePrice?.ethereum?.usd ? (+theAmount * thePrice.ethereum?.usd).toFixed(2) : (+theAmount * prevPrice).toFixed(2);
		}
	} catch (error) {
		console.log(error);
	}
};

import { BrowserProvider, Contract, JsonRpcProvider, formatEther, formatUnits } from 'ethers';

const oneInchAggrAddress = '0x07d91f5fb9bf7798734c3f606db065549f6893bb';
const oneInchAggr_ABI = [
	{
		inputs: [
			{
				internalType: 'contract IERC20',
				name: 'srcToken',
				type: 'address',
			},
			{
				internalType: 'contract IERC20',
				name: 'dstToken',
				type: 'address',
			},
			{ internalType: 'bool', name: 'useWrappers', type: 'bool' },
		],
		name: 'getRate',
		outputs: [{ internalType: 'uint256', name: 'weightedRate', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'contract IERC20',
				name: 'srcToken',
				type: 'address',
			},
			{ internalType: 'bool', name: 'useSrcWrappers', type: 'bool' },
		],
		name: 'getRateToEth',
		outputs: [{ internalType: 'uint256', name: 'weightedRate', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
];

export async function checkPriceImpact(amount: string) {
	const provider = new JsonRpcProvider('https://rpc.ankr.com/eth');
	const toToken = '0xdAC17F958D2ee523a2206206994597C13D831ec7';

	// const formattedAmountOut = formatUnits(amount, 6);

	const oneInchAggrContract = new Contract(oneInchAggrAddress, oneInchAggr_ABI, provider);
	// USE getRateToEth IF TOKEN IS NATIVE
	const oneInchRate: bigint = await oneInchAggrContract.getRateToEth(toToken, true);

	// STOP IF RATE IS 0 ( the params are incorrect, mainly the useWrappers bool )
	if (!oneInchRate) throw new Error('Error getting the 1inch Rate');

	const numerator = 10 ** 6;
	const denominator = 10 ** 18;

	const price = formatEther((oneInchRate * BigInt(numerator)) / BigInt(denominator));

	const formatted1InchAmount = (1 / +price) * +amount;

	console.log('formatted1InchAmount', formatted1InchAmount);

	return String(formatted1InchAmount);
}
