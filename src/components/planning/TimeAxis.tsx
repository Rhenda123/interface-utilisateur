
import React from "react";

interface TimeAxisProps {
  className?: string;
}

const TimeAxis: React.FC<TimeAxisProps> = ({ className = "" }) => {
  const generateHours = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      const timeString = `${i.toString().padStart(2, '0')}:00`;
      hours.push(timeString);
    }
    return hours;
  };

  const hours = generateHours();

  return (
    <div className={`bg-gradient-to-b from-yellow-50 to-yellow-100 dark:from-gray-800 dark:to-gray-900 border-r border-yellow-200 dark:border-gray-600 ${className}`}>
      {/* Header spacer - matches day header height */}
      <div className="h-20 md:h-16 bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-gray-700 dark:to-gray-800 border-b border-yellow-300 dark:border-gray-600 flex items-center justify-center sticky top-0 md:top-16 z-40">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Heure</span>
      </div>
      
      {/* Time slots */}
      <div className="relative">
        {hours.map((hour, index) => (
          <div key={hour} className="relative h-16 border-b border-yellow-100 dark:border-gray-700 flex items-start justify-end pr-3 pt-2">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm border border-yellow-200 dark:border-gray-600">
              {hour}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeAxis;
