import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { ethers, BrowserProvider, Signer, Contract } from 'ethers';
import { FUTURES_EXCHANGE_ADDRESS, FUTURES_EXCHANGE_ABI, PHAROS_TESTNET_CONFIG } from '../constants';

// Add this declaration to fix TypeScript errors related to window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface Web3ContextType {
  provider: BrowserProvider | null;
  signer: Signer | null;
  address: string | null;
  balance: string | null;
  contract: Contract | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isLoading: boolean;
  error: string | null;
  addPharosNetwork: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearState = () => {
    setProvider(null);
    setSigner(null);
    setAddress(null);
    setBalance(null);
    setContract(null);
    setIsConnected(false);
    localStorage.removeItem('walletConnected');
  };

  const updateConnection = useCallback(async (ethProvider: BrowserProvider) => {
    setIsLoading(true);
    setError(null);
    try {
      const network = await ethProvider.getNetwork();
      if (network.chainId !== BigInt(PHAROS_TESTNET_CONFIG.chainId)) {
        setError(`Please switch to Pharos Testnet (Chain ID: ${parseInt(PHAROS_TESTNET_CONFIG.chainId, 16)}).`);
        clearState();
        setIsLoading(false);
        return;
      }

      const signerInstance = await ethProvider.getSigner();
      const userAddress = await signerInstance.getAddress();
      const userBalance = await ethProvider.getBalance(userAddress);

      const contractInstance = new Contract(FUTURES_EXCHANGE_ADDRESS, FUTURES_EXCHANGE_ABI, signerInstance);

      setProvider(ethProvider);
      setSigner(signerInstance);
      setAddress(userAddress);
      setBalance(ethers.formatEther(userBalance));
      setContract(contractInstance);
      setIsConnected(true);
      localStorage.setItem('walletConnected', 'true');
    } catch (e) {
      console.error("Failed to update connection:", e);
      setError("Failed to connect. Please ensure your wallet is unlocked and on the correct network.");
      clearState();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError("MetaMask or compatible wallet is not installed.");
      return;
    }

    try {
      setIsLoading(true);
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      await ethProvider.send("eth_requestAccounts", []);
      await updateConnection(ethProvider);
    } catch (e: any) {
      console.error("Connection error:", e);
      setError(e.message || "An unexpected error occurred while connecting.");
      clearState();
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    clearState();
  };
  
  const addPharosNetwork = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError("MetaMask is not installed.");
      return;
    }
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [PHAROS_TESTNET_CONFIG],
      });
    } catch (addError) {
      console.error("Could not add Pharos Testnet to MetaMask", addError);
      setError("Failed to add Pharos Testnet. Please add it manually.");
    }
  };


  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if(provider) {
        updateConnection(provider);
      }
    };

    const handleChainChanged = () => {
        if(provider) {
             updateConnection(provider);
        }
    };
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      if (localStorage.getItem('walletConnected') === 'true') {
        connectWallet();
      }
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, updateConnection]);

  return (
    <Web3Context.Provider value={{ provider, signer, address, balance, contract, isConnected, connectWallet, disconnectWallet, isLoading, error, addPharosNetwork }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
