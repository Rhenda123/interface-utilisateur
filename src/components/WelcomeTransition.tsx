
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface WelcomeTransitionProps {
  onComplete: () => void;
}

const WelcomeTransition: React.FC<WelcomeTransitionProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 300);
    const timer2 = setTimeout(() => setStage(2), 1200);
    const timer3 = setTimeout(() => setStage(3), 2000);
    const timer4 = setTimeout(() => onComplete(), 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* SKOOLIFE Logo with animation */}
        <div className={`transition-all duration-1000 ${stage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-[#F6C103] to-[#E5AD03] bg-clip-text text-transparent">
            SKOOLIFE
          </h1>
        </div>

        {/* Welcome message */}
        <div className={`transition-all duration-800 delay-300 ${stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200">
            Welcome back, {user?.name?.split(' ')[0]}!
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            Getting your dashboard ready...
          </p>
        </div>

        {/* Loading animation */}
        <div className={`transition-all duration-600 delay-700 ${stage >= 3 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-[#F6C103] to-[#E5AD03] rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-[#F6C103] to-[#E5AD03] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-gradient-to-r from-[#F6C103] to-[#E5AD03] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        {/* Subtle background animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#F6C103]/10 to-[#E5AD03]/10 rounded-full transition-all duration-2000 ${stage >= 1 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}></div>
          <div className={`absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-[#F6C103]/10 to-[#E5AD03]/10 rounded-full transition-all duration-2000 delay-500 ${stage >= 2 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}></div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeTransition;
