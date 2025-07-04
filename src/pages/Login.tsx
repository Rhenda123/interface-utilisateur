
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Loader2, BookOpen, Users, Target } from 'lucide-react';
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
    // Welcome screen with improved design
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-32 right-12 w-24 h-24 bg-orange-200/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-12 w-18 h-18 bg-yellow-200/30 rounded-full blur-xl animate-pulse delay-500"></div>
          <div className="absolute bottom-16 right-16 w-16 h-16 bg-amber-200/20 rounded-full blur-lg animate-pulse delay-700"></div>
        </div>

        {/* Main Content Container */}
        <div className="w-full max-w-sm mx-auto relative z-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
              SKOOLIFE
            </h1>
            <div className="w-16 h-1 bg-gray-700 mx-auto mt-2 rounded-full"></div>
          </div>

          {/* Illustration Container */}
          <div className="w-full max-w-xs mx-auto mb-8">
            <div className="aspect-square bg-white/20 backdrop-blur-sm rounded-3xl shadow-xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
              
              {/* Central academic hub */}
              <div className="relative flex items-center justify-center">
                <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-yellow-300" />
                </div>
                
                {/* Surrounding elements */}
                <div className="absolute -top-5 -left-5 w-7 h-7 bg-white/70 rounded-lg flex items-center justify-center shadow-md">
                  <Target className="w-3.5 h-3.5 text-gray-600" />
                </div>
                <div className="absolute -top-5 -right-5 w-7 h-7 bg-white/70 rounded-lg flex items-center justify-center shadow-md">
                  <Users className="w-3.5 h-3.5 text-gray-600" />
                </div>
                <div className="absolute -bottom-4 left-0 w-6 h-6 bg-yellow-200/70 rounded-md flex items-center justify-center shadow-sm">
                  <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                </div>
                <div className="absolute -bottom-4 right-0 w-6 h-6 bg-orange-200/70 rounded-md flex items-center justify-center shadow-sm">
                  <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 leading-tight">
              Optimise ton parcours éducatif
            </h2>
            <p className="text-gray-700 text-base leading-relaxed">
              Gère tes cours, devoirs et projets en un seul endroit
            </p>
            
            {/* Features */}
            <div className="flex justify-center space-x-6 text-gray-600 text-sm pt-2">
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                <span>Planning</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                <span>Devoirs</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                <span>Projets</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={() => handleAuthAction(true)}
              className="w-full h-12 text-base font-semibold bg-gray-800 text-yellow-300 hover:bg-gray-700 rounded-xl shadow-lg transition-all duration-200"
            >
              Se connecter
            </Button>
            
            <Button 
              onClick={() => handleAuthAction(false)}
              variant="outline"
              className="w-full h-12 text-base font-semibold bg-white/15 text-gray-800 border-2 border-gray-700 hover:bg-white/25 rounded-xl backdrop-blur-sm transition-all duration-200"
            >
              S'inscrire
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center pt-8 space-y-3">
            <p className="text-gray-700 text-sm">
              En t'inscrivant, tu acceptes nos
            </p>
            <div className="space-y-2">
              <button className="block w-full text-gray-800 text-sm font-medium underline hover:text-gray-600 transition-colors">
                Conditions d'utilisation
              </button>
              <button className="block w-full text-gray-700 text-sm underline hover:text-gray-600 transition-colors">
                Besoin d'aide pour te connecter ?
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-24 h-24 bg-white/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-16 w-32 h-32 bg-orange-200/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-16 w-28 h-28 bg-yellow-200/40 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-12 w-20 h-20 bg-amber-200/30 rounded-full blur-lg animate-pulse delay-700"></div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => setShowForm(false)}
        className="absolute top-6 left-6 z-20 text-gray-700 hover:text-gray-800 transition-colors p-2 bg-white/20 rounded-full backdrop-blur-sm"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <Card className="w-full max-w-md border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center items-center">
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              SKOOLIFE
            </h1>
          </div>
          
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-800">
              {isLogin ? 'Bon retour !' : 'Rejoins-nous'}
            </h2>
            <CardDescription className="text-gray-600 text-sm">
              {isLogin ? 'Nous sommes ravis de vous revoir !' : 'Commence ton parcours éducatif avec nous'}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="h-11 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500/20 rounded-xl"
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
                className="h-11 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500/20 rounded-xl"
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
                  className="h-11 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500/20 rounded-xl pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
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
              className="w-full h-11 bg-gray-800 hover:bg-gray-700 text-yellow-300 font-semibold rounded-xl shadow-lg transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? 'Se connecter' : 'Créer un compte'}
            </Button>
          </form>

          <div className="text-center pt-3 border-t border-gray-100">
            <p className="text-gray-600 text-sm mb-2">
              {isLogin ? "Nouveau sur SKOOLIFE ?" : "Tu as déjà un compte ?"}
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
              className="text-gray-800 hover:text-gray-600 font-medium text-sm transition-colors hover:underline"
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
