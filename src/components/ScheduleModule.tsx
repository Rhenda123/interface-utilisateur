import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Calendar, Clock, Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { eventTypes, getEventTypeById, Event } from "@/utils/eventTypes";
import TimeAxis from "@/components/planning/TimeAxis";
import WeekNavigation from "@/components/planning/WeekNavigation";
import DayColumn from "@/components/planning/DayColumn";
import EventCreationModal from "@/components/planning/EventCreationModal";
import EventEditModal from "@/components/planning/EventEditModal";
import GoogleCalendarSync from "@/components/planning/GoogleCalendarSync";
import { useGoogleCalendar } from "@/hooks/useGoogleCalendar";

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

  const { syncGoogleEvents } = useGoogleCalendar();

  // Enhanced event loading with Google Calendar sync
  const [allEvents, setAllEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem("skoolife_events");
    if (saved) {
      const parsedEvents = JSON.parse(saved);
      return parsedEvents.map((event: any) => ({
        ...event,
        date: event.date || new Date().toISOString().split('T')[0]
      }));
    }
    return [];
  });

  // Update events state to use allEvents
  const events = allEvents;
  const setEvents = setAllEvents;
  
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
    date: string;
  } | null>(null);

  // Mobile view state
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Add Google Calendar events sync handler
  const handleGoogleEventsSync = async (googleEvents: Event[]) => {
    const localEvents = allEvents.filter(e => !e.id.startsWith('google_'));
    const combinedEvents = [...localEvents, ...googleEvents];
    setAllEvents(combinedEvents);
    localStorage.setItem("skoolife_events", JSON.stringify(combinedEvents));
  };

  // Enhanced useEffect to sync Google events on load
  useEffect(() => {
    const syncOnLoad = async () => {
      try {
        const googleEvents = await syncGoogleEvents();
        if (googleEvents.length > 0) {
          handleGoogleEventsSync(googleEvents);
        }
      } catch (error) {
        console.log('Google Calendar sync not available or failed');
      }
    };

    syncOnLoad();
  }, []);

  useEffect(() => {
    localStorage.setItem("skoolife_events", JSON.stringify(events));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('eventUpdate', { detail: events }));
  }, [events]);

  const getEventsForDay = (dayName: string): Event[] => {
    const dayInfo = days.find(d => d.name === dayName);
    if (!dayInfo) return [];
    
    const dayDateString = dayInfo.fullDate.toISOString().split('T')[0];
    
    return events.filter(e => 
      e.day === dayName && 
      e.date === dayDateString && 
      visibleEventTypes.has(e.typeId)
    ).sort((a, b) => {
      const timeToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
      };
      return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
    });
  };

  // Enhanced Mobile Day View Component with multiple event support
  const MobileDayView = ({ dayName }: { dayName: string }) => {
    const dayEvents = getEventsForDay(dayName);
    const dayInfo = days.find(d => d.name === dayName);
    
    return (
      <div className="space-y-5 px-1">
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
            className="rounded-full shadow-sm border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
          >
            <Eye className="w-4 h-4 mr-2" />
            Vue semaine
          </Button>
        </div>

        {/* Enhanced Add Event Button */}
        <div className="flex gap-3">
          <Button
            onClick={() => handleTimeSlotClick(dayName, 9)}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 rounded-full flex-1 shadow-lg hover:shadow-xl transition-all font-medium py-3"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un événement
          </Button>
          <Button
            onClick={() => {
              const dayInfo = days.find(d => d.name === dayName);
              const dayDate = dayInfo ? dayInfo.fullDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
              setQuickCreateData({
                day: dayName,
                startTime: '09:00',
                endTime: '10:00',
                date: dayDate
              });
              setShowFullCreateModal(true);
            }}
            variant="outline"
            className="rounded-full px-4 shadow-sm border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
          >
            <Calendar className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {dayEvents.length > 0 ? (
            dayEvents.map((event) => {
              const eventType = getEventTypeById(event.typeId);
              const IconComponent = eventType?.icon;
              
              return (
                <Card key={event.id} className="border-l-4 hover:shadow-lg transition-all duration-200 touch-manipulation rounded-xl shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-100 dark:border-gray-700" style={{ borderLeftColor: event.color }}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          {IconComponent && <IconComponent className="w-5 h-5" style={{ color: event.color }} />}
                          <h4 className="font-semibold text-gray-900 dark:text-white text-base">{event.name}</h4>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <Clock className="w-4 h-4" />
                          <span>{event.startTime} - {event.endTime}</span>
                        </div>
                        {eventType && (
                          <span className="inline-block px-3 py-1 text-xs rounded-full bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 text-yellow-800 dark:text-yellow-200 font-medium">
                            {eventType.name}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          onClick={() => editEvent(event)}
                          variant="ghost"
                          size="sm"
                          className="text-xs px-3 py-2 h-8 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 font-medium transition-all"
                        >
                          Modifier
                        </Button>
                        <Button
                          onClick={() => deleteEvent(event.id)}
                          variant="ghost"
                          size="sm"
                          className="text-xs px-2 py-2 h-8 rounded-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
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
            <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400 mb-6 text-base">Aucun événement prévu</p>
                <Button
                  onClick={() => handleTimeSlotClick(dayName, 9)}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 rounded-full shadow-lg hover:shadow-xl transition-all font-medium py-3 px-6"
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
    const dayInfo = days.find(d => d.name === day);
    const dayDate = dayInfo ? dayInfo.fullDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    
    setQuickCreateData({
      day,
      startTime: timeString,
      endTime: endTimeString,
      date: dayDate
    });
    setShowQuickCreateModal(true);
  };

  const handleQuickSave = (eventData: Partial<Event>) => {
    const dayInfo = days.find(d => d.name === eventData.day);
    const eventDate = dayInfo ? dayInfo.fullDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    
    const newEvent: Event = {
      id: Date.now().toString(),
      day: eventData.day!,
      date: eventDate,
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
        {/* Hide action buttons on mobile, show on desktop */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-3">
          <Button
            onClick={() => setShowFullCreateModal(true)}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 flex items-center gap-2 rounded-full sm:rounded-lg px-4 py-2 sm:px-6 sm:py-3 shadow-lg hover:shadow-xl active:scale-95 transition-all touch-manipulation font-medium"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouvel événement</span>
          </Button>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="flex items-center gap-2 rounded-full sm:rounded-lg px-4 py-2 sm:px-6 sm:py-3 active:scale-95 transition-all touch-manipulation shadow-sm border-gray-200 dark:border-gray-700 hover:shadow-md"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filtres</span>
          </Button>
        </div>
      </div>

      {/* Google Calendar Integration - Show after filters */}
      {showFilters && (
        <>
          {/* Event Type Filters */}
          <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-gray-900 rounded-xl">
            <CardContent className="p-5">
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
                      size="sm"
                      className={`flex items-center gap-2 rounded-full touch-manipulation active:scale-95 transition-all shadow-sm hover:shadow-md font-medium ${isVisible ? '' : 'opacity-50'}`}
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
          
          {/* Google Calendar Sync */}
          <GoogleCalendarSync 
            onEventsSync={handleGoogleEventsSync}
            isMobile={isMobileView}
          />
        </>
      )}

      {/* Mobile Google Calendar Sync - Compact version */}
      {isMobileView && !selectedDay && (
        <GoogleCalendarSync 
          onEventsSync={handleGoogleEventsSync}
          isMobile={true}
        />
      )}

      {/* Enhanced Mobile Week Navigation - More compact */}
      {isMobileView && !selectedDay && (
        <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-gray-900 rounded-xl mx-1">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <Button
                onClick={handlePreviousWeek}
                variant="outline"
                size="sm"
                className="rounded-full shadow-sm border-gray-200 dark:border-gray-700 hover:shadow-md transition-all p-2"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  Semaine du {days[0]?.date}
                </h3>
                <Button
                  onClick={handleToday}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 rounded-full font-medium transition-all py-1"
                >
                  Aujourd'hui
                </Button>
              </div>
              
              <Button
                onClick={handleNextWeek}
                variant="outline"
                size="sm"
                className="rounded-full shadow-sm border-gray-200 dark:border-gray-700 hover:shadow-md transition-all p-2"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mobile Week Overview - Smaller cards */}
      {isMobileView && !selectedDay && (
        <div className="grid grid-cols-2 gap-2 px-1">
          {days.map((day) => {
            const dayEvents = getEventsForDay(day.name);
            const isToday = new Date().toDateString() === day.fullDate.toDateString();
            
            return (
              <Card 
                key={day.name} 
                className={`cursor-pointer transition-all hover:shadow-xl active:scale-95 touch-manipulation rounded-xl shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-100 dark:border-gray-700 ${
                  isToday ? 'ring-2 ring-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20' : ''
                }`}
                onClick={() => setSelectedDay(day.name)}
              >
                <CardContent className="p-2.5">
                  <div className="text-center">
                    <h3 className={`text-xs font-bold mb-1 capitalize ${isToday ? 'text-yellow-700 dark:text-yellow-400' : 'text-gray-900 dark:text-white'}`}>
                      {day.name.substring(0, 3)}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                      {day.date}
                    </p>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div 
                          key={event.id} 
                          className="text-xs px-1.5 py-0.5 rounded-full text-white truncate font-medium shadow-sm"
                          style={{ backgroundColor: event.color }}
                        >
                          {event.name}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          +{dayEvents.length - 2}
                        </div>
                      )}
                      {dayEvents.length === 0 && (
                        <div className="text-xs text-gray-400 font-medium py-0.5">Libre</div>
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
        <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 overflow-hidden rounded-xl">
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
        initialData={quickCreateData || { 
          day: days[0]?.name || 'Lundi', 
          startTime: '08:00', 
          endTime: '09:00',
          date: days[0]?.fullDate.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
        }}
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
