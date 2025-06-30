
import { useState, useEffect, useCallback } from 'react';
import { googleCalendarService, GoogleCalendarEvent } from '@/services/googleCalendar';
import { Event } from '@/utils/eventTypes';
import { useToast } from '@/hooks/use-toast';

interface UseGoogleCalendarReturn {
  isConnected: boolean;
  isLoading: boolean;
  googleEvents: GoogleCalendarEvent[];
  connectToGoogle: () => Promise<void>;
  syncEvents: (events: Event[]) => Promise<void>;
  disconnectGoogle: () => void;
  syncGoogleEvents: () => Promise<Event[]>;
}

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar';

export const useGoogleCalendar = (): UseGoogleCalendarReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleEvents, setGoogleEvents] = useState<GoogleCalendarEvent[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const checkConnection = () => {
      const token = localStorage.getItem('google_calendar_token');
      if (token) {
        setIsConnected(true);
        googleCalendarService.setConfig({ accessToken: token });
      }
    };

    checkConnection();
  }, []);

  const connectToGoogle = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Initialize Google API
      if (!window.gapi) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://apis.google.com/js/api.js';
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }

      await new Promise((resolve) => window.gapi.load('auth2', resolve));
      
      const authInstance = window.gapi.auth2.getAuthInstance();
      if (!authInstance) {
        await window.gapi.auth2.init({
          client_id: CLIENT_ID,
          scope: SCOPES
        });
      }

      const user = await window.gapi.auth2.getAuthInstance().signIn();
      const token = user.getAuthResponse().access_token;
      
      localStorage.setItem('google_calendar_token', token);
      googleCalendarService.setConfig({ accessToken: token });
      setIsConnected(true);
      
      toast({
        title: "Google Calendar connecté",
        description: "Synchronisation activée avec succès"
      });
    } catch (error) {
      console.error('Google Calendar connection failed:', error);
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter à Google Calendar",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const disconnectGoogle = useCallback(() => {
    localStorage.removeItem('google_calendar_token');
    setIsConnected(false);
    setGoogleEvents([]);
    
    toast({
      title: "Google Calendar déconnecté",
      description: "Synchronisation désactivée"
    });
  }, [toast]);

  const syncGoogleEvents = useCallback(async (): Promise<Event[]> => {
    if (!isConnected) return [];

    try {
      setIsLoading(true);
      const now = new Date();
      const timeMin = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const timeMax = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

      const events = await googleCalendarService.getEvents(timeMin, timeMax);
      setGoogleEvents(events);

      // Convert Google Calendar events to local Event format
      const localEvents: Event[] = events.map(gEvent => {
        const startDate = new Date(gEvent.start.dateTime || gEvent.start.date || '');
        const endDate = new Date(gEvent.end.dateTime || gEvent.end.date || '');
        
        return {
          id: `google_${gEvent.id}`,
          name: gEvent.summary || 'Événement sans titre',
          day: startDate.toLocaleDateString('fr-FR', { weekday: 'long' }),
          date: startDate.toISOString().split('T')[0],
          startTime: startDate.toTimeString().slice(0, 5),
          endTime: endDate.toTimeString().slice(0, 5),
          typeId: 'google',
          color: '#4285f4',
          isRecurring: false,
          dynamicFields: {
            location: gEvent.location || '',
            description: gEvent.description || ''
          },
          reminders: [],
          googleEventId: gEvent.id
        };
      });

      return localEvents;
    } catch (error) {
      console.error('Failed to sync Google Calendar events:', error);
      toast({
        title: "Erreur de synchronisation",
        description: "Impossible de synchroniser avec Google Calendar",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, toast]);

  const syncEvents = useCallback(async (localEvents: Event[]) => {
    if (!isConnected) return;

    try {
      setIsLoading(true);
      
      for (const event of localEvents) {
        if (event.id.startsWith('google_')) continue; // Skip Google events
        
        const startDateTime = new Date(`${event.date}T${event.startTime}:00`);
        const endDateTime = new Date(`${event.date}T${event.endTime}:00`);
        
        const googleEvent = {
          summary: event.name,
          description: Object.values(event.dynamicFields).filter(Boolean).join('\n'),
          start: {
            dateTime: startDateTime.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          end: {
            dateTime: endDateTime.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          }
        };

        if (event.googleEventId) {
          await googleCalendarService.updateEvent(event.googleEventId, googleEvent);
        } else {
          const created = await googleCalendarService.createEvent(googleEvent);
          // You would need to update the local event with the Google event ID
          console.log('Created Google Calendar event:', created.id);
        }
      }
      
      toast({
        title: "Synchronisation réussie",
        description: "Événements synchronisés avec Google Calendar"
      });
    } catch (error) {
      console.error('Failed to sync events to Google Calendar:', error);
      toast({
        title: "Erreur de synchronisation",
        description: "Impossible de synchroniser vers Google Calendar",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, toast]);

  return {
    isConnected,
    isLoading,
    googleEvents,
    connectToGoogle,
    syncEvents,
    disconnectGoogle,
    syncGoogleEvents
  };
};
