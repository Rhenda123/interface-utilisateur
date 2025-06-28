
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
  ArrowUpRight, 
  Plus,
  Target,
  Clock,
  AlertTriangle,
  Sparkles,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Users,
  Award,
  Star,
  ChevronRight
} from "lucide-react";

interface HomeModuleProps {
  onNavigate?: (view: string) => void;
}

const HomeModule = ({ onNavigate }: HomeModuleProps) => {
  const [finances, setFinances] = useState({ income: 0, expenses: 0 });
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);

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

        const savedBudgets = localStorage.getItem("skoolife_budgets");
        if (savedBudgets) setBudgets(JSON.parse(savedBudgets));
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-cyan-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    Bonjour ! 👋
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 text-lg">
                    Voici votre vue d'ensemble aujourd'hui
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-full border border-white/20">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Temps réel</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Balance */}
          <Card className="group relative overflow-hidden border-0 shadow-lg shadow-blue-500/10 bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-800 dark:to-blue-950/20 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer" onClick={() => onNavigate?.('finances')}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
            <CardContent className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Solde actuel</p>
                <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  €{Math.abs(netBalance).toLocaleString()}
                </p>
                <div className="flex items-center space-x-1">
                  {netBalance >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-xs text-slate-500">Ce mois</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card className="group relative overflow-hidden border-0 shadow-lg shadow-purple-500/10 bg-gradient-to-br from-white to-purple-50/50 dark:from-slate-800 dark:to-purple-950/20 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer" onClick={() => onNavigate?.('todo')}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
            <CardContent className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Progression des tâches</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">{Math.round(taskProgress)}%</span>
                    <span className="text-sm text-slate-500">{completedTasks}/{totalTasks}</span>
                  </div>
                  <Progress value={taskProgress} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Events */}
          <Card className="group relative overflow-hidden border-0 shadow-lg shadow-cyan-500/10 bg-gradient-to-br from-white to-cyan-50/50 dark:from-slate-800 dark:to-cyan-950/20 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 cursor-pointer" onClick={() => onNavigate?.('planning')}>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent"></div>
            <CardContent className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Aujourd'hui</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{todayEvents}</p>
                <p className="text-xs text-slate-500">événement{todayEvents !== 1 ? 's' : ''} planifié{todayEvents !== 1 ? 's' : ''}</p>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card className="group relative overflow-hidden border-0 shadow-lg shadow-orange-500/10 bg-gradient-to-br from-white to-orange-50/50 dark:from-slate-800 dark:to-orange-950/20 hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300 cursor-pointer" onClick={() => onNavigate?.('documents')}>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent"></div>
            <CardContent className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Documents</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{documents.length}</p>
                <p className="text-xs text-slate-500">fichier{documents.length !== 1 ? 's' : ''} stocké{documents.length !== 1 ? 's' : ''}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Financial Overview */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Aperçu financier</h3>
                      <p className="text-sm text-slate-500">Performances de ce mois</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => onNavigate?.('finances')} className="hover:bg-blue-50 dark:hover:bg-slate-700">
                    Voir tout <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Income */}
                  <div className="relative p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/10 border border-emerald-200/50 dark:border-emerald-800/30">
                    <div className="flex items-center justify-between mb-3">
                      <TrendingUp className="w-8 h-8 text-emerald-600" />
                      <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">€{monthlyIncome.toLocaleString()}</p>
                        <p className="text-sm text-emerald-600 dark:text-emerald-500">Revenus</p>
                      </div>
                    </div>
                  </div>

                  {/* Expenses */}
                  <div className="relative p-6 rounded-2xl bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/10 border border-red-200/50 dark:border-red-800/30">
                    <div className="flex items-center justify-between mb-3">
                      <TrendingDown className="w-8 h-8 text-red-600" />
                      <div className="text-right">
                        <p className="text-2xl font-bold text-red-700 dark:text-red-400">€{monthlyExpenses.toLocaleString()}</p>
                        <p className="text-sm text-red-600 dark:text-red-500">Dépenses</p>
                      </div>
                    </div>
                  </div>

                  {/* Net */}
                  <div className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 border border-blue-200/50 dark:border-blue-800/30">
                    <div className="flex items-center justify-between mb-3">
                      <Activity className="w-8 h-8 text-blue-600" />
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-blue-700 dark:text-blue-400' : 'text-red-700 dark:text-red-400'}`}>
                          €{Math.abs(netBalance).toLocaleString()}
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-500">Net</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Task Alert */}
            {urgentTasks > 0 && (
              <Card className="border-0 shadow-lg bg-gradient-to-r from-red-500 to-pink-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-8 h-8" />
                    <div>
                      <h4 className="font-semibold">Attention requise</h4>
                      <p className="text-sm opacity-90">{urgentTasks} tâche{urgentTasks !== 1 ? 's' : ''} urgente{urgentTasks !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" className="mt-4 w-full" onClick={() => onNavigate?.('todo')}>
                    Voir les tâches
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                  Actions rapides
                </h4>
                <div className="space-y-3">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start hover:bg-blue-50 dark:hover:bg-slate-700" 
                    onClick={() => onNavigate?.('finances')}
                  >
                    <Plus className="w-4 h-4 mr-3" />
                    Ajouter une transaction
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start hover:bg-purple-50 dark:hover:bg-slate-700" 
                    onClick={() => onNavigate?.('todo')}
                  >
                    <Target className="w-4 h-4 mr-3" />
                    Nouvelle tâche
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start hover:bg-cyan-50 dark:hover:bg-slate-700" 
                    onClick={() => onNavigate?.('planning')}
                  >
                    <Calendar className="w-4 h-4 mr-3" />
                    Planifier événement
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white">Activité récente</h4>
              </div>
              <div className="space-y-4">
                {transactions.slice(0, 3).map((transaction: any, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${transaction.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                        {transaction.type === 'income' ? (
                          <TrendingUp className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-slate-900 dark:text-white">{transaction.description}</p>
                        <p className="text-xs text-slate-500">{transaction.category}</p>
                      </div>
                    </div>
                    <span className={`font-semibold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {transaction.type === 'income' ? '+' : '-'}€{transaction.amount}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <PieChart className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white">Vue d'ensemble</h4>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Tâches complétées</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{completedTasks}/{totalTasks}</span>
                  </div>
                  <Progress value={taskProgress} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{todayEvents}</p>
                    <p className="text-xs text-slate-500">Événements</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                    <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{documents.length}</p>
                    <p className="text-xs text-slate-500">Documents</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-semibold">Performance</h4>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-80">Productivité</span>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className={`w-4 h-4 ${star <= Math.ceil(taskProgress / 20) ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-center py-4">
                  <p className="text-2xl font-bold mb-1">{Math.round(taskProgress)}%</p>
                  <p className="text-sm opacity-80">Objectifs atteints</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomeModule;
