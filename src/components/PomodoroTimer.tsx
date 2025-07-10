
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Coffee, Clock } from 'lucide-react';

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes en secondes
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [sessions, setSessions] = useState(0);

  const modes = {
    work: { duration: 25 * 60, label: 'Travail', color: 'text-skoolife-primary', bg: 'bg-skoolife-light' },
    shortBreak: { duration: 5 * 60, label: 'Pause courte', color: 'text-skoolife-secondary', bg: 'bg-orange-50' },
    longBreak: { duration: 15 * 60, label: 'Pause longue', color: 'text-blue-600', bg: 'bg-blue-50' }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Auto-switch modes
      if (mode === 'work') {
        setSessions(prev => prev + 1);
        const newMode = sessions > 0 && (sessions + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
        setMode(newMode);
        setTimeLeft(modes[newMode].duration);
      } else {
        setMode('work');
        setTimeLeft(modes.work.duration);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, sessions]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(modes[mode].duration);
  };

  const switchMode = (newMode: 'work' | 'shortBreak' | 'longBreak') => {
    setMode(newMode);
    setTimeLeft(modes[newMode].duration);
    setIsActive(false);
  };

  const progress = ((modes[mode].duration - timeLeft) / modes[mode].duration) * 100;
  const currentMode = modes[mode];

  return (
    <Card className="border-skoolife-primary dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-skoolife-primary" />
            Pomodoro
          </h3>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Coffee className="w-3 h-3" />
            <span>{sessions} sessions</span>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {Object.entries(modes).map(([key, modeConfig]) => (
            <button
              key={key}
              onClick={() => switchMode(key as any)}
              className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 ${
                mode === key
                  ? `${modeConfig.bg} ${modeConfig.color} shadow-sm`
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {modeConfig.label}
            </button>
          ))}
        </div>

        {/* Timer Display */}
        <div className="text-center mb-6">
          <div className={`text-4xl sm:text-5xl font-bold ${currentMode.color} dark:text-yellow-400 mb-2`}>
            {formatTime(timeLeft)}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div 
              className={`bg-gradient-to-r from-skoolife-primary to-skoolife-secondary h-2 rounded-full transition-all duration-1000 relative overflow-hidden`}
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>

          <div className={`text-sm font-medium ${currentMode.color} dark:text-yellow-300`}>
            {currentMode.label}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3">
          <Button
            onClick={toggleTimer}
            className={`${
              isActive 
                ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                : 'bg-skoolife-primary hover:bg-yellow-500 text-gray-900'
            } rounded-full w-12 h-12 sm:w-auto sm:h-auto sm:rounded-lg sm:px-6 sm:py-3 shadow-lg active:scale-95 transition-all touch-manipulation`}
          >
            {isActive ? (
              <Pause className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-2" />
            ) : (
              <Play className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-2" />
            )}
            <span className="hidden sm:inline">
              {isActive ? 'Pause' : 'Start'}
            </span>
          </Button>

          <Button
            onClick={resetTimer}
            variant="outline"
            className="rounded-full w-12 h-12 sm:w-auto sm:h-auto sm:rounded-lg sm:px-6 sm:py-3 shadow-lg active:scale-95 transition-all touch-manipulation border-skoolife-primary text-skoolife-primary hover:bg-skoolife-light"
          >
            <RotateCcw className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PomodoroTimer;
