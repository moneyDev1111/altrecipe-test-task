import { tokens } from './evm'

export interface Wallet {
	address: string
	balance: bigint | string
}

export interface IERC20 {
	name(): Promise<string>
	symbol(): Promise<string>
	decimals(): Promise<bigint>
	totalSupply(): Promise<bigint>
	balanceOf(address: string): Promise<bigint>
	transfer(_to: string, _value: bigint): Promise<boolean>
	transferFrom(_from: string, _to: string, _value: bigint): Promise<boolean>
	approve(_spender: string, _value: bigint): Promise<boolean>
	allowance(_owner: string, _spender: string): Promise<bigint>
}

export type Token = (typeof tokens)[number]
