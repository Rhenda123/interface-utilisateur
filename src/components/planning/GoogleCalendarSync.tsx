
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, AlertCircle, CheckCircle } from 'lucide-react';

interface GoogleCalendarSyncProps {
  onEventsSync?: (events: any[]) => void;
  isMobile?: boolean;
}

const GoogleCalendarSync: React.FC<GoogleCalendarSyncProps> = ({ onEventsSync, isMobile = false }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    // Simuler une connexion
    setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
      if (onEventsSync) {
        onEventsSync([]);
      }
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  if (isMobile) {
    return (
      <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-gray-900 rounded-xl mx-1">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Google Calendar
              </span>
            </div>
            {isConnected ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-yellow-600" />
                <Button
                  onClick={handleDisconnect}
                  variant="outline"
                  size="sm"
                  className="text-xs px-2 py-1 h-6 border-yellow-300 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-600 dark:text-yellow-400 dark:hover:bg-yellow-900/20"
                >
                  Déconnecter
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleConnect}
                disabled={isLoading}
                size="sm"
                className="text-xs px-3 py-1 h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900"
              >
                {isLoading ? 'Connexion...' : 'Connecter'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-gray-900 rounded-xl">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
              <Calendar className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Synchronisation Google Calendar
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isConnected 
                  ? 'Connecté - Vos événements sont synchronisés' 
                  : 'Connectez votre Google Calendar pour synchroniser vos événements'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isConnected && (
              <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Connecté</span>
              </div>
            )}
            
            {isConnected ? (
              <Button
                onClick={handleDisconnect}
                variant="outline"
                className="border-yellow-300 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-600 dark:text-yellow-400 dark:hover:bg-yellow-900/20"
              >
                Déconnecter
              </Button>
            ) : (
              <Button
                onClick={handleConnect}
                disabled={isLoading}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mr-2" />
                    Connexion...
                  </>
                ) : (
                  'Connecter Google Calendar'
                )}
              </Button>
            )}
          </div>
        </div>
        
        {!isConnected && (
          <div className="mt-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <p className="font-medium mb-1">Pourquoi connecter Google Calendar ?</p>
                <ul className="text-xs space-y-1 text-yellow-700 dark:text-yellow-300">
                  <li>• Synchronisation automatique de vos événements</li>
                  <li>• Évitez les conflits d'horaires</li>
                  <li>• Accès à tous vos calendriers en un seul endroit</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleCalendarSync;
