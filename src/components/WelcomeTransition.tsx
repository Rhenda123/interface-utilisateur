
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface WelcomeTransitionProps {
  onComplete: () => void;
}

const WelcomeTransition: React.FC<WelcomeTransitionProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 500);
    const timer2 = setTimeout(() => setStage(2), 1800);
    const timer3 = setTimeout(() => setStage(3), 2800);
    const timer4 = setTimeout(() => onComplete(), 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-white via-yellow-50 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center">
      {/* Floating white elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-20 w-4 h-4 bg-white/40 rounded-full transition-all duration-[3000ms] ease-out ${stage >= 1 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} style={{ animationDelay: '0.2s' }}></div>
        <div className={`absolute top-40 right-32 w-6 h-6 bg-white/30 rounded-full transition-all duration-[3500ms] ease-out ${stage >= 1 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} style={{ animationDelay: '0.5s' }}></div>
        <div className={`absolute bottom-32 left-32 w-3 h-3 bg-white/50 rounded-full transition-all duration-[4000ms] ease-out ${stage >= 2 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} style={{ animationDelay: '0.8s' }}></div>
        <div className={`absolute bottom-20 right-20 w-5 h-5 bg-white/35 rounded-full transition-all duration-[3200ms] ease-out ${stage >= 2 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} style={{ animationDelay: '1.1s' }}></div>
      </div>

      <div className="text-center space-y-12 relative z-10">
        {/* White backdrop circle */}
        <div className={`absolute -inset-20 bg-white/20 dark:bg-white/10 rounded-full blur-3xl transition-all duration-[2000ms] ease-out ${stage >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}></div>
        
        {/* SKOOLIFE Logo with white shadow */}
        <div className={`transition-all duration-[1500ms] ease-out transform ${stage >= 1 ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-8'}`}>
          <div className="relative">
            {/* White shadow/glow effect */}
            <h1 className="absolute inset-0 text-6xl md:text-8xl font-bold text-white/30 blur-sm">
              SKOOLIFE
            </h1>
            {/* Main logo */}
            <h1 className="relative text-6xl md:text-8xl font-bold bg-gradient-to-r from-[#F6C103] to-[#E5AD03] bg-clip-text text-transparent drop-shadow-lg">
              SKOOLIFE
            </h1>
          </div>
        </div>

        {/* Welcome message with white background */}
        <div className={`transition-all duration-[1200ms] ease-out transform ${stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-xl border border-white/50">
            <p className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200">
              Welcome back, {user?.name?.split(' ')[0]}!
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
              Getting your dashboard ready...
            </p>
          </div>
        </div>

        {/* Enhanced loading animation */}
        <div className={`transition-all duration-[1000ms] ease-out ${stage >= 3 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex justify-center space-x-3">
            <div className="w-4 h-4 bg-gradient-to-r from-[#F6C103] to-[#E5AD03] rounded-full animate-bounce shadow-lg"></div>
            <div className="w-4 h-4 bg-white/90 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.15s' }}></div>
            <div className="w-4 h-4 bg-gradient-to-r from-[#F6C103] to-[#E5AD03] rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.3s' }}></div>
            <div className="w-4 h-4 bg-white/90 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.45s' }}></div>
            <div className="w-4 h-4 bg-gradient-to-r from-[#F6C103] to-[#E5AD03] rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.6s' }}></div>
          </div>
        </div>

        {/* Large background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-white/10 via-[#F6C103]/10 to-[#E5AD03]/10 rounded-full transition-all duration-[2500ms] ease-out ${stage >= 1 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}></div>
          <div className={`absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-white/10 via-[#F6C103]/10 to-[#E5AD03]/10 rounded-full transition-all duration-[3000ms] ease-out delay-700 ${stage >= 2 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}></div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeTransition;
