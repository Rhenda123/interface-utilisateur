
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit2, Trash2, AlertTriangle, Plus, X, Check, Filter, Bell } from "lucide-react";
import { eventTypes, getEventTypeById, getEventTypeColor, EventType } from "@/utils/eventTypes";

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

function ScheduleModule() {
  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
  
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
  const majorHours = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];

  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem("skoolife_events");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedDay, setSelectedDay] = useState("Lundi");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");
  const [eventName, setEventName] = useState("");
  const [selectedTypeId, setSelectedTypeId] = useState("class");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringPattern, setRecurringPattern] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [dynamicFields, setDynamicFields] = useState<Record<string, string>>({});
  const [customReminders, setCustomReminders] = useState<number[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  // Filter states
  const [visibleEventTypes, setVisibleEventTypes] = useState<Set<string>>(
    new Set(eventTypes.map(type => type.id))
  );
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    localStorage.setItem("skoolife_events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    // Reset dynamic fields when event type changes
    const eventType = getEventTypeById(selectedTypeId);
    if (eventType) {
      const newFields: Record<string, string> = {};
      eventType.fields.forEach(field => {
        newFields[field.id] = "";
      });
      setDynamicFields(newFields);
      setCustomReminders([...eventType.reminderDefaults]);
    }
  }, [selectedTypeId]);

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const calculateEventPosition = (startTime: string, endTime: string) => {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    const duration = endMinutes - startMinutes;
    
    // Each 15-minute slot is 20px high
    const slotHeight = 20;
    const startOffset = (startMinutes - 420) / 15; // 420 = 7:00 AM in minutes
    const height = (duration / 15) * slotHeight;
    const top = startOffset * slotHeight;
    
    return { top, height };
  };

  const getEventsForDay = (day: string): Event[] => {
    return events.filter(e => 
      e.day === day && 
      visibleEventTypes.has(e.typeId)
    ).sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
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

  const addOrUpdateEvent = () => {
    if (!eventName.trim()) return;
    
    const eventType = getEventTypeById(selectedTypeId);
    if (!eventType) return;
    
    if (editingEvent) {
      setEvents(events.map(e => 
        e.id === editingEvent.id 
          ? { 
              ...e, 
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
            }
          : e
      ));
      setEditingEvent(null);
    } else {
      const newEvent: Event = {
        id: Date.now().toString(),
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
      setEvents([...events, newEvent]);
    }
    
    resetForm();
  };

  const editEvent = (event: Event) => {
    setEditingEvent(event);
    setSelectedDay(event.day);
    setStartTime(event.startTime);
    setEndTime(event.endTime);
    setEventName(event.name);
    setSelectedTypeId(event.typeId);
    setIsRecurring(event.isRecurring);
    setRecurringPattern(event.recurringPattern || 'weekly');
    setDynamicFields({ ...event.dynamicFields });
    setCustomReminders([...event.reminders]);
  };

  const deleteEvent = (eventId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      setEvents(events.filter(e => e.id !== eventId));
    }
  };

  const resetForm = () => {
    setEventName("");
    setStartTime("08:00");
    setEndTime("09:00");
    setIsRecurring(false);
    setDynamicFields({});
    setCustomReminders([]);
    setEditingEvent(null);
  };

  const toggleEventTypeVisibility = (typeId: string) => {
    const newVisible = new Set(visibleEventTypes);
    if (newVisible.has(typeId)) {
      newVisible.delete(typeId);
    } else {
      newVisible.add(typeId);
    }
    setVisibleEventTypes(newVisible);
  };

  const updateDynamicField = (fieldId: string, value: string) => {
    setDynamicFields(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const selectedEventType = getEventTypeById(selectedTypeId);
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Mon Planning</h2>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtres
          </Button>
          <div className="text-sm text-gray-600 dark:text-gray-300 font-medium bg-yellow-100 dark:bg-yellow-900 px-3 py-2 rounded-full border border-yellow-200 dark:border-yellow-700">
            {currentMonth}
          </div>
        </div>
      </div>

      {/* Event Type Filters */}
      {showFilters && (
        <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filtrer par type d'événement</h3>
            <div className="flex flex-wrap gap-3">
              {eventTypes.map(type => {
                const IconComponent = type.icon;
                const isVisible = visibleEventTypes.has(type.id);
                return (
                  <Button
                    key={type.id}
                    onClick={() => toggleEventTypeVisibility(type.id)}
                    variant={isVisible ? "default" : "outline"}
                    className={`flex items-center gap-2 ${isVisible ? '' : 'opacity-50'}`}
                    style={isVisible ? { backgroundColor: type.color } : {}}
                  >
                    <IconComponent className="w-4 h-4" />
                    {type.name}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Event Form */}
      <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
        <CardContent className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            {editingEvent ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {editingEvent ? "Modifier l'Événement" : "Ajouter un Événement"}
          </h3>
          
          {/* Basic Event Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {days.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
            
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
            
            <Input 
              type="text" 
              placeholder="Nom de l'événement" 
              value={eventName} 
              onChange={(e) => setEventName(e.target.value)} 
              className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-white" 
            />
          </div>

          {/* Event Type Selection */}
          <div className="mb-4">
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
            <div className="mb-4">
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
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-3">
              <input
                type="checkbox"
                id="recurring"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
              />
              <label htmlFor="recurring" className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
          <div className="mb-4">
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
          
          <div className="flex gap-3">
            <Button 
              onClick={addOrUpdateEvent} 
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center gap-2"
            >
              {editingEvent ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingEvent ? "Modifier" : "Ajouter"}
            </Button>
            
            {editingEvent && (
              <Button 
                onClick={resetForm} 
                variant="outline"
                className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Annuler
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 overflow-hidden">
        <CardContent className="p-0">
          <div className="flex">
            {/* Time Column */}
            <div className="bg-gradient-to-b from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 border-r border-yellow-300 dark:border-yellow-600">
              <div className="h-12 border-b border-yellow-300 dark:border-yellow-600"></div>
              <ScrollArea className="h-[600px]">
                <div className="relative">
                  {majorHours.map((hour, index) => (
                    <div key={hour} className="relative h-20 border-b border-yellow-200 dark:border-yellow-700">
                      <div className="absolute -top-2 left-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-yellow-100 dark:bg-yellow-900 px-1 rounded">
                        {hour}
                      </div>
                      {/* 15-minute subdivisions */}
                      <div className="absolute top-5 right-0 w-2 h-px bg-yellow-300 dark:bg-yellow-600"></div>
                      <div className="absolute top-10 right-0 w-2 h-px bg-yellow-300 dark:bg-yellow-600"></div>
                      <div className="absolute top-15 right-0 w-2 h-px bg-yellow-300 dark:bg-yellow-600"></div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Days Columns */}
            <div className="flex-1 overflow-x-auto">
              <div className="flex min-w-[800px]">
                {days.map((day) => (
                  <div key={day} className="flex-1 border-r border-yellow-200 dark:border-gray-600 last:border-r-0">
                    {/* Day Header */}
                    <div className="h-12 bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 border-b border-yellow-300 dark:border-yellow-600 flex items-center justify-center">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{day}</span>
                    </div>
                    
                    {/* Day Content */}
                    <ScrollArea className="h-[600px]">
                      <div className="relative h-[1200px]"> {/* 15 hours * 80px */}
                        {/* Hour grid lines */}
                        {majorHours.map((_, index) => (
                          <div key={index} className="absolute w-full border-b border-yellow-100 dark:border-gray-700" style={{ top: index * 80 }}>
                            {/* 15-minute lines */}
                            <div className="absolute w-full border-b border-yellow-50 dark:border-gray-800" style={{ top: 20 }}></div>
                            <div className="absolute w-full border-b border-yellow-50 dark:border-gray-800" style={{ top: 40 }}></div>
                            <div className="absolute w-full border-b border-yellow-50 dark:border-gray-800" style={{ top: 60 }}></div>
                          </div>
                        ))}
                        
                        {/* Events */}
                        {(() => {
                          const dayEvents = getEventsForDay(day);
                          const eventGroups = getOverlappingEvents(dayEvents);
                          
                          return eventGroups.map((group, groupIndex) => 
                            group.map((event, eventIndex) => {
                              const { top, height } = calculateEventPosition(event.startTime, event.endTime);
                              const eventType = getEventTypeById(event.typeId);
                              const IconComponent = eventType?.icon;
                              const groupSize = group.length;
                              const width = groupSize > 1 ? `${95 / groupSize}%` : '95%';
                              const left = groupSize > 1 ? `${(eventIndex * 95) / groupSize + 2}%` : '2.5%';
                              
                              return (
                                <div
                                  key={event.id}
                                  className="absolute rounded-lg shadow-sm text-white font-medium group cursor-pointer transition-all hover:shadow-lg hover:z-10"
                                  style={{
                                    backgroundColor: event.color,
                                    top: `${top}px`,
                                    height: `${Math.max(height, 20)}px`,
                                    width,
                                    left,
                                  }}
                                >
                                  <div className="p-2 h-full flex flex-col justify-between">
                                    <div>
                                      <div className="flex items-center gap-1 mb-1">
                                        {IconComponent && <IconComponent className="w-3 h-3 flex-shrink-0" />}
                                        <div className="font-semibold text-xs leading-tight truncate">{event.name}</div>
                                      </div>
                                      
                                      <div className="text-xs opacity-90">
                                        {event.startTime} - {event.endTime}
                                      </div>
                                      
                                      {Object.entries(event.dynamicFields).map(([key, value]) => (
                                        value && (
                                          <div key={key} className="text-xs opacity-80 truncate">{value}</div>
                                        )
                                      ))}
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                      {event.isRecurring && (
                                        <div className="text-xs opacity-80">↻</div>
                                      )}
                                      {event.reminders.length > 0 && (
                                        <Bell className="w-3 h-3 opacity-80" />
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        editEvent(event);
                                      }}
                                      className="bg-white/20 hover:bg-white/30 rounded p-1 transition-colors"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteEvent(event.id);
                                      }}
                                      className="bg-white/20 hover:bg-red-500 rounded p-1 transition-colors"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })
                          );
                        })()}
                      </div>
                    </ScrollArea>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ScheduleModule;
