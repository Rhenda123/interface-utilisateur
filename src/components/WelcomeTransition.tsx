
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Home, DollarSign, CheckSquare, Calendar, FileText } from "lucide-react";

interface WelcomeTransitionProps {
  onComplete: () => void;
}

const WelcomeTransition: React.FC<WelcomeTransitionProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 500);
    const timer2 = setTimeout(() => setStage(2), 1000);
    const timer3 = setTimeout(() => setStage(3), 1500);
    const timer4 = setTimeout(() => onComplete(), 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  const navigationItems = [
    { id: "home", label: "Accueil", icon: Home },
    { id: "finances", label: "Finances", icon: DollarSign },
    { id: "todo", label: "Tâches", icon: CheckSquare },
    { id: "planning", label: "Planning", icon: Calendar },
    { id: "documents", label: "Documents", icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header matching the main interface */}
      <header className="sticky top-0 z-50 bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm lg:shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Brand */}
            <div className={`transition-all duration-800 ease-out ${stage >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[#F6C103] to-[#E5AD03] dark:from-[#F6C103] dark:to-[#E5AD03] bg-clip-text text-transparent">
                SKOOLIFE
              </h1>
            </div>

            {/* Navigation preview */}
            <div className={`hidden lg:flex transition-all duration-800 ease-out delay-300 ${stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="inline-flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg border border-[#F6C103] dark:border-gray-700">
                {navigationItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={item.id}
                      className={`px-4 py-2 rounded-md font-medium transition-all duration-300 whitespace-nowrap ${
                        index === 0 
                          ? "bg-gradient-to-r from-[#F6C103] to-[#E5AD03] text-gray-900 shadow-md" 
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="hidden lg:block">{item.label}</div>
                      <div className="lg:hidden">
                        <IconComponent className="h-5 w-5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* User avatar preview */}
            <div className={`transition-all duration-800 ease-out delay-500 ${stage >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <Avatar className="h-8 w-8 lg:h-10 lg:w-10 border-2 border-yellow-200">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-gray-900 font-semibold text-sm lg:text-base">
                  {user?.initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <div className="text-center max-w-md mx-auto">
          {/* Welcome card matching interface style */}
          <div className={`transition-all duration-800 ease-out delay-700 ${stage >= 2 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
              <div className="flex items-center justify-center mb-6">
                <Avatar className="h-16 w-16 border-4 border-yellow-200 dark:border-yellow-400/30">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-gray-900 font-bold text-xl">
                    {user?.initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Bienvenue !
              </h2>
              
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Salut {user?.name?.split(' ')[0] || 'toi'} 👋
              </p>

              {/* Loading indicator */}
              <div className={`transition-all duration-500 ease-out delay-1000 ${stage >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-4">
                  Préparation en cours...
                </p>
                <div className="flex justify-center items-center space-x-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#F6C103] to-[#E5AD03] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gradient-to-r from-[#F6C103] to-[#E5AD03] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gradient-to-r from-[#F6C103] to-[#E5AD03] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom navigation preview for mobile */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 transition-all duration-800 ease-out delay-900 ${stage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-full'}`}>
        <nav className="bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
          <div className="flex items-center justify-around px-1 py-2">
            {navigationItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-center p-2.5 rounded-full transition-all duration-300 ${
                    index === 0
                      ? "bg-gradient-to-r from-[#F6C103] to-[#E5AD03] text-gray-900 shadow-lg scale-105"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                </div>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default WelcomeTransition;
