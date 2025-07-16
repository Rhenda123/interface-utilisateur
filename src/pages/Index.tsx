import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import UserAccountMenu from "@/components/UserAccountMenu";
import HomeModule from "@/components/HomeModule";
import TodoModule from "@/components/TodoModule";
import ScheduleModule from "@/components/ScheduleModule";
import DocumentsModule from "@/components/DocumentsModule";
import FinanceModule from "@/components/FinanceModule";
import Offers from "./Offers";
import { Menu, X, Home, User, Settings, Bell, LogOut, DollarSign, CheckSquare, Calendar, FileText, Tag } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";

export default function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-skoolife-light to-skoolife-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-skoolife-primary mx-auto mb-4"></div>
          <p className="text-responsive-body text-gray-600 dark:text-gray-300">Chargement...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, the useEffect will redirect to /auth
  if (!user) {
    return null;
  }

  const handleNavigation = (newView: string) => {
    setView(newView);
    setMobileMenuOpen(false); // Close mobile menu when navigating
  };

  const navigationItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "finances", label: "Finances", icon: DollarSign },
    { id: "todo", label: "To-Do", icon: CheckSquare },
    { id: "planning", label: "Planning", icon: Calendar },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "offers", label: "Offres", icon: Tag }
  ];

  // User data for mobile menu
  const userDisplayData = {
    name: user.user_metadata?.first_name && user.user_metadata?.last_name 
      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
      : user.email?.split('@')[0] || "Utilisateur",
    email: user.email || "",
    avatar: "",
    initials: user.user_metadata?.first_name && user.user_metadata?.last_name
      ? `${user.user_metadata.first_name[0]}${user.user_metadata.last_name[0]}`
      : user.email?.[0]?.toUpperCase() || "U"
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    setMobileMenuOpen(false);
  };

  const handleSwitchAccounts = () => {
    console.log("Switch accounts clicked");
    setMobileMenuOpen(false);
  };

  const handleAccountSettings = () => {
    console.log("Account settings clicked");
    setMobileMenuOpen(false);
  };

  const handleNotificationToggle = () => {
    console.log("Notification toggle clicked");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-skoolife-light to-skoolife-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Desktop-Only Header - Hidden on tablet and mobile */}
      <header className="hidden lg:block sticky top-0 z-50 bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl border-b border-skoolife-primary/20 dark:border-gray-700/50 shadow-sm lg:shadow-lg">
        <div className="max-w-7xl mx-auto section-padding">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left: Brand - Mobile optimized */}
            <h1 className="text-responsive-2xl font-bold gradient-skoolife bg-clip-text text-transparent">
              SKOOLIFE
            </h1>
            
            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="hidden lg:flex flex-1 justify-center">
              <div className="inline-flex bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl p-1 shadow-lg border border-skoolife-primary dark:border-gray-700 gap-1">
                {navigationItems.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setView(item.id)} 
                    className={`btn-responsive font-medium transition-all duration-200 whitespace-nowrap hover:shadow-md ${
                      view === item.id 
                        ? "gradient-skoolife text-gray-900 shadow-md transform scale-105" 
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-skoolife-light dark:hover:bg-gray-700 hover:shadow-sm"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </nav>

            {/* Right: Desktop User Controls */}
            <div className="hidden lg:flex items-center gap-responsive">
              <ThemeToggle />
              <UserAccountMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - User Account Section */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl animate-fade-in">
          <div className="pt-20 section-padding space-y-4 sm:space-y-6 h-full overflow-y-auto">
            {/* User Profile Section */}
            <div className="flex items-center gap-responsive pb-4 sm:pb-6 border-b border-skoolife-primary/20 dark:border-gray-700">
              <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border-2 border-skoolife-primary/30">
                <AvatarImage src={userDisplayData.avatar} alt={userDisplayData.name} />
                <AvatarFallback className="gradient-skoolife text-gray-900 font-semibold text-lg sm:text-xl">
                  {userDisplayData.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-responsive-lg font-semibold text-gray-900 dark:text-white truncate">
                  {userDisplayData.name}
                </p>
                <p className="text-responsive-sm text-gray-500 dark:text-gray-400 truncate">
                  {userDisplayData.email}
                </p>
              </div>
            </div>

            {/* Account Section */}
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 sm:mb-4">
                Account
              </p>
              <div className="space-y-1">
                <button 
                  className="flex w-full items-center gap-responsive py-3 sm:py-4 px-3 sm:px-4 hover:bg-skoolife-light dark:hover:bg-gray-800 rounded-xl transition-all duration-200 active:scale-98 touch-manipulation"
                  onClick={handleSwitchAccounts}
                >
                  <User className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-gray-300" />
                  <span className="text-responsive-base font-medium">Switch accounts</span>
                </button>
                <button 
                  className="flex w-full items-center gap-responsive py-3 sm:py-4 px-3 sm:px-4 hover:bg-skoolife-light dark:hover:bg-gray-800 rounded-xl transition-all duration-200 active:scale-98 touch-manipulation"
                  onClick={handleAccountSettings}
                >
                  <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-gray-300" />
                  <span className="text-responsive-base font-medium">Account settings</span>
                </button>
              </div>
            </div>

            {/* Notifications Section */}
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 sm:mb-4">
                Notifications
              </p>
              <div className="flex items-center justify-between py-3 sm:py-4 px-3 sm:px-4 hover:bg-skoolife-light dark:hover:bg-gray-800 rounded-xl transition-all duration-200">
                <div className="flex items-center gap-responsive">
                  <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-gray-300" />
                  <span className="text-responsive-base font-medium">Email notifications</span>
                </div>
                <Switch 
                  className="data-[state=checked]:bg-skoolife-primary scale-110 sm:scale-125"
                  onCheckedChange={handleNotificationToggle}
                />
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center justify-center py-4 sm:py-6 border-t border-gray-200/30 dark:border-gray-700/30">
              <ThemeToggle />
            </div>

            {/* Logout Section */}
            <div className="pt-2 border-t border-gray-200/30 dark:border-gray-700/30">
              <button 
                className="flex w-full items-center gap-responsive py-3 sm:py-4 px-3 sm:px-4 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl cursor-pointer text-red-600 dark:text-red-400 transition-all duration-200 active:scale-98 touch-manipulation"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-responsive-base font-semibold">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Mobile optimized with proper padding for bottom nav and iPhone 16 safe area */}
      <main className={`max-w-7xl mx-auto section-padding py-4 pb-32 lg:pb-8 lg:py-8 pt-16 lg:pt-4 transition-all duration-300 ${mobileMenuOpen ? 'lg:block hidden' : ''}`}>
        <div className="w-full">
          <div className="transition-all duration-300 ease-in-out">
            {view === "home" && <HomeModule onNavigate={handleNavigation} />}
            {view === "finances" && <FinanceModule />}
            {view === "todo" && <TodoModule />}
            {view === "planning" && <ScheduleModule />}
            {view === "documents" && <DocumentsModule />}
            {view === "offers" && <Offers />}
          </div>
        </div>
      </main>

      {/* Fixed Bottom Navigation - Native mobile app style with icons only - Larger size */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl border-t border-skoolife-primary/20 dark:border-gray-700/50 shadow-2xl">
        <div className="flex items-center justify-around px-1 py-4 pb-8">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`flex items-center justify-center p-3 sm:p-3.5 rounded-full transition-all duration-200 touch-manipulation active:scale-95 ${
                  view === item.id
                    ? "gradient-skoolife text-gray-900 shadow-lg scale-105"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <IconComponent className="h-6 w-6 sm:h-7 sm:w-7" />
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
