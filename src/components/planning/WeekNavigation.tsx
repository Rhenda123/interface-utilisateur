
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

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
    <div className="flex items-center justify-between gap-4 p-6 bg-white dark:bg-gray-800 border-b border-yellow-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <Button
          onClick={onToday}
          variant="outline"
          size="default"
          className="border-yellow-200 dark:border-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 h-11 px-5"
        >
          <Calendar className="w-5 h-5 mr-2" />
          Aujourd'hui
        </Button>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={onPreviousWeek}
            variant="ghost"
            size="default"
            className="hover:bg-yellow-100 dark:hover:bg-yellow-900/20 h-11 w-11"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <Button
            onClick={onNextWeek}
            variant="ghost"
            size="default"
            className="hover:bg-yellow-100 dark:hover:bg-yellow-900/20 h-11 w-11"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      <div className="text-lg font-semibold text-gray-900 dark:text-white">
        {weekRange.start} - {weekRange.end}
      </div>
    </div>
  );
};

export default WeekNavigation;
