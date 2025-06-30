import { Calendar, Users, Dumbbell, User } from "lucide-react";

export interface EventType {
  id: string;
  name: string;
  icon: any;
  color: string;
  fields: EventField[];
  reminderDefaults: number[]; // minutes before event
}

export interface EventField {
  id: string;
  label: string;
  type: 'text' | 'select' | 'number';
  required?: boolean;
  options?: string[];
}

export interface Event {
  id: string;
  day: string;
  date: string; // Added specific date in YYYY-MM-DD format
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
  googleEventId?: string; // Added optional Google Calendar event ID
}

// Add Google Calendar event type
const googleEventType: EventType = {
  id: 'google',
  name: 'Google Calendar',
  icon: Calendar,
  color: '#4285f4',
  fields: [
    { id: 'location', label: 'Lieu', type: 'text' },
    { id: 'description', label: 'Description', type: 'text' }
  ],
  reminderDefaults: []
};

// Update the eventTypes array to include the Google event type
export const eventTypes: EventType[] = [
  {
    id: 'class',
    name: 'Classe',
    icon: Calendar,
    color: '#3b82f6',
    fields: [
      { id: 'professor', label: 'Professeur', type: 'text' },
      { id: 'room', label: 'Salle', type: 'text' },
      { id: 'subject', label: 'Matière', type: 'text' }
    ],
    reminderDefaults: [15, 5]
  },
  {
    id: 'meeting',
    name: 'Réunion',
    icon: Users,
    color: '#10b981',
    fields: [
      { id: 'organizer', label: 'Organisateur', type: 'text' },
      { id: 'location', label: 'Lieu', type: 'text' },
      { id: 'agenda', label: 'Ordre du jour', type: 'text' }
    ],
    reminderDefaults: [30, 10]
  },
  {
    id: 'sport',
    name: 'Sport',
    icon: Dumbbell,
    color: '#f59e0b',
    fields: [
      { id: 'activity', label: 'Activité', type: 'text', required: true },
      { id: 'location', label: 'Lieu', type: 'text' },
      { id: 'equipment', label: 'Équipement', type: 'text' }
    ],
    reminderDefaults: [60, 15]
  },
  {
    id: 'personal',
    name: 'Personnel',
    icon: User,
    color: '#ec4899',
    fields: [
      { id: 'description', label: 'Description', type: 'text' },
      { id: 'priority', label: 'Priorité', type: 'select', options: ['Basse', 'Moyenne', 'Haute'] }
    ],
    reminderDefaults: [30]
  },
  googleEventType
];

export const getEventTypeById = (id: string): EventType | undefined => {
  return eventTypes.find(type => type.id === id);
};

export const getEventTypeColor = (typeId: string): string => {
  const eventType = getEventTypeById(typeId);
  return eventType?.color || '#6b7280';
};
