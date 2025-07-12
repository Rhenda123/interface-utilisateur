
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MobileSignup from "./MobileSignup";

interface MobileAuthProps {
  onLogin: () => void;
}

export default function MobileAuth({ onLogin }: MobileAuthProps) {
  const [currentView, setCurrentView] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simuler un délai de connexion
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (username === "r.henda" && password === "123456") {
      setTimeout(() => {
        onLogin();
      }, 500);
    } else {
      toast({
        title: "Erreur de connexion",
        description: "Identifiant ou mot de passe incorrect",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  // Show signup page if currentView is 'signup'
  if (currentView === 'signup') {
    return (
      <MobileSignup 
        onBack={() => setCurrentView('login')} 
        onLogin={onLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-skoolife-light to-skoolife-white flex flex-col justify-center section-padding">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold gradient-skoolife bg-clip-text text-transparent mb-2">
          SKOOLIFE
        </h1>
        <p className="text-gray-600 text-lg">
          Connectez-vous à votre compte
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-700 font-medium">
              Identifiant
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Votre identifiant"
                className="pl-10 h-12 border-gray-200 focus:border-skoolife-primary text-base"
                style={{ fontSize: '16px' }}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium">
              Mot de passe
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                className="pl-10 pr-10 h-12 border-gray-200 focus:border-skoolife-primary text-base"
                style={{ fontSize: '16px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 gradient-skoolife text-gray-900 font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-98"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                Connexion...
              </div>
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>

        {/* Toggle Login/Register */}
        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-gray-600 mb-2">
            Pas encore de compte ?
          </p>
          <button
            onClick={() => setCurrentView('signup')}
            className="text-skoolife-primary font-semibold hover:underline"
          >
            Créer un compte
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 text-gray-500 text-sm">
        <p>© 2025 SKOOLIFE. Tous droits réservés.</p>
      </div>
    </div>
  );
}
