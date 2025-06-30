
import { BookOpen, Coffee, Dumbbell, Music, Phone, Pizza, Zap, Palette, MapPin, Users, Calendar } from "lucide-react";

export interface Event {
  id: string;
  name: string;
  day: string;
  date: string;
  startTime: string;
  endTime: string;
  typeId: string;
  color: string;
  isRecurring: boolean;
  recurringPattern?: string;
  dynamicFields: Record<string, string>;
  reminders: number[];
  googleEventId?: string;
}

export interface EventType {
  id: string;
  name: string;
  icon: any;
  color: string;
  fields: EventField[];
  reminderDefaults: number[];
}

export interface EventField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select';
  options?: string[];
  required?: boolean;
}

export const eventTypes: EventType[] = [
  {
    id: 'class',
    name: 'Cours',
    icon: BookOpen,
    color: '#3b82f6',
    fields: [
      { id: 'subject', label: 'Matière', type: 'text', required: true },
      { id: 'teacher', label: 'Professeur', type: 'text' },
      { id: 'room', label: 'Salle', type: 'text' },
      { id: 'homework', label: 'Devoirs', type: 'text' }
    ],
    reminderDefaults: [15, 5]
  },
  {
    id: 'break',
    name: 'Pause',
    icon: Coffee,
    color: '#10b981',
    fields: [
      { id: 'location', label: 'Lieu', type: 'text' },
      { id: 'activity', label: 'Activité', type: 'text' }
    ],
    reminderDefaults: [5]
  },
  {
    id: 'sport',
    name: 'Sport',
    icon: Dumbbell,
    color: '#f59e0b',
    fields: [
      { id: 'sport', label: 'Sport', type: 'text', required: true },
      { id: 'location', label: 'Lieu', type: 'text' },
      { id: 'equipment', label: 'Équipement', type: 'text' }
    ],
    reminderDefaults: [30, 15]
  },
  {
    id: 'music',
    name: 'Musique',
    icon: Music,
    color: '#8b5cf6',
    fields: [
      { id: 'instrument', label: 'Instrument', type: 'text' },
      { id: 'song', label: 'Morceau', type: 'text' },
      { id: 'teacher', label: 'Professeur', type: 'text' }
    ],
    reminderDefaults: [15]
  },
  {
    id: 'meeting',
    name: 'Réunion',
    icon: Users,
    color: '#ef4444',
    fields: [
      { id: 'participants', label: 'Participants', type: 'text' },
      { id: 'agenda', label: 'Ordre du jour', type: 'text' },
      { id: 'location', label: 'Lieu', type: 'text' }
    ],
    reminderDefaults: [15, 5]
  },
  {
    id: 'google',
    name: 'Google Calendar',
    icon: Calendar,
    color: '#4285f4',
    fields: [
      { id: 'location', label: 'Lieu', type: 'text' },
      { id: 'description', label: 'Description', type: 'text' }
    ],
    reminderDefaults: [15]
  }
];

export const getEventTypeById = (id: string): EventType | undefined => {
  return eventTypes.find(type => type.id === id);
};
