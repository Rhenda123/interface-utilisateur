
import React from 'react';

interface GoogleCalendarSyncProps {
  onEventsSync?: (events: any[]) => void;
  isMobile?: boolean;
}

const GoogleCalendarSync: React.FC<GoogleCalendarSyncProps> = ({ onEventsSync, isMobile = false }) => {
  return null;
};

export default GoogleCalendarSync;
