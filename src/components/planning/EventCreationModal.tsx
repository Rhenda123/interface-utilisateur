
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, MoreHorizontal } from "lucide-react";
import { eventTypes, getEventTypeById, Event } from "@/utils/eventTypes";

interface EventCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: Partial<Event>) => void;
  initialData: {
    day: string;
    startTime: string;
    endTime: string;
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
      <DialogContent className="sm:max-w-md p-0 gap-0 bg-white dark:bg-gray-800 border-yellow-200 dark:border-gray-700">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Nouvel événement
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-4 space-y-4">
          {/* Event Name */}
          <Input
            type="text"
            placeholder="Ajouter un titre"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="text-lg font-medium border-0 shadow-none px-0 focus-visible:ring-0 placeholder:text-gray-400"
            autoFocus
          />
          
          {/* Day Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Jour
            </label>
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger className="w-full">
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
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger className="w-20 h-8 border-0 shadow-none px-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <span>-</span>
              
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger className="w-20 h-8 border-0 shadow-none px-2">
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

          {/* Event Type Selection */}
          <div className="space-y-2">
            <div className="flex gap-2 flex-wrap">
              {eventTypes.map(type => {
                const IconComponent = type.icon;
                const isSelected = selectedTypeId === type.id;
                return (
                  <Button
                    key={type.id}
                    onClick={() => setSelectedTypeId(type.id)}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className={`flex items-center gap-1 h-8 text-xs ${isSelected ? 'shadow-sm' : ''}`}
                    style={isSelected ? { backgroundColor: type.color } : { borderColor: type.color, color: type.color }}
                  >
                    <IconComponent className="w-3 h-3" />
                    {type.name}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Fields - Show only the first 2 most important ones */}
          {selectedEventType && selectedEventType.fields.length > 0 && (
            <div className="space-y-2">
              {selectedEventType.fields.slice(0, 2).map(field => (
                <Input
                  key={field.id}
                  type={field.type === 'number' ? 'number' : 'text'}
                  placeholder={field.label}
                  value={dynamicFields[field.id] || ''}
                  onChange={(e) => updateDynamicField(field.id, e.target.value)}
                  className="h-8 text-sm"
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-between p-4 pt-0 border-t border-gray-100 dark:border-gray-700">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMoreOptions}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <MoreHorizontal className="w-4 h-4 mr-1" />
            Plus d'options
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-sm"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              size="sm"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-sm"
              disabled={!eventName.trim()}
            >
              <Plus className="w-3 h-3 mr-1" />
              Enregistrer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventCreationModal;
