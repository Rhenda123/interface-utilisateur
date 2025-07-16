import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, GraduationCap, Users, Code, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Offers() {
  const [campusCode, setCampusCode] = useState("");
  const [isActivating, setIsActivating] = useState(false);
  const { toast } = useToast();

  const handleActivateCampusCode = async () => {
    if (!campusCode.trim()) {
      toast({
        title: "Code requis",
        description: "Veuillez saisir votre code d'accès Campus",
        variant: "destructive"
      });
      return;
    }

    setIsActivating(true);
    
    // Simulation d'activation - À remplacer par la vraie logique
    setTimeout(() => {
      setIsActivating(false);
      toast({
        title: "Code activé avec succès !",
        description: "Votre accès Premium Skoolife Campus est maintenant actif",
      });
      setCampusCode("");
    }, 2000);
  };

  const plans = [
    {
      name: "Gratuit",
      price: "0€",
      period: "/mois",
      description: "Parfait pour commencer",
      features: [
        "Gestion basique des tâches",
        "Planning personnel",
        "Stockage limité",
        "Support communautaire"
      ],
      current: true
    },
    {
      name: "Premium",
      price: "4,99€",
      period: "/mois",
      description: "Pour les étudiants organisés",
      features: [
        "Toutes les fonctionnalités gratuites",
        "Synchronisation calendrier avancée",
        "Stockage illimité",
        "Outils de collaboration",
        "Support prioritaire",
        "Templates exclusifs"
      ],
      popular: true
    },
    {
      name: "Campus",
      price: "Gratuit",
      period: "avec code école",
      description: "Accès Premium offert par votre établissement",
      features: [
        "Toutes les fonctionnalités Premium",
        "Intégration avec l'ENT de l'école",
        "Collaboration avec les camarades",
        "Ressources pédagogiques exclusives",
        "Support dédié établissement"
      ],
      campus: true
    }
  ];

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="text-center space-y-4">
        <h1 className="skoolife-title text-gray-900 dark:text-white">
          Offres Skoolife
        </h1>
        <p className="skoolife-caption text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Choisissez l'offre qui correspond le mieux à vos besoins d'étudiant
        </p>
      </div>

      {/* Section Skoolife Campus - Mise en avant */}
      <Card className="border-2 border-gradient-to-r from-skoolife-primary to-skoolife-accent bg-gradient-to-br from-skoolife-light/50 to-white dark:from-gray-800/50 dark:to-gray-900 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <GraduationCap className="h-8 w-8 text-skoolife-primary" />
            <CardTitle className="skoolife-subtitle text-skoolife-primary">
              Skoolife Campus
            </CardTitle>
          </div>
          <CardDescription className="skoolife-caption text-gray-600 dark:text-gray-300">
            Votre école a partenaire avec Skoolife ? Activez votre accès Premium gratuit
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-skoolife-primary/10 rounded-lg">
                <Code className="h-5 w-5 text-skoolife-primary" />
              </div>
              <div>
                <h3 className="skoolife-subtitle text-gray-900 dark:text-white">
                  Code d'accès Campus
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Saisissez le code fourni par votre établissement
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Input
                placeholder="Entrez votre code d'accès..."
                value={campusCode}
                onChange={(e) => setCampusCode(e.target.value.toUpperCase())}
                className="text-center font-mono text-lg tracking-wider"
                maxLength={12}
              />
              
              <Button 
                onClick={handleActivateCampusCode}
                disabled={isActivating || !campusCode.trim()}
                className="w-full bg-skoolife-primary hover:bg-skoolife-primary/90 text-white"
                size="lg"
              >
                {isActivating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Activation en cours...
                  </>
                ) : (
                  <>
                    Activer mon accès Campus
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            <div className="text-center pt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Pas de code ? Contactez l'administration de votre établissement
              </p>
            </div>
          </div>

          {/* Avantages Campus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Premium gratuit
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Collaboration étudiante
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grille des offres */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <Card 
            key={index} 
            className={`relative transition-all duration-300 hover:shadow-lg ${
              plan.popular 
                ? 'border-2 border-skoolife-primary shadow-lg scale-105' 
                : plan.campus
                ? 'border-2 border-skoolife-accent'
                : 'border border-gray-200 dark:border-gray-700'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-skoolife-primary text-white px-4 py-1">
                  <Star className="w-3 h-3 mr-1" />
                  Populaire
                </Badge>
              </div>
            )}
            
            {plan.campus && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-skoolife-accent text-white px-4 py-1">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  Campus
                </Badge>
              </div>
            )}

            <CardHeader className="text-center space-y-3">
              <CardTitle className="skoolife-subtitle text-gray-900 dark:text-white">
                {plan.name}
              </CardTitle>
              <div className="space-y-1">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {plan.period}
                  </span>
                </div>
                <CardDescription className="text-sm">
                  {plan.description}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full ${
                  plan.current 
                    ? 'bg-gray-100 text-gray-500 cursor-default' 
                    : plan.popular || plan.campus
                    ? 'bg-skoolife-primary hover:bg-skoolife-primary/90 text-white'
                    : 'border border-skoolife-primary text-skoolife-primary hover:bg-skoolife-primary hover:text-white'
                }`}
                variant={plan.current ? "secondary" : plan.popular || plan.campus ? "default" : "outline"}
                disabled={plan.current || plan.campus}
              >
                {plan.current 
                  ? 'Plan actuel' 
                  : plan.campus 
                  ? 'Nécessite un code'
                  : 'Choisir ce plan'
                }
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Section FAQ rapide */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 space-y-4">
        <h3 className="skoolife-subtitle text-gray-900 dark:text-white text-center">
          Questions fréquentes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Comment obtenir un code Campus ?
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Contactez l'administration de votre établissement ou vérifiez vos emails officiels.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Le code Campus expire-t-il ?
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              L'accès Campus reste actif tant que vous êtes scolarisé dans l'établissement partenaire.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}