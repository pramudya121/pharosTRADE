import { useState, useEffect, useCallback } from 'react';
import { Pair, PriceData, CandlestickData } from '../types';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';

export const useCoingeckoApi = (pair: Pair | null) => {
    const [priceData, setPriceData] = useState<PriceData | null>(null);
    const [candlestickData, setCandlestickData] = useState<CandlestickData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPriceData = useCallback(async () => {
        if (!pair) return;
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/coins/markets?vs_currency=usd&ids=${pair.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch price data');
            }
            const data = await response.json();
            if (data && data.length > 0) {
                const market = data[0];
                setPriceData({
                    price: market.current_price,
                    change24h: market.price_change_percentage_24h,
                    high24h: market.high_24h,
                    low24h: market.low_24h,
                    volume24h: market.total_volume,
                });
            } else {
                throw new Error('No data found for the pair');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [pair]);

    const fetchCandlestickData = useCallback(async () => {
        if (!pair) return;
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/coins/${pair.id}/ohlc?vs_currency=usd&days=30`);
            if (!response.ok) {
                throw new Error('Failed to fetch chart data');
            }
            const data = await response.json();
            const formattedData: CandlestickData[] = data.map((d: number[]) => {
                const open = d[1];
                const close = d[4];
                // NOTE: Endpoint OHLC gratis dari CoinGecko tidak menyediakan data volume.
                // Kami menghasilkan data volume acak di sini untuk tujuan demonstrasi.
                // Untuk aplikasi produksi, penyedia data yang berbeda akan diperlukan untuk volume per candle yang akurat.
                const simulatedVolume = Math.random() * (close * 10) + (close * 2);

                return {
                    time: d[0] / 1000,
                    open: open,
                    high: d[2],
                    low: d[3],
                    close: close,
                    volume: simulatedVolume,
                };
            });
            setCandlestickData(formattedData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [pair]);
    
    useEffect(() => {
        if (pair) {
            fetchPriceData();
            fetchCandlestickData();
            const interval = setInterval(fetchPriceData, 10000); // Update price every 10 seconds
            return () => clearInterval(interval);
        }
    }, [pair, fetchPriceData, fetchCandlestickData]);

    return { priceData, candlestickData, isLoading, error };
};