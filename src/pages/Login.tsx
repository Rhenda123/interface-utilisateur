
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
    // Welcome screen with interface-matching colors
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        {/* Main Content Container */}
        <div className="w-full max-w-sm mx-auto flex flex-col items-center">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              SKOOLIFE
            </h1>
            <div className="w-12 h-1 bg-yellow-500 mx-auto mt-2 rounded-full"></div>
          </div>

          {/* Main Rectangle Container */}
          <Card className="w-full shadow-lg border-border">
            <CardContent className="p-6 flex flex-col items-center space-y-6">
              {/* Illustration Container */}
              <div className="w-20 h-20 bg-yellow-100 rounded-2xl flex items-center justify-center">
                {/* Central academic hub */}
                <div className="relative flex items-center justify-center">
                  <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center shadow-lg">
                    <BookOpen className="w-4 h-4 text-yellow-400" />
                  </div>
                  
                  {/* Surrounding elements */}
                  <div className="absolute -top-3 -left-3 w-5 h-5 bg-white rounded-md flex items-center justify-center shadow-md border">
                    <Target className="w-2.5 h-2.5 text-gray-600" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-5 h-5 bg-white rounded-md flex items-center justify-center shadow-md border">
                    <Users className="w-2.5 h-2.5 text-gray-600" />
                  </div>
                  <div className="absolute -bottom-2 left-0 w-4 h-4 bg-yellow-200 rounded-sm flex items-center justify-center shadow-sm">
                    <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                  </div>
                  <div className="absolute -bottom-2 right-0 w-4 h-4 bg-orange-200 rounded-sm flex items-center justify-center shadow-sm">
                    <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Welcome Text */}
              <div className="text-center space-y-3">
                <h2 className="text-xl font-bold text-foreground leading-tight">
                  Optimise ton parcours éducatif
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed px-2">
                  Gère tes cours, devoirs et projets en un seul endroit
                </p>
                
                {/* Features */}
                <div className="flex justify-center space-x-4 text-muted-foreground text-xs pt-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                    <span>Planning</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                    <span>Devoirs</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                    <span>Projets</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full space-y-3">
                <Button 
                  onClick={() => handleAuthAction(true)}
                  className="w-full h-11 text-sm font-semibold bg-gray-900 text-white hover:bg-gray-800 rounded-lg shadow-md transition-all duration-200"
                >
                  Se connecter
                </Button>
                
                <Button 
                  onClick={() => handleAuthAction(false)}
                  variant="outline"
                  className="w-full h-11 text-sm font-semibold border-2 border-gray-200 hover:bg-gray-50 rounded-lg transition-all duration-200"
                >
                  S'inscrire
                </Button>
              </div>

              {/* Footer */}
              <div className="text-center space-y-3 pt-2">
                <p className="text-muted-foreground text-xs">
                  En t'inscrivant, tu acceptes nos
                </p>
                <div className="space-y-1">
                  <button className="block w-full text-foreground text-xs font-medium underline hover:text-muted-foreground transition-colors">
                    Conditions d'utilisation
                  </button>
                  <button className="block w-full text-muted-foreground text-xs underline hover:text-foreground transition-colors">
                    Besoin d'aide pour te connecter ?
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Form screen
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Back Button */}
      <button
        onClick={() => setShowForm(false)}
        className="absolute top-6 left-6 z-20 text-muted-foreground hover:text-foreground transition-colors p-2 bg-card rounded-full border shadow-sm"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center items-center">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              SKOOLIFE
            </h1>
          </div>
          
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-foreground">
              {isLogin ? 'Bon retour !' : 'Rejoins-nous'}
            </h2>
            <CardDescription className="text-muted-foreground text-sm">
              {isLogin ? 'Nous sommes ravis de vous revoir !' : 'Commence ton parcours éducatif avec nous'}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">
                  Nom complet
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Entrez votre nom complet"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className="h-11 border-border focus:border-yellow-500 focus:ring-yellow-500/20 rounded-lg"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Adresse email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 border-border focus:border-yellow-500 focus:ring-yellow-500/20 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
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
                  className="h-11 border-border focus:border-yellow-500 focus:ring-yellow-500/20 rounded-lg pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-destructive text-sm text-center bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? 'Se connecter' : 'Créer un compte'}
            </Button>
          </form>

          <div className="text-center pt-3 border-t border-border">
            <p className="text-muted-foreground text-sm mb-2">
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
              className="text-foreground hover:text-muted-foreground font-medium text-sm transition-colors hover:underline"
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
