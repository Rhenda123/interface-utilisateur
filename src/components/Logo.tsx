
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10 sm:w-12 sm:h-12"
        >
          {/* Background circle */}
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="url(#gradient1)"
            className="drop-shadow-lg"
          />
          
          {/* Book pages */}
          <path
            d="M14 16h20v16H14z"
            fill="white"
            fillOpacity="0.9"
            rx="2"
          />
          
          {/* Book spine */}
          <path
            d="M16 14h16v2H16z"
            fill="url(#gradient2)"
            rx="1"
          />
          
          {/* Academic cap */}
          <path
            d="M24 12L30 15v6l-6 3-6-3v-6l6-3z"
            fill="url(#gradient3)"
            className="drop-shadow-sm"
          />
          
          {/* Cap tassel */}
          <circle
            cx="28"
            cy="17"
            r="2"
            fill="#F59E0B"
          />
          <path
            d="M28 19v4"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeLinecap="round"
          />
          
          {/* Text lines on book */}
          <path d="M18 20h12" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round" />
          <path d="M18 23h10" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round" />
          <path d="M18 26h8" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round" />
          
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="50%" stopColor="#FCD34D" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="flex flex-col">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-700 dark:from-yellow-400 dark:to-yellow-500 bg-clip-text text-transparent leading-tight">
          SKOOLIFE
        </h1>
        <p className="text-xs sm:text-sm text-yellow-600 dark:text-yellow-400 font-medium -mt-1">
          Student Hub
        </p>
      </div>
    </div>
  );
};

export default Logo;
