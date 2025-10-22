
import React, { useState, useEffect } from 'react';

interface Order {
    price: number;
    size: number;
    total: number;
}

const generateRandomOrders = (count: number, startPrice: number, isBids: boolean): Order[] => {
    let orders: Order[] = [];
    let cumulativeTotal = 0;
    for (let i = 0; i < count; i++) {
        const price = startPrice + (isBids ? -i * 0.5 : i * 0.5) + (Math.random() - 0.5);
        const size = Math.random() * 5 + 0.1;
        cumulativeTotal += size;
        orders.push({
            price: parseFloat(price.toFixed(2)),
            size: parseFloat(size.toFixed(3)),
            total: parseFloat(cumulativeTotal.toFixed(3)),
        });
    }
    return orders;
};

export const OrderBook: React.FC<{ currentPrice: number | null }> = ({ currentPrice }) => {
    const [bids, setBids] = useState<Order[]>([]);
    const [asks, setAsks] = useState<Order[]>([]);

    useEffect(() => {
        if (currentPrice) {
            setBids(generateRandomOrders(10, currentPrice - 0.5, true));
            setAsks(generateRandomOrders(10, currentPrice + 0.5, false).reverse());
        }
    }, [currentPrice]);

    const maxTotal = Math.max(...bids.map(o => o.total), ...asks.map(o => o.total));

    const OrderRow: React.FC<{ order: Order; type: 'bid' | 'ask' }> = ({ order, type }) => {
        const percentage = (order.total / maxTotal) * 100;
        const bgColor = type === 'bid' ? `bg-green-500/10` : `bg-red-500/10`;
        const barColor = type === 'bid' ? `bg-green-500/20` : `bg-red-500/20`;
        const textColor = type === 'bid' ? `text-green-400` : `text-red-400`;

        return (
            <div className={`relative flex justify-between text-xs font-mono p-1 ${bgColor}`}>
                <div className="absolute top-0 left-0 h-full" style={{ width: `${percentage}%`, background: barColor }}></div>
                <span className={`z-10 ${textColor}`}>{order.price.toFixed(2)}</span>
                <span className="z-10 text-gray-300">{order.size.toFixed(3)}</span>
                <span className="z-10 text-gray-400">{order.total.toFixed(3)}</span>
            </div>
        );
    };

    return (
        <div className="bg-slate-900/50 p-2 rounded-lg h-full flex flex-col">
            <h3 className="text-sm font-semibold mb-2 px-1">Order Book</h3>
            <div className="grid grid-cols-3 text-xs text-gray-500 px-1 mb-1">
                <span>Price (USD)</span>
                <span className="text-right">Size</span>
                <span className="text-right">Total</span>
            </div>
            <div className="flex-1 overflow-y-auto">
                {asks.map((ask, i) => <OrderRow key={i} order={ask} type="ask" />)}
            </div>
            <div className="py-2 text-center text-lg font-bold">
                <span className={ (currentPrice ?? 0) > (asks[0]?.price ?? 0) ? 'text-green-400' : 'text-red-400'}>
                  {currentPrice?.toFixed(2) ?? '...'}
                </span>
            </div>
            <div className="flex-1 overflow-y-auto">
                {bids.map((bid, i) => <OrderRow key={i} order={bid} type="bid" />)}
            </div>
        </div>
    );
};
