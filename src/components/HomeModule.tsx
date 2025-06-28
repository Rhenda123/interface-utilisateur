
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  CheckCircle2, 
  Calendar, 
  FileText, 
  Plus,
  Clock,
  AlertTriangle
} from "lucide-react";

interface HomeModuleProps {
  onNavigate?: (view: string) => void;
}

const HomeModule = ({ onNavigate }: HomeModuleProps) => {
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Data loading logic
  useEffect(() => {
    const loadAllData = () => {
      try {
        const savedTasks = localStorage.getItem("skoolife_tasks");
        if (savedTasks) setTasks(JSON.parse(savedTasks));

        const savedEvents = localStorage.getItem("skoolife_events");
        if (savedEvents) setEvents(JSON.parse(savedEvents));

        const savedDocuments = localStorage.getItem("skoolife_documents");
        if (savedDocuments) setDocuments(JSON.parse(savedDocuments));

        const savedTransactions = localStorage.getItem("skoolife_transactions");
        if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadAllData();
    const interval = setInterval(loadAllData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Calculations
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const currentMonthTransactions = transactions.filter(t => {
    try {
      const tDate = new Date(t.date);
      return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
    } catch {
      return false;
    }
  });

  const monthlyIncome = currentMonthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + (t.amount || 0), 0);
  const monthlyExpenses = currentMonthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + (t.amount || 0), 0);
  const netBalance = monthlyIncome - monthlyExpenses;

  const completedTasks = tasks.filter((task: any) => task.completed).length;
  const totalTasks = tasks.length;
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const urgentTasks = tasks.filter((task: any) => !task.completed && task.priority === "Haute").length;

  const todayEvents = events.filter((event: any) => {
    const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long' });
    return event.day?.toLowerCase() === today.toLowerCase();
  }).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Simple Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Tableau de bord
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Vue d'ensemble de vos activités
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Balance Card */}
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate?.('finances')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Wallet className="w-8 h-8 text-blue-600" />
                <span className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  €{Math.abs(netBalance).toLocaleString()}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Solde</p>
                <div className="flex items-center text-sm text-gray-500">
                  {netBalance >= 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1 text-red-500" />
                  )}
                  Ce mois
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tasks Card */}
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate?.('todo')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle2 className="w-8 h-8 text-purple-600" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(taskProgress)}%
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Tâches</p>
                <Progress value={taskProgress} className="h-2" />
                <p className="text-sm text-gray-500">{completedTasks}/{totalTasks} terminées</p>
              </div>
            </CardContent>
          </Card>

          {/* Events Card */}
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate?.('planning')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="w-8 h-8 text-cyan-600" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {todayEvents}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Événements</p>
                <p className="text-sm text-gray-500">Aujourd'hui</p>
              </div>
            </CardContent>
          </Card>

          {/* Documents Card */}
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate?.('documents')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <FileText className="w-8 h-8 text-orange-600" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {documents.length}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Documents</p>
                <p className="text-sm text-gray-500">Fichiers stockés</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Financial Overview */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Finances du mois
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => onNavigate?.('finances')}>
                    Voir tout
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                      €{monthlyIncome.toLocaleString()}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-500">Revenus</p>
                  </div>

                  <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <TrendingDown className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                      €{monthlyExpenses.toLocaleString()}
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-500">Dépenses</p>
                  </div>

                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Wallet className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-blue-700 dark:text-blue-400' : 'text-red-700 dark:text-red-400'}`}>
                      €{Math.abs(netBalance).toLocaleString()}
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-500">Net</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Urgent Alert */}
            {urgentTasks > 0 && (
              <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                    <div>
                      <h4 className="font-semibold text-red-900 dark:text-red-100">
                        Tâches urgentes
                      </h4>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        {urgentTasks} tâche{urgentTasks !== 1 ? 's' : ''} à traiter
                      </p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full" onClick={() => onNavigate?.('todo')}>
                    Voir les tâches
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Actions rapides
                </h4>
                <div className="space-y-3">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    onClick={() => onNavigate?.('finances')}
                  >
                    <Plus className="w-4 h-4 mr-3" />
                    Ajouter une transaction
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    onClick={() => onNavigate?.('todo')}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-3" />
                    Nouvelle tâche
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    onClick={() => onNavigate?.('planning')}
                  >
                    <Calendar className="w-4 h-4 mr-3" />
                    Planifier événement
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Activité récente
                  </h4>
                </div>
                <div className="space-y-3">
                  {transactions.slice(0, 3).map((transaction: any, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
                        }`}>
                          {transaction.type === 'income' ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-900 dark:text-white">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {transaction.category}
                          </p>
                        </div>
                      </div>
                      <span className={`font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}€{transaction.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeModule;
