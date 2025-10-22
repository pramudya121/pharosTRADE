
import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { Pair, PriceData } from '../types';
import { ethers } from 'ethers';
import { Notification } from './Notification';
import { OrderBook } from './OrderBook';

interface TradePanelProps {
  pair: Pair;
  priceData: PriceData | null;
}

export const TradePanel: React.FC<TradePanelProps> = ({ pair, priceData }) => {
  const { contract, isConnected, connectWallet } = useWeb3();
  const [isLong, setIsLong] = useState(true);
  const [margin, setMargin] = useState('');
  const [leverage, setLeverage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleOpenPosition = async () => {
    if (!contract || !margin || parseFloat(margin) <= 0) {
        setNotification({ message: 'Please connect wallet and enter a valid margin.', type: 'error' });
        return;
    }
    setIsLoading(true);
    setNotification(null);
    try {
        const marginInWei = ethers.parseEther(margin);
        const tx = await contract.openPosition(pair.name, isLong, leverage, marginInWei, { value: marginInWei });
        await tx.wait();
        setNotification({ message: 'Position opened successfully!', type: 'success' });
        setMargin('');
    } catch (err: any) {
        console.error('Failed to open position:', err);
        setNotification({ message: err.reason || 'Failed to open position.', type: 'error' });
    } finally {
        setIsLoading(false);
    }
  };

  const marginInUsd = (priceData?.price ?? 0) * parseFloat(margin || '0');
  const positionSize = marginInUsd * leverage;

  return (
    <div className="bg-[#10183c] border border-blue-900/50 rounded-lg p-4 h-full flex flex-col space-y-4">
        {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
        <div className="grid grid-cols-2 gap-2">
            <button
                onClick={() => setIsLong(true)}
                className={`py-3 rounded-md text-sm font-bold transition-all duration-200 ${isLong ? 'bg-green-600 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
                Long
            </button>
            <button
                onClick={() => setIsLong(false)}
                className={`py-3 rounded-md text-sm font-bold transition-all duration-200 ${!isLong ? 'bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
                Short
            </button>
        </div>
        
        <div>
            <label htmlFor="margin" className="text-xs text-gray-400">Margin (PHRS)</label>
            <input
                id="margin"
                type="number"
                value={margin}
                onChange={(e) => setMargin(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-900/50 p-2 rounded-md border border-blue-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
            />
             <p className="text-right text-xs text-gray-500 mt-1">≈ ${marginInUsd.toFixed(2)}</p>
        </div>

        <div>
            <label htmlFor="leverage" className="text-xs text-gray-400 flex justify-between">
                <span>Leverage</span>
                <span className="font-bold text-blue-300">{leverage}x</span>
            </label>
            <input
                id="leverage"
                type="range"
                min="1"
                max="100"
                step="1"
                value={leverage}
                onChange={(e) => setLeverage(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer mt-1"
            />
        </div>

        <div className="text-xs space-y-2 text-gray-400 border-t border-blue-900/50 pt-4">
            <div className="flex justify-between"><span>Position Size:</span> <span>≈ ${positionSize.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Est. Liq. Price:</span> <span>--</span></div>
            <div className="flex justify-between"><span>Fees:</span> <span>≈ 0.01 PHRS</span></div>
        </div>

        {isConnected ? (
             <button
                onClick={handleOpenPosition}
                disabled={isLoading}
                className={`w-full py-3 rounded-md font-bold text-white transition-all duration-200 ${isLong ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isLoading ? 'Processing...' : `Open ${isLong ? 'Long' : 'Short'}`}
            </button>
        ) : (
             <button
                onClick={connectWallet}
                className="w-full py-3 rounded-md font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors duration-200"
            >
                Connect Wallet to Trade
            </button>
        )}

        <div className="flex-grow">
          <OrderBook currentPrice={priceData?.price ?? null} />
        </div>
    </div>
  );
};
