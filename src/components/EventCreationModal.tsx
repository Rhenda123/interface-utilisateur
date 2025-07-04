
import React from "react";
import EventCreationModal from "@/components/planning/EventCreationModal";
import { Event } from "@/utils/eventTypes";

interface EventCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Event) => void;
  defaultDay: string;
  defaultTime: number;
}

const EventCreationModalWrapper: React.FC<EventCreationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultDay,
  defaultTime
}) => {
  const formatTime = (hour: number): string => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const initialData = {
    day: defaultDay,
    startTime: formatTime(defaultTime),
    endTime: formatTime(defaultTime + 1),
    date: new Date().toISOString().split('T')[0]
  };

  return (
    <EventCreationModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={onSave}
      initialData={initialData}
    />
  );
};

export default EventCreationModalWrapper;
