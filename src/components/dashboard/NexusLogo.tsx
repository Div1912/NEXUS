import React from 'react';

const NexusLogo: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="10" fill="url(#logo-grad)" />
    <path d="M12 28V12L20 22L28 12V28" stroke="hsl(224, 100%, 97%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="20" cy="17" r="3" fill="hsl(186, 100%, 50%)" opacity="0.8">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
    </circle>
    <defs>
      <linearGradient id="logo-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="hsl(357, 85%, 52%)" />
        <stop offset="1" stopColor="hsl(357, 85%, 38%)" />
      </linearGradient>
    </defs>
  </svg>
);

export default NexusLogo;
