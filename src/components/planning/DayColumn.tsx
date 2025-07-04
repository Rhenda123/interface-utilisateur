
import React from "react";
import { Event } from "@/utils/eventTypes";
import { getEventTypeById } from "@/utils/eventTypes";
import EventDetailsPopover from "@/components/EventDetailsPopover";
import { Bell, Calendar } from "lucide-react";

interface DayColumnProps {
  day: string;
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
  onTimeSlotClick: (day: string, hour: number) => void;
}

const DayColumn: React.FC<DayColumnProps> = ({
  day,
  events,
  onEdit,
  onDelete,
  onTimeSlotClick
}) => {
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const calculateEventPosition = (startTime: string, endTime: string) => {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    const duration = endMinutes - startMinutes;
    
    // Each hour is 64px (h-16)
    const hourHeight = 64;
    const top = (startMinutes / 60) * hourHeight;
    const height = Math.max((duration / 60) * hourHeight, 24);
    
    return { top, height };
  };

  const getOverlappingEvents = (dayEvents: Event[]) => {
    const groups: Event[][] = [];
    
    dayEvents.forEach(event => {
      const eventStart = timeToMinutes(event.startTime);
      const eventEnd = timeToMinutes(event.endTime);
      
      let placed = false;
      
      for (let group of groups) {
        const hasOverlap = group.some(groupEvent => {
          const groupStart = timeToMinutes(groupEvent.startTime);
          const groupEnd = timeToMinutes(groupEvent.endTime);
          return eventStart < groupEnd && eventEnd > groupStart;
        });
        
        if (hasOverlap) {
          group.push(event);
          placed = true;
          break;
        }
      }
      
      if (!placed) {
        groups.push([event]);
      }
    });
    
    return groups;
  };

  const eventGroups = getOverlappingEvents(events);

  // Get current day for highlighting
  const currentDay = new Date().toLocaleDateString('fr-FR', { weekday: 'long' });
  const isToday = currentDay.toLowerCase() === day.toLowerCase();

  return (
    <div className="flex-1 border-r border-yellow-200 dark:border-gray-600 last:border-r-0 min-w-0">
      {/* Day Header - Sticky on desktop/tablet only */}
      <div className={`h-20 md:h-16 bg-gradient-to-br ${isToday 
        ? 'from-yellow-200 to-yellow-300 dark:from-yellow-600 dark:to-yellow-700' 
        : 'from-yellow-100 to-yellow-200 dark:from-gray-700 dark:to-gray-800'
      } border-b-2 ${isToday 
        ? 'border-yellow-400 dark:border-yellow-500' 
        : 'border-yellow-300 dark:border-gray-600'
      } md:sticky md:top-16 z-30 flex flex-col items-center justify-center shadow-sm`}>
        <div className="flex items-center gap-2">
          {isToday && <Calendar className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />}
          <span className={`font-bold text-sm md:text-base ${isToday 
            ? 'text-yellow-800 dark:text-yellow-200' 
            : 'text-gray-800 dark:text-gray-200'
          }`}>
            {day}
          </span>
        </div>
        {isToday && (
          <div className="text-xs text-yellow-700 dark:text-yellow-300 font-medium">
            Aujourd'hui
          </div>
        )}
      </div>
      
      {/* Day Content */}
      <div className="relative bg-white dark:bg-gray-900" style={{ height: '1536px' }}> {/* 24 hours * 64px */}
        {/* Hour grid lines and click areas */}
        {Array.from({ length: 24 }, (_, index) => (
          <div
            key={index}
            className="absolute w-full border-b border-yellow-50 dark:border-gray-800 hover:bg-yellow-25 dark:hover:bg-gray-800/50 cursor-pointer transition-colors group"
            style={{ 
              top: index * 64, 
              height: 64,
              zIndex: 1
            }}
            onClick={() => onTimeSlotClick(day, index)}
            title={`Créer un événement à ${index.toString().padStart(2, '0')}:00`}
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-yellow-400 text-gray-800 px-2 py-1 rounded-md text-xs font-medium shadow-lg">
                + Ajouter événement
              </div>
            </div>
          </div>
        ))}
        
        {/* Events */}
        {eventGroups.map((group, groupIndex) => 
          group.map((event, eventIndex) => {
            const { top, height } = calculateEventPosition(event.startTime, event.endTime);
            const eventType = getEventTypeById(event.typeId);
            const IconComponent = eventType?.icon;
            const groupSize = group.length;
            const width = groupSize > 1 ? `${90 / groupSize}%` : '90%';
            const left = groupSize > 1 ? `${(eventIndex * 90) / groupSize + 5}%` : '5%';
            
            return (
              <EventDetailsPopover
                key={event.id}
                event={event}
                onEdit={onEdit}
                onDelete={onDelete}
              >
                <div
                  className="absolute rounded-xl shadow-lg text-white font-medium group cursor-pointer transition-all hover:shadow-xl hover:z-20 border-2 border-white/30 backdrop-blur-sm"
                  style={{
                    backgroundColor: event.color,
                    backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                    top: `${top}px`,
                    height: `${Math.max(height, 32)}px`,
                    width,
                    left,
                    zIndex: 10
                  }}
                >
                  <div className="p-3 h-full flex flex-col justify-between overflow-hidden">
                    <div className="min-h-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {IconComponent && <IconComponent className="w-4 h-4 flex-shrink-0" />}
                        <div className="font-bold text-sm leading-tight truncate">{event.name}</div>
                      </div>
                      
                      <div className="text-xs opacity-90 mb-2 font-medium">
                        {event.startTime} - {event.endTime}
                      </div>
                      
                      {Object.entries(event.dynamicFields).slice(0, 1).map(([key, value]) => (
                        value && (
                          <div key={key} className="text-xs opacity-80 truncate bg-black/10 px-2 py-1 rounded">
                            {value}
                          </div>
                        )
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      {event.isRecurring && (
                        <div className="text-xs opacity-90 bg-black/20 px-2 py-1 rounded font-medium">↻</div>
                      )}
                      {event.reminders.length > 0 && (
                        <Bell className="w-3 h-3 opacity-90" />
                      )}
                    </div>
                  </div>
                </div>
              </EventDetailsPopover>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DayColumn;
