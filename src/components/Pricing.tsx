import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap } from "lucide-react";

const packs = [
  {
    name: "Pack A",
    subtitle: "Landing",
    price: "249€",
    duration: "48h",
    express: "+100€",
    features: [
      "1 page landing responsive",
      "Design moderne et mobile-first",
      "Formulaire de contact",
      "SEO de base",
      "Analytics configurés",
      "1 aller-retour de modifications"
    ],
    popular: false
  },
  {
    name: "Pack B",
    subtitle: "Mini Brand + Landing",
    price: "449€",
    duration: "72h",
    express: "+150€",
    features: [
      "Tout du Pack A +",
      "Logo et identité visuelle",
      "Palette de couleurs",
      "Typographie personnalisée",
      "Kit de marque (PDF)",
      "2 aller-retours de modifications"
    ],
    popular: true
  },
  {
    name: "Pack C",
    subtitle: "Prototype Sprint",
    price: "899€",
    duration: "1 semaine",
    express: "+250€",
    features: [
      "Tout du Pack B +",
      "Site multi-pages (jusqu'à 5)",
      "Fonctionnalités avancées",
      "CMS simple intégré",
      "Documentation complète",
      "2 aller-retours de modifications"
    ],
    popular: false
  }
];

const addons = [
  { name: "FR/EN bilingue", price: "+80€" },
  { name: "Réservation/Calendrier", price: "+50€" },
  { name: "SEO avancé", price: "+70€" },
  { name: "Vidéo 45s", price: "+120€" }
];

export const Pricing = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Forfaits & Tarifs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Des prix fixes et transparents. Choisissez le pack adapté à vos besoins.
          </p>
        </div>

        {/* Express Option Banner */}
        <div className="max-w-4xl mx-auto mb-12 p-6 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/20">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                Option Express 4–8h (même jour)
              </h3>
              <p className="text-muted-foreground mb-3">
                Besoin d'un site aujourd'hui ? Ajoutez l'option Express à votre pack :
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <Badge variant="secondary">Pack A: +100€</Badge>
                <Badge variant="secondary">Pack B: +150€</Badge>
                <Badge variant="secondary">Pack C: +250€</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Paiement 100% à la commande • 1 aller-retour ≤ 15 min
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {packs.map((pack, index) => (
            <Card 
              key={index}
              className={`relative overflow-hidden transition-all hover:shadow-xl animate-slide-up ${
                pack.popular ? 'border-primary border-2 shadow-lg' : 'border-2'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {pack.popular && (
                <div className="absolute top-0 right-0 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-bl-lg">
                  Plus populaire
                </div>
              )}
              
              <CardHeader className="pb-8 pt-8">
                <CardTitle className="text-2xl">{pack.name}</CardTitle>
                <CardDescription className="text-base">{pack.subtitle}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">{pack.price}</span>
                  <span className="text-muted-foreground ml-2">/ {pack.duration}</span>
                </div>
                <p className="text-sm text-primary font-medium mt-2">
                  Express: {pack.express}
                </p>
              </CardHeader>

              <CardContent className="pb-8">
                <ul className="space-y-3">
                  {pack.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={pack.popular ? "default" : "outline"}
                  onClick={scrollToContact}
                >
                  Choisir ce pack
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Add-ons */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl">Add-ons disponibles</CardTitle>
              <CardDescription>
                Personnalisez votre projet avec ces options supplémentaires
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {addons.map((addon, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border"
                  >
                    <span className="font-medium">{addon.name}</span>
                    <Badge variant="secondary">{addon.price}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
