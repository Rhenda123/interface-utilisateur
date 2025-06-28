
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Calendar, Clock, FileText, MessageSquare, TrendingUp, AlertCircle, CheckCircle, ArrowRight, Eye, Users, BookOpen, Target } from "lucide-react";

interface HomeModuleProps {
  onNavigate?: (view: string) => void;
}

const HomeModule = ({ onNavigate }: HomeModuleProps) => {
  const [finances, setFinances] = useState({ income: 0, expenses: 0 });
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [screenSize, setScreenSize] = useState('desktop');

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    // Enhanced data loading with error handling and fallbacks
    const loadData = () => {
      try {
        const savedTasks = localStorage.getItem("skoolife_tasks");
        if (savedTasks) setTasks(JSON.parse(savedTasks));

        const savedEvents = localStorage.getItem("skoolife_events");
        if (savedEvents) setEvents(JSON.parse(savedEvents));

        const savedDocuments = localStorage.getItem("skoolife_documents");
        if (savedDocuments) setDocuments(JSON.parse(savedDocuments));

        const savedPosts = localStorage.getItem("skoolife_forum_posts");
        if (savedPosts) setPosts(JSON.parse(savedPosts));

        const savedFinances = localStorage.getItem("skoolife_finances");
        if (savedFinances) {
          setFinances(JSON.parse(savedFinances));
        }

        const savedTransactions = localStorage.getItem("skoolife_transactions");
        if (savedTransactions) setTransactions(JSON.parse(savedTransactions));

        const savedBudgets = localStorage.getItem("skoolife_budgets");
        if (savedBudgets) setBudgets(JSON.parse(savedBudgets));
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();

    // Enhanced real-time synchronization
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.newValue) {
        try {
          switch (e.key) {
            case "skoolife_finances":
              setFinances(JSON.parse(e.newValue));
              break;
            case "skoolife_tasks":
              setTasks(JSON.parse(e.newValue));
              break;
            case "skoolife_events":
              setEvents(JSON.parse(e.newValue));
              break;
            case "skoolife_documents":
              setDocuments(JSON.parse(e.newValue));
              break;
            case "skoolife_forum_posts":
              setPosts(JSON.parse(e.newValue));
              break;
            case "skoolife_transactions":
              setTransactions(JSON.parse(e.newValue));
              break;
            case "skoolife_budgets":
              setBudgets(JSON.parse(e.newValue));
              break;
          }
        } catch (error) {
          console.error('Error parsing storage data:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    const handleFinanceUpdate = (e: CustomEvent) => {
      setFinances(e.detail);
    };
    
    const handleDataUpdate = () => {
      loadData();
    };
    
    window.addEventListener('financeUpdate', handleFinanceUpdate as EventListener);
    window.addEventListener('dataUpdate', handleDataUpdate);

    // More frequent updates for better synchronization
    const intervalId = setInterval(loadData, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('financeUpdate', handleFinanceUpdate as EventListener);
      window.removeEventListener('dataUpdate', handleDataUpdate);
      clearInterval(intervalId);
    };
  }, []);

  // Enhanced calculations with better error handling
  const calculateCurrentMonthBudgetData = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    const updatedBudgets = budgets.map(budget => {
      const relevantTransactions = transactions.filter(t => {
        try {
          const tDate = new Date(t.date);
          const isExpense = t.type === 'expense';
          const isCategory = t.category === budget.category;
          
          let isInPeriod = false;
          switch (budget.period) {
            case 'monthly':
              isInPeriod = tDate.getFullYear() === currentYear && tDate.getMonth() === currentMonth;
              break;
            case 'quarterly':
              const quarter = Math.floor(currentMonth / 3);
              const tQuarter = Math.floor(tDate.getMonth() / 3);
              isInPeriod = tDate.getFullYear() === currentYear && tQuarter === quarter;
              break;
            case 'yearly':
              isInPeriod = tDate.getFullYear() === currentYear;
              break;
          }
          
          return isExpense && isCategory && isInPeriod;
        } catch (error) {
          return false;
        }
      });
      
      const spent = relevantTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
      return { ...budget, spent };
    });
    
    return updatedBudgets;
  };

  // Enhanced data calculations
  const completedTasks = tasks.filter((task: any) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const currentBalance = finances.income - finances.expenses;
  
  const currentBudgets = calculateCurrentMonthBudgetData();
  const totalBudget = currentBudgets.reduce((sum: number, budget: any) => sum + (budget.limit || 0), 0);
  const budgetSpent = currentBudgets.reduce((sum: number, budget: any) => sum + (budget.spent || 0), 0);
  const budgetProgress = totalBudget > 0 ? (budgetSpent / totalBudget) * 100 : 0;
  
  const urgentTasks = tasks.filter((task: any) => 
    !task.completed && 
    (task.priority === "Haute" || 
     (task.deadline && new Date(task.deadline) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)))
  );

  const todaysEvents = events.filter((event: any) => {
    const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long' });
    const todayFrench = today.charAt(0).toUpperCase() + today.slice(1);
    return event.day === todayFrench;
  });

  const thisWeekEvents = events.filter((event: any) => {
    const today = new Date();
    const todayDay = today.toLocaleDateString('fr-FR', { weekday: 'long' });
    const todayFrench = todayDay.charAt(0).toUpperCase() + todayDay.slice(1);
    
    const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const todayIndex = weekDays.indexOf(todayFrench);
    const eventIndex = weekDays.indexOf(event.day);
    
    return eventIndex >= todayIndex;
  });

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlySpending = transactions
    .filter((t: any) => {
      try {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear &&
               t.type === 'expense';
      } catch (error) {
        return false;
      }
    })
    .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

  const recentDocuments = documents.filter((doc: any) => {
    if (!doc.uploadDate) return false;
    try {
      const docDate = new Date(doc.uploadDate);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return docDate >= weekAgo;
    } catch (error) {
      return false;
    }
  });

  // Responsive grid configurations
  const getGridConfig = () => {
    switch (screenSize) {
      case 'mobile':
        return {
          statsGrid: 'grid-cols-2',
          contentGrid: 'grid-cols-1',
          chartHeight: 'h-24',
          showCharts: false
        };
      case 'tablet':
        return {
          statsGrid: 'grid-cols-2 sm:grid-cols-4',
          contentGrid: 'grid-cols-1 md:grid-cols-2',
          chartHeight: 'h-32',
          showCharts: true
        };
      default:
        return {
          statsGrid: 'grid-cols-2 lg:grid-cols-4',
          contentGrid: 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3',
          chartHeight: 'h-32',
          showCharts: true
        };
    }
  };

  const gridConfig = getGridConfig();

  const financeData = [
    { name: "Revenus", amount: finances.income, color: "#10b981" },
    { name: "Dépenses", amount: finances.expenses, color: "#ef4444" },
  ];

  const taskData = [
    { name: "Faites", value: completedTasks, color: "#10b981" },
    { name: "À faire", value: pendingTasks, color: "#f59e0b" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6 max-w-full overflow-hidden">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#F6C103] to-[#E5AC00] bg-clip-text text-transparent mb-2 sm:mb-3">
          Tableau de Bord
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
          Votre vue d'ensemble personnalisée
        </p>
      </div>

      {/* Enhanced Responsive Quick Stats Grid */}
      <div className={`grid ${gridConfig.statsGrid} gap-3 sm:gap-4 mb-6 sm:mb-8`}>
        <Card 
          className="border-[#F6C103] dark:border-gray-700 shadow-lg bg-gradient-to-br from-white to-[#FEF7D6] dark:from-gray-800 dark:to-gray-700 hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer touch-manipulation"
          onClick={() => onNavigate?.('finances')}
        >
          <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
            <div className="flex items-center justify-center mb-2 sm:mb-3">
              <TrendingUp className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 ${currentBalance >= 0 ? "text-green-500" : "text-red-500"}`} />
            </div>
            <div className={`text-base sm:text-lg lg:text-2xl font-bold mb-1 sm:mb-2 ${
              currentBalance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            }`}>
              €{currentBalance.toFixed(0)}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1 sm:mb-2">
              Solde Actuel
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {budgetProgress.toFixed(0)}% utilisé
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-[#F6C103] dark:border-gray-700 shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer touch-manipulation"
          onClick={() => onNavigate?.('todo')}
        >
          <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
            <div className="flex items-center justify-center mb-2 sm:mb-3">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-blue-500" />
            </div>
            <div className="text-base sm:text-lg lg:text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1 sm:mb-2">
              {pendingTasks}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1 sm:mb-2">
              Tâches
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {urgentTasks.length} urgentes
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-[#F6C103] dark:border-gray-700 shadow-lg bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-700 hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer touch-manipulation"
          onClick={() => onNavigate?.('planning')}
        >
          <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
            <div className="flex items-center justify-center mb-2 sm:mb-3">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-purple-500" />
            </div>
            <div className="text-base sm:text-lg lg:text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1 sm:mb-2">
              {todaysEvents.length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1 sm:mb-2">
              Aujourd'hui
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {thisWeekEvents.length} cette semaine
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-[#F6C103] dark:border-gray-700 shadow-lg bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-gray-700 hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer touch-manipulation"
          onClick={() => onNavigate?.('documents')}
        >
          <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
            <div className="flex items-center justify-center mb-2 sm:mb-3">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-orange-500" />
            </div>
            <div className="text-base sm:text-lg lg:text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1 sm:mb-2">
              {documents.length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1 sm:mb-2">
              Documents
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {recentDocuments.length} récents
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Responsive Content Grid */}
      <div className={`grid ${gridConfig.contentGrid} gap-4 sm:gap-6`}>
        {/* Enhanced Finance Summary */}
        <Card className="border-[#F6C103] dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Finances
              </h3>
              <Button
                onClick={() => onNavigate?.('finances')}
                variant="ghost"
                size="sm"
                className="text-[#F6C103] hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-full p-2"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Ce mois</span>
                <span className="font-semibold text-red-600 dark:text-red-400">€{monthlySpending.toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[#F6C103] to-[#E5AC00] h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                ></div>
              </div>
              {gridConfig.showCharts && (
                <div className={gridConfig.chartHeight}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={financeData}>
                      <Bar dataKey="amount" fill="#F6C103" radius={[4, 4, 0, 0]} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--card)',
                          border: '2px solid #F6C103',
                          borderRadius: '8px',
                          color: 'var(--card-foreground)'
                        }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Tasks Overview */}
        <Card className="border-[#F6C103] dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Tâches
              </h3>
              <Button
                onClick={() => onNavigate?.('todo')}
                variant="ghost"
                size="sm"
                className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full p-2"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {urgentTasks.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-red-700 dark:text-red-300">
                      {urgentTasks.length} urgente{urgentTasks.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {tasks.filter((task: any) => !task.completed).slice(0, screenSize === 'mobile' ? 2 : 3).map((task: any, index: number) => (
                  <div key={index} className="p-2 bg-[#FEF7D6] dark:bg-yellow-900/20 rounded-lg border border-[#F6C103] dark:border-yellow-700 animate-fade-in">
                    <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
                      {task.text}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {task.priority}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Planning Overview */}
        <Card className="border-[#F6C103] dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Planning
              </h3>
              <Button
                onClick={() => onNavigate?.('planning')}
                variant="ghost"
                size="sm"
                className="text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full p-2"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {todaysEvents.slice(0, screenSize === 'mobile' ? 1 : 2).map((event: any, index: number) => (
                <div key={index} className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700 animate-fade-in">
                  <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
                    {event.name}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <Clock className="w-3 h-3" />
                    {event.startTime} - {event.endTime}
                  </div>
                </div>
              ))}
              {thisWeekEvents.slice(0, 1).map((event: any, index: number) => (
                <div key={`week-${index}`} className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="font-medium text-xs text-gray-700 dark:text-gray-300 truncate">
                    {event.day}: {event.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {event.startTime}
                  </div>
                </div>
              ))}
              {todaysEvents.length === 0 && thisWeekEvents.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4 text-sm">
                  Aucun événement prévu
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Documents Activity - Enhanced */}
        <Card className="border-[#F6C103] dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Documents
              </h3>
              <Button
                onClick={() => onNavigate?.('documents')}
                variant="ghost"
                size="sm"
                className="text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-full p-2"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {recentDocuments.slice(0, screenSize === 'mobile' ? 1 : 2).map((doc: any, index: number) => (
                <div key={index} className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700 animate-fade-in">
                  <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
                    {doc.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {doc.category}
                  </div>
                </div>
              ))}
              {documents.slice(0, 1).map((doc: any, index: number) => (
                <div key={`all-${index}`} className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="font-medium text-xs text-gray-700 dark:text-gray-300 truncate">
                    {doc.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {doc.category}
                  </div>
                </div>
              ))}
              {documents.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4 text-sm">
                  Aucun document
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Forum Activity - Enhanced */}
        <Card className="border-[#F6C103] dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Forum
              </h3>
              <Button
                onClick={() => onNavigate?.('forum')}
                variant="ghost"
                size="sm"
                className="text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full p-2"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {posts.slice(0, screenSize === 'mobile' ? 1 : 2).map((post: any, index: number) => (
                <div key={index} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700 animate-fade-in hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors cursor-pointer">
                  <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
                    {post.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {post.author} • {post.replies?.length || 0} réponses
                  </div>
                </div>
              ))}
              {posts.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4 text-sm">
                  Aucune activité récente
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Weekly Insights */}
        <Card className="border-[#F6C103] dark:border-gray-700 shadow-lg bg-gradient-to-br from-white to-[#FEF7D6] dark:from-gray-800 dark:to-gray-700 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Cette Semaine
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-[#F6C103] dark:border-gray-600">
                <span className="text-sm text-gray-600 dark:text-gray-300">Tâches</span>
                <span className="font-bold text-green-600 dark:text-green-400">{completedTasks}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-[#F6C103] dark:border-gray-600">
                <span className="text-sm text-gray-600 dark:text-gray-300">Événements</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">{thisWeekEvents.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-[#F6C103] dark:border-gray-600">
                <span className="text-sm text-gray-600 dark:text-gray-300">Dépenses</span>
                <span className="font-bold text-red-600 dark:text-red-400">€{monthlySpending.toFixed(0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomeModule;
