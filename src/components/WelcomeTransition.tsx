
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface WelcomeTransitionProps {
  onComplete: () => void;
}

const WelcomeTransition: React.FC<WelcomeTransitionProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 600);
    const timer2 = setTimeout(() => setStage(2), 1400);
    const timer3 = setTimeout(() => onComplete(), 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="text-center max-w-sm mx-auto">
        {/* Logo */}
        <div className={`transition-all duration-700 ease-out transform ${stage >= 0 ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#F6C103] to-[#E5AD03] bg-clip-text text-transparent mb-8">
            SKOOLIFE
          </h1>
        </div>

        {/* Welcome Message */}
        <div className={`transition-all duration-700 ease-out transform ${stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-gray-200 mb-2">
            Welcome back!
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            {user?.name?.split(' ')[0]}
          </p>
        </div>

        {/* Simple Loading */}
        <div className={`transition-all duration-500 ease-out ${stage >= 2 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex justify-center items-center space-x-1">
            <div className="w-2 h-2 bg-[#F6C103] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[#F6C103] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-[#F6C103] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeTransition;
