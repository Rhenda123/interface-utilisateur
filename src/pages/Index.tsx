import React, { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import UserAccountMenu from "@/components/UserAccountMenu";
import HomeModule from "@/components/HomeModule";
import TodoModule from "@/components/TodoModule";
import ScheduleModule from "@/components/ScheduleModule";
import DocumentsModule from "@/components/DocumentsModule";
import FinanceModule from "@/components/FinanceModule";
import { Menu, X, Home, User, Settings, Bell, LogOut, DollarSign, CheckSquare, Calendar, FileText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";

export default function Index() {
  const [view, setView] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigation = (newView: string) => {
    setView(newView);
    setMobileMenuOpen(false); // Close mobile menu when navigating
  };

  const navigationItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "finances", label: "Finances", icon: DollarSign },
    { id: "todo", label: "To-Do", icon: CheckSquare },
    { id: "planning", label: "Planning", icon: Calendar },
    { id: "documents", label: "Documents", icon: FileText }
  ];

  // User data for mobile menu
  const user = {
    name: "Ridouane Henda",
    email: "r.henda@icloud.com",
    avatar: "",
    initials: "RH"
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Mobile-First Header - Fixed dark mode styling */}
      <header className="sticky top-0 z-50 bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm lg:shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left: Brand - Mobile optimized */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[#F6C103] to-[#E5AD03] dark:from-[#F6C103] dark:to-[#E5AD03] bg-clip-text text-transparent">
              SKOOLIFE
            </h1>
            
            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="hidden lg:flex flex-1 justify-center">
              <div className="inline-flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg border border-[#F6C103] dark:border-gray-700">
                {navigationItems.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setView(item.id)} 
                    className={`px-4 py-2 rounded-md font-medium transition-all duration-200 whitespace-nowrap hover:shadow-md ${
                      view === item.id 
                        ? "bg-gradient-to-r from-[#F6C103] to-[#E5AD03] text-gray-900 shadow-md transform scale-105" 
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-[#FEF7D6] dark:hover:bg-gray-700 hover:shadow-sm"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </nav>

            {/* Mobile: Menu Button Only */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-3 rounded-xl text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 transition-all duration-200 touch-manipulation"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
            
            {/* Right: Desktop User Controls */}
            <div className="hidden lg:flex items-center gap-2 lg:gap-3">
              <ThemeToggle />
              <UserAccountMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - User Account Section */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl animate-fade-in">
          <div className="pt-20 p-6 space-y-6 h-full overflow-y-auto">
            {/* User Profile Section */}
            <div className="flex items-center space-x-4 pb-6 border-b border-yellow-100 dark:border-gray-700">
              <Avatar className="h-16 w-16 border-2 border-yellow-200">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-gray-900 font-semibold text-xl">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Account Section */}
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Account
              </p>
              <div className="space-y-1">
                <button 
                  className="flex w-full items-center space-x-4 py-4 px-4 hover:bg-yellow-50 dark:hover:bg-gray-800 rounded-xl cursor-pointer transition-all duration-200 active:scale-98 touch-manipulation"
                  onClick={handleSwitchAccounts}
                >
                  <User className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                  <span className="text-lg font-medium">Switch accounts</span>
                </button>
                <button 
                  className="flex w-full items-center space-x-4 py-4 px-4 hover:bg-yellow-50 dark:hover:bg-gray-800 rounded-xl cursor-pointer transition-all duration-200 active:scale-98 touch-manipulation"
                  onClick={handleAccountSettings}
                >
                  <Settings className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                  <span className="text-lg font-medium">Account settings</span>
                </button>
              </div>
            </div>

            {/* Notifications Section */}
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Notifications
              </p>
              <div className="flex items-center justify-between py-4 px-4 hover:bg-yellow-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                  <span className="text-lg font-medium">Email notifications</span>
                </div>
                <Switch 
                  className="data-[state=checked]:bg-yellow-500 scale-125"
                  onCheckedChange={handleNotificationToggle}
                />
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center justify-center py-6 border-t border-gray-200/30 dark:border-gray-700/30">
              <ThemeToggle />
            </div>

            {/* Logout Section */}
            <div className="pt-2 border-t border-gray-200/30 dark:border-gray-700/30">
              <button 
                className="flex w-full items-center space-x-4 py-4 px-4 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl cursor-pointer text-red-600 dark:text-red-400 transition-all duration-200 active:scale-98 touch-manipulation"
                onClick={handleLogout}
              >
                <LogOut className="h-6 w-6" />
                <span className="text-lg font-semibold">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Mobile optimized with proper padding for bottom nav */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-20 lg:pb-8 lg:py-8 transition-all duration-300 ${mobileMenuOpen ? 'lg:block hidden' : ''}`}>
        <div className="w-full">
          <div className="transition-all duration-300 ease-in-out">
            {view === "home" && <HomeModule onNavigate={handleNavigation} />}
            {view === "finances" && <FinanceModule />}
            {view === "todo" && <TodoModule />}
            {view === "planning" && <ScheduleModule />}
            {view === "documents" && <DocumentsModule />}
          </div>
        </div>
      </main>

      {/* Fixed Bottom Navigation - Native mobile app style with icons only - Compact design */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
        <div className="flex items-center justify-around px-1 py-2 safe-area-inset-bottom">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`flex items-center justify-center p-2.5 rounded-full transition-all duration-200 touch-manipulation active:scale-95 ${
                  view === item.id
                    ? "bg-gradient-to-r from-[#F6C103] to-[#E5AD03] text-gray-900 shadow-lg scale-105"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <IconComponent className="h-5 w-5" />
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
