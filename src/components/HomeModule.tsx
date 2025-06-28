
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, TrendingUp, TrendingDown, AlertCircle, CheckCircle, ArrowRight, Target, Wallet, FileText } from "lucide-react";

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
          contentGrid: 'grid-cols-1 lg:grid-cols-2',
          chartHeight: 'h-32',
          showCharts: true
        };
    }
  };

  const gridConfig = getGridConfig();

  const financeData = [
    { name: "Revenus", amount: currentMonthData.income, color: "#10b981" },
    { name: "Dépenses", amount: currentMonthData.expenses, color: "#ef4444" },
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
        {/* Real-time sync indicator */}
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Synchronisé en temps réel
          </span>
        </div>
      </div>

      {/* Enhanced Responsive Quick Stats Grid with real-time updates */}
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

      {/* Enhanced Responsive Content Grid - Updated to show 3 cards in a row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* NEW Modern Finance Overview with timeline design */}
        <Card className="border-[#F6C103] dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#F6C103]" />
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
            
            {/* Modern Financial Timeline Design */}
            <div className="space-y-6">
              {/* Income Section with Timeline Design */}
              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900 dark:text-white">Revenus</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Ce mois-ci</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      €{currentMonthData.income.toFixed(0)}
                    </div>
                  </div>
                </div>

                {/* Vertical line connector */}
                <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-green-300 to-red-300 dark:from-green-600 dark:to-red-600"></div>
              </div>

              {/* Expenses Section */}
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg">
                    <TrendingDown className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900 dark:text-white">Dépenses</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Ce mois-ci</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      €{currentMonthData.expenses.toFixed(0)}
                    </div>
                  </div>
                </div>

                {/* Always show Budget Progress Section */}
                <div className="flex justify-center">
                  <div className="w-full max-w-md bg-white dark:bg-gray-900/50 rounded-2xl p-6 border-2 border-gradient-to-r from-[#F6C103] to-[#E5AC00] shadow-lg">
                    <div className="text-center mb-6">
                      <h5 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        Budget utilisé
                      </h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Ce mois-ci
                      </p>
                    </div>
                    
                    {totalBudget > 0 ? (
                      <>
                        <div className="relative mb-3">
                          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-4 shadow-inner">
                            <div 
                              className="bg-gradient-to-r from-[#F6C103] via-[#E5AC00] to-[#D4A200] h-4 rounded-full transition-all duration-700 ease-in-out shadow-lg relative overflow-hidden" 
                              style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress percentage indicator - moved below the bar */}
                        <div className="text-center mb-4">
                          <div className="bg-gradient-to-r from-[#F6C103] to-[#E5AC00] text-white text-sm font-bold px-4 py-1 rounded-full shadow-lg inline-block">
                            {budgetProgress.toFixed(0)}%
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <div className="text-center">
                            <div className="font-bold text-red-600 dark:text-red-400">
                              €{budgetSpent.toFixed(0)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Dépensé
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-gray-600 dark:text-gray-300">
                              €{totalBudget.toFixed(0)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Budget total
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="relative mb-3">
                          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-4 shadow-inner">
                            <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded-full w-0"></div>
                          </div>
                        </div>
                        
                        {/* Progress percentage indicator - moved below the bar */}
                        <div className="text-center mb-4">
                          <div className="bg-gray-400 dark:bg-gray-600 text-white text-sm font-bold px-4 py-1 rounded-full shadow-lg inline-block">
                            0%
                          </div>
                        </div>
                        
                        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                          Aucun budget configuré
                        </div>
                        <div className="flex justify-center">
                          <Button
                            onClick={() => onNavigate?.('finances')}
                            size="sm"
                            className="text-xs px-4 py-2 rounded-full bg-gradient-to-r from-[#F6C103] to-[#E5AC00] text-white hover:from-[#E5AC00] hover:to-[#D4A200]"
                          >
                            Créer un budget
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NEW Modern Tasks Overview with timeline design */}
        <Card className="border-[#F6C103] dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-500" />
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
            
            {/* Modern Tasks Timeline Design */}
            <div className="space-y-6">
              {/* Pending Tasks Section */}
              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900 dark:text-white">À faire</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tâches en attente</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {pendingTasks}
                    </div>
                  </div>
                </div>

                {/* Urgent Tasks Alert */}
                {urgentTasks.length > 0 && (
                  <div className="ml-16 mb-4">
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border-l-4 border-red-500">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-medium text-red-700 dark:text-red-300">
                          {urgentTasks.length} tâche{urgentTasks.length !== 1 ? 's' : ''} urgente{urgentTasks.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent Tasks Preview */}
                {tasks.filter((task: any) => !task.completed).length > 0 && (
                  <div className="ml-16">
                    <div className="space-y-2">
                      {tasks.filter((task: any) => !task.completed).slice(0, 2).map((task: any, index: number) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                          <div className={`w-3 h-3 rounded-full ${
                            task.priority === "Haute" ? "bg-red-500" : 
                            task.priority === "Moyenne" ? "bg-yellow-500" : "bg-green-500"
                          }`}></div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-white text-sm truncate">
                              {task.text}
                            </div>
                            <div className="text-xs text-blue-600 dark:text-blue-400">
                              Priorité {task.priority?.toLowerCase() || 'normale'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vertical line connector */}
                <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 to-green-300 dark:from-blue-600 dark:to-green-600"></div>
              </div>

              {/* Completed Tasks Section */}
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900 dark:text-white">Terminées</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tâches accomplies</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {completedTasks}
                    </div>
                  </div>
                </div>

                {/* Centered and Modern Progress Summary */}
                <div className="flex justify-center">
                  <div className="w-full max-w-md bg-white dark:bg-gray-900/50 rounded-2xl p-6 border-2 border-gradient-to-r from-green-400 to-blue-500 shadow-lg">
                    <div className="text-center mb-6">
                      <h5 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        Progression globale
                      </h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Toutes vos tâches
                      </p>
                    </div>
                    
                    <div className="relative mb-3">
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-4 shadow-inner">
                        <div 
                          className="bg-gradient-to-r from-green-500 via-green-400 to-blue-500 h-4 rounded-full transition-all duration-700 ease-in-out shadow-lg relative overflow-hidden" 
                          style={{ width: `${tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress percentage indicator - moved below the bar */}
                    <div className="text-center mb-4">
                      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm font-bold px-4 py-1 rounded-full shadow-lg inline-block">
                        {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <div className="text-center">
                        <div className="font-bold text-green-600 dark:text-green-400">
                          {completedTasks}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Terminées
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-gray-600 dark:text-gray-300">
                          {tasks.length}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Total
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Planning Overview - Keep existing modern design */}
        <Card className="border-[#F6C103] dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
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
            
            {/* Modern Timeline Design */}
            <div className="space-y-6">
              {/* Today Section with Timeline Design */}
              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900 dark:text-white">Aujourd'hui</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date().toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long' 
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {todaysEvents.length}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      événement{todaysEvents.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                {/* Today's Events Preview */}
                {todaysEvents.length > 0 ? (
                  <div className="ml-16 space-y-2">
                    {todaysEvents.slice(0, 2).map((event: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white text-sm">
                            {event.name}
                          </div>
                          <div className="text-xs text-purple-600 dark:text-purple-400">
                            {event.startTime} - {event.endTime}
                          </div>
                        </div>
                      </div>
                    ))}
                    {todaysEvents.length > 2 && (
                      <div className="ml-6 text-xs text-gray-500 dark:text-gray-400">
                        +{todaysEvents.length - 2} autre{todaysEvents.length - 2 !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="ml-16 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      Aucun événement prévu
                    </p>
                  </div>
                )}

                {/* Vertical line connector */}
                <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-purple-300 to-indigo-300 dark:from-purple-600 dark:to-indigo-600"></div>
              </div>

              {/* This Week Section */}
              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full shadow-lg">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900 dark:text-white">Cette semaine</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Du {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} au {new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {thisWeekEvents.length}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      événement{thisWeekEvents.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                {/* Weekly Events Summary */}
                {thisWeekEvents.length > 0 ? (
                  <div className="ml-16">
                    <div className="grid grid-cols-7 gap-1 mb-3">
                      {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => {
                        const dayEvents = thisWeekEvents.filter(event => {
                          const eventDate = new Date(event.date);
                          const weekStart = new Date();
                          weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1 + index);
                          return eventDate.toDateString() === weekStart.toDateString();
                        });
                        
                        return (
                          <div key={day} className="text-center">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{day}</div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                              dayEvents.length > 0 
                                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-300 dark:border-indigo-600' 
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                            }`}>
                              {dayEvents.length || ''}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Quick Action */}
                    <div className="flex items-center justify-center">
                      <Button
                        onClick={() => onNavigate?.('planning')}
                        variant="outline"
                        size="sm"
                        className="text-xs px-4 py-2 rounded-full border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                      >
                        Voir le planning complet
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="ml-16 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-3">
                      Semaine libre
                    </p>
                    <div className="flex justify-center">
                      <Button
                        onClick={() => onNavigate?.('planning')}
                        size="sm"
                        className="text-xs px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600"
                      >
                        Planifier un événement
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomeModule;
