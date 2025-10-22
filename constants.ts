
import { Pair, PharosNetwork } from './types';

export const FUTURES_EXCHANGE_ADDRESS = '0x7Bf11Cdd519E8B4544D28c8EA2a2F9f3Ca17cb4c';

export const FUTURES_EXCHANGE_ABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_positionId",
				"type": "uint256"
			}
		],
		"name": "closePosition",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "trader",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "pair",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "fundingCost",
				"type": "uint256"
			}
		],
		"name": "FundingApplied",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_pair",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "_isLong",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "_leverage",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_margin",
				"type": "uint256"
			}
		],
		"name": "openPosition",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "trader",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "pair",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "profitLoss",
				"type": "uint256"
			}
		],
		"name": "PositionClosed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "trader",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "pair",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "isLong",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "margin",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "leverage",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "entryPrice",
				"type": "uint256"
			}
		],
		"name": "PositionOpened",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "pair",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newPrice",
				"type": "uint256"
			}
		],
		"name": "PriceUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_pair",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "updatePrice",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	},
	{
		"inputs": [],
		"name": "FUNDING_INTERVAL",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "FUNDING_RATE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "lastPrice",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MAX_LEVERAGE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MIN_MARGIN",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "supportedPairs",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "traderPositions",
		"outputs": [
			{
				"internalType": "address",
				"name": "trader",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "pair",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isLong",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "leverage",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "margin",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "entryPrice",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "size",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "openTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "liquidationPrice",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "lastFundingTime",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

export const PHAROS_TESTNET_CONFIG: PharosNetwork = {
  chainId: '0xa80a0', // 688688 in hex
  chainName: 'Pharos Testnet',
  nativeCurrency: {
    name: 'Pharos',
    symbol: 'PHRS',
    decimals: 18,
  },
  rpcUrls: ['https://testnet.dplabs-internal.com'],
  blockExplorerUrls: ['https://testnet.pharosscan.xyz'],
};


export const SUPPORTED_PAIRS: Pair[] = [
    { name: 'ETH/USD', id: 'ethereum', symbol: 'ETH' },
    { name: 'BTC/USD', id: 'bitcoin', symbol: 'BTC' },
    { name: 'BNB/USD', id: 'binancecoin', symbol: 'BNB' },
    { name: 'SOL/USD', id: 'solana', symbol: 'SOL' },
];

export const PHAROS_FAUCET_URL = 'https://zan.top/faucet/pharos';
