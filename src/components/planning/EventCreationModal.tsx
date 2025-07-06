import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, MoreHorizontal } from "lucide-react";
import { eventTypes, getEventTypeById, Event } from "@/utils/eventTypes";
import { useIsMobile } from "@/hooks/use-mobile";

interface EventCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: Partial<Event>) => void;
  initialData: {
    day: string;
    startTime: string;
    endTime: string;
    date: string;
  };
  onMoreOptions?: () => void;
}

const EventCreationModal: React.FC<EventCreationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  onMoreOptions
}) => {
  const isMobile = useIsMobile();
  
  const [eventName, setEventName] = useState("");
  const [selectedTypeId, setSelectedTypeId] = useState("class");
  const [selectedDay, setSelectedDay] = useState(initialData.day);
  const [startTime, setStartTime] = useState(initialData.startTime);
  const [endTime, setEndTime] = useState(initialData.endTime);
  const [dynamicFields, setDynamicFields] = useState<Record<string, string>>({});

  // Days of the week in French
  const daysOfWeek = [
    'lundi',
    'mardi', 
    'mercredi',
    'jeudi',
    'vendredi',
    'samedi',
    'dimanche'
  ];

  // Generate 15-minute intervals from 7:00 to 22:00
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 7; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  useEffect(() => {
    if (isOpen) {
      setSelectedDay(initialData.day);
      setStartTime(initialData.startTime);
      setEndTime(initialData.endTime);
      setEventName("");
      setSelectedTypeId("class");
      setDynamicFields({});
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    // Reset dynamic fields when event type changes
    const eventType = getEventTypeById(selectedTypeId);
    if (eventType) {
      const newFields: Record<string, string> = {};
      eventType.fields.forEach(field => {
        newFields[field.id] = "";
      });
      setDynamicFields(newFields);
    }
  }, [selectedTypeId]);

  const handleSave = () => {
    if (!eventName.trim()) return;
    
    const eventType = getEventTypeById(selectedTypeId);
    if (!eventType) return;
    
    const eventData: Partial<Event> = {
      day: selectedDay,
      startTime,
      endTime,
      name: eventName,
      typeId: selectedTypeId,
      color: eventType.color,
      isRecurring: false,
      dynamicFields: { ...dynamicFields },
      reminders: [...eventType.reminderDefaults]
    };
    
    onSave(eventData);
    onClose();
  };

  const updateDynamicField = (fieldId: string, value: string) => {
    setDynamicFields(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const selectedEventType = getEventTypeById(selectedTypeId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-[90vw] max-w-[90vw] sm:w-full p-0 gap-0 bg-white dark:bg-gray-800 border-skoolife-primary/30 dark:border-gray-700 max-h-[85vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="p-4 pb-3 border-b border-skoolife-primary/20 dark:border-gray-700 bg-gradient-to-r from-skoolife-light to-white dark:from-gray-800 dark:to-gray-800">
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Nouvel événement
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Event Name */}
          <div>
            <Input
              type="text"
              placeholder="Ajouter un titre"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="text-base font-medium border-0 shadow-none px-0 focus-visible:ring-0 placeholder:text-gray-400 h-10 bg-transparent"
              autoFocus
            />
          </div>
          
          {/* Day Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Jour
            </label>
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger className="h-10 bg-skoolife-light/50 border-skoolife-primary/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {daysOfWeek.map(day => (
                  <SelectItem key={day} value={day} className="capitalize">
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Time Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Horaire
            </label>
            <div className="flex items-center gap-2">
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger className="flex-1 h-10 bg-skoolife-light/50 border-skoolife-primary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <span className="text-gray-500">-</span>
              
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger className="flex-1 h-10 bg-skoolife-light/50 border-skoolife-primary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Event Type Selection - Simplified for mobile */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {eventTypes.slice(0, 4).map(type => {
                const IconComponent = type.icon;
                const isSelected = selectedTypeId === type.id;
                return (
                  <Button
                    key={type.id}
                    onClick={() => setSelectedTypeId(type.id)}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className={`flex items-center gap-2 h-10 text-xs ${isSelected ? 'bg-skoolife-primary hover:bg-skoolife-secondary text-gray-900' : 'border-skoolife-primary/30 hover:bg-skoolife-light/50'}`}
                  >
                    <IconComponent className="w-3 h-3" />
                    {type.name}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Fields - Show only the first one for mobile */}
          {selectedEventType && selectedEventType.fields.length > 0 && (
            <div className="space-y-2">
              <Input
                type={selectedEventType.fields[0].type === 'number' ? 'number' : 'text'}
                placeholder={selectedEventType.fields[0].label}
                value={dynamicFields[selectedEventType.fields[0].id] || ''}
                onChange={(e) => updateDynamicField(selectedEventType.fields[0].id, e.target.value)}
                className="h-10 bg-skoolife-light/50 border-skoolife-primary/30"
              />
            </div>
          )}
        </div>
        
        {/* Actions - Fixed at bottom */}
        <div className="flex flex-col gap-3 p-4 border-t border-skoolife-primary/20 dark:border-gray-700 bg-gradient-to-r from-skoolife-light to-white dark:from-gray-800 dark:to-gray-800">
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMoreOptions}
              className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-skoolife-light/50 h-8"
            >
              <MoreHorizontal className="w-4 h-4 mr-2" />
              Plus d'options
            </Button>
          )}
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="flex-1 h-10 border-skoolife-primary/30 hover:bg-skoolife-light/50"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              size="sm"
              className="bg-skoolife-primary hover:bg-skoolife-secondary text-gray-900 flex-1 h-10 font-medium"
              disabled={!eventName.trim()}
            >
              <Plus className="w-4 h-4 mr-1" />
              Enregistrer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventCreationModal;
