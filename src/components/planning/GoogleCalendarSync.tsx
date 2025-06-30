
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, RefreshCw, Link, Unlink, Loader2 } from 'lucide-react';
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar';

interface GoogleCalendarSyncProps {
  onEventsSync?: (events: any[]) => void;
  isMobile?: boolean;
}

const GoogleCalendarSync: React.FC<GoogleCalendarSyncProps> = ({ onEventsSync, isMobile = false }) => {
  const {
    isConnected,
    isLoading,
    googleEvents,
    connectToGoogle,
    disconnectGoogle,
    syncGoogleEvents
  } = useGoogleCalendar();

  const handleSync = async () => {
    const events = await syncGoogleEvents();
    if (onEventsSync) {
      onEventsSync(events);
    }
  };

  if (isMobile) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Google Calendar</span>
            {isConnected && <Badge variant="secondary" className="text-xs">Connecté</Badge>}
          </div>
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        </div>
        
        <div className="flex gap-2">
          {!isConnected ? (
            <Button
              onClick={connectToGoogle}
              disabled={isLoading}
              size="sm"
              className="flex-1 bg-blue-500 hover:bg-blue-600"
            >
              <Link className="w-3 h-3 mr-1" />
              Connecter
            </Button>
          ) : (
            <>
              <Button
                onClick={handleSync}
                disabled={isLoading}
                size="sm"
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Sync
              </Button>
              <Button
                onClick={disconnectGoogle}
                disabled={isLoading}
                size="sm"
                variant="outline"
              >
                <Unlink className="w-3 h-3" />
              </Button>
            </>
          )}
        </div>
        
        {isConnected && googleEvents.length > 0 && (
          <div className="text-xs text-gray-500">
            {googleEvents.length} événement(s) Google Calendar
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className="border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="w-5 h-5 text-blue-500" />
          Google Calendar
          {isConnected && (
            <Badge variant="secondary" className="ml-auto">
              Connecté
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Synchronisez vos événements avec Google Calendar
            </p>
            <Button
              onClick={connectToGoogle}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Link className="w-4 h-4 mr-2" />
              )}
              Se connecter à Google Calendar
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {googleEvents.length} événement(s) synchronisé(s)
              </div>
              {isLoading && (
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleSync}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Synchroniser
              </Button>
              <Button
                onClick={disconnectGoogle}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                <Unlink className="w-4 h-4 mr-2" />
                Déconnecter
              </Button>
            </div>
            
            {googleEvents.length > 0 && (
              <div className="max-h-32 overflow-y-auto space-y-1">
                {googleEvents.slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-center gap-2 text-xs p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                    <span className="truncate">{event.summary}</span>
                  </div>
                ))}
                {googleEvents.length > 5 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{googleEvents.length - 5} autres événements
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleCalendarSync;
