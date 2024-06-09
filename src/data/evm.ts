export const Erc20_ABI = [
	{ constant: true, inputs: [], name: 'name', outputs: [{ name: '', type: 'string' }], payable: false, stateMutability: 'view', type: 'function' },

	{ constant: true, inputs: [], name: 'symbol', outputs: [{ name: '', type: 'string' }], payable: false, stateMutability: 'view', type: 'function' },
	{
		constant: false,
		inputs: [
			{ name: '_spender', type: 'address' },
			{ name: '_value', type: 'uint256' },
		],
		name: 'approve',
		outputs: [{ name: 'success', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'totalSupply',
		outputs: [{ name: '', type: 'uint256' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{ name: '_from', type: 'address' },
			{ name: '_to', type: 'address' },
			{ name: '_value', type: 'uint256' },
		],
		name: 'transferFrom',
		outputs: [{ name: 'success', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{ constant: true, inputs: [], name: 'decimals', outputs: [{ name: '', type: 'uint8' }], payable: false, stateMutability: 'view', type: 'function' },
	{
		constant: true,
		inputs: [{ name: '', type: 'address' }],
		name: 'balanceOf',
		outputs: [{ name: '', type: 'uint256' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},

	{
		constant: false,
		inputs: [
			{ name: '_to', type: 'address' },
			{ name: '_value', type: 'uint256' },
		],
		name: 'transfer',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},

	{
		constant: true,
		inputs: [
			{ name: '', type: 'address' },
			{ name: '', type: 'address' },
		],
		name: 'allowance',
		outputs: [{ name: '', type: 'uint256' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
];

export const tokens = [
	{ symbol: 'ETH', decimals: '18', address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' },
	{ symbol: 'USDT', decimals: '6', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
	{ symbol: 'USDC', decimals: '6', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' },
	{ symbol: 'DAI', decimals: '18', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' },
	{ symbol: 'WBTC', decimals: '8', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' },
];
