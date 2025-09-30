import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Clock } from "lucide-react";
import { motion } from "framer-motion";

const packs = [
  {
    name: "Pack A",
    subtitle: "Landing",
    price: "249",
    duration: "48h",
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
    price: "449",
    duration: "72h",
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
    price: "899",
    duration: "1 semaine",
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
    <section id="pricing" className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-medium text-foreground">
            Tarifs transparents
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choisissez la formule adaptée à vos besoins
          </p>
        </motion.div>

        {/* Express Option Banner */}
        <motion.div
          className="mb-12 p-6 rounded-lg professional-card max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-foreground">Option Express 4-8h</h3>
                <p className="text-muted-foreground">Publication le jour même</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground">Supplément selon le pack</p>
              <p className="text-lg font-medium text-foreground">+100€ à +250€</p>
            </div>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {packs.map((pack, index) => (
            <motion.div
              key={pack.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="relative"
            >
              <Card className={`h-full professional-card ${
                pack.popular ? 'border-2 border-accent' : ''
              }`}>
                {pack.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-medium bg-accent text-background">
                    Plus populaire
                  </span>
                )}
                
                <CardHeader>
                  <CardTitle className="text-2xl font-medium text-foreground">{pack.name}</CardTitle>
                  <CardDescription>{pack.subtitle}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-medium text-foreground">{pack.price}€</span>
                  </div>
                  <p className="text-muted-foreground mt-2 text-sm">{pack.duration}</p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {pack.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className={`w-full ${
                      pack.popular 
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                    onClick={scrollToContact}
                  >
                    Choisir ce pack
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Add-ons */}
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="professional-card">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">Add-ons disponibles</CardTitle>
              <CardDescription>
                Personnalisez votre projet avec ces options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {addons.map((addon, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border"
                  >
                    <span className="font-medium text-foreground">{addon.name}</span>
                    <Badge className="bg-accent/20 text-foreground border-accent/30">{addon.price}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
