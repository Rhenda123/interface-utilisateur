
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, User, Lock, Mail, Building2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MobileCampusSignupProps {
  onBack: () => void;
  onLogin: () => void;
  onSwitchToPlus: () => void;
}

export default function MobileCampusSignup({ onBack, onLogin, onSwitchToPlus }: MobileCampusSignupProps) {
  const [step, setStep] = useState<'code' | 'signup'>('code');
  const [showPassword, setShowPassword] = useState(false);
  const [establishmentCode, setEstablishmentCode] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [codeError, setCodeError] = useState("");
  const { toast } = useToast();

  const validateEstablishmentCode = async () => {
    setIsLoading(true);
    setCodeError("");

    // Simuler la vérification du code établissement
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Codes d'exemple valides
    const validCodes = ["LYCEE2025", "UNIV-PARIS", "COLLEGE-ST"];
    
    if (validCodes.includes(establishmentCode.toUpperCase())) {
      setStep('signup');
      toast({
        title: "Code établissement validé",
        description: "Vous pouvez maintenant créer votre compte Campus",
      });
    } else {
      setCodeError("Code établissement invalide");
    }
    
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simuler la création de compte Campus
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Compte Campus créé avec succès !",
      description: "Bienvenue sur SKOOLIFE Campus",
    });

    setTimeout(() => {
      onLogin();
    }, 500);
    
    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (step === 'code') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col section-padding">
        {/* Header avec espace pour Dynamic Island */}
        <div className="text-center mb-6 pt-16 mt-4">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">
            SKOOLIFE Campus
          </h1>
          <p className="text-gray-600 text-base">
            Entrez votre code établissement
          </p>
        </div>

        {/* Code Input Form */}
        <div className="bg-white rounded-2xl shadow-xl p-5 mb-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-gray-700 font-medium text-sm">
                Code établissement
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="code"
                  type="text"
                  value={establishmentCode}
                  onChange={(e) => setEstablishmentCode(e.target.value)}
                  placeholder="Ex: LYCEE2025"
                  className="pl-10 h-11 border-gray-200 focus:border-blue-500 text-base uppercase"
                  style={{ fontSize: '16px' }}
                  required
                />
              </div>
              {codeError && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{codeError}</span>
                </div>
              )}
            </div>

            <Button
              onClick={validateEstablishmentCode}
              disabled={isLoading || !establishmentCode.trim()}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-98"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Vérification...
                </div>
              ) : (
                "Valider le code"
              )}
            </Button>
          </div>
        </div>

        {/* Error Help */}
        {codeError && (
          <div className="bg-red-50 rounded-2xl p-4 mb-4 border border-red-200">
            <div className="text-center">
              <p className="text-red-800 text-sm mb-3">
                Code établissement non reconnu ?
              </p>
              <Button
                onClick={onSwitchToPlus}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                Essayer SKOOLIFE+ à la place
              </Button>
            </div>
          </div>
        )}

        {/* Back to Login */}
        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-gray-600 mb-2 text-sm">
            Déjà un compte Campus ?
          </p>
          <button
            onClick={onBack}
            className="text-blue-600 font-semibold hover:underline text-sm"
          >
            Se connecter
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-auto text-gray-500 text-xs pb-8">
          <p>© 2025 SKOOLIFE. Tous droits réservés.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col section-padding">
      {/* Header avec espace pour Dynamic Island */}
      <div className="text-center mb-6 pt-16 mt-4">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          SKOOLIFE Campus
        </h1>
        <p className="text-gray-600 text-base">
          Créez votre compte étudiant
        </p>
      </div>

      {/* Sign Up Form */}
      <div className="bg-white rounded-2xl shadow-xl p-5 space-y-4">
        <form onSubmit={handleSignup} className="space-y-4">
          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-700 font-medium text-sm">
              Identifiant
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="Votre identifiant"
                className="pl-10 h-11 border-gray-200 focus:border-blue-500 text-base"
                style={{ fontSize: '16px' }}
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium text-sm">
              Adresse e-mail
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="votre@email.com"
                className="pl-10 h-11 border-gray-200 focus:border-blue-500 text-base"
                style={{ fontSize: '16px' }}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium text-sm">
              Mot de passe
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Votre mot de passe"
                className="pl-10 pr-10 h-11 border-gray-200 focus:border-blue-500 text-base"
                style={{ fontSize: '16px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-98 mt-6"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Création en cours...
              </div>
            ) : (
              "Créer mon compte Campus"
            )}
          </Button>
        </form>

        {/* Back to Login */}
        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-gray-600 mb-2 text-sm">
            Déjà un compte ?
          </p>
          <button
            onClick={onBack}
            className="text-blue-600 font-semibold hover:underline text-sm"
          >
            Se connecter
          </button>
        </div>
      </div>

      {/* Footer avec espace pour la zone de sécurité en bas */}
      <div className="text-center mt-6 text-gray-500 text-xs pb-8">
        <p>© 2025 SKOOLIFE. Tous droits réservés.</p>
      </div>
    </div>
  );
}
