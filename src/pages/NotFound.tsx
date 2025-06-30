
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-8xl font-bold text-yellow-500 dark:text-yellow-400">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Page non trouvée
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Désolé, la page que vous recherchez n'existe pas.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="border-yellow-200 hover:bg-yellow-50 dark:border-yellow-600 dark:hover:bg-yellow-900/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <Link to="/">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
