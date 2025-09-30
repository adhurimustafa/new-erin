import { Button } from "@/components/ui/button";
import { CheckCircle2, Home, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4">
      <div className="max-w-2xl mx-auto text-center animate-fade-in">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-8 animate-scale-in">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>

        {/* Content */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Merci pour votre message !
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Nous avons bien reçu votre demande et nous vous répondrons dans les <strong>24 heures</strong>.
        </p>

        {/* Info Box */}
        <div className="bg-card border-2 rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Prochaines étapes
          </h2>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-medium shrink-0">
                1
              </span>
              <span>Notre équipe examine votre demande</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-medium shrink-0">
                2
              </span>
              <span>Nous vous contactons pour discuter de votre projet</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-medium shrink-0">
                3
              </span>
              <span>Nous vous proposons un devis personnalisé</span>
            </li>
          </ol>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            onClick={() => navigate("/")}
            className="group"
          >
            <Home className="w-5 h-5 mr-2" />
            Retour à l'accueil
          </Button>
          <Button 
            size="lg"
            variant="outline"
            onClick={() => window.location.href = "mailto:[EMAIL CONTACT]"}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Nous contacter directement
          </Button>
        </div>

        {/* Additional Info */}
        <p className="text-sm text-muted-foreground mt-8">
          Besoin d'une réponse urgente ?{" "}
          <a href="tel:[TÉLÉPHONE]" className="text-primary hover:underline font-medium">
            Appelez-nous au [TÉLÉPHONE]
          </a>
        </p>
      </div>
    </div>
  );
};

export default ThankYou;
