
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
      const clientId = localStorage.getItem('google_client_id');
      if (token && clientId) {
        setIsConnected(true);
        googleCalendarService.setConfig({ accessToken: token });
      }
    };

    checkConnection();
  }, []);

  const connectToGoogle = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const clientId = localStorage.getItem('google_client_id');
      if (!clientId) {
        throw new Error('Google Client ID not configured');
      }
      
      // Initialize Google API
      if (!window.gapi) {
        await new Promise<void>((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://apis.google.com/js/api.js';
          script.onload = () => resolve();
          document.head.appendChild(script);
        });
      }

      await new Promise<void>((resolve) => {
        window.gapi.load('auth2', () => resolve());
      });
      
      const authInstance = window.gapi.auth2.getAuthInstance();
      if (!authInstance) {
        await window.gapi.auth2.init({
          client_id: clientId,
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
      // Google Calendar connection failed
      toast({
        title: "Erreur de connexion",
        description: error instanceof Error ? error.message : "Impossible de se connecter à Google Calendar",
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
      // Failed to sync Google Calendar events
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
          // Created Google Calendar event
        }
      }
      
      toast({
        title: "Synchronisation réussie",
        description: "Événements synchronisés avec Google Calendar"
      });
    } catch (error) {
      // Failed to sync events to Google Calendar
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
