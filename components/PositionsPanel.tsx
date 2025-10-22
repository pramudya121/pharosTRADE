
import React, { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { Position, PriceData } from '../types';
import { ethers } from 'ethers';
import { Notification } from './Notification';

interface PositionsPanelProps {
    priceData: PriceData | null;
}

const EmptyState: React.FC = () => (
    <div className="flex items-center justify-center h-32 text-gray-500">
        <p>No active positions.</p>
    </div>
);


export const PositionsPanel: React.FC<PositionsPanelProps> = ({ priceData }) => {
    const { contract, address, isConnected } = useWeb3();
    const [positions, setPositions] = useState<Position[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isClosing, setIsClosing] = useState<number | null>(null);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    
    const fetchPositions = useCallback(async () => {
        if (!contract || !address) {
            setPositions([]);
            return;
        };
        setIsLoading(true);
        try {
            const userPositions: Position[] = [];
            // Contracts often store positions in an array. We loop until we find an inactive one or hit a limit.
            for (let i = 0; i < 20; i++) { 
                try {
                    const posData = await contract.traderPositions(address, i);
                    if (posData.isActive) {
                        userPositions.push({
                            id: i,
                            trader: posData.trader,
                            pair: posData.pair,
                            isLong: posData.isLong,
                            leverage: posData.leverage,
                            margin: posData.margin,
                            entryPrice: posData.entryPrice,
                            size: posData.size,
                            openTime: posData.openTime,
                            liquidationPrice: posData.liquidationPrice,
                            isActive: posData.isActive,
                            lastFundingTime: posData.lastFundingTime,
                        });
                    }
                } catch (e) {
                    // Stop if we hit an error, likely end of array
                    break;
                }
            }
            setPositions(userPositions);
        } catch (error) {
            console.error("Failed to fetch positions:", error);
        } finally {
            setIsLoading(false);
        }
    }, [contract, address]);

    useEffect(() => {
        if(isConnected) {
            fetchPositions();
            const interval = setInterval(fetchPositions, 30000); // Refresh every 30 seconds
            return () => clearInterval(interval);
        }
    }, [isConnected, fetchPositions]);

    const handleClosePosition = async (positionId: number) => {
        if (!contract) return;
        setIsClosing(positionId);
        setNotification(null);
        try {
            const tx = await contract.closePosition(positionId);
            await tx.wait();
            setNotification({ message: `Position #${positionId} closed successfully!`, type: 'success' });
            fetchPositions(); // Re-fetch positions after closing
        } catch (err: any) {
            console.error('Failed to close position:', err);
            setNotification({ message: err.reason || 'Failed to close position.', type: 'error' });
        } finally {
            setIsClosing(null);
        }
    };
    
    const calculatePnl = (position: Position): { pnl: number, pnlPerc: number } => {
        if(!priceData) return {pnl: 0, pnlPerc: 0};
        const entryPrice = parseFloat(ethers.formatUnits(position.entryPrice, 8)); // Assuming price has 8 decimals in contract
        const currentPrice = priceData.price;
        const size = parseFloat(ethers.formatEther(position.size));
        const leverage = Number(position.leverage);

        let pnl = 0; // PnL in USD
        if(position.isLong) {
            pnl = (currentPrice - entryPrice) * size;
        } else {
            pnl = (entryPrice - currentPrice) * size;
        }

        const initialMarginInUsd = (size * entryPrice) / leverage;
        const pnlPerc = initialMarginInUsd > 0 ? (pnl / initialMarginInUsd) * 100 : 0;

        return { pnl, pnlPerc };
    }

    return (
        <div className="bg-[#10183c]/70 border-t border-blue-900/50 p-4 rounded-t-lg backdrop-blur-sm">
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
            <h2 className="text-lg font-semibold mb-2">Positions</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead className="text-gray-400 border-b border-blue-900/50">
                        <tr>
                            {['Pair', 'Side', 'Size', 'Entry Price', 'Mark Price', 'Liq. Price', 'Margin', 'P&L', ''].map(h => 
                                <th key={h} className="p-2 font-semibold">{h}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={9} className="text-center p-4">Loading positions...</td></tr>
                        ) : isConnected && positions.length > 0 ? (
                            positions.map(pos => {
                                const {pnl, pnlPerc} = calculatePnl(pos);
                                const pnlColor = pnl >= 0 ? 'text-green-400' : 'text-red-400';

                                return (
                                <tr key={pos.id} className="border-b border-blue-900/50 hover:bg-blue-900/20">
                                    <td className="p-2 font-bold">{pos.pair}</td>
                                    <td className={`p-2 font-bold ${pos.isLong ? 'text-green-400' : 'text-red-400'}`}>{pos.isLong ? 'LONG' : 'SHORT'}</td>
                                    <td className="p-2 font-mono">{parseFloat(ethers.formatEther(pos.size)).toFixed(4)}</td>
                                    <td className="p-2 font-mono">${parseFloat(ethers.formatUnits(pos.entryPrice, 8)).toFixed(2)}</td>
                                    <td className="p-2 font-mono">${priceData?.price.toFixed(2) ?? '...'}</td>
                                    <td className="p-2 font-mono text-orange-400">${parseFloat(ethers.formatUnits(pos.liquidationPrice, 8)).toFixed(2)}</td>
                                    <td className="p-2 font-mono">{parseFloat(ethers.formatEther(pos.margin)).toFixed(4)} PHRS</td>
                                    <td className={`p-2 font-mono ${pnlColor}`}>{pnl.toFixed(4)} ({pnlPerc.toFixed(2)}%)</td>
                                    <td className="p-2 text-right">
                                        <button 
                                            onClick={() => handleClosePosition(pos.id)} 
                                            disabled={isClosing === pos.id}
                                            className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white text-xs font-semibold py-1 px-3 rounded-md transition-colors duration-200">
                                            {isClosing === pos.id ? 'Closing...' : 'Close'}
                                        </button>
                                    </td>
                                </tr>
                            )})
                        ) : (
                            <tr><td colSpan={9}><EmptyState /></td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
