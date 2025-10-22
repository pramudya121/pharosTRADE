import React, { useState } from 'react';
import { Header } from './components/Header';
import { PairSelector } from './components/PairSelector';
import { StatsPanel } from './components/StatsPanel';
import { TradingViewWidget } from './components/TradingViewWidget';
import { TradePanel } from './components/TradePanel';
import { PositionsPanel } from './components/PositionsPanel';
import { Web3Provider } from './contexts/Web3Context';
import { SUPPORTED_PAIRS } from './constants';
import { useCoingeckoApi } from './hooks/useCoingeckoApi';
import { Pair } from './types';
import { Tabs } from './components/Tabs';
import { OrdersTab } from './components/OrdersTab';

const AppContent: React.FC = () => {
    const [selectedPair, setSelectedPair] = useState<Pair>(SUPPORTED_PAIRS[0]);
    const { priceData, candlestickData, isLoading: isApiLoading } = useCoingeckoApi(selectedPair);

    const bottomTabs = [
        {
            label: 'Positions',
            content: <PositionsPanel priceData={priceData} />
        },
        {
            label: 'Open Orders',
            content: <OrdersTab />
        }
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="container mx-auto p-4 flex-grow grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Main content area */}
                <div className="lg:col-span-3 flex flex-col space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <PairSelector selectedPair={selectedPair} setSelectedPair={setSelectedPair} />
                    </div>
                    <StatsPanel priceData={priceData} isLoading={isApiLoading} />
                    <div className="flex-grow bg-[#10183c] border border-blue-900/50 rounded-lg p-2">
                        <TradingViewWidget data={candlestickData} />
                    </div>
                </div>

                {/* Side panel */}
                <div className="lg:col-span-1">
                    <TradePanel pair={selectedPair} priceData={priceData} />
                </div>

                {/* Bottom panel */}
                <div className="lg:col-span-4">
                     <Tabs tabs={bottomTabs} />
                </div>
            </main>
        </div>
    );
};


const App: React.FC = () => {
    return (
        <Web3Provider>
            <AppContent />
        </Web3Provider>
    );
};

export default App;