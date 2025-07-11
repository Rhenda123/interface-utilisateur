
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MobileAuth from "./components/MobileAuth";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isMobile = useIsMobile();

  const handleLogin = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      setIsTransitioning(false);
    }, 800);
  };

  // Show mobile auth only on mobile devices
  if (isMobile && !isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {isTransitioning ? (
              <div className="min-h-screen bg-gradient-to-br from-skoolife-light to-skoolife-white flex items-center justify-center">
                <div className="text-center space-y-4 animate-fade-in">
                  <div className="w-16 h-16 border-4 border-skoolife-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  <h2 className="text-2xl font-bold gradient-skoolife bg-clip-text text-transparent">
                    Chargement...
                  </h2>
                  <p className="text-gray-600">Préparation de votre espace</p>
                </div>
              </div>
            ) : (
              <MobileAuth onLogin={handleLogin} />
            )}
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div className={`transition-all duration-800 ease-in-out ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
