
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, User, Lock, Mail, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MobileSignupProps {
  onBack: () => void;
  onLogin: () => void;
}

export default function MobileSignup({ onBack, onLogin }: MobileSignupProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const plans = [
    {
      id: 'monthly',
      name: 'Mensuel',
      price: '4,99 €',
      period: 'mois',
      popular: false
    },
    {
      id: 'yearly',
      name: 'Annuel',
      price: '49,99 €',
      period: 'an',
      popular: true,
      savings: 'Économisez 2 mois !'
    }
  ];

  const features = [
    "Accès illimité à tous les modules",
    "Synchronisation cloud de vos données",
    "Support prioritaire 24/7",
    "Fonctionnalités avancées de planification",
    "Outils collaboratifs premium"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) {
      toast({
        title: "Plan requis",
        description: "Veuillez sélectionner un plan d'abonnement",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simuler la création de compte et l'abonnement
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Compte créé avec succès !",
      description: `Bienvenue sur SKOOLIFE+ (${selectedPlan === 'monthly' ? 'Mensuel' : 'Annuel'})`,
    });

    setTimeout(() => {
      onLogin();
    }, 500);
    
    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-skoolife-light to-skoolife-white flex flex-col section-padding">
      {/* Header avec espace pour Dynamic Island */}
      <div className="text-center mb-6 pt-16 mt-4">
        <h1 className="text-3xl font-bold gradient-skoolife bg-clip-text text-transparent mb-2">
          SKOOLIFE+
        </h1>
        <p className="text-gray-600 text-base">
          Créez votre compte premium
        </p>
      </div>

      {/* Plan Selection */}
      <div className="bg-white rounded-2xl shadow-xl p-5 mb-4 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 text-center mb-4">
          Choisissez votre plan
        </h2>
        
        <div className="space-y-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                selectedPlan === plan.id
                  ? 'border-skoolife-primary bg-skoolife-light'
                  : 'border-gray-200 hover:border-skoolife-primary/50'
              } ${plan.popular ? 'ring-2 ring-skoolife-secondary ring-opacity-50' : ''}`}
              onClick={() => setSelectedPlan(plan.id as 'monthly' | 'yearly')}
            >
              {plan.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-skoolife-secondary text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                    POPULAIRE
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === plan.id
                        ? 'border-skoolife-primary bg-skoolife-primary'
                        : 'border-gray-300'
                    }`}>
                      {selectedPlan === plan.id && (
                        <Check className="w-3 h-3 text-gray-900" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                        <span className="text-sm text-gray-600">/ {plan.period}</span>
                      </div>
                      {plan.savings && (
                        <span className="text-xs text-skoolife-secondary font-medium">
                          {plan.savings}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Inclus dans votre abonnement :</h3>
          <div className="space-y-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-skoolife-primary flex-shrink-0" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sign Up Form */}
      <div className="bg-white rounded-2xl shadow-xl p-5 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
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
                className="pl-10 h-11 border-gray-200 focus:border-skoolife-primary text-base"
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
                className="pl-10 h-11 border-gray-200 focus:border-skoolife-primary text-base"
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
                className="pl-10 pr-10 h-11 border-gray-200 focus:border-skoolife-primary text-base"
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
            disabled={isLoading || !selectedPlan}
            className="w-full h-11 gradient-skoolife text-gray-900 font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-98 mt-6"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                Création en cours...
              </div>
            ) : (
              `Créer mon compte ${selectedPlan ? `(${selectedPlan === 'monthly' ? '4,99€/mois' : '49,99€/an'})` : ''}`
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
            className="text-skoolife-primary font-semibold hover:underline text-sm"
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
