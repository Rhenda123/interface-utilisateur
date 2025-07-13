
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { User, Session } from '@supabase/supabase-js';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';

interface AuthProps {
  onAuthSuccess: (user: User) => void;
  onBack: () => void;
}

const Auth = ({ onAuthSuccess, onBack }: AuthProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Configurer l'écoute des changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          onAuthSuccess(session.user);
        }
      }
    );

    // Vérifier s'il y a déjà une session active
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        onAuthSuccess(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [onAuthSuccess]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté."
        });
      } else {
        const redirectUrl = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl
          }
        });
        if (error) throw error;
        
        toast({
          title: "Inscription réussie",
          description: "Vérifiez votre email pour confirmer votre compte."
        });
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header avec bouton retour */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Retour</span>
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Mes Documents
          </h1>
          <div className="w-16"></div> {/* Spacer pour centrer le titre */}
        </div>

        {/* Carte d'authentification */}
        <div className="max-w-md mx-auto">
          <Card className="border-yellow-200 dark:border-gray-700 shadow-xl bg-white dark:bg-gray-800 transition-colors duration-300">
            <CardContent className="p-6 sm:p-8">
              {/* Logo/Icon */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl sm:text-3xl">📁</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {isLogin ? 'Connexion' : 'Inscription'}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  {isLogin 
                    ? 'Connectez-vous pour accéder à vos documents' 
                    : 'Créez votre compte pour commencer'
                  }
                </p>
              </div>

              {/* Formulaire */}
              <form onSubmit={handleAuth} className="space-y-4 sm:space-y-6">
                <div className="space-y-4">
                  {/* Email */}
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 sm:pl-12 border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors duration-300 h-12 sm:h-14 text-sm sm:text-base"
                      required
                    />
                  </div>

                  {/* Mot de passe */}
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 sm:pl-12 pr-10 sm:pr-12 border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors duration-300 h-12 sm:h-14 text-sm sm:text-base"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-2"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Bouton principal */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-semibold py-3 sm:py-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] text-sm sm:text-base h-12 sm:h-14"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                      <span>Chargement...</span>
                    </div>
                  ) : (
                    isLogin ? 'Se connecter' : "S'inscrire"
                  )}
                </Button>

                {/* Bouton pour changer de mode */}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsLogin(!isLogin)}
                  className="w-full text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium py-2 text-sm sm:text-base"
                >
                  {isLogin 
                    ? "Pas de compte ? S'inscrire" 
                    : 'Déjà un compte ? Se connecter'
                  }
                </Button>
              </form>

              {/* Note pour les nouveaux utilisateurs */}
              {!isLogin && (
                <div className="mt-6 p-4 bg-yellow-100 dark:bg-gray-700 rounded-lg border border-yellow-200 dark:border-gray-600">
                  <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-300 text-center">
                    📝 Après inscription, vérifiez votre email pour activer votre compte
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
