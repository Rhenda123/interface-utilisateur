
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface WelcomeTransitionProps {
  onComplete: () => void;
}

const WelcomeTransition: React.FC<WelcomeTransitionProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 800);
    const timer2 = setTimeout(() => setStage(2), 1600);
    const timer3 = setTimeout(() => setStage(3), 2400);
    const timer4 = setTimeout(() => onComplete(), 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex items-center justify-center px-6">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-white to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 opacity-60"></div>
      
      {/* Floating circles decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-yellow-200/20 dark:bg-yellow-500/10 transition-all duration-[2000ms] ease-out ${stage >= 1 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full bg-yellow-300/30 dark:bg-yellow-400/20 transition-all duration-[2000ms] ease-out delay-300 ${stage >= 1 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}></div>
        <div className={`absolute top-1/2 right-1/3 w-16 h-16 rounded-full bg-yellow-400/20 dark:bg-yellow-300/15 transition-all duration-[2000ms] ease-out delay-500 ${stage >= 1 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-md mx-auto">
        {/* Logo with entrance animation */}
        <div className={`transition-all duration-1000 ease-out ${stage >= 0 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
          <div className="relative">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-8">
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent drop-shadow-sm">
                SKOO
              </span>
              <span className="text-gray-800 dark:text-gray-200">
                LIFE
              </span>
            </h1>
            {/* Subtle underline decoration */}
            <div className={`h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full mx-auto transition-all duration-1000 delay-300 ${stage >= 0 ? 'w-24 opacity-100' : 'w-0 opacity-0'}`}></div>
          </div>
        </div>

        {/* Welcome message with slide-in animation */}
        <div className={`transition-all duration-800 ease-out delay-500 ${stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-yellow-200/50 dark:border-gray-700/50 shadow-lg">
            <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Welcome back!
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Hi {user?.name?.split(' ')[0] || 'there'} 👋
            </p>
          </div>
        </div>

        {/* Status message */}
        <div className={`transition-all duration-600 ease-out delay-1000 ${stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium mb-6">
            Getting things ready for you...
          </p>
        </div>

        {/* Modern loading animation */}
        <div className={`transition-all duration-500 ease-out delay-1500 ${stage >= 3 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex justify-center items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeTransition;
