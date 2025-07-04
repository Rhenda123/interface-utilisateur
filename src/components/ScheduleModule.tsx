
import React, { useState, useEffect } from "react";
import { Event } from "@/utils/eventTypes";
import { getEventsForWeek, createEvent, updateEvent, deleteEvent } from "@/utils/api";
import { formatDateForAPI } from "@/utils/helpers";
import TimeAxis from "@/components/planning/TimeAxis";
import DayColumn from "@/components/planning/DayColumn";
import WeekNavigation from "@/components/planning/WeekNavigation";
import EventCreationModal from "@/components/EventCreationModal";
import EventEditModal from "@/components/EventEditModal";
import { useToast } from "@/components/ui/use-toast";

interface ScheduleModuleProps {
  onViewChange?: (view: string) => void;
}

const ScheduleModule: React.FC<ScheduleModuleProps> = ({ onViewChange }) => {
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ day: string; time: number } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, [currentWeek]);

  const fetchEvents = async () => {
    try {
      const startDate = formatDateForAPI(getStartOfWeek(currentWeek));
      const endDate = formatDateForAPI(getEndOfWeek(currentWeek));
      const fetchedEvents = await getEventsForWeek(startDate, endDate);
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      toast({
        variant: "destructive",
        title: "Erreur!",
        description: "Impossible de charger les événements de la semaine.",
      });
    }
  };

  const handleCreateEvent = async (newEvent: Event) => {
    try {
      await createEvent(newEvent);
      fetchEvents(); // Refresh events after creating
      setShowCreateModal(false);
      setSelectedTimeSlot(null);
      toast({
        title: "Succès!",
        description: "Événement créé avec succès.",
      });
    } catch (error) {
      console.error("Failed to create event:", error);
      toast({
        variant: "destructive",
        title: "Erreur!",
        description: "Impossible de créer l'événement.",
      });
    }
  };

  const handleUpdateEvent = async (updatedEvent: Event) => {
    try {
      await updateEvent(updatedEvent);
      fetchEvents(); // Refresh events after updating
      setShowEditModal(false);
      setSelectedEvent(null);
      toast({
        title: "Succès!",
        description: "Événement mis à jour avec succès.",
      });
    } catch (error) {
      console.error("Failed to update event:", error);
      toast({
        variant: "destructive",
        title: "Erreur!",
        description: "Impossible de mettre à jour l'événement.",
      });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      fetchEvents(); // Refresh events after deleting
      toast({
        title: "Succès!",
        description: "Événement supprimé avec succès.",
      });
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast({
        variant: "destructive",
        title: "Erreur!",
        description: "Impossible de supprimer l'événement.",
      });
    }
  };

  const handlePreviousWeek = () => {
    const prevWeek = new Date(currentWeek);
    prevWeek.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(prevWeek);
  };

  const handleNextWeek = () => {
    const nextWeek = new Date(currentWeek);
    nextWeek.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(nextWeek);
  };

  const handleToday = () => {
    setCurrentWeek(new Date());
  };

  const handleTimeSlotClick = (day: string, hour: number) => {
    setSelectedTimeSlot({ day, time: hour });
    setShowCreateModal(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowEditModal(true);
  };

  const getStartOfWeek = (date: Date): Date => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(date.setDate(diff));
  };

  const getEndOfWeek = (date: Date): Date => {
    const startOfWeek = getStartOfWeek(date);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return endOfWeek;
  };

  const getEventsForDay = (day: string): Event[] => {
    return events.filter(event => event.day === day);
  };

  const weekDays = [
    { dayName: "Lundi", dayEvents: getEventsForDay("Lundi") },
    { dayName: "Mardi", dayEvents: getEventsForDay("Mardi") },
    { dayName: "Mercredi", dayEvents: getEventsForDay("Mercredi") },
    { dayName: "Jeudi", dayEvents: getEventsForDay("Jeudi") },
    { dayName: "Vendredi", dayEvents: getEventsForDay("Vendredi") },
    { dayName: "Samedi", dayEvents: getEventsForDay("Samedi") },
    { dayName: "Dimanche", dayEvents: getEventsForDay("Dimanche") },
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Navigation - Sticky on tablet and desktop */}
      <div className="md:sticky md:top-0 z-50 bg-white dark:bg-gray-900">
        <WeekNavigation
          currentWeek={currentWeek}
          onPreviousWeek={handlePreviousWeek}
          onNextWeek={handleNextWeek}
          onToday={handleToday}
        />
      </div>
      
      {/* Planning Grid */}
      <div className="flex-1 overflow-auto">
        <div className="flex min-w-full">
          {/* Time Axis */}
          <div className="w-20 flex-shrink-0">
            <TimeAxis />
          </div>
          
          {/* Days Container */}
          <div className="flex-1 flex min-w-0">
            {weekDays.map(({ dayName, dayEvents }) => (
              <DayColumn
                key={dayName}
                day={dayName}
                events={dayEvents}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
                onTimeSlotClick={handleTimeSlotClick}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && selectedTimeSlot && (
        <EventCreationModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedTimeSlot(null);
          }}
          onSave={handleCreateEvent}
          defaultDay={selectedTimeSlot.day}
          defaultTime={selectedTimeSlot.time}
        />
      )}

      {showEditModal && selectedEvent && (
        <EventEditModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedEvent(null);
          }}
          onSave={handleUpdateEvent}
          event={selectedEvent}
        />
      )}
    </div>
  );
};

export default ScheduleModule;
