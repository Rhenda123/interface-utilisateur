
import React, { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import UserAccountMenu from "@/components/UserAccountMenu";
import HomeModule from "@/components/HomeModule";
import TodoModule from "@/components/TodoModule";
import ScheduleModule from "@/components/ScheduleModule";
import DocumentsModule from "@/components/DocumentsModule";
import ForumModule from "@/components/ForumModule";
import FinanceModule from "@/components/FinanceModule";
import { Menu, X } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-[#F6C103] dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left: Brand */}
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

            {/* Mobile Menu Button - Visible on mobile/tablet */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            {/* Right: User Controls - Hidden on small mobile, visible on larger screens */}
            <div className="hidden sm:flex items-center gap-2 lg:gap-3">
              <ThemeToggle />
              <UserAccountMenu />
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-[#F6C103] dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-lg shadow-lg">
              <div className="px-2 py-3 space-y-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`block w-full text-left px-3 py-2 rounded-md font-medium transition-colors ${
                      view === item.id
                        ? "bg-gradient-to-r from-[#F6C103] to-[#E5AD03] text-gray-900"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-[#FEF7D6] dark:hover:bg-gray-700"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              
              {/* Mobile User Controls */}
              <div className="sm:hidden border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-center gap-3 bg-gray-50 dark:bg-gray-750">
                <ThemeToggle />
                <UserAccountMenu />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
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
