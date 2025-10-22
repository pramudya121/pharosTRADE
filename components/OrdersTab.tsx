import React, { useState } from 'react';
import { Order } from '../types';

// Mock data as the contract ABI doesn't support fetching open orders
const mockOrders: Order[] = [
    { id: '1', pair: 'ETH/USD', type: 'Limit', side: 'Long', price: 3500.50, amount: 0.5, filled: 0 },
    { id: '2', pair: 'BTC/USD', type: 'Limit', side: 'Short', price: 68000.00, amount: 0.1, filled: 0.05 },
    { id: '3', pair: 'SOL/USD', type: 'Market', side: 'Long', price: 165.75, amount: 10, filled: 10 },
];

const EmptyState: React.FC = () => (
    <div className="flex items-center justify-center h-32 text-gray-500">
        <p>No open orders.</p>
    </div>
);

export const OrdersTab: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>(mockOrders);
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    const handleCancelOrder = (orderId: string) => {
        setCancellingId(orderId);
        // Simulate API call
        setTimeout(() => {
            setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
            setCancellingId(null);
        }, 1000);
    };
    
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
                <thead className="text-gray-400 border-b border-blue-900/50">
                    <tr>
                        {['Pair', 'Type', 'Side', 'Price', 'Amount', 'Filled', ''].map(h => 
                            <th key={h} className="p-2 font-semibold">{h}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map(order => {
                            const filledPercentage = (order.amount > 0) ? (order.filled / order.amount) * 100 : 0;

                            return (
                            <tr key={order.id} className="border-b border-blue-900/50 hover:bg-blue-900/20">
                                <td className="p-2 font-bold">{order.pair}</td>
                                <td className="p-2">{order.type}</td>
                                <td className={`p-2 font-bold ${order.side === 'Long' ? 'text-green-400' : 'text-red-400'}`}>{order.side.toUpperCase()}</td>
                                <td className="p-2 font-mono">${order.price.toFixed(2)}</td>
                                <td className="p-2 font-mono">{order.amount}</td>
                                <td className="p-2 font-mono">
                                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${filledPercentage}%` }}></div>
                                    </div>
                                    <span className="text-gray-400 text-xs">{order.filled.toFixed(2)} ({filledPercentage.toFixed(0)}%)</span>
                                </td>
                                <td className="p-2 text-right">
                                    <button 
                                        onClick={() => handleCancelOrder(order.id)}
                                        disabled={cancellingId === order.id}
                                        className="bg-red-600/50 hover:bg-red-500/50 disabled:bg-gray-600 text-white text-xs font-semibold py-1 px-3 rounded-md transition-colors duration-200">
                                        {cancellingId === order.id ? 'Cancelling...' : 'Cancel'}
                                    </button>
                                </td>
                            </tr>
                        )})
                    ) : (
                        <tr><td colSpan={7}><EmptyState /></td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
