
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Edit2, Trash2, Check, ExternalLink, Clock, MapPin, Users, FileText, X } from "lucide-react";
import { getEventTypeById } from "@/utils/eventTypes";

interface Event {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  name: string;
  typeId: string;
  color: string;
  isRecurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  recurringEnd?: string;
  dynamicFields: Record<string, string>;
  reminders: number[];
}

interface EventDetailsPopoverProps {
  event: Event;
  children: React.ReactNode;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
  onMarkDone?: (eventId: string) => void;
}

const EventDetailsPopover: React.FC<EventDetailsPopoverProps> = ({
  event,
  children,
  onEdit,
  onDelete,
  onMarkDone
}) => {
  const eventType = getEventTypeById(event.typeId);
  const IconComponent = eventType?.icon;

  const calculateDuration = () => {
    const start = new Date(`2000-01-01T${event.startTime}`);
    const end = new Date(`2000-01-01T${event.endTime}`);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return diffMinutes > 0 ? `${diffHours}h ${diffMinutes}min` : `${diffHours}h`;
    }
    return `${diffMinutes}min`;
  };

  const getJoinLink = () => {
    const linkField = Object.entries(event.dynamicFields).find(([key, value]) => 
      key.toLowerCase().includes('lien') || key.toLowerCase().includes('link') || 
      key.toLowerCase().includes('url') || value.toLowerCase().includes('http')
    );
    return linkField ? linkField[1] : null;
  };

  const joinLink = getJoinLink();

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 sm:w-96 p-0 bg-white dark:bg-gray-800 border-2 border-yellow-200 dark:border-yellow-600 shadow-xl"
        align="center"
        side="top"
      >
        {/* Header */}
        <div 
          className="p-4 rounded-t-lg text-white"
          style={{ backgroundColor: event.color }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 flex-1">
              {IconComponent && <IconComponent className="w-5 h-5 flex-shrink-0" />}
              <h3 className="font-semibold text-lg leading-tight">{event.name}</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 h-6 w-6 p-0"
              onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-2 text-sm opacity-90">
            {eventType?.name}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Time and Duration */}
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {event.startTime} - {event.endTime}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {event.day} • Durée: {calculateDuration()}
              </div>
            </div>
          </div>

          {/* Dynamic Fields */}
          {Object.entries(event.dynamicFields).map(([key, value]) => {
            if (!value) return null;
            
            const isLocation = key.toLowerCase().includes('lieu') || key.toLowerCase().includes('salle') || key.toLowerCase().includes('location');
            const isParticipants = key.toLowerCase().includes('participant') || key.toLowerCase().includes('organisateur') || key.toLowerCase().includes('professeur');
            const isNotes = key.toLowerCase().includes('note') || key.toLowerCase().includes('description') || key.toLowerCase().includes('agenda');
            
            let icon = FileText;
            if (isLocation) icon = MapPin;
            if (isParticipants) icon = Users;
            
            const IconComp = icon;
            
            return (
              <div key={key} className="flex items-start gap-3">
                <IconComp className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {key}
                  </div>
                  <div className="text-sm text-gray-900 dark:text-white">
                    {value}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Recurring Info */}
          {event.isRecurring && (
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 text-gray-500 dark:text-gray-400 flex items-center justify-center">
                ↻
              </div>
              <div className="text-sm text-gray-900 dark:text-white">
                Récurrence: {event.recurringPattern === 'daily' ? 'Quotidien' :
                           event.recurringPattern === 'weekly' ? 'Hebdomadaire' : 'Mensuel'}
              </div>
            </div>
          )}

          {/* Reminders */}
          {event.reminders.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 text-gray-500 dark:text-gray-400 flex items-center justify-center">
                🔔
              </div>
              <div className="text-sm text-gray-900 dark:text-white">
                Rappels: {event.reminders.map(r => `${r}min`).join(', ')} avant
              </div>
            </div>
          )}
        </div>

        <Separator className="border-yellow-200 dark:border-yellow-600" />

        {/* Actions */}
        <div className="p-4 space-y-3">
          {joinLink && (
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => window.open(joinLink, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Rejoindre
            </Button>
          )}
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 border-yellow-200 dark:border-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
              onClick={() => onEdit(event)}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Modifier
            </Button>
            
            {onMarkDone && (
              <Button
                variant="outline"
                className="flex-1 border-green-200 dark:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                onClick={() => onMarkDone(event.id)}
              >
                <Check className="w-4 h-4 mr-2" />
                Terminé
              </Button>
            )}
            
            <Button
              variant="outline"
              className="flex-1 border-red-200 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={() => onDelete(event.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EventDetailsPopover;
