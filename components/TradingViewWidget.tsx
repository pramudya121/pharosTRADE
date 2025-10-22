import React, { useEffect, useRef } from 'react';
import { createChart, CrosshairMode } from 'lightweight-charts';
import { CandlestickData } from '../types';

interface TradingViewWidgetProps {
  data: CandlestickData[];
}

export const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({ data }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container || data.length === 0) {
      return;
    }

    const chart = createChart(container, {
      width: container.clientWidth,
      height: 600, // Increased height for better indicator visibility
      layout: {
        backgroundColor: '#0a0f2a',
        textColor: 'rgba(255, 255, 255, 0.9)',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.1)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: 'rgba(197, 203, 206, 0.8)',
      },
      timeScale: {
        borderColor: 'rgba(197, 203, 206, 0.8)',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#22c55e',
      wickDownColor: '#ef4444',
      wickUpColor: '#22c55e',
    });

    candlestickSeries.setData(data);

    // Volume Indicator
    const volumeSeries = chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '', // Set as an overlay by setting a blank priceScaleId
    });
    volumeSeries.priceScale().applyOptions({
        scaleMargins: {
            top: 0.8, // 80% empty space above the series
            bottom: 0,
        },
    });

    const volumeData = data.map(d => ({
        time: d.time,
        value: d.volume || 0,
        color: d.close >= d.open ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)',
    }));
    volumeSeries.setData(volumeData);

    // Simple Moving Average (SMA) Indicator
    const smaPeriod = 20;
    const smaData = data.map((d, i) => {
        if (i < smaPeriod -1) return null;
        const sum = data.slice(i - (smaPeriod - 1), i + 1).reduce((acc, curr) => acc + curr.close, 0);
        return { time: d.time, value: sum / smaPeriod };
    }).filter(Boolean);

    const smaLine = chart.addLineSeries({
      color: 'rgba(59, 130, 246, 0.8)',
      lineWidth: 2,
    });
    smaLine.setData(smaData as any);


    chart.timeScale().fitContent();

    const handleResize = () => {
      chart.resize(container.clientWidth, 600);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
    
  }, [data]);

  return <div ref={chartContainerRef} className="w-full h-[600px]" />;
};