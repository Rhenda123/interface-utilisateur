
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X, Bell } from "lucide-react";
import { eventTypes, getEventTypeById, Event } from "@/utils/eventTypes";

interface EventEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: Partial<Event>) => void;
  event: Event;
  timeSlots: string[];
  days: string[];
}

const EventEditModal: React.FC<EventEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  event,
  timeSlots,
  days
}) => {
  const [eventName, setEventName] = useState(event.name);
  const [selectedDay, setSelectedDay] = useState(event.day);
  const [startTime, setStartTime] = useState(event.startTime);
  const [endTime, setEndTime] = useState(event.endTime);
  const [selectedTypeId, setSelectedTypeId] = useState(event.typeId);
  const [isRecurring, setIsRecurring] = useState(event.isRecurring);
  const [recurringPattern, setRecurringPattern] = useState<'daily' | 'weekly' | 'monthly'>(event.recurringPattern || 'weekly');
  const [dynamicFields, setDynamicFields] = useState<Record<string, string>>(event.dynamicFields);
  const [customReminders, setCustomReminders] = useState<number[]>(event.reminders);

  useEffect(() => {
    if (isOpen) {
      setEventName(event.name);
      setSelectedDay(event.day);
      setStartTime(event.startTime);
      setEndTime(event.endTime);
      setSelectedTypeId(event.typeId);
      setIsRecurring(event.isRecurring);
      setRecurringPattern(event.recurringPattern || 'weekly');
      setDynamicFields(event.dynamicFields);
      setCustomReminders(event.reminders);
    }
  }, [isOpen, event]);

  useEffect(() => {
    // Reset dynamic fields when event type changes
    const eventType = getEventTypeById(selectedTypeId);
    if (eventType) {
      const newFields: Record<string, string> = {};
      eventType.fields.forEach(field => {
        newFields[field.id] = dynamicFields[field.id] || "";
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
      isRecurring,
      recurringPattern: isRecurring ? recurringPattern : undefined,
      dynamicFields: { ...dynamicFields },
      reminders: [...customReminders]
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
      <DialogContent className="sm:max-w-lg p-0 gap-0 bg-white dark:bg-gray-800 border-yellow-200 dark:border-gray-700">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Check className="w-5 h-5" />
            Modifier l'Événement
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 pt-0 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Basic Event Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {days.map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}
              </SelectContent>
            </Select>
            
            <Input 
              type="text" 
              placeholder="Nom de l'événement" 
              value={eventName} 
              onChange={(e) => setEventName(e.target.value)} 
              className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-white" 
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select value={startTime} onValueChange={setStartTime}>
              <SelectTrigger className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700">
                <SelectValue placeholder="Heure de début" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={endTime} onValueChange={setEndTime}>
              <SelectTrigger className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700">
                <SelectValue placeholder="Heure de fin" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Event Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type d'événement</label>
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
                    className={`flex items-center gap-2 ${isSelected ? 'shadow-lg' : ''}`}
                    style={isSelected ? { backgroundColor: type.color } : {}}
                  >
                    <IconComponent className="w-4 h-4" />
                    {type.name}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Fields */}
          {selectedEventType && selectedEventType.fields.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Détails spécifiques</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedEventType.fields.map(field => (
                  <div key={field.id}>
                    {field.type === 'select' && field.options ? (
                      <Select value={dynamicFields[field.id] || ''} onValueChange={(value) => updateDynamicField(field.id, value)}>
                        <SelectTrigger className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700">
                          <SelectValue placeholder={field.label} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type={field.type === 'number' ? 'number' : 'text'}
                        placeholder={field.label}
                        value={dynamicFields[field.id] || ''}
                        onChange={(e) => updateDynamicField(field.id, e.target.value)}
                        className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-white"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recurring Options */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <input
                type="checkbox"
                id="recurring-edit"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
              />
              <label htmlFor="recurring-edit" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Événement récurrent
              </label>
            </div>
            
            {isRecurring && (
              <Select value={recurringPattern} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setRecurringPattern(value)}>
                <SelectTrigger className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Quotidien</SelectItem>
                  <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  <SelectItem value="monthly">Mensuel</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Reminders */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Rappels (minutes avant)
            </label>
            <div className="flex gap-2 flex-wrap">
              {[5, 10, 15, 30, 60].map(minutes => (
                <Button
                  key={minutes}
                  type="button"
                  variant={customReminders.includes(minutes) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (customReminders.includes(minutes)) {
                      setCustomReminders(customReminders.filter(m => m !== minutes));
                    } else {
                      setCustomReminders([...customReminders, minutes]);
                    }
                  }}
                >
                  {minutes}min
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Footer Actions */}
        <div className="flex gap-3 p-6 pt-4 border-t border-gray-100 dark:border-gray-700">
          <Button 
            onClick={handleSave} 
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 hover:shadow-lg flex items-center gap-2 flex-1"
          >
            <Check className="w-4 h-4" />
            Modifier
          </Button>
          
          <Button 
            onClick={onClose}
            variant="outline"
            className="px-6 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Annuler
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventEditModal;
