
interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  location?: string;
  status: string;
}

interface GoogleCalendarConfig {
  accessToken: string;
  calendarId?: string;
}

class GoogleCalendarService {
  private config: GoogleCalendarConfig | null = null;

  setConfig(config: GoogleCalendarConfig) {
    this.config = config;
  }

  async getEvents(timeMin: string, timeMax: string): Promise<GoogleCalendarEvent[]> {
    if (!this.config?.accessToken) {
      throw new Error('Google Calendar not configured');
    }

    const calendarId = this.config.calendarId || 'primary';
    const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`;
    
    const params = new URLSearchParams({
      timeMin,
      timeMax,
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '100'
    });

    const response = await fetch(`${url}?${params}`, {
      headers: {
        'Authorization': `Bearer ${this.config.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Google Calendar API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.items || [];
  }

  async createEvent(event: Partial<GoogleCalendarEvent>): Promise<GoogleCalendarEvent> {
    if (!this.config?.accessToken) {
      throw new Error('Google Calendar not configured');
    }

    const calendarId = this.config.calendarId || 'primary';
    const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      throw new Error(`Failed to create Google Calendar event: ${response.statusText}`);
    }

    return response.json();
  }

  async updateEvent(eventId: string, event: Partial<GoogleCalendarEvent>): Promise<GoogleCalendarEvent> {
    if (!this.config?.accessToken) {
      throw new Error('Google Calendar not configured');
    }

    const calendarId = this.config.calendarId || 'primary';
    const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.config.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      throw new Error(`Failed to update Google Calendar event: ${response.statusText}`);
    }

    return response.json();
  }

  async deleteEvent(eventId: string): Promise<void> {
    if (!this.config?.accessToken) {
      throw new Error('Google Calendar not configured');
    }

    const calendarId = this.config.calendarId || 'primary';
    const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.config.accessToken}`,
      },
    });

    if (!response.ok && response.status !== 410) {
      throw new Error(`Failed to delete Google Calendar event: ${response.statusText}`);
    }
  }
}

export const googleCalendarService = new GoogleCalendarService();
export type { GoogleCalendarEvent, GoogleCalendarConfig };
