import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const success = await login(email, password);
        if (success) {
          navigate('/');
        } else {
          setError('Email ou mot de passe invalide');
        }
      } else {
        setError('L\'inscription est actuellement désactivée. Veuillez utiliser les identifiants existants.');
      }
    } catch (err) {
      setError('Une erreur s\'est produite. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-200/30 dark:bg-yellow-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-yellow-300/20 dark:bg-yellow-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-yellow-400/20 dark:bg-yellow-300/10 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute bottom-40 right-10 w-16 h-16 bg-yellow-200/30 dark:bg-yellow-500/10 rounded-full blur-lg animate-pulse delay-700"></div>
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm animate-fade-in">
        <CardHeader className="text-center space-y-6 pb-8">
          {/* Logo Section */}
          <div className="flex justify-center items-center space-x-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 bg-clip-text text-transparent tracking-tight">
              SKOOLIFE
            </h1>
          </div>
          
          {/* Welcome Text */}
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
              {isLogin ? 'Bon retour ! 👋' : 'Rejoignez SKOOLIFE 🎓'}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
              {isLogin ? 'Nous sommes ravis de vous revoir' : 'Commencez votre parcours éducatif avec nous'}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nom complet
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Entrez votre nom complet"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className="h-11 border-gray-200 dark:border-gray-600 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-yellow-400/20 rounded-lg transition-all duration-200"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Adresse email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 border-gray-200 dark:border-gray-600 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-yellow-400/20 rounded-lg transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 border-gray-200 dark:border-gray-600 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-yellow-400/20 rounded-lg transition-all duration-200 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? 'Se connecter' : 'Créer un compte'}
            </Button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              {isLogin ? "Nouveau sur SKOOLIFE ?" : "Vous avez déjà un compte ?"}
            </p>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setEmail('');
                setPassword('');
                setName('');
              }}
              className="text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 font-semibold text-sm transition-colors hover:underline"
            >
              {isLogin ? "Rejoins l'aventure" : "Se connecter plutôt"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
