
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
    const timer1 = setTimeout(() => setStage(1), 800);
    const timer2 = setTimeout(() => setStage(2), 1600);
    const timer3 = setTimeout(() => setStage(3), 2400);
    const timer4 = setTimeout(() => onComplete(), 3500);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-20 left-10 w-32 h-32 bg-blue-200/20 dark:bg-blue-400/10 rounded-full blur-xl transition-all duration-1000 ${stage >= 1 ? 'scale-150 opacity-100' : 'scale-0 opacity-0'}`}></div>
        <div className={`absolute bottom-32 right-16 w-48 h-48 bg-indigo-200/15 dark:bg-indigo-400/8 rounded-full blur-2xl transition-all duration-1200 delay-300 ${stage >= 2 ? 'scale-125 opacity-100' : 'scale-0 opacity-0'}`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-100/10 to-indigo-100/10 dark:from-blue-400/5 dark:to-indigo-400/5 rounded-full blur-3xl transition-all duration-1500 delay-600 ${stage >= 3 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          {/* Brand logo with smooth entrance */}
          <div className={`transition-all duration-1000 ease-out ${stage >= 0 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#F6C103] to-[#E5AD03] bg-clip-text text-transparent mb-8 tracking-tight">
              SKOOLIFE
            </h1>
          </div>

          {/* User avatar with elegant entrance */}
          <div className={`transition-all duration-800 ease-out delay-500 ${stage >= 1 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90'}`}>
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-white dark:border-gray-700 shadow-2xl">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-[#F6C103] to-[#E5AD03] text-gray-900 font-bold text-2xl">
                    {user?.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -inset-1 bg-gradient-to-r from-[#F6C103] to-[#E5AD03] rounded-full blur opacity-30 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Welcome message with smooth entrance */}
          <div className={`transition-all duration-1000 ease-out delay-1000 ${stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-gray-200/50 dark:border-gray-700/50 shadow-2xl mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Bienvenue sur Skoolife,
                <br />
                <span className="text-xl sm:text-2xl lg:text-3xl font-medium text-gray-600 dark:text-gray-300">
                  votre espace étudiant personnalisé.
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-[#F6C103] font-medium">
                Salut {user?.name?.split(' ')[0] || 'toi'} ! 👋
              </p>
            </div>
          </div>

          {/* Navigation preview with staggered animation */}
          <div className={`transition-all duration-800 ease-out delay-1500 ${stage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="hidden sm:flex justify-center mb-8">
              <div className="inline-flex bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-2 shadow-xl border border-gray-200/50 dark:border-gray-700/50 gap-1">
                {navigationItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={item.id}
                      className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                        index === 0 
                          ? "bg-gradient-to-r from-[#F6C103] to-[#E5AD03] text-gray-900 shadow-lg transform scale-105" 
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                      style={{ 
                        animationDelay: `${1800 + index * 150}ms`,
                        opacity: stage >= 3 ? 1 : 0,
                        transform: stage >= 3 ? 'translateY(0)' : 'translateY(10px)',
                        transition: `opacity 0.5s ease-out ${1800 + index * 150}ms, transform 0.5s ease-out ${1800 + index * 150}ms`
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <span className="hidden lg:block">{item.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile navigation preview */}
            <div className="sm:hidden">
              <div className="flex justify-center gap-4">
                {navigationItems.slice(0, 5).map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-full transition-all duration-300 ${
                        index === 0
                          ? "bg-gradient-to-r from-[#F6C103] to-[#E5AD03] text-gray-900 shadow-lg scale-110"
                          : "bg-white/95 dark:bg-gray-800/95 text-gray-500 dark:text-gray-400 shadow-md"
                      }`}
                      style={{ 
                        animationDelay: `${1800 + index * 100}ms`,
                        opacity: stage >= 3 ? 1 : 0,
                        transform: stage >= 3 ? 'scale(1)' : 'scale(0.8)',
                        transition: `opacity 0.4s ease-out ${1800 + index * 100}ms, transform 0.4s ease-out ${1800 + index * 100}ms`
                      }}
                    >
                      <IconComponent className="h-5 w-5" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Loading indicator */}
            <div className="mt-12">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-6">
                Préparation de votre espace...
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
    </div>
  );
};

export default WelcomeTransition;
