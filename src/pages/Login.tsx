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
    // Welcome screen with SKOOLIFE yellow theme
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-300 to-amber-400 flex flex-col justify-between p-6 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-24 h-24 bg-white/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-16 w-32 h-32 bg-orange-200/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-40 left-16 w-28 h-28 bg-yellow-200/40 rounded-full blur-xl animate-pulse delay-500"></div>
          <div className="absolute bottom-20 right-12 w-20 h-20 bg-amber-200/30 rounded-full blur-lg animate-pulse delay-700"></div>
          
          {/* Floating academic elements */}
          <div className="absolute top-32 right-32 text-yellow-600/20 text-4xl animate-bounce">📚</div>
          <div className="absolute bottom-64 left-8 text-orange-600/20 text-3xl animate-bounce delay-300">🎓</div>
          <div className="absolute top-64 left-16 text-amber-600/20 text-2xl animate-bounce delay-700">✨</div>
        </div>

        {/* Header with Logo */}
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 relative z-10">
          {/* Logo */}
          <div className="mb-6">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 tracking-tight drop-shadow-sm">
              SKOOLIFE
            </h1>
            <div className="w-24 h-1 bg-gray-700 mx-auto mt-2 rounded-full"></div>
          </div>

          {/* Modern Student-focused Illustration */}
          <div className="w-72 h-56 mb-8 relative">
            <div className="w-full h-full bg-white/25 backdrop-blur-sm rounded-3xl shadow-xl flex items-center justify-center relative overflow-hidden">
              {/* Modern illustration with student elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              
              {/* Central academic hub concept */}
              <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-8 h-8 text-yellow-300" />
                </div>
                
                {/* Surrounding elements representing different academic areas */}
                <div className="absolute -top-8 -left-8 w-10 h-10 bg-white/80 rounded-xl flex items-center justify-center shadow-md">
                  <Target className="w-5 h-5 text-gray-600" />
                </div>
                <div className="absolute -top-8 -right-8 w-10 h-10 bg-white/80 rounded-xl flex items-center justify-center shadow-md">
                  <Users className="w-5 h-5 text-gray-600" />
                </div>
                <div className="absolute -bottom-6 left-0 w-8 h-8 bg-yellow-200/80 rounded-lg flex items-center justify-center shadow-sm">
                  <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                </div>
                <div className="absolute -bottom-6 right-0 w-8 h-8 bg-orange-200/80 rounded-lg flex items-center justify-center shadow-sm">
                  <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                </div>
              </div>
              
              {/* Connecting lines for modern tech feel */}
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 288 224">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgb(107, 114, 128)" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="rgb(107, 114, 128)" stopOpacity="0.1"/>
                    </linearGradient>
                  </defs>
                  <path d="M100 80 L144 112 L188 80" stroke="url(#lineGradient)" strokeWidth="2" fill="none"/>
                  <path d="M100 144 L144 112 L188 144" stroke="url(#lineGradient)" strokeWidth="2" fill="none"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Welcome Text with better hierarchy */}
          <div className="space-y-6 max-w-sm">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
              Optimise ton parcours éducatif
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed font-medium">
              Gère tes cours, devoirs et projets en un seul endroit
            </p>
            
            {/* Key features */}
            <div className="flex justify-center space-x-6 text-gray-600 text-sm pt-2">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                <span>Planning</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                <span>Devoirs</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                <span>Projets</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons with improved styling */}
        <div className="space-y-4 relative z-10">
          <Button 
            onClick={() => handleAuthAction(true)}
            className="w-full h-16 text-lg font-bold bg-gray-800 text-yellow-300 hover:bg-gray-700 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border-2 border-gray-700"
          >
            Se connecter
          </Button>
          
          <Button 
            onClick={() => handleAuthAction(false)}
            variant="outline"
            className="w-full h-16 text-lg font-bold bg-white/20 text-gray-800 border-3 border-gray-700 hover:bg-white/30 rounded-2xl backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
          >
            S'inscrire
          </Button>

          {/* Footer Text with better styling */}
          <div className="text-center pt-8 space-y-3">
            <p className="text-gray-700 text-sm font-medium">
              En t'inscrivant, tu acceptes nos
            </p>
            <div className="flex flex-col space-y-2">
              <button className="text-gray-800 text-sm font-semibold underline hover:text-gray-600 transition-colors">
                Conditions d'utilisation
              </button>
              <button className="text-gray-700 text-sm underline hover:text-gray-600 transition-colors">
                Besoin d'aide pour te connecter ?
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form screen with yellow theme
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-300 to-amber-400 flex items-center justify-center p-4 relative overflow-hidden">
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

      <Card className="w-full max-w-md border-0 shadow-2xl bg-white/95 backdrop-blur-sm animate-fade-in mx-auto">
        <CardHeader className="text-center space-y-6 pb-8 px-6">
          {/* Logo */}
          <div className="flex justify-center items-center">
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              SKOOLIFE
            </h1>
          </div>
          
          {/* Welcome Text */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-800">
              {isLogin ? 'Bon retour !' : 'Rejoins-nous'}
            </h2>
            <CardDescription className="text-gray-600 text-base font-medium">
              {isLogin ? 'Nous sommes ravis de vous revoir !' : 'Commence ton parcours éducatif avec nous'}
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
                  className="h-12 text-base border-gray-200 focus:border-yellow-500 focus:ring-yellow-500/20 rounded-xl transition-all duration-200"
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
                className="h-12 text-base border-gray-200 focus:border-yellow-500 focus:ring-yellow-500/20 rounded-xl transition-all duration-200"
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
                  className="h-12 text-base border-gray-200 focus:border-yellow-500 focus:ring-yellow-500/20 rounded-xl transition-all duration-200 pr-12"
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
              className="w-full h-12 text-base bg-gray-800 hover:bg-gray-700 text-yellow-300 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? 'Se connecter' : 'Créer un compte'}
            </Button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="text-center pt-4 border-t border-gray-100">
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
              className="text-gray-800 hover:text-gray-600 font-bold text-sm transition-colors hover:underline p-1"
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
