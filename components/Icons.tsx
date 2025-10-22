
import React from 'react';

export const LogoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 0L95.1141 24.9992V75.0008L50 100L4.88591 75.0008V24.9992L50 0Z" fill="url(#paint0_linear_1_2)"/>
    <path d="M50 10L86.6025 30V70L50 90L13.3975 70V30L50 10Z" stroke="white" strokeWidth="3"/>
    <path d="M50 40L75.9808 55V85L50 100L24.0192 85V55L50 40Z" fill="url(#paint1_linear_1_2)" opacity="0.5"/>
    <defs>
    <linearGradient id="paint0_linear_1_2" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
    <stop stopColor="#1E3A8A"/>
    <stop offset="1" stopColor="#3B82F6"/>
    </linearGradient>
    <linearGradient id="paint1_linear_1_2" x1="50" y1="40" x2="50" y2="100" gradientUnits="userSpaceOnUse">
    <stop stopColor="#FFFFFF" stopOpacity="0.5"/>
    <stop offset="1" stopColor="#FFFFFF" stopOpacity="0"/>
    </linearGradient>
    </defs>
  </svg>
);

export const WalletIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
  </svg>
);

export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
    </svg>
);

export const ExternalLinkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);
