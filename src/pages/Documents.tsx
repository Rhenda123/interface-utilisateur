
import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import DocumentsModule from '@/components/DocumentsModule';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentsProps {
  user: User;
  onBack: () => void;
}

const Documents = ({ user, onBack }: DocumentsProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Header avec bouton retour */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Accueil</span>
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {user.email}
            </span>
          </div>
        </div>

        {/* Module Documents */}
        <DocumentsModule />
      </div>
    </div>
  );
};

export default Documents;
