
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showSubscription, setShowSubscription] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Erreur de connexion",
          description: error.message === "Invalid login credentials" 
            ? "Email ou mot de passe incorrect" 
            : error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur SKOOLIFE !",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) {
      setShowSubscription(true);
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast({
            title: "Compte existant",
            description: "Un compte existe déjà avec cet email. Essayez de vous connecter.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erreur d'inscription",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        // Update user profile with selected plan
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              email: user.email,
              first_name: firstName,
              last_name: lastName,
              plan: selectedPlan,
              subscription_status: 'trial',
              subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days trial
            });
        }

        toast({
          title: "Inscription réussie",
          description: "Vérifiez votre email pour confirmer votre compte.",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      id: 'monthly' as const,
      name: 'Mensuel',
      price: '2,99 €',
      period: 'mois',
      description: '1er mois offert',
      features: ['Accès complet à tous les modules', 'Synchronisation cloud', 'Support prioritaire']
    },
    {
      id: 'yearly' as const,
      name: 'Annuel',
      price: '29,99 €',
      period: 'an',
      description: '2 mois économisés',
      popular: true,
      features: ['Accès complet à tous les modules', 'Synchronisation cloud', 'Support prioritaire', '2 mois gratuits']
    }
  ];

  if (showSubscription && !isLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-skoolife-light to-skoolife-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center section-padding">
        <Card className="w-full max-w-2xl card-responsive border-skoolife-primary/20 shadow-xl">
          <div className="text-center mb-6">
            <Button
              variant="ghost"
              onClick={() => setShowSubscription(false)}
              className="mb-4 self-start"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-responsive-heading font-bold gradient-skoolife bg-clip-text text-transparent mb-2">
              Choisissez votre abonnement
            </h1>
            <p className="text-responsive-body text-gray-600 dark:text-gray-300">
              Débloquez toutes les fonctionnalités SKOOLIFE+
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                  selectedPlan === plan.id
                    ? 'border-skoolife-primary bg-skoolife-light/50 scale-105'
                    : 'border-gray-200 hover:border-skoolife-primary/50'
                } ${plan.popular ? 'ring-2 ring-skoolife-primary/30' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="gradient-skoolife text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                      Populaire
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-skoolife-primary">{plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                  <p className="text-sm text-skoolife-secondary font-medium">{plan.description}</p>
                </div>

                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-skoolife-primary" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {selectedPlan === plan.id && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 gradient-skoolife rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-gray-900" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Button
            onClick={handleSignUp}
            disabled={!selectedPlan || loading}
            className="w-full btn-responsive gradient-skoolife text-gray-900 font-semibold hover:shadow-lg transition-all duration-200"
          >
            {loading ? "Création du compte..." : "Créer mon compte"}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-skoolife-light to-skoolife-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center section-padding">
      <Card className="w-full max-w-md card-responsive border-skoolife-primary/20 shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-responsive-heading font-bold gradient-skoolife bg-clip-text text-transparent mb-2">
            SKOOLIFE
          </h1>
          <p className="text-responsive-body text-gray-600 dark:text-gray-300">
            {isLogin ? "Connectez-vous à votre compte" : "Créez votre compte"}
          </p>
        </div>

        <form onSubmit={isLogin ? handleSignIn : handleSignUp} className="space-y-4">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium">
                  Prénom
                </Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-10 input-responsive border-gray-300 focus:border-skoolife-primary"
                    placeholder="Prénom"
                    required={!isLogin}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Nom
                </Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="pl-10 input-responsive border-gray-300 focus:border-skoolife-primary"
                    placeholder="Nom"
                    required={!isLogin}
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 input-responsive border-gray-300 focus:border-skoolife-primary"
                placeholder="votre@email.com"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium">
              Mot de passe
            </Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 input-responsive border-gray-300 focus:border-skoolife-primary"
                placeholder="••••••••"
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

          <Button
            type="submit"
            disabled={loading}
            className="w-full btn-responsive gradient-skoolife text-gray-900 font-semibold hover:shadow-lg transition-all duration-200"
          >
            {loading 
              ? (isLogin ? "Connexion..." : "Inscription...") 
              : (isLogin ? "Se connecter" : "S'inscrire")
            }
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setShowSubscription(false);
              setSelectedPlan(null);
            }}
            className="text-skoolife-primary hover:text-skoolife-secondary font-medium transition-colors"
          >
            {isLogin 
              ? "Pas encore de compte ? S'inscrire" 
              : "Déjà un compte ? Se connecter"
            }
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
