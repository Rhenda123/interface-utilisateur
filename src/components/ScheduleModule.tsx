
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { eventTypes, getEventTypeById, Event } from "@/utils/eventTypes";
import TimeAxis from "@/components/planning/TimeAxis";
import WeekNavigation from "@/components/planning/WeekNavigation";
import DayColumn from "@/components/planning/DayColumn";
import EventCreationModal from "@/components/planning/EventCreationModal";
import EventEditModal from "@/components/planning/EventEditModal";

function ScheduleModule() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  const getDaysOfWeek = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
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
  
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  // Filter states
  const [visibleEventTypes, setVisibleEventTypes] = useState<Set<string>>(
    new Set(eventTypes.map(type => type.id))
  );
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [showQuickCreateModal, setShowQuickCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFullCreateModal, setShowFullCreateModal] = useState(false);
  const [quickCreateData, setQuickCreateData] = useState<{
    day: string;
    startTime: string;
    endTime: string;
  } | null>(null);

  useEffect(() => {
    localStorage.setItem("skoolife_events", JSON.stringify(events));
  }, [events]);

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

  const addOrUpdateEvent = (eventData: Partial<Event>) => {
    if (editingEvent) {
      setEvents(events.map(e => 
        e.id === editingEvent.id 
          ? { ...e, ...eventData }
          : e
      ));
      setEditingEvent(null);
      setShowEditModal(false);
    } else {
      const newEvent: Event = {
        id: Date.now().toString(),
        ...eventData as Event
      };
      setEvents([...events, newEvent]);
    }
  };

  const editEvent = (event: Event) => {
    setEditingEvent(event);
    setShowEditModal(true);
  };

  const deleteEvent = (eventId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      setEvents(events.filter(e => e.id !== eventId));
    }
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
      setShowQuickCreateModal(false);
      setShowFullCreateModal(true);
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

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Mon Planning</h2>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowFullCreateModal(true)}
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
            <TimeAxis className="w-20 flex-shrink-0" />

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

      {/* Full Create Modal */}
      <EventCreationModal
        isOpen={showFullCreateModal}
        onClose={() => setShowFullCreateModal(false)}
        onSave={addOrUpdateEvent}
        initialData={quickCreateData || { day: days[0]?.name || 'Lundi', startTime: '08:00', endTime: '09:00' }}
        onMoreOptions={() => {}}
      />

      {/* Edit Event Modal */}
      {editingEvent && (
        <EventEditModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingEvent(null);
          }}
          onSave={addOrUpdateEvent}
          event={editingEvent}
          timeSlots={timeSlots}
          days={days.map(d => d.name)}
        />
      )}
    </div>
  );
}

export default ScheduleModule;
