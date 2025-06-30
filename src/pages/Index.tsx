
import React, { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import WeekNavigation from "@/components/planning/WeekNavigation";
import TimeAxis from "@/components/planning/TimeAxis";
import DayColumn from "@/components/planning/DayColumn";
import EventCreationModal from "@/components/planning/EventCreationModal";
import GoogleCalendarSync from "@/components/planning/GoogleCalendarSync";
import UserAccountMenu from "@/components/UserAccountMenu";
import ThemeToggle from "@/components/ThemeToggle";
import { Event } from "@/utils/eventTypes";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState({
    day: '',
    startTime: '',
    endTime: '',
    date: ''
  });

  const daysOfWeek = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

  const getWeekDates = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  };

  const weekDates = getWeekDates(currentWeek);

  const handleTimeSlotClick = (day: string, hour: number) => {
    const dayIndex = daysOfWeek.indexOf(day.toLowerCase());
    const clickedDate = weekDates[dayIndex];
    
    setModalInitialData({
      day,
      startTime: `${hour.toString().padStart(2, '0')}:00`,
      endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
      date: clickedDate.toISOString().split('T')[0]
    });
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (eventData: Partial<Event>) => {
    const newEvent: Event = {
      id: Date.now().toString(),
      ...eventData as Event
    };
    setEvents(prev => [...prev, newEvent]);
    toast({
      title: "Événement créé",
      description: `${newEvent.name} a été ajouté à votre planning`
    });
  };

  const handleEditEvent = (event: Event) => {
    setModalInitialData({
      day: event.day,
      startTime: event.startTime,
      endTime: event.endTime,
      date: event.date
    });
    setIsEventModalOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    toast({
      title: "Événement supprimé",
      description: "L'événement a été supprimé de votre planning"
    });
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(newDate);
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  const getEventsForDay = (day: string) => {
    return events.filter(event => event.day.toLowerCase() === day.toLowerCase());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-yellow-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                SkooLife Planning
              </h1>
            </div>
            {!isMobile && (
              <Button
                onClick={() => setIsEventModalOpen(true)}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvel événement
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <GoogleCalendarSync />
            <ThemeToggle />
            <UserAccountMenu />
          </div>
        </div>
        
        <WeekNavigation
          currentWeek={currentWeek}
          onPreviousWeek={goToPreviousWeek}
          onNextWeek={goToNextWeek}
          onToday={goToToday}
        />
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-140px)] overflow-hidden">
        {/* Time Axis */}
        <TimeAxis className="w-16 sm:w-20 flex-shrink-0" />
        
        {/* Days Grid */}
        <div className="flex-1 flex overflow-x-auto">
          {daysOfWeek.map((day, index) => (
            <DayColumn
              key={day}
              day={day}
              events={getEventsForDay(day)}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
              onTimeSlotClick={handleTimeSlotClick}
            />
          ))}
        </div>
      </div>

      {/* Mobile FAB */}
      {isMobile && (
        <Button
          onClick={() => setIsEventModalOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 shadow-lg z-30"
        >
          <Plus className="w-6 h-6" />
        </Button>
      )}

      {/* Event Creation Modal */}
      <EventCreationModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSave={handleSaveEvent}
        initialData={modalInitialData}
      />
    </div>
  );
};

export default Index;
