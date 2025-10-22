
import React from 'react';
import { PriceData } from '../types';

interface StatsPanelProps {
  priceData: PriceData | null;
  isLoading: boolean;
}

const StatItem: React.FC<{ label: string; value: string | number; className?: string }> = ({ label, value, className }) => (
  <div>
    <p className="text-xs text-gray-400">{label}</p>
    <p className={`text-sm font-mono ${className || 'text-white'}`}>{value}</p>
  </div>
);

export const StatsPanel: React.FC<StatsPanelProps> = ({ priceData, isLoading }) => {
  if (isLoading || !priceData) {
    return (
      <div className="flex items-center justify-between p-3 border-y border-blue-900/50 animate-pulse">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-1">
                <div className="h-3 w-16 bg-gray-700 rounded"></div>
                <div className="h-4 w-20 bg-gray-600 rounded"></div>
            </div>
        ))}
      </div>
    );
  }

  const { price, change24h, high24h, low24h, volume24h } = priceData;
  const priceChangeColor = change24h >= 0 ? 'text-green-400' : 'text-red-400';
  const priceChangeSign = change24h >= 0 ? '+' : '';

  return (
    <div className="flex items-center justify-between p-3 border-y border-blue-900/50 text-xs">
        <StatItem label="Price" value={`$${price.toLocaleString()}`} className={priceChangeColor + " text-lg font-bold"} />
        <StatItem label="24h Change" value={`${priceChangeSign}${change24h.toFixed(2)}%`} className={priceChangeColor} />
        <StatItem label="24h High" value={`$${high24h.toLocaleString()}`} />
        <StatItem label="24h Low" value={`$${low24h.toLocaleString()}`} />
        <StatItem label="24h Volume" value={`$${volume24h.toLocaleString()}`} />
    </div>
  );
};
