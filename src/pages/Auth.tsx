
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          setError(error.message);
        } else {
          toast({
            title: "Connexion réussie !",
            description: "Bienvenue sur Skoolife",
          });
          navigate('/');
        }
      } else {
        if (password !== confirmPassword) {
          setError('Les mots de passe ne correspondent pas');
          return;
        }

        if (password.length < 6) {
          setError('Le mot de passe doit contenir au moins 6 caractères');
          return;
        }

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
          setError(error.message);
        } else {
          toast({
            title: "Compte créé !",
            description: "Vérifiez votre email pour confirmer votre compte",
          });
          setIsLogin(true);
        }
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setError('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-skoolife-light via-white to-skoolife-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-skoolife-primary rounded-2xl mb-4">
            <span className="text-2xl font-bold text-gray-800">S</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Skoolife</h1>
          <p className="text-gray-600 mt-2">
            {isLogin ? 'Connectez-vous à votre compte' : 'Créez votre compte Skoolife'}
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center text-gray-800">
              {isLogin ? 'Connexion' : 'Inscription'}
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              {isLogin 
                ? 'Entrez vos identifiants pour accéder à votre dashboard'
                : 'Remplissez les informations ci-dessous pour créer votre compte'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Prénom"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="pl-10 h-12 bg-white border-gray-200 focus:border-skoolife-primary focus:ring-2 focus:ring-skoolife-primary/20"
                      required={!isLogin}
                    />
                  </div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Nom"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="pl-10 h-12 bg-white border-gray-200 focus:border-skoolife-primary focus:ring-2 focus:ring-skoolife-primary/20"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="email"
                  placeholder="Adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-white border-gray-200 focus:border-skoolife-primary focus:ring-2 focus:ring-skoolife-primary/20"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-white border-gray-200 focus:border-skoolife-primary focus:ring-2 focus:ring-skoolife-primary/20"
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

              {!isLogin && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmer le mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-white border-gray-200 focus:border-skoolife-primary focus:ring-2 focus:ring-skoolife-primary/20"
                    required={!isLogin}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-skoolife-primary hover:bg-skoolife-secondary text-gray-800 font-semibold text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'Créer mon compte')}
              </Button>
            </form>

            <div className="text-center pt-4">
              <button
                onClick={toggleMode}
                className="text-sm text-gray-600 hover:text-skoolife-primary transition-colors duration-200"
              >
                {isLogin 
                  ? "Pas encore de compte ? Créer un compte"
                  : "Déjà un compte ? Se connecter"
                }
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-xs text-gray-500">
          <p>En continuant, vous acceptez nos</p>
          <div className="flex justify-center gap-2 mt-1">
            <button className="text-skoolife-primary hover:underline">Conditions d'utilisation</button>
            <span>et</span>
            <button className="text-skoolife-primary hover:underline">Politique de confidentialité</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
