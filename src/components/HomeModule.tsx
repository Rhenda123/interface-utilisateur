import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, TrendingUp, TrendingDown, AlertCircle, CheckCircle, ArrowRight, Target, Wallet, FileText, Plus, ChevronRight } from "lucide-react";

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
  const [lastUpdate, setLastUpdate] = useState(Date.now());

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

  // Enhanced data loading with better error handling and performance
  const loadAllData = () => {
    try {
      console.log('Loading all data for Home dashboard synchronization...');
      
      // Load tasks
      const savedTasks = localStorage.getItem("skoolife_tasks");
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks);
        console.log('Tasks loaded:', parsedTasks.length);
      }

      // Load events
      const savedEvents = localStorage.getItem("skoolife_events");
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents);
        setEvents(parsedEvents);
        console.log('Events loaded:', parsedEvents.length);
      }

      // Load documents with deduplication
      const savedDocuments = localStorage.getItem("skoolife_documents");
      if (savedDocuments) {
        const parsedDocs = JSON.parse(savedDocuments);
        const uniqueDocs = parsedDocs.filter((doc: any, index: number, self: any[]) => 
          index === self.findIndex((d: any) => d.id === doc.id)
        );
        setDocuments(uniqueDocs);
        console.log('Documents loaded:', uniqueDocs.length);
      }

      // Load forum posts
      const savedPosts = localStorage.getItem("skoolife_forum_posts");
      if (savedPosts) {
        const parsedPosts = JSON.parse(savedPosts);
        setPosts(parsedPosts);
        console.log('Forum posts loaded:', parsedPosts.length);
      }

      // Load financial data
      const savedFinances = localStorage.getItem("skoolife_finances");
      if (savedFinances) {
        const parsedFinances = JSON.parse(savedFinances);
        setFinances(parsedFinances);
        console.log('Finances loaded:', parsedFinances);
      }

      // Load transactions
      const savedTransactions = localStorage.getItem("skoolife_transactions");
      if (savedTransactions) {
        const parsedTransactions = JSON.parse(savedTransactions);
        setTransactions(parsedTransactions);
        console.log('Transactions loaded:', parsedTransactions.length);
      }

      // Load budgets
      const savedBudgets = localStorage.getItem("skoolife_budgets");
      if (savedBudgets) {
        const parsedBudgets = JSON.parse(savedBudgets);
        setBudgets(parsedBudgets);
        console.log('Budgets loaded:', parsedBudgets.length);
      }

      setLastUpdate(Date.now());
      console.log('All data loaded successfully for Home dashboard');
    } catch (error) {
      console.error('Error loading data for Home dashboard:', error);
    }
  };

  useEffect(() => {
    // Initial data load
    loadAllData();

    // Enhanced real-time synchronization with multiple listeners
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.newValue) {
        console.log('Storage change detected:', e.key);
        try {
          switch (e.key) {
            case "skoolife_finances":
              const newFinances = JSON.parse(e.newValue);
              setFinances(newFinances);
              console.log('Home: Finances updated from storage');
              break;
            case "skoolife_tasks":
              const newTasks = JSON.parse(e.newValue);
              setTasks(newTasks);
              console.log('Home: Tasks updated from storage');
              break;
            case "skoolife_events":
              const newEvents = JSON.parse(e.newValue);
              setEvents(newEvents);
              console.log('Home: Events updated from storage');
              break;
            case "skoolife_documents":
              const parsedDocs = JSON.parse(e.newValue);
              const uniqueDocs = parsedDocs.filter((doc: any, index: number, self: any[]) => 
                index === self.findIndex((d: any) => d.id === doc.id)
              );
              setDocuments(uniqueDocs);
              console.log('Home: Documents updated from storage');
              break;
            case "skoolife_forum_posts":
              const newPosts = JSON.parse(e.newValue);
              setPosts(newPosts);
              console.log('Home: Forum posts updated from storage');
              break;
            case "skoolife_transactions":
              const newTransactions = JSON.parse(e.newValue);
              setTransactions(newTransactions);
              console.log('Home: Transactions updated from storage');
              break;
            case "skoolife_budgets":
              const newBudgets = JSON.parse(e.newValue);
              setBudgets(newBudgets);
              console.log('Home: Budgets updated from storage');
              break;
          }
          setLastUpdate(Date.now());
        } catch (error) {
          console.error('Error parsing storage data in Home:', error);
        }
      }
    };

    // Custom event listeners for direct module updates
    const handleFinanceUpdate = (e: CustomEvent) => {
      console.log('Home: Finance update event received');
      setFinances(e.detail);
      setLastUpdate(Date.now());
    };
    
    const handleTaskUpdate = (e: CustomEvent) => {
      console.log('Home: Task update event received');
      setTasks(e.detail);
      setLastUpdate(Date.now());
    };

    const handleEventUpdate = (e: CustomEvent) => {
      console.log('Home: Event update event received');
      setEvents(e.detail);
      setLastUpdate(Date.now());
    };

    const handleDocumentUpdate = (e: CustomEvent) => {
      console.log('Home: Document update event received');
      const uniqueDocs = e.detail.filter((doc: any, index: number, self: any[]) => 
        index === self.findIndex((d: any) => d.id === doc.id)
      );
      setDocuments(uniqueDocs);
      setLastUpdate(Date.now());
    };
    
    const handleDataUpdate = () => {
      console.log('Home: General data update event received');
      loadAllData();
    };

    // Register all event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('financeUpdate', handleFinanceUpdate as EventListener);
    window.addEventListener('taskUpdate', handleTaskUpdate as EventListener);
    window.addEventListener('eventUpdate', handleEventUpdate as EventListener);
    window.addEventListener('documentUpdate', handleDocumentUpdate as EventListener);
    window.addEventListener('dataUpdate', handleDataUpdate);

    // Enhanced polling for cross-tab synchronization (more frequent for better UX)
    const intervalId = setInterval(() => {
      loadAllData();
    }, 2000); // Check every 2 seconds for better responsiveness

    // Focus-based synchronization for when user returns to tab
    const handleFocus = () => {
      console.log('Home: Window focus detected, refreshing data');
      loadAllData();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('financeUpdate', handleFinanceUpdate as EventListener);
      window.removeEventListener('taskUpdate', handleTaskUpdate as EventListener);
      window.removeEventListener('eventUpdate', handleEventUpdate as EventListener);
      window.removeEventListener('documentUpdate', handleDocumentUpdate as EventListener);
      window.removeEventListener('dataUpdate', handleDataUpdate);
      window.removeEventListener('focus', handleFocus);
      clearInterval(intervalId);
    };
  }, []);

  // Enhanced calculations with better error handling and real-time updates
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

  // Calculate current month's financial data from transactions (same logic as FinanceModule)
  const calculateCurrentMonthData = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    const currentMonthTransactions = transactions.filter(t => {
      try {
        const tDate = new Date(t.date);
        return tDate.getFullYear() === currentYear && tDate.getMonth() === currentMonth;
      } catch (error) {
        return false;
      }
    });

    const income = currentMonthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + (t.amount || 0), 0);
    const expenses = currentMonthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + (t.amount || 0), 0);
    const net = income - expenses;

    console.log('Current month calculation - Income:', income, 'Expenses:', expenses, 'Net:', net);

    return { income, expenses, net };
  };

  // Get today's day name in French format matching ScheduleModule exactly
  const getTodayDayName = () => {
    const today = new Date();
    const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const dayName = dayNames[today.getDay()];
    // Capitalize first letter to match ScheduleModule format
    return dayName.charAt(0).toUpperCase() + dayName.slice(1);
  };

  // Fixed getCurrentWeekRange using the user's pseudo-code approach
  const getCurrentWeekRange = () => {
    const today = new Date();
    const dayOfWeek = today.getDay() || 7; // Make Sunday 7 as per user's suggestion
    
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + 1);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    
    console.log('Week range calculation (using user pseudo-code):');
    console.log('Today:', today.toDateString());
    console.log('Monday start:', monday.toDateString(), monday.toISOString());
    console.log('Sunday end:', sunday.toDateString(), sunday.toISOString());
    
    return { monday, sunday };
  };

  // Real-time calculations that update automatically
  const completedTasks = tasks.filter((task: any) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  
  // Use transaction-based calculation for current balance (same as FinanceModule)
  const currentMonthData = calculateCurrentMonthData();
  const currentBalance = currentMonthData.net;
  
  const currentBudgets = calculateCurrentMonthBudgetData();
  const totalBudget = currentBudgets.reduce((sum: number, budget: any) => sum + (budget.limit || 0), 0);
  const budgetSpent = currentBudgets.reduce((sum: number, budget: any) => sum + (budget.spent || 0), 0);
  const budgetProgress = totalBudget > 0 ? (budgetSpent / totalBudget) * 100 : 0;
  
  // Only count tasks with "Haute" priority as urgent
  const urgentTasks = tasks.filter((task: any) => 
    !task.completed && task.priority === "Haute"
  );

  // Enhanced today's events calculation with better matching
  const todayDayName = getTodayDayName();
  const todaysEvents = events.filter((event: any) => {
    const eventDay = event.day?.toLowerCase?.();
    const todayDay = todayDayName.toLowerCase();
    console.log('Checking event:', event.name, 'Event day:', eventDay, 'Today:', todayDay);
    return eventDay === todayDay;
  });
  
  console.log('Today is:', todayDayName);
  console.log('All events:', events);
  console.log('Today\'s events:', todaysEvents);

  // Fixed this week events calculation using actual event dates
  const thisWeekEvents = events.filter((event: any) => {
    // Skip events without valid date property
    if (!event.date || typeof event.date !== 'string') {
      console.log('Event skipped - no valid date:', event);
      return false;
    }

    try {
      const { monday, sunday } = getCurrentWeekRange();
      const eventDate = new Date(event.date);
      
      // Ensure eventDate is valid
      if (isNaN(eventDate.getTime())) {
        console.log('Event skipped - invalid date format:', event.date, 'for event:', event.name);
        return false;
      }
      
      // Check if the event date is within the current week range
      const isInCurrentWeek = eventDate >= monday && eventDate <= sunday;
      
      console.log('Event:', event.name, 'Date:', event.date, 'Parsed:', eventDate.toDateString(), 'In current week:', isInCurrentWeek);
      
      return isInCurrentWeek;
    } catch (error) {
      console.log('Error processing event date:', event.name, error);
      return false;
    }
  });

  console.log('Current week range:', getCurrentWeekRange());
  console.log('This week events (using actual dates):', thisWeekEvents.length, 'events:', thisWeekEvents.map(e => ({ name: e.name, date: e.date })));

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 via-transparent to-orange-50/30 dark:from-yellow-900/20 dark:to-orange-900/10"></div>
        <div className="relative px-6 py-16 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  Tableau de Bord
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300 sm:text-xl">
                Votre vue d'ensemble personnalisée pour gérer efficacement votre vie étudiante
              </p>
              
              {/* Real-time sync indicator */}
              <div className="mt-8 flex items-center justify-center">
                <div className="flex items-center gap-3 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                  <div className="relative">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Synchronisé en temps réel
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="relative -mt-8 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Enhanced Stats Grid */}
        <div className={`grid ${gridConfig.statsGrid} gap-6 mb-12`}>
          {/* Balance Card */}
          <Card className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer" onClick={() => onNavigate?.('finances')}>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-emerald-600/5"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Solde Actuel</p>
                <div className={`text-3xl font-bold ${currentBalance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                  €{Math.abs(currentBalance).toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${currentBalance >= 0 ? "bg-emerald-500" : "bg-red-500"}`}></div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {budgetProgress.toFixed(0)}% du budget utilisé
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tasks Card */}
          <Card className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer" onClick={() => onNavigate?.('todo')}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-600/5"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Tâches</p>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {pendingTasks}
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${urgentTasks.length > 0 ? "bg-red-500" : "bg-emerald-500"}`}></div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {urgentTasks.length} urgente{urgentTasks.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Events Card */}
          <Card className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer" onClick={() => onNavigate?.('planning')}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-purple-600/5"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Aujourd'hui</p>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {todaysEvents.length}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {thisWeekEvents.length} cette semaine
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents Card */}
          <Card className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer" onClick={() => onNavigate?.('documents')}>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-orange-600/5"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Documents</p>
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {documents.length}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {recentDocuments.length} récent{recentDocuments.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Content Cards */}
        <div className={`grid ${gridConfig.contentGrid} gap-8 pb-16`}>
          {/* Finance Overview */}
          <Card className="relative overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-600/5"></div>
            <CardContent className="relative p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Finances</h3>
                </div>
                <Button
                  onClick={() => onNavigate?.('finances')}
                  variant="ghost"
                  size="sm"
                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl p-2"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-8">
                {/* Income */}
                <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 border border-emerald-200/50 dark:border-emerald-700/30">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500 shadow-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">Revenus</h4>
                      <p className="text-sm text-slate-500 dark:text-gray-400">Ce mois-ci</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    €{currentMonthData.income.toLocaleString()}
                  </div>
                </div>

                {/* Expenses */}
                <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10 border border-red-200/50 dark:border-red-700/30">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-500 shadow-lg">
                      <TrendingDown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">Dépenses</h4>
                      <p className="text-sm text-slate-500 dark:text-gray-400">Ce mois-ci</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    €{currentMonthData.expenses.toLocaleString()}
                  </div>
                </div>

                {/* Budget Progress */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 border border-slate-200/50 dark:border-slate-600/30">
                  <div className="text-center mb-6">
                    <h5 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      Budget utilisé
                    </h5>
                    <p className="text-sm text-slate-500 dark:text-gray-400">
                      Ce mois-ci
                    </p>
                  </div>
                  
                  {totalBudget > 0 ? (
                    <>
                      <div className="relative mb-4">
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 shadow-inner">
                          <div 
                            className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-sm relative overflow-hidden" 
                            style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress percentage indicator - moved below the bar */}
                      <div className="text-center mb-4">
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold px-4 py-1 rounded-full shadow-lg inline-block">
                          {budgetProgress.toFixed(0)}%
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <div className="text-center">
                          <div className="font-bold text-red-600 dark:text-red-400">
                            €{budgetSpent.toFixed(0)}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-gray-400">
                            Dépensé
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-slate-600 dark:text-gray-300">
                            €{totalBudget.toFixed(0)}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-gray-400">
                            Budget total
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="relative mb-4">
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 shadow-inner">
                          <div className="bg-slate-300 dark:bg-slate-600 h-3 rounded-full w-0"></div>
                        </div>
                      </div>
                      
                      {/* Progress percentage indicator - moved below the bar */}
                      <div className="text-center mb-4">
                        <div className="bg-slate-400 dark:bg-slate-600 text-white text-sm font-bold px-4 py-1 rounded-full shadow-lg inline-block">
                          0%
                        </div>
                      </div>
                      
                      <div className="text-center text-sm text-slate-500 dark:text-gray-400 mb-3">
                        Aucun budget configuré
                      </div>
                      <div className="flex justify-center">
                        <Button
                          onClick={() => onNavigate?.('finances')}
                          size="sm"
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 rounded-xl px-6 py-2 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Créer un budget
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tasks Overview */}
          <Card className="relative overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-600/5"></div>
            <CardContent className="relative p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Tâches</h3>
                </div>
                <Button
                  onClick={() => onNavigate?.('todo')}
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl p-2"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Progress Overview */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 border border-slate-200/50 dark:border-slate-600/30">
                  <div className="text-center mb-6">
                    <h5 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      Progression globale
                    </h5>
                    <p className="text-sm text-slate-500 dark:text-gray-400">
                      Toutes vos tâches
                    </p>
                  </div>
                  
                  <div className="relative mb-4">
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 shadow-inner">
                      <div 
                        className="bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-sm relative overflow-hidden" 
                        style={{ width: `${tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress percentage indicator - moved below the bar */}
                  <div className="text-center mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-bold px-4 py-1 rounded-full shadow-lg inline-block">
                      {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-center">
                      <div className="font-bold text-blue-600 dark:text-blue-400">
                        {completedTasks}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-gray-400">
                        Terminées
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-slate-600 dark:text-gray-300">
                        {tasks.length}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-gray-400">
                        Total
                      </div>
                    </div>
                  </div>
                </div>

                {/* Urgent Tasks Alert */}
                {urgentTasks.length > 0 && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10 border border-red-200/50 dark:border-red-700/30">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="font-medium text-red-700 dark:text-red-300">
                          {urgentTasks.length} tâche{urgentTasks.length !== 1 ? 's' : ''} urgente{urgentTasks.length !== 1 ? 's' : ''}
                        </p>
                        <p className="text-sm text-red-600 dark:text-red-400">
                          Nécessite votre attention
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent Tasks Preview */}
                {tasks.filter((task: any) => !task.completed).length > 0 && (
                  <div className="space-y-3">
                    <h6 className="text-sm font-medium text-slate-600 dark:text-slate-400">Tâches récentes</h6>
                    {tasks.filter((task: any) => !task.completed).slice(0, 2).map((task: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/30 hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-colors duration-200">
                        <div className={`w-3 h-3 rounded-full ${
                          task.priority === "Haute" ? "bg-red-500" : 
                          task.priority === "Moyenne" ? "bg-yellow-500" : "bg-green-500"
                        }`}></div>
                        <div className="flex-1">
                          <div className="font-medium text-slate-900 dark:text-white text-sm truncate">
                            {task.text}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            Priorité {task.priority?.toLowerCase() || 'normale'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Planning Overview */}
          <Card className="relative overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-purple-600/5"></div>
            <CardContent className="relative p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Planning</h3>
                </div>
                <Button
                  onClick={() => onNavigate?.('planning')}
                  variant="ghost"
                  size="sm"
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl p-2"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Today's Events */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 border border-purple-200/50 dark:border-purple-700/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-500 shadow-md">
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">Aujourd'hui</h4>
                        <p className="text-sm text-slate-600 dark:text-gray-400">
                          {new Date().toLocaleDateString('fr-FR', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long' 
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {todaysEvents.length}
                    </div>
                  </div>

                  {todaysEvents.length > 0 ? (
                    <div className="space-y-2">
                      {todaysEvents.slice(0, 2).map((event: any, index: number) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-slate-800/30 border border-purple-200/30 dark:border-purple-600/20">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-900 dark:text-white text-sm">
                              {event.name}
                            </div>
                            <div className="text-xs text-purple-600 dark:text-purple-400">
                              {event.startTime} - {event.endTime}
                            </div>
                          </div>
                        </div>
                      ))}
                      {todaysEvents.length > 2 && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 text-center pt-2">
                          +{todaysEvents.length - 2} autre{todaysEvents.length - 2 !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                        Aucun événement prévu
                      </p>
                      <div className="flex justify-center">
                        <Button
                          onClick={() => onNavigate?.('planning')}
                          size="sm"
                          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 rounded-xl px-4 py-2 text-xs font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Planifier un événement
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Weekly Overview */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 border border-slate-200/50 dark:border-slate-600/30">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">Cette semaine</h4>
                      <p className="text-sm text-slate-600 dark:text-gray-400">
                        {thisWeekEvents.length} événement{thisWeekEvents.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => {
                      const dayEvents = thisWeekEvents.filter(event => {
                        const eventDate = new Date(event.date);
                        const weekStart = new Date();
                        weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1 + index);
                        return eventDate.toDateString() === weekStart.toDateString();
                      });
                      
                      return (
                        <div key={day} className="text-center">
                          <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">{day}</div>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-200 ${
                            dayEvents.length > 0 
                              ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md' 
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                          }`}>
                            {dayEvents.length || ''}
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
