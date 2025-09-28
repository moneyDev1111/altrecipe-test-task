export const shortenAddress = (address: string) => {
	const firstPart = address.slice(0, 5)
	const secondPart = address.slice(35, -1)
	return firstPart + '...' + secondPart
}

const getPrice = async () => {
	return await (
		await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`)
	).json()
}

// let prevPrice = 0;

export const inUSD = async (amount: string) => {
	try {
		// txfee is wei amount paid for tx
		if (amount === '0.00') return '0'
		else {
			// const theAmount = formatEther(amount.toString());

			const thePrice = await getPrice()
			// if (!prevPrice) prevPrice = thePrice?.ethereum?.usd;
			return thePrice?.ethereum?.usd
				? (+amount * thePrice.ethereum?.usd).toFixed(2)
				: 'ERROR FETCHING COIN PRICE'
			// return thePrice?.ethereum?.usd ? (+theAmount * thePrice.ethereum?.usd).toFixed(2) : (+theAmount * prevPrice).toFixed(2);
		}
	} catch (error) {
		console.log(error)
	}
}

import { BrowserProvider, Contract, JsonRpcProvider, formatEther, formatUnits } from 'ethers'
import { Token } from './interfaces'

export const oneInchAggrAddress = '0x07d91f5fb9bf7798734c3f606db065549f6893bb'
export const oneInchAggr_ABI = [
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
]

export async function priceToUsd(amount: string) {
	const provider = new JsonRpcProvider('https://rpc.ankr.com/eth')
	const toToken = '0xdAC17F958D2ee523a2206206994597C13D831ec7'

	// const formattedAmountOut = formatUnits(amount, 6);

	const oneInchAggrContract = new Contract(oneInchAggrAddress, oneInchAggr_ABI, provider)
	// USE getRateToEth IF TOKEN IS NATIVE
	const oneInchRate: bigint = await oneInchAggrContract.getRateToEth(toToken, true)

	// STOP IF RATE IS 0 ( the params are incorrect, mainly the useWrappers bool )
	if (!oneInchRate) throw new Error('Error getting the 1inch Rate')

	const numerator = 10 ** 6
	const denominator = 10 ** 18

	const price = formatEther((oneInchRate * BigInt(numerator)) / BigInt(denominator))

	const formatted1InchAmount = (1 / +price) * +amount

	console.log('formatted1InchAmount', formatted1InchAmount)

	provider.destroy()
	return String(formatted1InchAmount)
}

export const convertTokensAddressesToMainnet = (aToken: Token) => {
	switch (true) {
		case /U[a-zA-Z]?S[a-zA-Z]?D[a-zA-Z]?T/i.test(aToken.symbol):
			// console.log('USDT!!!');
			return '0xdAC17F958D2ee523a2206206994597C13D831ec7'
		case /U[a-zA-Z]?S[a-zA-Z]?D[a-zA-Z]?C/i.test(aToken.symbol):
			// console.log('USDC!!!');
			return '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
		case /D[a-zA-Z]?A[a-zA-Z]?I/i.test(aToken.symbol):
			// console.log('DAI!!!');
			return '0x6B175474E89094C44Da98b954EedeAC495271d0F'
		case /B[a-zA-Z]?T[a-zA-Z]?C/i.test(aToken.symbol):
			// console.log('WBTC!!!');
			return '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
		case /E[a-zA-Z]?T[a-zA-Z]?H/i.test(aToken.symbol):
			// console.log('ETH!!!');
			return aToken.address
		default:
			throw Error('Token not supported!!!')
	}
}

export const getOneInchAmount = (
	fromToken: Token,
	toToken: Token,
	oneInchRate: bigint,
	multiplierAmount: string | bigint
) => {
	const numerator = 10 ** toToken.decimals
	const denominator = 10 ** fromToken.decimals

	if (fromToken.symbol === 'ETH' || toToken.symbol === 'ETH') {
		console.log('ETH!!!!!!!!!!!!!!')

		const price = formatEther(
			(oneInchRate * BigInt(fromToken.symbol === 'ETH' ? numerator : denominator)) /
				BigInt(toToken.symbol === 'ETH' ? numerator : denominator)
		)

		return toToken.symbol === 'ETH'
			? String(parseFloat(price) * parseFloat(String(multiplierAmount)))
			: String((1 / parseFloat(price)) * parseFloat(String(multiplierAmount)))
	} else {
		// TOKEN TO TOKEN
		const price = formatEther((oneInchRate * BigInt(denominator)) / BigInt(numerator))

		return String(parseFloat(price) * parseFloat(String(multiplierAmount)))
	}
}

export async function checkPriceImpact(
	fromToken: Token,
	toToken: Token,
	// multiplierAmount: string | bigint,
	quoteAmount: string | bigint
	// dexId?: string
) {
	console.log('CHECKING PRICE IMPACT BEFORE SWAP...')

	// const formattedAmountOut = parseFloat(formatUnits(quoteAmount, toToken.decimals || 18));

	// get tokens mainnet addresses
	const fromTokenMainnet = convertTokensAddressesToMainnet(fromToken)
	const toTokenMainnet = convertTokensAddressesToMainnet(toToken)

	const provider = new JsonRpcProvider('https://ethereum-rpc.publicnode.com')

	const oneInchAggrContract = new Contract(oneInchAggrAddress, oneInchAggr_ABI, provider)

	// USE getRateToEth IF TOKEN IS NATIVE
	const oneInchRate: bigint =
		fromToken.symbol === 'ETH'
			? await oneInchAggrContract.getRateToEth(toTokenMainnet, true)
			: await oneInchAggrContract.getRate(
					fromTokenMainnet,
					toTokenMainnet,
					toToken.symbol === 'ETH' ? true : false
			  )
	// STOP IF RATE IS 0 ( the params are incorrect, mainly the useWrappers bool )
	if (oneInchRate === 0n) throw new Error('Error getting the 1inch Rate')

	const formatted1InchAmount = parseFloat(
		getOneInchAmount(fromToken, toToken, oneInchRate, quoteAmount)
	)

	// console.log('1inch AMOUNT OUT', formatted1InchAmount);
	// console.log('AMOUNT OUT      ', formattedAmountOut);

	// // COMPARE OUTPUT AMOUNTS AND DECIDE WHETHER TO DO THE SWAP!
	// if (
	// 	formatted1InchAmount > formattedAmountOut &&
	// 	formatted1InchAmount - formattedAmountOut > formatted1InchAmount * (2 / 100) // IF DIFFENCE IS MORE THEN x%
	// ) {
	// 	provider?.destroy();
	// 	throw Error('PRICE IMPACT TOO HIGH !!! ');
	// 	// } else if (
	// 	// 	// if 1 inch amount is less then amount from the swap itself the dif is bigger then x%
	// 	// 	formatted1InchAmount < formattedAmountOut &&
	// 	// 	formattedAmountOut - formatted1InchAmount >
	// 	// 		formatted1InchAmount * (priceImpact / 100)
	// 	// ) {
	// 	// 	throw new Error("Sth's wrong with 1inch");
	// } else {
	// 	provider?.destroy();

	// 	// throw Error('GOOD AMOUNT!');
	// 	console.log('GOOD AMOUNT!');
	// }
	provider.destroy()
	return String(formatted1InchAmount)
}
