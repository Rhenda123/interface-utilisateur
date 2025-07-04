import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Loader2, BookOpen, Users, Target, Calendar, PiggyBank, FileText, MessageSquare } from 'lucide-react';
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
    return (
      <>
        {/* Mobile and Tablet View */}
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 lg:hidden">
          <div className="w-full max-w-sm mx-auto flex flex-col items-center">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                SKOOLIFE
              </h1>
              <div className="w-12 h-1 bg-yellow-500 mx-auto mt-2 rounded-full"></div>
            </div>

            <Card className="w-full shadow-lg border-border">
              <CardContent className="p-6 flex flex-col items-center space-y-6">
                <div className="w-20 h-20 bg-yellow-100 rounded-2xl flex items-center justify-center">
                  <div className="relative flex items-center justify-center">
                    <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center shadow-lg">
                      <BookOpen className="w-4 h-4 text-yellow-400" />
                    </div>
                    
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

                <div className="text-center space-y-3">
                  <h2 className="text-xl font-bold text-foreground leading-tight">
                    Optimise ton parcours éducatif
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed px-2">
                    Gère tes cours, devoirs et projets en un seul endroit
                  </p>
                  
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

        {/* Desktop View - New Design */}
        <div className="min-h-screen bg-gray-50 hidden lg:flex">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 px-8 py-6">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-yellow-500">SKOOLIFE</h1>
              </div>
              <div className="flex items-center space-x-8">
                <nav className="flex items-center space-x-8">
                  <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Fonctionnalités</a>
                  <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">À propos</a>
                  <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Contact</a>
                </nav>
                <div className="flex items-center space-x-3">
                  <Button 
                    onClick={() => handleAuthAction(false)}
                    variant="outline"
                    className="px-6 py-2 border-gray-300 hover:bg-gray-50"
                  >
                    Rejoindre l'aventure
                  </Button>
                  <Button 
                    onClick={() => handleAuthAction(true)}
                    className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                  >
                    Connexion
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-8 pt-24">
            {/* Hero Section */}
            <div className="text-center max-w-4xl mx-auto mb-16">
              <div className="inline-flex items-center bg-yellow-100 px-4 py-2 rounded-full mb-8">
                <Target className="w-4 h-4 text-yellow-600 mr-2" />
                <span className="text-yellow-800 text-sm font-medium">L'outil ultime pour maîtriser la vie étudiante</span>
              </div>
              
              <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Gérez toute votre <span className="text-yellow-500">vie étudiante</span> en un seul endroit
              </h1>
              
              <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
                Skoolife est la plateforme tout-en-un qui simplifie chaque aspect de votre parcours étudiant. Planning, budget, documents, collaboration - tout ce dont vous avez besoin pour réussir.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-8 mb-16 max-w-4xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Planning intelligent</h3>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <PiggyBank className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Gestion budget</h3>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Documents organisés</h3>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Forum collaboratif</h3>
              </div>
            </div>

            {/* Features Section */}
            <div className="max-w-6xl mx-auto mb-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Tout ce dont vous avez besoin pour réussir
                </h2>
                <p className="text-xl text-gray-600">
                  Découvrez comment Skoolife transforme la gestion de votre vie étudiante avec des outils intuitifs et puissants
                </p>
              </div>

              <div className="grid grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Planning Intelligent</h3>
                  <p className="text-gray-600 text-sm">
                    Organisez vos cours, devoirs et examens avec un planificateur adaptatif
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <PiggyBank className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestion Budget</h3>
                  <p className="text-gray-600 text-sm">
                    Suivez vos dépenses et gérez votre budget étudiant intelligemment
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Documents Organisés</h3>
                  <p className="text-gray-600 text-sm">
                    Centralisez et organisez tous vos fichiers académiques
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Forum Collaboratif</h3>
                  <p className="text-gray-600 text-sm">
                    Échangez avec d'autres étudiants et collaborez efficacement
                  </p>
                </div>
              </div>
            </div>

            {/* Success Partner Section */}
            <div className="max-w-5xl mx-auto mb-16">
              <div className="flex items-center justify-between">
                <div className="max-w-md">
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">
                    Plus qu'une app, votre partenaire de réussite
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Réduisez le stress avec une organisation claire</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Maximisez votre productivité quotidienne</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Gardez le contrôle de votre vie étudiante</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Planifiez votre avenir avec confiance</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 text-center">
                  <div>
                    <div className="text-5xl font-bold text-gray-900 mb-2">4-en-1</div>
                    <div className="text-gray-600">Outils essentiels unifiés</div>
                  </div>
                  <div>
                    <div className="text-5xl font-bold text-gray-900 mb-2">100%</div>
                    <div className="text-gray-600">Pensé pour les étudiants</div>
                  </div>
                  <div>
                    <div className="text-5xl font-bold text-gray-900 mb-2">24/7</div>
                    <div className="text-gray-600">Accessible partout</div>
                  </div>
                  <div>
                    <div className="text-5xl font-bold text-gray-900 mb-2">0€</div>
                    <div className="text-gray-600">Commencez gratuitement</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Ce que disent les étudiants
                </h2>
                <p className="text-xl text-gray-600">
                  Découvrez comment Skoolife transforme le quotidien de milliers d'étudiants
                </p>
              </div>

              <div className="grid grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">
                    "Skoolife a révolutionné ma façon d'organiser mes études. Plus de stress avec les deadlines !"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-semibold text-sm">MA</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Marie A.</div>
                      <div className="text-gray-600 text-sm">Étudiante en droit</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">
                    "Le suivi budgétaire m'aide énormément à gérer mes finances étudiantes. Indispensable !"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-semibold text-sm">TL</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Thomas L.</div>
                      <div className="text-gray-600 text-sm">Étudiant en commerce</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">
                    "L'interface est magnifique et intuitive. J'adore pouvoir tout centraliser au même endroit."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-semibold text-sm">EB</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Emma B.</div>
                      <div className="text-gray-600 text-sm">Étudiante en médecine</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
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
