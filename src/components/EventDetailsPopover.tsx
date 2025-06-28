
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, X, Calendar, Clock, Bell, Tag } from "lucide-react";
import { Event, getEventTypeById } from "@/utils/eventTypes";

interface EventDetailsPopoverProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
  children: React.ReactNode;
}

const EventDetailsPopover: React.FC<EventDetailsPopoverProps> = ({
  event,
  onEdit,
  onDelete,
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const eventType = getEventTypeById(event.typeId);
  const IconComponent = eventType?.icon;

  const calculateDuration = () => {
    const [startHours, startMinutes] = event.startTime.split(':').map(Number);
    const [endHours, endMinutes] = event.endTime.split(':').map(Number);
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    const durationMinutes = endTotalMinutes - startTotalMinutes;
    
    if (durationMinutes < 60) {
      return `${durationMinutes} min`;
    } else {
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
    }
  };

  const handleEdit = () => {
    setIsOpen(false);
    onEdit(event);
  };

  const handleDelete = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      onDelete(event.id);
    }
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 bg-white dark:bg-gray-800 border-yellow-200 dark:border-gray-700 shadow-xl"
        align="center"
        onInteractOutside={() => setIsOpen(false)}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-yellow-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            {IconComponent && (
              <div 
                className="w-3 h-3 rounded-full flex items-center justify-center"
                style={{ backgroundColor: event.color }}
              >
                <IconComponent className="w-2 h-2 text-white" />
              </div>
            )}
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {event.name}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Date and Time */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{event.day}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{event.startTime} - {event.endTime}</span>
            <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
              {calculateDuration()}
            </span>
          </div>

          {/* Event Type */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Tag className="w-4 h-4" />
            <span>{eventType?.name}</span>
          </div>

          {/* Reminders */}
          {event.reminders.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Bell className="w-4 h-4" />
              <span>Rappels: {event.reminders.join(', ')} min avant</span>
            </div>
          )}

          {/* Dynamic Fields */}
          {Object.entries(event.dynamicFields).map(([key, value]) => (
            value && (
              <div key={key} className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">{key}:</span> {value}
              </div>
            )
          ))}

          {/* Recurring Info */}
          {event.isRecurring && (
            <div className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded inline-block">
              Événement récurrent ({event.recurringPattern})
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-4 pt-0 border-t border-yellow-100 dark:border-gray-700">
          <Button
            onClick={handleEdit}
            size="sm"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 flex items-center gap-1"
          >
            <Edit className="w-3 h-3" />
            Modifier
          </Button>
          
          <Button
            onClick={handleDelete}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20 flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            Supprimer
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EventDetailsPopover;
