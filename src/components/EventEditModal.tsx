
import React from "react";
import EventEditModal from "@/components/planning/EventEditModal";
import { Event } from "@/utils/eventTypes";

interface EventEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Event) => void;
  event: Event;
}

const EventEditModalWrapper: React.FC<EventEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  event
}) => {
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
  const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

  return (
    <EventEditModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={onSave}
      event={event}
      timeSlots={timeSlots}
      days={days}
    />
  );
};

export default EventEditModalWrapper;
