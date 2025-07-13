
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Users, Calendar, DollarSign, MessageSquare, CheckSquare } from 'lucide-react';

interface HomeProps {
  onNavigateToDocuments: () => void;
}

const Home = ({ onNavigateToDocuments }: HomeProps) => {
  const modules = [
    {
      id: 'documents',
      title: 'Documents',
      description: 'Gérez et organisez vos documents',
      icon: FileText,
      color: 'from-yellow-400 to-yellow-500',
      available: true,
      onClick: onNavigateToDocuments
    },
    {
      id: 'planning',
      title: 'Planning',
      description: 'Organisez votre emploi du temps',
      icon: Calendar,
      color: 'from-blue-400 to-blue-500',
      available: false
    },
    {
      id: 'finance',
      title: 'Finance',
      description: 'Suivez vos dépenses et budget',
      icon: DollarSign,
      color: 'from-green-400 to-green-500',
      available: false
    },
    {
      id: 'forum',
      title: 'Forum',
      description: 'Discutez avec la communauté',
      icon: MessageSquare,
      color: 'from-purple-400 to-purple-500',
      available: false
    },
    {
      id: 'todo',
      title: 'To-Do',
      description: 'Gérez vos tâches quotidiennes',
      icon: CheckSquare,
      color: 'from-red-400 to-red-500',
      available: false
    },
    {
      id: 'social',
      title: 'Social',
      description: 'Connectez-vous avec vos amis',
      icon: Users,
      color: 'from-pink-400 to-pink-500',
      available: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl sm:text-3xl">🎓</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Interface Utilisateur
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Votre plateforme tout-en-un pour gérer vos documents, plannings, finances et plus encore
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {modules.map((module) => {
            const IconComponent = module.icon;
            return (
              <Card 
                key={module.id} 
                className={`group border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                  module.available ? 'cursor-pointer' : 'opacity-75'
                }`}
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="text-center">
                    {/* Icon */}
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${module.color} rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                      {module.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                      {module.description}
                    </p>
                    
                    {/* Button */}
                    {module.available ? (
                      <Button
                        onClick={module.onClick}
                        className={`w-full bg-gradient-to-r ${module.color} hover:opacity-90 text-white font-semibold py-2 sm:py-3 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg text-sm sm:text-base`}
                      >
                        Accéder
                      </Button>
                    ) : (
                      <Button
                        disabled
                        className="w-full bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 font-semibold py-2 sm:py-3 rounded-lg cursor-not-allowed text-sm sm:text-base"
                      >
                        Bientôt disponible
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 sm:mt-16">
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
            © 2024 Interface Utilisateur - Votre assistant numérique personnel
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
