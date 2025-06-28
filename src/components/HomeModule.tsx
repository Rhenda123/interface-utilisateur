import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, TrendingUp, TrendingDown, AlertCircle, CheckCircle, ArrowRight, Target, Wallet, FileText, Plus, ChevronRight, BarChart3, Users, Bell } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Tableau de Bord
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Vue d'ensemble de votre activité
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                En temps réel
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Balance */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200" onClick={() => onNavigate?.('finances')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Solde</p>
                    <p className={`text-xl font-bold ${currentBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      €{Math.abs(currentBalance).toLocaleString()}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200" onClick={() => onNavigate?.('todo')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tâches</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {pendingTasks}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          {/* Events */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200" onClick={() => onNavigate?.('planning')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Aujourd'hui</p>
                    <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      {todaysEvents.length}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200" onClick={() => onNavigate?.('documents')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Documents</p>
                    <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                      {documents.length}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Finance Overview */}
          <Card className="lg:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Finances</h3>
                <Button variant="ghost" size="sm" onClick={() => onNavigate?.('finances')}>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {/* Income */}
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Revenus</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Ce mois-ci</p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    €{currentMonthData.income.toLocaleString()}
                  </p>
                </div>

                {/* Expenses */}
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Dépenses</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Ce mois-ci</p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-red-600 dark:text-red-400">
                    €{currentMonthData.expenses.toLocaleString()}
                  </p>
                </div>

                {/* Net */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Solde net</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Ce mois-ci</p>
                    </div>
                  </div>
                  <p className={`text-lg font-bold ${currentBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    €{Math.abs(currentBalance).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tasks Overview */}
          <Card className="lg:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tâches</h3>
                <Button variant="ghost" size="sm" onClick={() => onNavigate?.('todo')}>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {/* Progress */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Progression</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
                    <div 
                      className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{completedTasks}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Terminées</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{pendingTasks}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">En cours</p>
                  </div>
                </div>

                {/* Urgent Tasks Alert */}
                {urgentTasks.length > 0 && (
                  <div className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <div>
                      <p className="font-medium text-red-700 dark:text-red-300">
                        {urgentTasks.length} tâche{urgentTasks.length !== 1 ? 's' : ''} urgente{urgentTasks.length !== 1 ? 's' : ''}
                      </p>
                      <p className="text-sm text-red-600 dark:text-red-400">À traiter en priorité</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Planning Overview */}
          <Card className="lg:col-span-2 xl:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Planning</h3>
                <Button variant="ghost" size="sm" onClick={() => onNavigate?.('planning')}>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {/* Today */}
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                    {todaysEvents.length}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Événements aujourd'hui</p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                    {new Date().toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long' 
                    })}
                  </p>
                </div>

                {/* Today's Events */}
                {todaysEvents.length > 0 ? (
                  <div className="space-y-2">
                    {todaysEvents.slice(0, 3).map((event: any, index: number) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {event.name}
                          </p>
                          <p className="text-xs text-purple-600 dark:text-purple-400">
                            {event.startTime} - {event.endTime}
                          </p>
                        </div>
                      </div>
                    ))}
                    {todaysEvents.length > 3 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        +{todaysEvents.length - 3} autre{todaysEvents.length - 3 !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Aucun événement prévu
                    </p>
                    <Button size="sm" onClick={() => onNavigate?.('planning')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter un événement
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions rapides</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="flex flex-col items-center space-y-2 h-auto py-4"
              onClick={() => onNavigate?.('finances')}
            >
              <Wallet className="w-6 h-6 text-green-600 dark:text-green-400" />
              <span className="text-sm">Ajouter transaction</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center space-y-2 h-auto py-4"
              onClick={() => onNavigate?.('todo')}
            >
              <Plus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="text-sm">Nouvelle tâche</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center space-y-2 h-auto py-4"
              onClick={() => onNavigate?.('planning')}
            >
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <span className="text-sm">Planifier événement</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center space-y-2 h-auto py-4"
              onClick={() => onNavigate?.('documents')}
            >
              <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              <span className="text-sm">Ajouter document</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeModule;
