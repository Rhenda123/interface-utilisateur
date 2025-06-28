
import React from "react";
import { Event } from "@/utils/eventTypes";
import { getEventTypeById } from "@/utils/eventTypes";
import EventDetailsPopover from "@/components/EventDetailsPopover";
import { Bell } from "lucide-react";

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
    const height = Math.max((duration / 60) * hourHeight, 20);
    
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

  return (
    <div className="flex-1 border-r border-yellow-200 dark:border-gray-600 last:border-r-0">
      {/* Day Header */}
      <div className="h-16 bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 border-b border-yellow-300 dark:border-yellow-600 flex items-center justify-center sticky top-0 z-10">
        <span className="font-semibold text-gray-800 dark:text-gray-200">{day}</span>
      </div>
      
      {/* Day Content */}
      <div className="relative" style={{ height: '1536px' }}> {/* 24 hours * 64px */}
        {/* Hour grid lines and click areas */}
        {Array.from({ length: 24 }, (_, index) => (
          <div
            key={index}
            className="absolute w-full border-b border-yellow-100 dark:border-gray-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/10 cursor-pointer transition-colors"
            style={{ 
              top: index * 64, 
              height: 64,
              zIndex: 1
            }}
            onClick={() => onTimeSlotClick(day, index)}
            title={`Créer un événement à ${index.toString().padStart(2, '0')}:00`}
          />
        ))}
        
        {/* Events */}
        {eventGroups.map((group, groupIndex) => 
          group.map((event, eventIndex) => {
            const { top, height } = calculateEventPosition(event.startTime, event.endTime);
            const eventType = getEventTypeById(event.typeId);
            const IconComponent = eventType?.icon;
            const groupSize = group.length;
            const width = groupSize > 1 ? `${95 / groupSize}%` : '95%';
            const left = groupSize > 1 ? `${(eventIndex * 95) / groupSize + 2}%` : '2.5%';
            
            return (
              <EventDetailsPopover
                key={event.id}
                event={event}
                onEdit={onEdit}
                onDelete={onDelete}
              >
                <div
                  className="absolute rounded-lg shadow-md text-white font-medium group cursor-pointer transition-all hover:shadow-lg hover:z-20 border border-white/20"
                  style={{
                    backgroundColor: event.color,
                    top: `${top}px`,
                    height: `${Math.max(height, 24)}px`,
                    width,
                    left,
                    zIndex: 10
                  }}
                >
                  <div className="p-2 h-full flex flex-col justify-between overflow-hidden">
                    <div className="min-h-0">
                      <div className="flex items-center gap-1 mb-1">
                        {IconComponent && <IconComponent className="w-3 h-3 flex-shrink-0" />}
                        <div className="font-semibold text-xs leading-tight truncate">{event.name}</div>
                      </div>
                      
                      <div className="text-xs opacity-90 mb-1">
                        {event.startTime} - {event.endTime}
                      </div>
                      
                      {Object.entries(event.dynamicFields).slice(0, 1).map(([key, value]) => (
                        value && (
                          <div key={key} className="text-xs opacity-80 truncate">{value}</div>
                        )
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      {event.isRecurring && (
                        <div className="text-xs opacity-80">↻</div>
                      )}
                      {event.reminders.length > 0 && (
                        <Bell className="w-3 h-3 opacity-80" />
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
