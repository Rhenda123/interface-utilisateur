
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
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/4 left-1/6 w-20 h-20 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-blue-200/30 to-indigo-300/20 dark:from-blue-500/20 dark:to-indigo-400/10 transition-all duration-[2000ms] ease-out ${stage >= 1 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}></div>
        <div className={`absolute bottom-1/4 right-1/6 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-yellow-200/40 to-orange-300/30 dark:from-yellow-400/20 dark:to-orange-300/15 transition-all duration-[2000ms] ease-out delay-300 ${stage >= 1 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}></div>
        <div className={`absolute top-1/2 right-1/3 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-green-200/30 to-emerald-300/20 dark:from-green-400/15 dark:to-emerald-300/10 transition-all duration-[2000ms] ease-out delay-500 ${stage >= 1 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}></div>
        <div className={`absolute bottom-1/3 left-1/3 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-purple-200/30 to-pink-300/20 dark:from-purple-400/15 dark:to-pink-300/10 transition-all duration-[2000ms] ease-out delay-700 ${stage >= 1 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}></div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 text-center max-w-xs sm:max-w-md lg:max-w-lg mx-auto">
        {/* Logo */}
        <div className={`transition-all duration-1000 ease-out ${stage >= 0 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 sm:mb-8">
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
              SKOO
            </span>
            <span className="text-gray-800 dark:text-gray-100">
              LIFE
            </span>
          </h1>
        </div>

        {/* Welcome message */}
        <div className={`transition-all duration-800 ease-out delay-500 ${stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <p className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Bienvenue !
            </p>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
              Salut {user?.name?.split(' ')[0] || 'toi'} 👋
            </p>
          </div>
        </div>

        {/* Status message */}
        <div className={`transition-all duration-600 ease-out delay-1000 ${stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg font-medium mb-4 sm:mb-6">
            Préparation en cours...
          </p>
        </div>

        {/* Loading animation */}
        <div className={`transition-all duration-500 ease-out delay-1500 ${stage >= 3 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex justify-center items-center">
            <div className="flex space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeTransition;
