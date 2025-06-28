
import React, { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import UserAccountMenu from "@/components/UserAccountMenu";
import HomeModule from "@/components/HomeModule";
import TodoModule from "@/components/TodoModule";
import ScheduleModule from "@/components/ScheduleModule";
import DocumentsModule from "@/components/DocumentsModule";
import ForumModule from "@/components/ForumModule";
import FinanceModule from "@/components/FinanceModule";
import { Menu, X, Home } from "lucide-react";

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

  // Navigation items for mobile menu (excluding home)
  const mobileNavigationItems = navigationItems.filter(item => item.id !== "home");

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

          {/* Mobile Navigation Menu - Native app style */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-[#F6C103]/20 dark:border-gray-700/50 bg-white/98 dark:bg-gray-800/98 backdrop-blur-xl rounded-b-2xl shadow-2xl mx-2 mb-2">
              <div className="px-4 py-4 space-y-2">
                {mobileNavigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`flex w-full text-left px-4 py-4 rounded-xl font-medium transition-all duration-200 touch-manipulation active:scale-95 ${
                      view === item.id
                        ? "bg-gradient-to-r from-[#F6C103] to-[#E5AD03] text-gray-900 shadow-lg transform scale-[1.02]"
                        : "text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-[#FEF7D6]/50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              
              {/* Mobile User Controls - Native style */}
              <div className="sm:hidden border-t border-gray-200/30 dark:border-gray-700/30 px-4 py-4 flex items-center justify-center gap-4 bg-gray-50/80 dark:bg-gray-750/80 rounded-b-2xl">
                <ThemeToggle />
                <UserAccountMenu />
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
