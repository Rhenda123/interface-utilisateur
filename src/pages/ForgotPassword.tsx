
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Loader2, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { toast } = useToast();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsEmailSent(true);
      toast({
        title: "Email envoyé !",
        description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe.",
      });
    }, 1500);
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-background theme-transition flex flex-col">
        <header className="glass-effect border-b border-border/50 py-4 sm:py-6">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/login" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-5 h-5 text-secondary" />
              <h1 className="text-xl sm:text-2xl font-bold gradient-text">SKOOLIFE</h1>
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md text-center space-y-8">
            <div className="space-y-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 gradient-bg rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-primary">Email envoyé !</h2>
                <p className="text-secondary text-base sm:text-lg">
                  Nous avons envoyé un lien de réinitialisation à {email}
                </p>
              </div>
            </div>

            <Card className="card-elevated border-border/50 theme-transition">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <p className="text-secondary text-sm text-center">
                    Vous ne trouvez pas l'email ? Vérifiez votre dossier spam ou essayez avec une autre adresse.
                  </p>
                  <Button 
                    onClick={() => setIsEmailSent(false)}
                    variant="outline" 
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    Réessayer avec une autre adresse
                  </Button>
                  <Link to="/login">
                    <Button className="w-full gradient-bg hover:opacity-90 text-white">
                      Retour à la connexion
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background theme-transition flex flex-col">
      {/* Header */}
      <header className="glass-effect border-b border-border/50 py-4 sm:py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/login" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-5 h-5 text-secondary" />
              <h1 className="text-xl sm:text-2xl font-bold gradient-text">SKOOLIFE</h1>
            </Link>
            <div className="text-sm text-secondary">
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 gradient-bg rounded-3xl flex items-center justify-center mx-auto shadow-lg">
              <KeyRound className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary">Mot de passe oublié ?</h2>
              <p className="text-secondary text-base sm:text-lg">
                Pas de problème ! Nous vous enverrons un lien de réinitialisation.
              </p>
            </div>
          </div>

          {/* Forgot Password Form */}
          <Card className="card-elevated border-border/50 theme-transition">
            <CardHeader className="space-y-1 text-center pb-4">
              <CardTitle className="text-xl font-semibold text-primary">Réinitialiser le mot de passe</CardTitle>
              <CardDescription className="text-secondary">
                Entrez votre adresse email pour recevoir un lien de réinitialisation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleForgotPassword} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-primary">
                    Adresse email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-4 h-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 h-12 border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl theme-transition"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 gradient-bg hover:opacity-90 text-white font-semibold rounded-xl shadow-lg text-base transition-all theme-transition"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    "Envoyer le lien de réinitialisation"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Back to Login */}
          <div className="text-center">
            <p className="text-secondary text-sm">
              Vous vous souvenez de votre mot de passe ?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="surface-tertiary border-t border-border/50 py-6 theme-transition">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-secondary text-sm">
              &copy; 2024 Skoolife. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ForgotPassword;
