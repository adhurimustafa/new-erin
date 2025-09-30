import { Card, CardContent } from "@/components/ui/card";
import { Clock, Shield, Smartphone, Zap, TrendingUp, Headphones } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "Livraison rapide garantie",
    description: "48–72h en standard, 4–8h en Express. Pas de surprise, des délais tenus."
  },
  {
    icon: Zap,
    title: "Performance optimale",
    description: "Sites optimisés, temps de chargement < 3s, score Lighthouse ≥ 90."
  },
  {
    icon: Smartphone,
    title: "100% Mobile-first",
    description: "Design responsive parfait sur tous les appareils. Mobile, tablette, desktop."
  },
  {
    icon: Shield,
    title: "Prix fixes et transparents",
    description: "Pas de coûts cachés. Ce que vous voyez est ce que vous payez."
  },
  {
    icon: TrendingUp,
    title: "SEO & Analytics inclus",
    description: "Optimisation SEO de base et analytics configurés dès le départ."
  },
  {
    icon: Headphones,
    title: "Support et accompagnement",
    description: "Mini-tuto de prise en main + support post-livraison inclus."
  }
];

export const Benefits = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Pourquoi nous choisir ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Une approche moderne qui combine expertise humaine et puissance de l'IA
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card 
                key={index}
                className="border-2 hover:border-primary/50 transition-all hover:shadow-lg group animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  {/* Icon */}
                  <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
