import React from 'react';

const NexusLogo: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="url(#logo-grad)" />
    {/* Hexagonal neural core */}
    <path d="M20 8L30 14V26L20 32L10 26V14L20 8Z" stroke="hsl(224, 100%, 97%)" strokeWidth="1.5" strokeLinejoin="round" opacity="0.9" />
    {/* Inner triangle lattice */}
    <path d="M20 12L26 22H14L20 12Z" stroke="hsl(186, 100%, 50%)" strokeWidth="1" strokeLinejoin="round" opacity="0.7" />
    {/* Central eye / core */}
    <circle cx="20" cy="19" r="2.5" fill="hsl(186, 100%, 50%)" opacity="0.9">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="20" cy="19" r="5" stroke="hsl(186, 100%, 50%)" strokeWidth="0.5" opacity="0.3">
      <animate attributeName="r" values="4;6;4" dur="3s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite" />
    </circle>
    {/* Connection nodes */}
    <circle cx="20" cy="8" r="1" fill="hsl(357, 85%, 52%)" />
    <circle cx="30" cy="14" r="1" fill="hsl(357, 85%, 52%)" opacity="0.7" />
    <circle cx="10" cy="14" r="1" fill="hsl(357, 85%, 52%)" opacity="0.7" />
    <defs>
      <linearGradient id="logo-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="hsl(357, 85%, 52%)" />
        <stop offset="1" stopColor="hsl(357, 85%, 35%)" />
      </linearGradient>
    </defs>
  </svg>
);

export default NexusLogo;
