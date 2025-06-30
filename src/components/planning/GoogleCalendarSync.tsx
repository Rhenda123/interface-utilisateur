
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, CreditCard } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface GoogleCalendarSyncProps {
  onEventsSync?: (events: any[]) => void;
  isMobile?: boolean;
}

const GoogleCalendarSync: React.FC<GoogleCalendarSyncProps> = ({ onEventsSync, isMobile = false }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-white hover:bg-green-50 text-green-600 border-4 border-green-500 hover:border-green-600 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2 w-full justify-center">
          <CreditCard className="w-4 h-4" />
          Connecter votre Google Agenda
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-500" />
            Connexion Google Calendar
          </DialogTitle>
          <DialogDescription className="text-left">
            Pour connecter votre Google Calendar, vous devez activer l'intégration backend avec Supabase.
            
            <br /><br />
            
            <strong>Fonctionnalités disponibles avec l'intégration :</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Synchronisation automatique des événements</li>
              <li>Mise à jour en temps réel</li>
              <li>Gestion sécurisée des tokens</li>
              <li>Connexion OAuth simplifiée</li>
            </ul>
            
            <br />
            
            Cliquez sur le bouton Supabase vert en haut à droite pour activer l'intégration.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default GoogleCalendarSync;
