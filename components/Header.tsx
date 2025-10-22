
import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { LogoIcon, WalletIcon } from './Icons';
import { PHAROS_FAUCET_URL, PHAROS_TESTNET_CONFIG } from '../constants';
import { ExternalLinkIcon } from './Icons';


export const Header: React.FC = () => {
  const { isConnected, address, balance, connectWallet, disconnectWallet, isLoading, error, addPharosNetwork } = useWeb3();

  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <header className="p-4 border-b border-blue-900/50 bg-[#0a0f2a]/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <LogoIcon className="h-10 w-10" />
          <h1 className="text-2xl font-bold text-white tracking-wider">
            Pharos <span className="text-blue-400">Futures</span>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
            <a 
                href={PHAROS_FAUCET_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-sm text-blue-300 hover:text-blue-100 transition-colors duration-200"
            >
                Get Testnet PHRS <ExternalLinkIcon className="h-4 w-4 ml-1" />
            </a>
            {error && (
            <div className="flex items-center space-x-2">
                <span className="text-red-400 text-sm">{error.includes("Please switch to Pharos Testnet") ? "Wrong Network" : "Error"}</span>
                {error.includes("Please switch to Pharos Testnet") && (
                    <button onClick={addPharosNetwork} className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-1 px-3 rounded-md transition-colors duration-200">
                        Switch Network
                    </button>
                )}
            </div>
            )}
            {isConnected && address ? (
            <div className="flex items-center space-x-4">
                <div className="text-right">
                    <p className="text-sm font-mono text-gray-300">{truncateAddress(address)}</p>
                    <p className="text-xs font-semibold text-blue-300">{parseFloat(balance ?? '0').toFixed(4)} PHRS</p>
                </div>
                <button
                    onClick={disconnectWallet}
                    className="bg-red-600/50 hover:bg-red-500/50 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
                >
                    Disconnect
                </button>
            </div>
            ) : (
            <button
                onClick={connectWallet}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center"
            >
                <WalletIcon className="h-5 w-5 mr-2" />
                {isLoading ? 'Connecting...' : 'Connect Wallet'}
            </button>
            )}
        </div>
      </div>
    </header>
  );
};
