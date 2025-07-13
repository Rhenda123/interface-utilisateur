
import React from "react";
import { Button } from "@/components/ui/button";
import { Building2, User, ArrowRight } from "lucide-react";

interface MobileOfferSelectionProps {
  onSelectOffer: (offer: 'plus' | 'campus') => void;
  onBack: () => void;
}

export default function MobileOfferSelection({ onSelectOffer, onBack }: MobileOfferSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-skoolife-light to-skoolife-white flex flex-col section-padding">
      {/* Header avec espace pour Dynamic Island */}
      <div className="text-center mb-8 pt-16 mt-4">
        <h1 className="text-3xl font-bold gradient-skoolife bg-clip-text text-transparent mb-2">
          SKOOLIFE
        </h1>
        <p className="text-gray-600 text-base">
          Choisissez votre offre
        </p>
      </div>

      {/* Offer Cards */}
      <div className="space-y-4 mb-6">
        {/* Skoolife+ (B2C) */}
        <div
          onClick={() => onSelectOffer('plus')}
          className="bg-white rounded-2xl shadow-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-2xl active:scale-98 border-2 border-transparent hover:border-skoolife-primary/20"
        >
          <div className="flex items-start gap-4">
            <div className="bg-skoolife-light p-3 rounded-xl">
              <User className="h-6 w-6 text-skoolife-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-gray-900">SKOOLIFE+</h3>
                <span className="bg-skoolife-secondary text-gray-900 text-xs font-bold px-2 py-1 rounded-full">
                  B2C
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Abonnement individuel premium avec toutes les fonctionnalités avancées
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-gray-900">4,99 €</span>
                  <span className="text-sm text-gray-600">/mois</span>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Skoolife Campus (B2B2C) */}
        <div
          onClick={() => onSelectOffer('campus')}
          className="bg-white rounded-2xl shadow-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-2xl active:scale-98 border-2 border-transparent hover:border-blue-500/20"
        >
          <div className="flex items-start gap-4">
            <div className="bg-blue-50 p-3 rounded-xl">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-gray-900">SKOOLIFE Campus</h3>
                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  B2B2C
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Accès via votre établissement scolaire avec un code d'inscription
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-semibold text-blue-600">Code établissement requis</span>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="text-center pt-4 border-t border-gray-100">
        <p className="text-gray-600 mb-2 text-sm">
          Déjà un compte ?
        </p>
        <button
          onClick={onBack}
          className="text-skoolife-primary font-semibold hover:underline text-sm"
        >
          Se connecter
        </button>
      </div>

      {/* Footer avec espace pour la zone de sécurité en bas */}
      <div className="text-center mt-auto text-gray-500 text-xs pb-8">
        <p>© 2025 SKOOLIFE. Tous droits réservés.</p>
      </div>
    </div>
  );
}
