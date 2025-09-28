export const Erc20_ABI = [
	{
		constant: true,
		inputs: [],
		name: 'name',
		outputs: [{ name: '', type: 'string' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},

	{
		constant: true,
		inputs: [],
		name: 'symbol',
		outputs: [{ name: '', type: 'string' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
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
	{
		constant: true,
		inputs: [],
		name: 'decimals',
		outputs: [{ name: '', type: 'uint8' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
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
]

export const WETH_ABI = [
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'address', name: 'src', type: 'address' },
			{ indexed: true, internalType: 'address', name: 'guy', type: 'address' },
			{ indexed: false, internalType: 'uint256', name: 'wad', type: 'uint256' },
		],
		name: 'Approval',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'address', name: 'dst', type: 'address' },
			{ indexed: false, internalType: 'uint256', name: 'wad', type: 'uint256' },
		],
		name: 'Deposit',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'address', name: 'src', type: 'address' },
			{ indexed: true, internalType: 'address', name: 'dst', type: 'address' },
			{ indexed: false, internalType: 'uint256', name: 'wad', type: 'uint256' },
		],
		name: 'Transfer',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'address', name: 'src', type: 'address' },
			{ indexed: false, internalType: 'uint256', name: 'wad', type: 'uint256' },
		],
		name: 'Withdrawal',
		type: 'event',
	},
	{
		inputs: [
			{ internalType: 'address', name: '', type: 'address' },
			{ internalType: 'address', name: '', type: 'address' },
		],
		name: 'allowance',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'guy', type: 'address' },
			{ internalType: 'uint256', name: 'wad', type: 'uint256' },
		],
		name: 'approve',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: '', type: 'address' }],
		name: 'balanceOf',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'decimals',
		outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
		stateMutability: 'view',
		type: 'function',
	},
	{ inputs: [], name: 'deposit', outputs: [], stateMutability: 'payable', type: 'function' },
	{
		inputs: [],
		name: 'name',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'symbol',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'totalSupply',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'dst', type: 'address' },
			{ internalType: 'uint256', name: 'wad', type: 'uint256' },
		],
		name: 'transfer',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'src', type: 'address' },
			{ internalType: 'address', name: 'dst', type: 'address' },
			{ internalType: 'uint256', name: 'wad', type: 'uint256' },
		],
		name: 'transferFrom',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'uint256', name: 'wad', type: 'uint256' }],
		name: 'withdraw',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{ stateMutability: 'payable', type: 'receive' },
]

export const tokens = [
	{ symbol: 'ETH', decimals: 18, address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' },
	// { symbol: 'USDT', decimals: 6, address: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0' },
	// { symbol: 'USDC', decimals: 6, address: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8' },
	// { symbol: 'DAI', decimals: 18, address: '0x3e622317f8C93f7328350cF0B56d9eD4C620C5d6' },
	// { symbol: 'WBTC', decimals: 8, address: '0x92f3B59a79bFf5dc60c0d59eA13a44D082B2bdFC' },
	{ symbol: 'WETH', decimals: 18, address: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9' },
] as const

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
