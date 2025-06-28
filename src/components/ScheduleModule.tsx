import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Calendar, Clock, Eye, Trash2 } from "lucide-react";
import { eventTypes, getEventTypeById, Event } from "@/utils/eventTypes";
import TimeAxis from "@/components/planning/TimeAxis";
import WeekNavigation from "@/components/planning/WeekNavigation";
import DayColumn from "@/components/planning/DayColumn";
import EventCreationModal from "@/components/planning/EventCreationModal";
import EventEditModal from "@/components/planning/EventEditModal";

function ScheduleModule() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [isMobileView, setIsMobileView] = useState(false);
  
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

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
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

  // Mobile view state
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

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

  // Mobile Day View Component
  const MobileDayView = ({ dayName }: { dayName: string }) => {
    const dayEvents = getEventsForDay(dayName);
    const dayInfo = days.find(d => d.name === dayName);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
              {dayName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {dayInfo?.date}
            </p>
          </div>
          <Button
            onClick={() => setSelectedDay(null)}
            variant="outline"
            size="sm"
            className="rounded-full"
          >
            <Eye className="w-4 h-4 mr-2" />
            Vue semaine
          </Button>
        </div>
        
        <div className="space-y-3">
          {dayEvents.length > 0 ? (
            dayEvents.map((event) => {
              const eventType = getEventTypeById(event.typeId);
              const IconComponent = eventType?.icon;
              
              return (
                <Card key={event.id} className="border-l-4 hover:shadow-md transition-shadow touch-manipulation" style={{ borderLeftColor: event.color }}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {IconComponent && <IconComponent className="w-4 h-4" style={{ color: event.color }} />}
                          <h4 className="font-semibold text-gray-900 dark:text-white">{event.name}</h4>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>{event.startTime} - {event.endTime}</span>
                        </div>
                        {eventType && (
                          <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            {eventType.name}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => editEvent(event)}
                          variant="ghost"
                          size="sm"
                          className="text-xs p-2 h-8 rounded-full"
                        >
                          Modifier
                        </Button>
                        <Button
                          onClick={() => deleteEvent(event.id)}
                          variant="ghost"
                          size="sm"
                          className="text-xs p-2 h-8 rounded-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">Aucun événement prévu</p>
                <Button
                  onClick={() => handleTimeSlotClick(dayName, 9)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un événement
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
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
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Mon Planning</h2>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            onClick={() => setShowFullCreateModal(true)}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 flex items-center gap-2 rounded-full sm:rounded-lg px-4 py-2 sm:px-6 sm:py-3 shadow-lg active:scale-95 transition-all touch-manipulation"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouvel événement</span>
          </Button>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="flex items-center gap-2 rounded-full sm:rounded-lg px-4 py-2 sm:px-6 sm:py-3 active:scale-95 transition-all touch-manipulation"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filtres</span>
          </Button>
        </div>
      </div>

      {/* Event Type Filters */}
      {showFilters && (
        <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filtrer par type d'événement</h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {eventTypes.map(type => {
                const IconComponent = type.icon;
                const isVisible = visibleEventTypes.has(type.id);
                return (
                  <Button
                    key={type.id}
                    onClick={() => toggleEventTypeVisibility(type.id)}
                    variant={isVisible ? "default" : "outline"}
                    size="sm"
                    className={`flex items-center gap-2 rounded-full touch-manipulation active:scale-95 transition-all ${isVisible ? '' : 'opacity-50'}`}
                    style={isVisible ? { backgroundColor: type.color } : {}}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-xs sm:text-sm">{type.name}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mobile Week Overview */}
      {isMobileView && !selectedDay && (
        <div className="grid grid-cols-2 gap-3">
          {days.map((day) => {
            const dayEvents = getEventsForDay(day.name);
            const isToday = new Date().toLocaleDateString('fr-FR', { weekday: 'long' }).toLowerCase() === day.name.toLowerCase();
            
            return (
              <Card 
                key={day.name} 
                className={`cursor-pointer transition-all hover:shadow-md active:scale-95 touch-manipulation ${
                  isToday ? 'ring-2 ring-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' : ''
                }`}
                onClick={() => setSelectedDay(day.name)}
              >
                <CardContent className="p-4">
                  <div className="text-center">
                    <h3 className={`text-sm font-bold mb-1 capitalize ${isToday ? 'text-yellow-700 dark:text-yellow-400' : 'text-gray-900 dark:text-white'}`}>
                      {day.name.substring(0, 3)}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                      {day.date}
                    </p>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div 
                          key={event.id} 
                          className="text-xs px-2 py-1 rounded-full text-white truncate"
                          style={{ backgroundColor: event.color }}
                        >
                          {event.name}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          +{dayEvents.length - 2} autres
                        </div>
                      )}
                      {dayEvents.length === 0 && (
                        <div className="text-xs text-gray-400">Libre</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Mobile Day Detail View */}
      {isMobileView && selectedDay && (
        <MobileDayView dayName={selectedDay} />
      )}

      {/* Desktop Calendar Grid */}
      {!isMobileView && (
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
      )}

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
