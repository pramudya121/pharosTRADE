export interface Pair {
    name: string;
    id: string;
    symbol: string;
}

export interface Position {
    id: number;
    trader: string;
    pair: string;
    isLong: boolean;
    leverage: bigint;
    margin: bigint;
    entryPrice: bigint;
    size: bigint;
    openTime: bigint;
    liquidationPrice: bigint;
    isActive: boolean;
    lastFundingTime: bigint;
}

export interface PharosNetwork {
    chainId: string;
    chainName: string;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    rpcUrls: string[];
    blockExplorerUrls: string[];
}

export interface PriceData {
    price: number;
    change24h: number;
    high24h: number;
    low24h: number;
    volume24h: number;
}
export interface CandlestickData {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
}

export interface Order {
  id: string;
  pair: string;
  type: 'Limit' | 'Market';
  side: 'Long' | 'Short';
  price: number;
  amount: number;
  filled: number;
}