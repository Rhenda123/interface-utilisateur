
import React, { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import UserAccountMenu from "@/components/UserAccountMenu";
import HomeModule from "@/components/HomeModule";
import TodoModule from "@/components/TodoModule";
import ScheduleModule from "@/components/ScheduleModule";
import DocumentsModule from "@/components/DocumentsModule";
import ForumModule from "@/components/ForumModule";
import FinanceModule from "@/components/FinanceModule";
import { Menu, X, Home, User, Settings, Bell, LogOut } from "lucide-react";
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
    { id: "home", label: "Home" },
    { id: "finances", label: "Finances" },
    { id: "todo", label: "To-Do" },
    { id: "planning", label: "Planning" },
    { id: "documents", label: "Documents" },
    { id: "forum", label: "Forum" }
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
      {/* Sticky Header - Enhanced for native mobile feel */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-[#F6C103] dark:border-gray-700 shadow-lg lg:shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            {/* Left: Brand - Optimized for mobile */}
            <h1 className="text-lg sm:text-xl lg:text-3xl font-bold bg-gradient-to-r from-[#F6C103] to-[#E5AD03] dark:from-[#F6C103] dark:to-[#E5AD03] bg-clip-text text-transparent">
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

            {/* Mobile Navigation Controls - Enhanced native feel */}
            <div className="lg:hidden flex items-center gap-1">
              <button
                onClick={() => handleNavigation("home")}
                className={`p-3 rounded-xl transition-all duration-200 touch-manipulation ${
                  view === "home"
                    ? "bg-gradient-to-r from-[#F6C103] to-[#E5AD03] text-gray-900 shadow-lg scale-105"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95"
                }`}
              >
                <Home className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-3 rounded-xl text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 transition-all duration-200 touch-manipulation"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
            
            {/* Right: User Controls - Enhanced for mobile */}
            <div className="hidden sm:flex items-center gap-2 lg:gap-3">
              <ThemeToggle />
              <UserAccountMenu />
            </div>
          </div>

          {/* Mobile Navigation Menu - Now contains user account section */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-[#F6C103]/20 dark:border-gray-700/50 bg-white/98 dark:bg-gray-800/98 backdrop-blur-xl rounded-b-2xl shadow-2xl mx-2 mb-2">
              <div className="p-6 space-y-6">
                {/* User Profile Section */}
                <div className="flex items-center space-x-4 pb-4 border-b border-yellow-100 dark:border-gray-700">
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
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Account
                  </p>
                  <div className="space-y-2">
                    <button 
                      className="flex w-full items-center space-x-3 py-3 px-4 hover:bg-yellow-50 dark:hover:bg-gray-700 rounded-xl cursor-pointer transition-all duration-200 active:scale-95"
                      onClick={handleSwitchAccounts}
                    >
                      <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      <span className="text-base font-medium">Switch accounts</span>
                    </button>
                    <button 
                      className="flex w-full items-center space-x-3 py-3 px-4 hover:bg-yellow-50 dark:hover:bg-gray-700 rounded-xl cursor-pointer transition-all duration-200 active:scale-95"
                      onClick={handleAccountSettings}
                    >
                      <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      <span className="text-base font-medium">Account settings</span>
                    </button>
                  </div>
                </div>

                {/* Notifications Section */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Notifications
                  </p>
                  <div className="flex items-center justify-between py-3 px-4 hover:bg-yellow-50 dark:hover:bg-gray-700 rounded-xl transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      <span className="text-base font-medium">Email notifications</span>
                    </div>
                    <Switch 
                      className="data-[state=checked]:bg-yellow-500"
                      onCheckedChange={handleNotificationToggle}
                    />
                  </div>
                </div>

                {/* Theme Toggle */}
                <div className="flex items-center justify-center py-4 border-t border-gray-200/30 dark:border-gray-700/30">
                  <ThemeToggle />
                </div>

                {/* Logout Section */}
                <div className="pt-2 border-t border-gray-200/30 dark:border-gray-700/30">
                  <button 
                    className="flex w-full items-center space-x-3 py-4 px-4 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl cursor-pointer text-red-600 dark:text-red-400 transition-all duration-200 active:scale-95"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="text-base font-semibold">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content - Enhanced mobile spacing */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 lg:py-8">
        <div className="w-full">
          {view === "home" && <HomeModule onNavigate={handleNavigation} />}
          {view === "finances" && <FinanceModule />}
          {view === "todo" && <TodoModule />}
          {view === "planning" && <ScheduleModule />}
          {view === "documents" && <DocumentsModule />}
          {view === "forum" && <ForumModule />}
        </div>
      </main>
    </div>
  );
}
