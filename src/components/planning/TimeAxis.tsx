
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
    <div className={`bg-gradient-to-b from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 border-r border-yellow-300 dark:border-yellow-600 ${className}`}>
      {/* Header spacer - Sticky on desktop/tablet only */}
      <div className="h-16 border-b border-yellow-300 dark:border-yellow-600 flex items-center justify-center md:sticky md:top-0 z-30 bg-gradient-to-b from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Heure</span>
      </div>
      
      {/* Time slots */}
      <div className="relative">
        {hours.map((hour, index) => (
          <div key={hour} className="relative h-16 border-b border-yellow-200 dark:border-yellow-700 flex items-start justify-end pr-3 pt-1">
            <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">
              {hour}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeAxis;
