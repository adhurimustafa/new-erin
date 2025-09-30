import { Card, CardContent } from "@/components/ui/card";
import { Clock, Cog, Rocket } from "lucide-react";
import step1 from "@/assets/step-1.png";
import step2 from "@/assets/step-2.png";
import step3 from "@/assets/step-3.png";

const steps = [
  {
    icon: Clock,
    image: step1,
    title: "1. Formulaire 10 min + paiement",
    description: "Remplissez un brief structuré et validez votre commande. Acompte 50% en standard, 100% pour l'option Express."
  },
  {
    icon: Cog,
    image: step2,
    title: "2. Production (copie, visuels, build)",
    description: "Je structure le contenu, génère les visuels avec l'IA et construit votre site. Express 4–8h ou Standard 48–72h."
  },
  {
    icon: Rocket,
    image: step3,
    title: "3. Mise en ligne + mini-tuto + analytics",
    description: "Votre site est déployé, vous recevez un guide de prise en main et les analytics sont configurés."
  }
];

export const Process = () => {
  return (
    <section id="process" className="py-20 bg-muted/30">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un process simple et efficace en 3 étapes pour transformer votre idée en réalité
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <Card 
              key={index} 
              className="relative overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-lg group animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                {/* Step Number Badge */}
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{index + 1}</span>
                </div>

                {/* Icon/Image */}
                <div className="mb-6 relative">
                  <img 
                    src={step.image} 
                    alt={step.title}
                    className="w-24 h-24 mx-auto object-contain group-hover:scale-110 transition-transform"
                  />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
