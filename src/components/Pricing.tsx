import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap } from "lucide-react";
import { motion } from "framer-motion";

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
    <section id="pricing" className="py-20 bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background pointer-events-none" />
      <motion.div 
        className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-primary/10 blur-[120px] -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">Forfaits & Tarifs</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Des prix fixes et transparents. Choisissez le pack adapté à vos besoins.
          </p>
        </motion.div>

        {/* Express Option Banner */}
        <motion.div 
          className="max-w-4xl mx-auto mb-12 p-6 rounded-2xl glass border border-accent/30 glow-cyan relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-primary/5 animate-gradient" />
          <div className="relative z-10 flex items-start gap-4">
            <motion.div 
              className="p-3 rounded-lg bg-accent/20 glow-cyan"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-6 h-6 text-accent" />
            </motion.div>
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <span className="gradient-text">Option Express 4–8h</span>
                <span className="text-muted-foreground text-base">(même jour)</span>
              </h3>
              <p className="text-muted-foreground mb-3">
                Besoin d'un site aujourd'hui ? Créneaux demi-journée (9–13h / 14–20h, Europe/Paris)
              </p>
              <div className="flex flex-wrap gap-3 text-sm mb-3">
                <Badge className="bg-primary/20 text-primary border-primary/30">Pack A: +100€</Badge>
                <Badge className="bg-secondary/20 text-secondary border-secondary/30">Pack B: +150€</Badge>
                <Badge className="bg-accent/20 text-accent border-accent/30">Pack C: +250€</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Paiement 100% à la commande • 1 aller-retour ≤ 15 min • Publication sur domaine demo si DNS pas prêt
              </p>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {packs.map((pack, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <Card 
                className={`relative overflow-hidden h-full glass ${
                  pack.popular ? 'border-primary border-2 glow-blue' : 'border-border/50'
                }`}
              >
                {pack.popular && (
                  <div className="absolute top-0 right-0 px-4 py-1 bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium rounded-bl-lg">
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
                  className={`w-full ${pack.popular ? 'glow-blue hover-glow' : 'glass border-primary/30 hover:border-primary/50'}`}
                  variant={pack.popular ? "default" : "outline"}
                  onClick={scrollToContact}
                >
                  Choisir ce pack
                </Button>
              </CardFooter>
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
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="text-xl gradient-text">Add-ons disponibles</CardTitle>
              <CardDescription>
                Personnalisez votre projet avec ces options supplémentaires
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {addons.map((addon, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg glass border border-border/30 hover:border-primary/30 transition-all hover-glow"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <span className="font-medium">{addon.name}</span>
                    <Badge className="bg-primary/20 text-primary border-primary/30">{addon.price}</Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
