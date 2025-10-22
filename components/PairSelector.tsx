
import React, { useState, useRef, useEffect } from 'react';
import { SUPPORTED_PAIRS } from '../constants';
import { Pair } from '../types';
import { ChevronDownIcon } from './Icons';

interface PairSelectorProps {
  selectedPair: Pair;
  setSelectedPair: (pair: Pair) => void;
}

export const PairSelector: React.FC<PairSelectorProps> = ({ selectedPair, setSelectedPair }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (pair: Pair) => {
    setSelectedPair(pair);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-4 p-3 bg-blue-900/20 hover:bg-blue-900/40 rounded-lg transition-colors duration-200 w-full text-left"
      >
        <img src={`https://picsum.photos/seed/${selectedPair.symbol}/40`} alt={selectedPair.symbol} className="h-10 w-10 rounded-full" />
        <div>
          <span className="text-xl font-bold text-white">{selectedPair.name}</span>
          <p className="text-xs text-gray-400">Perpetual</p>
        </div>
        <ChevronDownIcon className={`h-6 w-6 text-gray-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-[#10183c] border border-blue-800/50 rounded-lg shadow-lg z-10 overflow-hidden">
          <ul>
            {SUPPORTED_PAIRS.map((pair) => (
              <li key={pair.id}>
                <button
                  onClick={() => handleSelect(pair)}
                  className={`w-full text-left p-3 flex items-center space-x-3 transition-colors duration-200 ${
                    selectedPair.id === pair.id ? 'bg-blue-700/50' : 'hover:bg-blue-800/30'
                  }`}
                >
                  <img src={`https://picsum.photos/seed/${pair.symbol}/32`} alt={pair.symbol} className="h-8 w-8 rounded-full" />
                  <span className="font-semibold text-white">{pair.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
