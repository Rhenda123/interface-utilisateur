import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, X, Check, Filter, Bell } from "lucide-react";
import { eventTypes, getEventTypeById, Event } from "@/utils/eventTypes";
import EventDetailsPopover from "@/components/EventDetailsPopover";
import TimeAxis from "@/components/planning/TimeAxis";
import WeekNavigation from "@/components/planning/WeekNavigation";
import DayColumn from "@/components/planning/DayColumn";
import EventCreationModal from "@/components/planning/EventCreationModal";

function ScheduleModule() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  const getDaysOfWeek = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
    startOfWeek.setDate(diff);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      days.push({
        name: currentDay.toLocaleDateString('fr-FR', { weekday: 'long' }),
        date: currentDay.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
        fullDate: currentDay
      });
    }
    return days;
  };

  const days = getDaysOfWeek(currentWeek);
  
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
  const [showEventForm, setShowEventForm] = useState(false);

  // Quick creation modal states
  const [showQuickCreateModal, setShowQuickCreateModal] = useState(false);
  const [quickCreateData, setQuickCreateData] = useState<{
    day: string;
    startTime: string;
    endTime: string;
  } | null>(null);

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

  const getEventsForDay = (dayName: string): Event[] => {
    return events.filter(e => 
      e.day === dayName && 
      visibleEventTypes.has(e.typeId)
    ).sort((a, b) => {
      const timeToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
      };
      return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
    });
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
    setShowEventForm(false);
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
    setShowEventForm(true);
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

  const handleTimeSlotClick = (day: string, hour: number) => {
    const timeString = `${hour.toString().padStart(2, '0')}:00`;
    const endTimeString = `${(hour + 1).toString().padStart(2, '0')}:00`;
    
    setQuickCreateData({
      day,
      startTime: timeString,
      endTime: endTimeString
    });
    setShowQuickCreateModal(true);
  };

  const handleQuickSave = (eventData: Partial<Event>) => {
    const newEvent: Event = {
      id: Date.now().toString(),
      day: eventData.day!,
      startTime: eventData.startTime!,
      endTime: eventData.endTime!,
      name: eventData.name!,
      typeId: eventData.typeId!,
      color: eventData.color!,
      isRecurring: eventData.isRecurring || false,
      recurringPattern: eventData.recurringPattern,
      dynamicFields: eventData.dynamicFields || {},
      reminders: eventData.reminders || []
    };
    
    setEvents([...events, newEvent]);
    setShowQuickCreateModal(false);
  };

  const handleMoreOptions = () => {
    if (quickCreateData) {
      setSelectedDay(quickCreateData.day);
      setStartTime(quickCreateData.startTime);
      setEndTime(quickCreateData.endTime);
      setShowQuickCreateModal(false);
      setShowEventForm(true);
      resetForm();
    }
  };

  const handlePreviousWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(newWeek);
  };

  const handleNextWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(newWeek);
  };

  const handleToday = () => {
    setCurrentWeek(new Date());
  };

  const selectedEventType = getEventTypeById(selectedTypeId);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Mon Planning</h2>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowEventForm(!showEventForm)}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nouvel événement
          </Button>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtres
          </Button>
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
      {showEventForm && (
        <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
          <CardContent className="p-4 sm:p-6">
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              {editingEvent ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {editingEvent ? "Modifier l'Événement" : "Ajouter un Événement"}
            </h3>
            
            {/* Basic Event Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {days.map(d => <SelectItem key={d.name} value={d.name}>{d.name}</SelectItem>)}
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
              
              <Button 
                onClick={() => {
                  resetForm();
                  setShowEventForm(false);
                }} 
                variant="outline"
                className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar Grid */}
      <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 overflow-hidden">
        <WeekNavigation
          currentWeek={currentWeek}
          onPreviousWeek={handlePreviousWeek}
          onNextWeek={handleNextWeek}
          onToday={handleToday}
        />
        
        <CardContent className="p-0">
          <div className="flex">
            {/* Time Column */}
            <TimeAxis className="w-20 flex-shrink-0" />

            {/* Days Columns */}
            <div className="flex-1 overflow-x-auto">
              <div className="flex min-w-[1000px]">
                {days.map((day) => (
                  <DayColumn
                    key={day.name}
                    day={day.name}
                    events={getEventsForDay(day.name)}
                    onEdit={editEvent}
                    onDelete={deleteEvent}
                    onTimeSlotClick={handleTimeSlotClick}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Create Modal */}
      {quickCreateData && (
        <EventCreationModal
          isOpen={showQuickCreateModal}
          onClose={() => setShowQuickCreateModal(false)}
          onSave={handleQuickSave}
          initialData={quickCreateData}
          onMoreOptions={handleMoreOptions}
        />
      )}
    </div>
  );
}

export default ScheduleModule;
