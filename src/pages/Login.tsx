
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
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

  const handleAuthAction = (isLoginAction: boolean) => {
    setIsLogin(isLoginAction);
    setShowForm(true);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
  };

  if (!showForm) {
    // Welcome screen similar to Trello
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex flex-col justify-between p-6 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-40 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse delay-500"></div>
          <div className="absolute bottom-20 right-10 w-16 h-16 bg-white/5 rounded-full blur-lg animate-pulse delay-700"></div>
        </div>

        {/* Header with Logo */}
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 relative z-10">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              SKOOLIFE
            </h1>
          </div>

          {/* Illustration Area - placeholder for now */}
          <div className="w-64 h-48 mb-8 flex items-center justify-center">
            <div className="w-full h-full bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center">
              <div className="text-white/60 text-6xl">📚</div>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="space-y-4 max-w-sm">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">
              Optimisez votre parcours éducatif
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Gérez vos cours, devoirs et projets en un seul endroit
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 relative z-10">
          <Button 
            onClick={() => handleAuthAction(true)}
            className="w-full h-14 text-lg font-semibold bg-white text-blue-600 hover:bg-gray-50 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Se connecter
          </Button>
          
          <Button 
            onClick={() => handleAuthAction(false)}
            variant="outline"
            className="w-full h-14 text-lg font-semibold bg-transparent text-white border-2 border-white/30 hover:bg-white/10 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            S'inscrire
          </Button>

          {/* Footer Text */}
          <div className="text-center pt-6 space-y-2">
            <p className="text-white/60 text-sm">
              En vous inscrivant, vous acceptez
            </p>
            <div className="flex flex-col space-y-1">
              <button className="text-white/80 text-sm underline hover:text-white transition-colors">
                l'Avis aux utilisateurs
              </button>
              <button className="text-white/80 text-sm underline hover:text-white transition-colors">
                Vous n'arrivez pas à vous connecter ou à vous inscrire ?
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-white/5 rounded-full blur-lg animate-pulse delay-700"></div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => setShowForm(false)}
        className="absolute top-6 left-6 z-20 text-white/80 hover:text-white transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <Card className="w-full max-w-md border-0 shadow-2xl bg-white/95 backdrop-blur-sm animate-fade-in mx-auto">
        <CardHeader className="text-center space-y-6 pb-8 px-6">
          {/* Logo */}
          <div className="flex justify-center items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent tracking-tight">
              SKOOLIFE
            </h1>
          </div>
          
          {/* Welcome Text */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">
              {isLogin ? 'Bon retour !' : 'Rejoignez-nous'}
            </h2>
            <CardDescription className="text-gray-600 text-base">
              {isLogin ? 'Nous sommes ravis de vous revoir' : 'Commencez votre parcours éducatif avec nous'}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-6 pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Nom complet
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Entrez votre nom complet"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className="h-12 text-base border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl transition-all duration-200"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Adresse email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-base border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
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
                  className="h-12 text-base border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl transition-all duration-200 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-xl border border-red-200">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? 'Se connecter' : 'Créer un compte'}
            </Button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-gray-600 text-sm mb-2">
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
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors hover:underline p-1"
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
