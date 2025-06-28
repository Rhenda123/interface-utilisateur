
import React, { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import UserAccountMenu from "@/components/UserAccountMenu";
import HomeModule from "@/components/HomeModule";
import TodoModule from "@/components/TodoModule";
import ScheduleModule from "@/components/ScheduleModule";
import DocumentsModule from "@/components/DocumentsModule";
import ForumModule from "@/components/ForumModule";
import FinanceModule from "@/components/FinanceModule";

export default function Index() {
  const [view, setView] = useState("home");

  const handleNavigation = (newView: string) => {
    setView(newView);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-yellow-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Brand */}
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-700 dark:from-yellow-400 dark:to-yellow-500 bg-clip-text text-transparent">
              SKOOLIFE
            </h1>
            
            {/* Center: Navigation */}
            <nav className="flex-1 flex justify-center">
              <div className="inline-flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg border border-yellow-200 dark:border-gray-700 overflow-x-auto">
                <button 
                  onClick={() => setView("home")} 
                  className={`px-3 sm:px-4 py-2 rounded-md font-medium transition-all duration-200 whitespace-nowrap hover:shadow-md ${
                    view === "home" 
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-md transform scale-105" 
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-yellow-100 dark:hover:bg-gray-700 hover:shadow-sm"
                  }`}
                >
                  Home
                </button>
                <button 
                  onClick={() => setView("finances")} 
                  className={`px-3 sm:px-4 py-2 rounded-md font-medium transition-all duration-200 whitespace-nowrap hover:shadow-md ${
                    view === "finances" 
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-md transform scale-105" 
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-yellow-100 dark:hover:bg-gray-700 hover:shadow-sm"
                  }`}
                >
                  Finances
                </button>
                <button 
                  onClick={() => setView("todo")} 
                  className={`px-3 sm:px-4 py-2 rounded-md font-medium transition-all duration-200 whitespace-nowrap hover:shadow-md ${
                    view === "todo" 
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-md transform scale-105" 
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-yellow-100 dark:hover:bg-gray-700 hover:shadow-sm"
                  }`}
                >
                  To-Do
                </button>
                <button 
                  onClick={() => setView("planning")} 
                  className={`px-3 sm:px-4 py-2 rounded-md font-medium transition-all duration-200 whitespace-nowrap hover:shadow-md ${
                    view === "planning" 
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-md transform scale-105" 
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-yellow-100 dark:hover:bg-gray-700 hover:shadow-sm"
                  }`}
                >
                  Planning
                </button>
                <button 
                  onClick={() => setView("documents")} 
                  className={`px-3 sm:px-4 py-2 rounded-md font-medium transition-all duration-200 whitespace-nowrap hover:shadow-md ${
                    view === "documents" 
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-md transform scale-105" 
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-yellow-100 dark:hover:bg-gray-700 hover:shadow-sm"
                  }`}
                >
                  Documents
                </button>
                <button 
                  onClick={() => setView("forum")} 
                  className={`px-3 sm:px-4 py-2 rounded-md font-medium transition-all duration-200 whitespace-nowrap hover:shadow-md ${
                    view === "forum" 
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-md transform scale-105" 
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-yellow-100 dark:hover:bg-gray-700 hover:shadow-sm"
                  }`}
                >
                  Forum
                </button>
              </div>
            </nav>
            
            {/* Right: User Controls */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserAccountMenu />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {view === "home" && <HomeModule onNavigate={handleNavigation} />}
        {view === "finances" && <FinanceModule />}
        {view === "todo" && <TodoModule />}
        {view === "planning" && <ScheduleModule />}
        {view === "documents" && <DocumentsModule />}
        {view === "forum" && <ForumModule />}
      </div>
    </div>
  );
}
