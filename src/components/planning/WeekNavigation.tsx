
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar, Today } from "lucide-react";

interface WeekNavigationProps {
  currentWeek: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
}

const WeekNavigation: React.FC<WeekNavigationProps> = ({
  currentWeek,
  onPreviousWeek,
  onNextWeek,
  onToday
}) => {
  const getWeekRange = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
    startOfWeek.setDate(diff);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return {
      start: startOfWeek.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
      end: endOfWeek.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    };
  };

  const weekRange = getWeekRange(currentWeek);

  return (
    <div className="md:sticky md:top-0 z-50 bg-white dark:bg-gray-900 border-b-2 border-yellow-200 dark:border-gray-700 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 md:p-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={onToday}
            variant="outline"
            className="bg-yellow-400 hover:bg-yellow-500 border-yellow-500 text-gray-900 font-semibold shadow-md hover:shadow-lg transition-all"
          >
            <Today className="w-4 h-4 mr-2" />
            Aujourd'hui
          </Button>
          
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-1">
            <Button
              onClick={onPreviousWeek}
              variant="ghost"
              size="sm"
              className="hover:bg-white dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={onNextWeek}
              variant="ghost"
              size="sm"
              className="hover:bg-white dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {weekRange.start} - {weekRange.end}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekNavigation;
