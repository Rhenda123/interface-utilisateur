
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  CheckCircle2, 
  Calendar, 
  Plus,
  ArrowRight
} from "lucide-react";

interface HomeModuleProps {
  onNavigate?: (view: string) => void;
}

const HomeModule = ({ onNavigate }: HomeModuleProps) => {
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Data loading logic
  useEffect(() => {
    const loadAllData = () => {
      try {
        const savedTasks = localStorage.getItem("skoolife_tasks");
        if (savedTasks) setTasks(JSON.parse(savedTasks));

        const savedEvents = localStorage.getItem("skoolife_events");
        if (savedEvents) setEvents(JSON.parse(savedEvents));

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

  const todayEvents = events.filter((event: any) => {
    const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long' });
    return event.day?.toLowerCase() === today.toLowerCase();
  }).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 font-display tracking-tight">
            Tableau de bord
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
            Vue d'ensemble de vos activités
          </p>
        </div>

        {/* Three Main Blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Finances Block */}
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-blue-200 dark:border-blue-800 flex flex-col h-full" onClick={() => onNavigate?.('finances')}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wallet className="w-6 h-6 text-blue-600" />
                  <span className="text-2xl font-bold text-gray-900 dark:text-white font-display tracking-tight">Finances</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Balance */}
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 font-display tracking-tight ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    €{Math.abs(netBalance).toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Solde ce mois</p>
                </div>

                {/* Income/Expenses */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400 font-display">
                      €{monthlyIncome.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-500 font-medium">Revenus</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <TrendingDown className="w-5 h-5 text-red-600 mx-auto mb-1" />
                    <p className="text-sm font-semibold text-red-700 dark:text-red-400 font-display">
                      €{monthlyExpenses.toLocaleString()}
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-500 font-medium">Dépenses</p>
                  </div>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full font-medium mt-6" 
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate?.('finances');
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une transaction
              </Button>
            </CardContent>
          </Card>

          {/* Tâches Block */}
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-purple-200 dark:border-purple-800 flex flex-col h-full" onClick={() => onNavigate?.('todo')}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-purple-600" />
                  <span className="text-2xl font-bold text-gray-900 dark:text-white font-display tracking-tight">Tâches</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Progress */}
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2 text-purple-600 font-display tracking-tight">
                    {Math.round(taskProgress)}%
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Progression</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <Progress value={taskProgress} className="h-3" />
                  <p className="text-sm text-gray-500 text-center font-medium">
                    {completedTasks} sur {totalTasks} tâches terminées
                  </p>
                </div>

                {/* Tasks Summary */}
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-sm font-semibold text-purple-700 dark:text-purple-400 font-display">
                    {totalTasks - completedTasks} tâches restantes
                  </p>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full font-medium mt-6" 
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate?.('todo');
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle tâche
              </Button>
            </CardContent>
          </Card>

          {/* Planning Block */}
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-cyan-200 dark:border-cyan-800 flex flex-col h-full" onClick={() => onNavigate?.('planning')}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-cyan-600" />
                  <span className="text-2xl font-bold text-gray-900 dark:text-white font-display tracking-tight">Planning</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Today's Events */}
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2 text-cyan-600 font-display tracking-tight">
                    {todayEvents}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Événements aujourd'hui</p>
                </div>

                {/* Calendar Visual */}
                <div className="text-center p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                  <Calendar className="w-12 h-12 text-cyan-600 mx-auto mb-2" />
                  <p className="text-sm text-cyan-700 dark:text-cyan-400 font-medium">
                    {new Date().toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long' 
                    })}
                  </p>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full font-medium mt-6" 
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate?.('planning');
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Planifier événement
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomeModule;
