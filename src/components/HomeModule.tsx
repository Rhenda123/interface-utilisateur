import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, CheckSquare, DollarSign, FileText, TrendingUp, Clock, AlertCircle } from "lucide-react";

interface HomeModuleProps {
  onNavigate: (view: string) => void;
}

export default function HomeModule({ onNavigate }: HomeModuleProps) {
  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Tableau de bord
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Votre vue d'ensemble personnalisée
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          📅 Synchronisé en temps réel
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900"
          onClick={() => onNavigate('finances')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Solde Actuel</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">€0</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900"
          onClick={() => onNavigate('todo')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Tâches</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">0</p>
              </div>
              <CheckSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900"
          onClick={() => onNavigate('planning')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Aujourd'hui</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">0</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900"
          onClick={() => onNavigate('documents')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Documents</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">0</p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-10">
        {/* Finance Section */}
        <Card className="lg:col-span-2 border-2 border-orange-200 dark:border-orange-800">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-orange-700 dark:text-orange-300">
              <DollarSign className="h-6 w-6" />
              💰 Finances
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">💵 Revenus</p>
                <p className="text-2xl font-bold text-green-800 dark:text-green-200">€0</p>
              </div>
              <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">💸 Dépenses</p>
                <p className="text-2xl font-bold text-red-800 dark:text-red-200">€0</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Budget ce mois</span>
                <span className="text-sm text-orange-600 dark:text-orange-400 font-semibold">0%</span>
              </div>
              <Progress value={0} className="h-3" />
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>€0 utilisé</span>
                <span>€450 total</span>
              </div>
            </div>

            <Button 
              onClick={() => onNavigate('finances')} 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3"
            >
              Gérer les finances
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-2 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-blue-700 dark:text-blue-300">
              <Clock className="h-6 w-6" />
              ⚡ Actions rapides
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => onNavigate('todo')} 
              variant="outline" 
              className="w-full justify-start border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950 font-medium py-3"
            >
              <CheckSquare className="mr-3 h-5 w-5" />
              Nouvelle tâche
            </Button>
            <Button 
              onClick={() => onNavigate('planning')} 
              variant="outline" 
              className="w-full justify-start border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-950 font-medium py-3"
            >
              <Calendar className="mr-3 h-5 w-5" />
              Nouvel événement
            </Button>
            <Button 
              onClick={() => onNavigate('documents')} 
              variant="outline" 
              className="w-full justify-start border-purple-200 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-950 font-medium py-3"
            >
              <FileText className="mr-3 h-5 w-5" />
              Nouveau document
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-2 border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <AlertCircle className="h-6 w-6" />
            📋 Activité récente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Aucune activité récente</p>
            <p className="text-sm">Commencez à utiliser SKOOLIFE pour voir votre activité ici</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
