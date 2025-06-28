import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Calendar, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Euro,
  FileText,
  AlertTriangle,
  Target,
  Activity
} from "lucide-react";

const HomeModule = () => {
  const [finances, setFinances] = useState({ income: 0, expenses: 0 });
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    // Load data from localStorage and set up real-time updates
    const loadData = () => {
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
    };

    // Initial load
    loadData();

    // Listen for localStorage changes to update data in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.newValue) {
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
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events for same-page updates
    const handleFinanceUpdate = (e: CustomEvent) => {
      setFinances(e.detail);
    };
    
    const handleDataUpdate = () => {
      loadData();
    };
    
    window.addEventListener('financeUpdate', handleFinanceUpdate as EventListener);
    window.addEventListener('dataUpdate', handleDataUpdate);

    // Set up periodic refresh to catch updates within the same tab
    const intervalId = setInterval(loadData, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('financeUpdate', handleFinanceUpdate as EventListener);
      window.removeEventListener('dataUpdate', handleDataUpdate);
      clearInterval(intervalId);
    };
  }, []);

  // Calculate real-time budget spending for current month
  const calculateCurrentMonthBudgetData = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    // Update budget spent amounts based on current month transactions
    const updatedBudgets = budgets.map(budget => {
      const relevantTransactions = transactions.filter(t => {
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
      });
      
      const spent = relevantTransactions.reduce((sum, t) => sum + t.amount, 0);
      return { ...budget, spent };
    });
    
    return updatedBudgets;
  };

  // Enhanced calculations with real-time budget data
  const completedTasks = tasks.filter((task: any) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const currentBalance = finances.income - finances.expenses;
  
  // Calculate real budget progress
  const currentBudgets = calculateCurrentMonthBudgetData();
  const totalBudget = currentBudgets.reduce((sum: number, budget: any) => sum + budget.limit, 0);
  const budgetSpent = currentBudgets.reduce((sum: number, budget: any) => sum + (budget.spent || 0), 0);
  const budgetProgress = totalBudget > 0 ? (budgetSpent / totalBudget) * 100 : 0;
  
  // Calculate urgent tasks (high priority and due soon) - fix arithmetic issue
  const urgentTasksArray = tasks.filter((task: any) => 
    !task.completed && 
    (task.priority === "Haute" || 
     (task.deadline && new Date(task.deadline) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)))
  );
  const urgentTasksCount = urgentTasksArray.length;

  // Calculate this week's events - fix date handling
  const thisWeekEvents = events.filter((event: any) => {
    const today = new Date();
    const todayWeekday = today.toLocaleDateString('fr-FR', { weekday: 'long' });
    const todayFrench = todayWeekday.charAt(0).toUpperCase() + todayWeekday.slice(1);
    
    const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const todayIndex = weekDays.indexOf(todayFrench);
    const eventIndex = weekDays.indexOf(event.day);
    
    return eventIndex >= todayIndex;
  });

  // Today's events - fix date handling
  const todaysEvents = events.filter((event: any) => {
    const today = new Date();
    const todayWeekday = today.toLocaleDateString('fr-FR', { weekday: 'long' });
    const todayFrench = todayWeekday.charAt(0).toUpperCase() + todayWeekday.slice(1);
    return event.day === todayFrench;
  });

  // Current month spending
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlySpending = transactions
    .filter((t: any) => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear &&
             t.type === 'expense';
    })
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  // Recent documents (last 7 days)
  const recentDocuments = documents.filter((doc: any) => {
    if (!doc.uploadDate) return false;
    const docDate = new Date(doc.uploadDate);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return docDate >= weekAgo;
  });

  // Recent transactions (last 7 days)
  const recentTransactions = transactions.filter((t: any) => {
    const transactionDate = new Date(t.date);
    return transactionDate >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  });

  // Upcoming events (next 7 days)
  const upcomingEvents = events.filter((event: any) => {
    const eventDate = new Date(event.start);
    return eventDate >= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  });

  // Enhanced finance chart data
  const financeData = [
    { name: "Revenus", amount: finances.income, color: "#10b981" },
    { name: "Dépenses", amount: finances.expenses, color: "#ef4444" },
  ];

  // Task completion data for mini chart
  const taskData = [
    { name: "Faites", value: completedTasks, color: "#10b981" },
    { name: "À faire", value: pendingTasks, color: "#f59e0b" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-skoolife-yellow-light to-skoolife-blue-light dark:from-skoolife-yellow-light dark:to-skoolife-blue-light rounded-lg p-6 border border-skoolife-yellow/20">
        <div className="flex items-center gap-3">
          <Home className="h-8 w-8 text-skoolife-yellow-dark" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Bienvenue sur Skoolife
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Voici un aperçu rapide de votre tableau de bord
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Balance Card */}
        <Card className="border-skoolife-green/20 bg-skoolife-green-light/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Solde actuel</p>
                <p className={`text-2xl font-bold ${currentBalance >= 0 ? 'text-skoolife-green-dark' : 'text-skoolife-red-dark'}`}>
                  {currentBalance >= 0 ? '+' : ''}{currentBalance.toFixed(2)}€
                </p>
              </div>
              <Euro className={`h-8 w-8 ${currentBalance >= 0 ? 'text-skoolife-green' : 'text-skoolife-red'}`} />
            </div>
          </CardContent>
        </Card>

        {/* Budget Progress Card */}
        <Card className="border-skoolife-blue/20 bg-skoolife-blue-light/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Budget utilisé</p>
                <p className="text-2xl font-bold text-skoolife-blue-dark">{budgetProgress.toFixed(1)}%</p>
              </div>
              <Target className="h-8 w-8 text-skoolife-blue" />
            </div>
            <Progress 
              value={budgetProgress} 
              className="h-2 bg-skoolife-blue-light/30"
            />
          </CardContent>
        </Card>

        {/* Tasks Card */}
        <Card className="border-skoolife-yellow/20 bg-skoolife-yellow-light/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tâches</p>
                <p className="text-2xl font-bold text-skoolife-yellow-dark">
                  {completedTasks}/{tasks.length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-skoolife-yellow" />
            </div>
          </CardContent>
        </Card>

        {/* Urgent Tasks Card */}
        <Card className="border-skoolife-red/20 bg-skoolife-red-light/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Urgent</p>
                <p className="text-2xl font-bold text-skoolife-red-dark">{urgentTasksCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-skoolife-red" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border-skoolife-blue/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-skoolife-blue" />
              <h2 className="text-lg font-semibold">Activité récente</h2>
            </div>
            <div className="space-y-3">
              {recentTransactions.slice(0, 5).map((transaction: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    {transaction.type === 'income' ? (
                      <TrendingUp className="h-4 w-4 text-skoolife-green" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-skoolife-red" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{transaction.description}</p>
                      <p className="text-xs text-gray-500">{transaction.category}</p>
                    </div>
                  </div>
                  <div className={`font-medium ${
                    transaction.type === 'income' ? 'text-skoolife-green-dark' : 'text-skoolife-red-dark'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{Math.abs(transaction.amount).toFixed(2)}€
                  </div>
                </div>
              ))}
              
              {recentTransactions.length === 0 && (
                <p className="text-gray-500 text-center py-4">Aucune transaction récente</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="border-skoolife-yellow/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-skoolife-yellow" />
              <h2 className="text-lg font-semibold">Événements à venir</h2>
            </div>
            <div className="space-y-3">
              {upcomingEvents.slice(0, 5).map((event: any, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-skoolife-yellow-light/20 rounded-lg">
                  <div className="w-2 h-2 bg-skoolife-yellow rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{event.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.start).toLocaleDateString('fr-FR', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="text-xs border-skoolife-yellow text-skoolife-yellow-dark"
                  >
                    {event.type}
                  </Badge>
                </div>
              ))}
              
              {upcomingEvents.length === 0 && (
                <p className="text-gray-500 text-center py-4">Aucun événement prévu</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tasks Overview */}
        <Card className="border-skoolife-green/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-skoolife-green" />
              <h2 className="text-lg font-semibold">Aperçu des tâches</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Terminées</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-skoolife-green h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-skoolife-green-dark">{completedTasks}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">En attente</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-skoolife-blue h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${tasks.length > 0 ? (pendingTasks / tasks.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-skoolife-blue-dark">{pendingTasks}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Urgentes</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-skoolife-red h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${tasks.length > 0 ? (urgentTasksCount / tasks.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-skoolife-red-dark">{urgentTasksCount}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Documents */}
        <Card className="border-skoolife-red/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-skoolife-red" />
              <h2 className="text-lg font-semibold">Documents récents</h2>
            </div>
            <div className="space-y-3">
              {recentDocuments.slice(0, 5).map((doc: any, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-skoolife-red-light/20 rounded-lg">
                  <FileText className="h-4 w-4 text-skoolife-red" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{doc.title}</p>
                    <p className="text-xs text-gray-500">{doc.type}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="text-xs border-skoolife-red text-skoolife-red-dark"
                  >
                    Nouveau
                  </Badge>
                </div>
              ))}
              
              {recentDocuments.length === 0 && (
                <p className="text-gray-500 text-center py-4">Aucun document récent</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-skoolife-yellow/10">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button 
              className="bg-skoolife-yellow hover:bg-skoolife-yellow-dark text-black font-medium"
              onClick={() => console.log('Navigate to new task')}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Nouvelle tâche
            </Button>
            <Button 
              className="bg-skoolife-blue hover:bg-skoolife-blue-dark text-white font-medium"
              onClick={() => console.log('Navigate to add transaction')}
            >
              <Euro className="h-4 w-4 mr-2" />
              Ajouter transaction
            </Button>
            <Button 
              className="bg-skoolife-green hover:bg-skoolife-green-dark text-white font-medium"
              onClick={() => console.log('Navigate to new event')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Nouvel événement
            </Button>
            <Button 
              className="bg-skoolife-red hover:bg-skoolife-red-dark text-white font-medium"
              onClick={() => console.log('Navigate to add document')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Ajouter document
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeModule;
