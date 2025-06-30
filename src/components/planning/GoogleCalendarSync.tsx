
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, RefreshCw, Link, Unlink, Loader2, Settings } from 'lucide-react';
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

  const [showClientIdInput, setShowClientIdInput] = useState(false);
  const [clientId, setClientId] = useState(() => {
    return localStorage.getItem('google_client_id') || '';
  });

  const handleClientIdSave = () => {
    if (clientId.trim()) {
      localStorage.setItem('google_client_id', clientId.trim());
      setShowClientIdInput(false);
    }
  };

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
        
        {!isConnected && !clientId && (
          <div className="text-xs text-orange-600 bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
            Client ID Google requis pour la connexion
          </div>
        )}
        
        <div className="flex gap-2">
          {!isConnected ? (
            <>
              <Button
                onClick={() => clientId ? connectToGoogle() : setShowClientIdInput(true)}
                disabled={isLoading}
                size="sm"
                className="flex-1 bg-blue-500 hover:bg-blue-600"
              >
                <Link className="w-3 h-3 mr-1" />
                {clientId ? 'Connecter' : 'Config'}
              </Button>
              {clientId && (
                <Button
                  onClick={() => setShowClientIdInput(true)}
                  disabled={isLoading}
                  size="sm"
                  variant="outline"
                >
                  <Settings className="w-3 h-3" />
                </Button>
              )}
            </>
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
        
        {showClientIdInput && (
          <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-800 rounded">
            <Label htmlFor="clientId" className="text-xs">Google Client ID</Label>
            <Input
              id="clientId"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="Votre Google Client ID"
              className="text-xs"
            />
            <div className="flex gap-2">
              <Button onClick={handleClientIdSave} size="sm" className="flex-1">
                Sauvegarder
              </Button>
              <Button onClick={() => setShowClientIdInput(false)} size="sm" variant="outline">
                Annuler
              </Button>
            </div>
          </div>
        )}
        
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
        {!clientId && (
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <p className="text-sm text-orange-800 dark:text-orange-200 mb-2">
              Configuration requise : Vous devez d'abord configurer votre Google Client ID.
            </p>
            <Button
              onClick={() => setShowClientIdInput(true)}
              size="sm"
              variant="outline"
              className="w-full"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configurer Client ID
            </Button>
          </div>
        )}

        {showClientIdInput && (
          <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <Label htmlFor="clientId" className="text-sm font-medium">Google Client ID</Label>
              <p className="text-xs text-gray-500 mt-1">
                Obtenez votre Client ID depuis la Google Cloud Console
              </p>
            </div>
            <Input
              id="clientId"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="123456789-abc123def456.apps.googleusercontent.com"
            />
            <div className="flex gap-2">
              <Button onClick={handleClientIdSave} size="sm" className="flex-1">
                Sauvegarder
              </Button>
              <Button onClick={() => setShowClientIdInput(false)} size="sm" variant="outline">
                Annuler
              </Button>
            </div>
          </div>
        )}

        {!isConnected && clientId ? (
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Synchronisez vos événements avec Google Calendar
            </p>
            <div className="flex gap-2">
              <Button
                onClick={connectToGoogle}
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600 flex-1"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Link className="w-4 h-4 mr-2" />
                )}
                Se connecter à Google Calendar
              </Button>
              <Button
                onClick={() => setShowClientIdInput(true)}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : isConnected ? (
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
        ) : null}
      </CardContent>
    </Card>
  );
};

export default GoogleCalendarSync;
