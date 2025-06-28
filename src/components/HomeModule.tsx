
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, BookOpen, Calendar, CreditCard, MessageSquare, CheckSquare, TrendingUp, Clock, Users, FileText, Plus } from "lucide-react";

interface HomeModuleProps {
  onNavigate: (view: string) => void;
}

function HomeModule({ onNavigate }: HomeModuleProps) {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [tasksCount, setTasksCount] = useState(0);
  const [eventsThisWeek, setEventsThisWeek] = useState(0);
  const [documentsCount, setDocumentsCount] = useState(0);
  const [forumPostsCount, setForumPostsCount] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

  useEffect(() => {
    console.log("Loading all data for Home dashboard synchronization...");
    loadAllData();
    
    // Listen for updates from other modules
    const handleEventUpdate = () => {
      loadEvents();
    };
    
    window.addEventListener('eventUpdate', handleEventUpdate);
    
    return () => {
      window.removeEventListener('eventUpdate', handleEventUpdate);
    };
  }, []);

  const loadAllData = () => {
    loadTasks();
    loadEvents();
    loadDocuments();
    loadForumPosts();
    loadFinances();
    console.log("All data loaded successfully for Home dashboard");
  };

  const loadTasks = () => {
    const saved = localStorage.getItem("skoolife_tasks");
    const tasks = saved ? JSON.parse(saved) : [];
    setTasksCount(tasks.length);
    console.log("Tasks loaded:", tasks.length);
  };

  const loadEvents = () => {
    const saved = localStorage.getItem("skoolife_events");
    const events = saved ? JSON.parse(saved) : [];
    
    console.log("All events:", events);
    
    // Calculate events for this week
    const today = new Date();
    console.log("Week range calculation (using user pseudo-code):");
    console.log("Today:", today.toDateString());
    
    const dayOfWeek = today.getDay() || 7; // Make Sunday 7
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + 1);
    monday.setHours(0, 0, 0, 0);
    console.log("Monday start:", monday.toDateString(), monday.toISOString());
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    console.log("Sunday end:", sunday.toDateString(), sunday.toISOString());
    
    console.log("Current week range:", {
      monday: { _type: "Date", value: { iso: monday.toISOString(), value: monday.getTime(), local: monday.toString() }},
      sunday: { _type: "Date", value: { iso: sunday.toISOString(), value: sunday.getTime(), local: sunday.toString() }}
    });
    
    const eventsThisWeekFiltered = events.filter((event: any) => {
      if (!event.date) return false;
      const eventDate = new Date(event.date);
      return eventDate >= monday && eventDate <= sunday;
    });
    
    console.log("This week events (using actual dates):", eventsThisWeekFiltered.length, "events:", eventsThisWeekFiltered);
    setEventsThisWeek(eventsThisWeekFiltered.length);
    
    // Get upcoming events (next 7 days from today)
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    nextWeek.setHours(23, 59, 59, 999);
    
    const upcomingEventsFiltered = events
      .filter((event: any) => {
        if (!event.date) return false;
        const eventDate = new Date(event.date);
        return eventDate >= today && eventDate <= nextWeek;
      })
      .sort((a: any, b: any) => {
        const dateA = new Date(a.date + 'T' + a.startTime);
        const dateB = new Date(b.date + 'T' + b.startTime);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 3);
    
    setUpcomingEvents(upcomingEventsFiltered);
  };

  const loadDocuments = () => {
    const saved = localStorage.getItem("skoolife_documents");
    const documents = saved ? JSON.parse(saved) : [];
    setDocumentsCount(documents.length);
    console.log("Documents loaded:", documents.length);
  };

  const loadForumPosts = () => {
    const saved = localStorage.getItem("skoolife_forum_posts");
    const posts = saved ? JSON.parse(saved) : [];
    setForumPostsCount(posts.length);
    console.log("Forum posts loaded:", posts.length);
  };

  const loadFinances = () => {
    const savedTransactions = localStorage.getItem("skoolife_transactions");
    const savedBudgets = localStorage.getItem("skoolife_budgets");
    
    const transactions = savedTransactions ? JSON.parse(savedTransactions) : [];
    const budgets = savedBudgets ? JSON.parse(savedBudgets) : [];
    
    // Calculate current month totals
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = transactions.filter((t: any) => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });
    
    const income = monthlyTransactions
      .filter((t: any) => t.type === 'income')
      .reduce((sum: number, t: any) => sum + t.amount, 0);
    
    const expenses = monthlyTransactions
      .filter((t: any) => t.type === 'expense')
      .reduce((sum: number, t: any) => sum + t.amount, 0);
    
    setTotalIncome(income);
    setTotalExpenses(expenses);
    
    console.log("Transactions loaded:", transactions.length);
    console.log("Budgets loaded:", budgets.length);
    console.log("Current month calculation - Income:", income, "Expenses:", expenses, "Net:", income - expenses);
  };

  // Get today's day name in French
  const getTodayName = () => {
    const today = new Date();
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return days[today.getDay()];
  };

  const todayName = getTodayName();
  console.log("Today is:", todayName);

  // Get today's events
  const getTodaysEvents = () => {
    const saved = localStorage.getItem("skoolife_events");
    const events = saved ? JSON.parse(saved) : [];
    const today = new Date().toISOString().split('T')[0];
    
    const todaysEvents = events.filter((event: any) => event.date === today);
    console.log("Today's events:", todaysEvents);
    return todaysEvents;
  };

  const todaysEvents = getTodaysEvents();

  const quickActions = [
    { icon: Plus, label: "Nouveau Cours", action: () => onNavigate("planning"), color: "bg-blue-500" },
    { icon: CheckSquare, label: "Nouvelle Tâche", action: () => onNavigate("todo"), color: "bg-green-500" },
    { icon: CreditCard, label: "Ajouter Dépense", action: () => onNavigate("finances"), color: "bg-red-500" },
    { icon: FileText, label: "Upload Document", action: () => onNavigate("documents"), color: "bg-purple-500" }
  ];

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Welcome Header */}
      <div className="text-center lg:text-left">
        <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Bienvenue sur SKOOLIFE
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">
          Gérez votre vie étudiante en toute simplicité
        </p>
      </div>

      {/* Today's Overview */}
      <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-gradient-to-br from-yellow-50 to-white dark:from-gray-800 dark:to-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Calendar className="w-5 h-5" />
            Aujourd'hui - {todayName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todaysEvents.length > 0 ? (
            <div className="space-y-2">
              {todaysEvents.slice(0, 3).map((event: any, index: number) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: event.color }}></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{event.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{event.startTime} - {event.endTime}</p>
                  </div>
                </div>
              ))}
              {todaysEvents.length > 3 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                  +{todaysEvents.length - 3} autres événements
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center py-4">
              Aucun événement prévu aujourd'hui
            </p>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate("finances")}>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="p-2 lg:p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <TrendingUp className="w-4 h-4 lg:w-6 lg:h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400">Solde ce mois</p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
                  {(totalIncome - totalExpenses).toFixed(0)}€
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate("planning")}>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="p-2 lg:p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Calendar className="w-4 h-4 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400">Cette semaine</p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">{eventsThisWeek}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate("todo")}>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="p-2 lg:p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                <CheckSquare className="w-4 h-4 lg:w-6 lg:h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400">Tâches</p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">{tasksCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate("forum")}>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="p-2 lg:p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <MessageSquare className="w-4 h-4 lg:w-6 lg:h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400">Posts Forum</p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">{forumPostsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events - Only show if there are upcoming events */}
      {upcomingEvents.length > 0 && (
        <Card className="border-blue-200 dark:border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Clock className="w-5 h-5" />
              Prochains événements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.map((event: any, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: event.color }}></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{event.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(event.date).toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'short' 
                      })} à {event.startTime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Plus className="w-5 h-5" />
            Actions rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                onClick={action.action}
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto p-4 hover:shadow-md transition-all"
              >
                <div className={`p-2 rounded-full ${action.color}`}>
                  <action.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-medium text-center">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default HomeModule;
