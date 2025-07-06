import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
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
  const [carouselApi, setCarouselApi] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  // Auto-scroll effect for mobile carousel
  useEffect(() => {
    if (screenSize === 'mobile' && carouselApi) {
      const autoScroll = setInterval(() => {
        const nextSlide = (currentSlide + 1) % 3; // 3 content blocks
        setCurrentSlide(nextSlide);
        carouselApi.scrollTo(nextSlide);
      }, 4000); // Auto-scroll every 4 seconds

      return () => clearInterval(autoScroll);
    }
  }, [screenSize, carouselApi, currentSlide]);

  // Update current slide when carousel changes
  useEffect(() => {
    if (carouselApi) {
      const handleSelect = () => {
        setCurrentSlide(carouselApi.selectedScrollSnap());
      };
      
      carouselApi.on('select', handleSelect);
      return () => carouselApi.off('select', handleSelect);
    }
  }, [carouselApi]);

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
    { name: "Revenus", amount: currentMonthData.income, color: "#FFD51C" },
    { name: "Dépenses", amount: currentMonthData.expenses, color: "#F5B43C" },
  ];

  const taskData = [
    { name: "Faites", value: completedTasks, color: "#FFD51C" },
    { name: "À faire", value: pendingTasks, color: "#F5B43C" },
  ];

  // Content blocks for the carousel
  const contentBlocks = [
    // Finance Block
    <Card key="finance" className="border-skoolife-primary dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 h-full">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-skoolife-primary" />
            Finances
          </h3>
          <Button
            onClick={() => onNavigate?.('finances')}
            variant="ghost"
            size="sm"
            className="text-skoolife-primary hover:bg-skoolife-light dark:hover:bg-yellow-900/20 rounded-full p-2"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Modern Financial Overview */}
        <div className="space-y-4">
          {/* Income/Expense Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-skoolife-light dark:bg-yellow-900/20 rounded-xl p-4 border border-skoolife-primary/30 dark:border-yellow-700">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-skoolife-primary" />
                <span className="text-sm font-medium text-skoolife-primary dark:text-yellow-300">Revenus</span>
              </div>
              <div className="text-lg font-bold text-skoolife-primary dark:text-yellow-400">
                €{currentMonthData.income.toFixed(0)}
              </div>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-700">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-skoolife-secondary" />
                <span className="text-sm font-medium text-skoolife-secondary dark:text-orange-300">Dépenses</span>
              </div>
              <div className="text-lg font-bold text-skoolife-secondary dark:text-orange-400">
                €{currentMonthData.expenses.toFixed(0)}
              </div>
            </div>
          </div>

          {/* Budget Progress */}
          <div className="bg-gradient-to-r from-skoolife-light to-white dark:from-yellow-900/20 dark:to-gray-800 rounded-xl p-4 border border-skoolife-primary/30 dark:border-yellow-700/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Budget ce mois</span>
              <span className="text-sm font-semibold text-skoolife-primary">
                {budgetProgress.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
              <div 
                className="bg-gradient-to-r from-skoolife-primary to-skoolife-secondary h-3 rounded-full transition-all duration-500 relative overflow-hidden" 
                style={{ width: `${Math.min(budgetProgress, 100)}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>€{budgetSpent.toFixed(0)} utilisé</span>
              <span>€{totalBudget.toFixed(0)} total</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>,

    // Tasks Block
    <Card key="tasks" className="border-skoolife-primary dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 h-full">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-skoolife-primary" />
            Tâches
          </h3>
          <Button
            onClick={() => onNavigate?.('todo')}
            variant="ghost"
            size="sm"
            className="text-skoolife-primary hover:bg-skoolife-light dark:hover:bg-yellow-900/20 rounded-full p-2"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Modern Task Overview */}
        <div className="space-y-4">
          {/* Task Statistics Cards - Colors inversed */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-skoolife-light dark:bg-yellow-900/20 rounded-xl p-4 border border-skoolife-primary/30 dark:border-yellow-700">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-skoolife-primary" />
                <span className="text-sm font-medium text-skoolife-primary dark:text-yellow-300">À faire</span>
              </div>
              <div className="text-lg font-bold text-skoolife-primary dark:text-yellow-400">
                {pendingTasks}
              </div>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-700">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-skoolife-secondary" />
                <span className="text-sm font-medium text-skoolife-secondary dark:text-orange-300">Terminées</span>
              </div>
              <div className="text-lg font-bold text-skoolife-secondary dark:text-orange-400">
                {completedTasks}
              </div>
            </div>
          </div>

          {/* Recent Tasks Preview */}
          <div className="bg-gradient-to-r from-skoolife-light to-white dark:from-yellow-900/20 dark:to-gray-800 rounded-xl p-4 border border-skoolife-primary/30 dark:border-yellow-700/30">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Prochaines tâches</span>
            </div>
            <div className="space-y-2 max-h-24">
              {tasks.filter((task: any) => !task.completed).slice(0, 2).map((task: any, index: number) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${
                    task.priority === "Haute" ? "bg-skoolife-secondary" : 
                    task.priority === "Moyenne" ? "bg-skoolife-primary" : "bg-orange-300"
                  }`}></div>
                  <span className="text-gray-700 dark:text-gray-300 truncate flex-1">
                    {task.text}
                  </span>
                </div>
              ))}
              {tasks.filter((task: any) => !task.completed).length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-2">
                  Aucune tâche en attente
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>,

    // Planning Block
    <Card key="planning" className="border-skoolife-primary dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 h-full">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-skoolife-primary" />
            Planning
          </h3>
          <Button
            onClick={() => onNavigate?.('planning')}
            variant="ghost"
            size="sm"
            className="text-skoolife-primary hover:bg-skoolife-light dark:hover:bg-yellow-900/20 rounded-full p-2"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Modern Planning Overview with consistent colors */}
        <div className="space-y-4">
          {/* Event Statistics Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-skoolife-light dark:bg-yellow-900/20 rounded-xl p-4 border border-skoolife-primary/30 dark:border-yellow-700">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-skoolife-primary" />
                <span className="text-sm font-medium text-skoolife-primary dark:text-yellow-300">Aujourd'hui</span>
              </div>
              <div className="text-lg font-bold text-skoolife-primary dark:text-yellow-400">
                {todaysEvents.length}
              </div>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-700">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-skoolife-secondary" />
                <span className="text-sm font-medium text-skoolife-secondary dark:text-orange-300">This week</span>
              </div>
              <div className="text-lg font-bold text-skoolife-secondary dark:text-orange-400">
                {thisWeekEvents.length}
              </div>
            </div>
          </div>

          {/* Today's Events */}
          {todaysEvents.length > 0 && (
            <div className="bg-gradient-to-r from-skoolife-light to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-skoolife-primary dark:border-yellow-700">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-skoolife-primary dark:text-yellow-300">
                  Événements d'aujourd'hui
                </span>
              </div>
              <div className="space-y-2 max-h-24 overflow-y-auto">
                {todaysEvents.slice(0, 2).map((event: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-skoolife-primary rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white truncate">
                        {event.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {event.startTime} - {event.endTime}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Show message when no events */}
          {thisWeekEvents.length === 0 && todaysEvents.length === 0 && (
            <div className="bg-gradient-to-r from-skoolife-light to-white dark:from-yellow-900/20 dark:to-gray-800 rounded-xl p-4 border border-skoolife-primary/30 dark:border-yellow-700/30">
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-2">
                Aucun événement prévu
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  ];

  return (
    <div className="space-y-2 sm:space-y-3 pt-4 px-3 sm:px-4 lg:px-6 max-w-full overflow-hidden pb-6 h-screen overflow-y-hidden">
      <div className="text-center mb-2 sm:mb-3">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-skoolife-primary to-skoolife-secondary bg-clip-text text-transparent mb-1 sm:mb-2">
          Tableau de bord
        </h2>
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">
            Votre vue d'ensemble personnalisée
          </span>
        </div>
        {/* Real-time sync indicator */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-skoolife-primary rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Synchronisé en temps réel
          </span>
        </div>
      </div>

      {/* Enhanced Responsive Quick Stats Grid with SKOOLIFE colors */}
      <div className={`grid ${gridConfig.statsGrid} gap-3 sm:gap-4 mb-4 sm:mb-6`}>
        <Card 
          className="border-skoolife-primary dark:border-gray-700 shadow-lg bg-gradient-to-br from-white to-skoolife-light dark:from-gray-800 dark:to-gray-700 hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer touch-manipulation"
          onClick={() => onNavigate?.('finances')}
        >
          <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
            <div className="flex items-center justify-center mb-2 sm:mb-3">
              <TrendingUp className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 ${currentBalance >= 0 ? "text-skoolife-primary" : "text-skoolife-secondary"}`} />
            </div>
            <div className={`text-base sm:text-lg lg:text-2xl font-bold mb-1 sm:mb-2 ${
              currentBalance >= 0 ? "text-skoolife-primary dark:text-yellow-400" : "text-skoolife-secondary dark:text-orange-400"
            }`}>
              €{currentBalance.toFixed(0)}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              Solde Actuel
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-skoolife-primary dark:border-gray-700 shadow-lg bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-gray-700 hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer touch-manipulation"
          onClick={() => onNavigate?.('todo')}
        >
          <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
            <div className="flex items-center justify-center mb-2 sm:mb-3">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-skoolife-primary" />
            </div>
            <div className="text-base sm:text-lg lg:text-2xl font-bold text-skoolife-primary dark:text-yellow-400 mb-1 sm:mb-2">
              {pendingTasks}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              Tâches
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-skoolife-primary dark:border-gray-700 shadow-lg bg-gradient-to-br from-white to-skoolife-light dark:from-gray-800 dark:to-gray-700 hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer touch-manipulation"
          onClick={() => onNavigate?.('planning')}
        >
          <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
            <div className="flex items-center justify-center mb-2 sm:mb-3">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-skoolife-primary" />
            </div>
            <div className="text-base sm:text-lg lg:text-2xl font-bold text-skoolife-primary dark:text-yellow-400 mb-1 sm:mb-2">
              {todaysEvents.length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              Aujourd'hui
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-skoolife-primary dark:border-gray-700 shadow-lg bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-gray-700 hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer touch-manipulation"
          onClick={() => onNavigate?.('documents')}
        >
          <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
            <div className="flex items-center justify-center mb-2 sm:mb-3">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-skoolife-secondary" />
            </div>
            <div className="text-base sm:text-lg lg:text-2xl font-bold text-skoolife-secondary dark:text-orange-400 mb-1 sm:mb-2">
              {documents.length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              Documents
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Séparateur visuel */}
      <div className="my-4 sm:my-6">
        <Separator className="bg-skoolife-primary/20 dark:bg-gray-700" />
      </div>

      {/* Content Grid - Auto-scrolling Carousel on Mobile, Grid on Desktop/Tablet */}
      {screenSize === 'mobile' ? (
        <div className="relative mt-8">
          <Carousel 
            className="w-full"
            setApi={setCarouselApi}
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {contentBlocks.map((block, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-full">
                  <div className="h-full">
                    {block}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          
          {/* Carousel Indicators - Minimal spacing from bottom navigation */}
          <div className="flex justify-center mt-2 gap-2 mb-8">
            {contentBlocks.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? 'bg-skoolife-primary w-6' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
                onClick={() => {
                  setCurrentSlide(index);
                  carouselApi?.scrollTo(index);
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4">
          {contentBlocks}
        </div>
      )}
    </div>
  );
};

export default HomeModule;
