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
    <section id="pricing" className="py-24 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, #0A1025 20%, #141934 80%)',
        }}
      />

      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold">
            <span className="bg-gradient-to-r from-cyan via-indigo to-violet bg-clip-text text-transparent">
              Forfaits transparents
            </span>
          </h2>
          <p className="text-xl text-accentlight/80 max-w-2xl mx-auto">
            Choisissez la formule adaptée à vos besoins. Paiement sécurisé, livraison garantie.
          </p>
        </motion.div>

        {/* Express Option Banner */}
        <motion.div
          className="mb-12 p-6 rounded-2xl glass-card border-2 border-cyan/40 max-w-4xl mx-auto animate-pulseGlow"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-cyan" fill="currentColor" />
              <div>
                <h3 className="text-xl font-bold text-accentlight">Option Express 4-8h</h3>
                <p className="text-accentlight/70">Publication le jour même</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-accentlight/70">Supplément selon le pack</p>
              <p className="text-lg font-bold bg-gradient-to-r from-gold to-salmon bg-clip-text text-transparent">+100€ à +250€</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 text-sm text-accentlight/70 space-y-2">
            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan" />
              Créneaux : 9h-13h / 14h-20h (Europe/Paris)
            </p>
            <p>
              Livraison 1 page (max 6 sections) + 1 mini-édition (≤15 min) • Paiement 100% à la commande
            </p>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {packs.map((pack, index) => (
            <motion.div
              key={pack.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="relative"
            >
              <Card className={`h-full glass-card transition-all duration-200 ${
                pack.popular ? 'border-2 border-cyan/60 shadow-glow animate-pulseGlow' : 'border-indigo/30'
              }`}>
                {pack.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-violet to-cyan text-white shadow-neon">
                    Plus populaire
                  </span>
                )}
                
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-accentlight">{pack.name}</CardTitle>
                  <CardDescription className="text-accentlight/60">{pack.subtitle}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-extrabold bg-gradient-to-r from-cyan to-indigo bg-clip-text text-transparent">{pack.price}€</span>
                  </div>
                  <p className="text-accentlight/70 mt-2 text-sm">{pack.duration}</p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {pack.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-cyan mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-accentlight/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className={`w-full font-semibold rounded-2xl transition-all duration-200 ${
                      pack.popular 
                        ? 'bg-gradient-to-r from-indigo via-cyan to-violet shadow-neon hover:brightness-125' 
                        : 'border-2 border-indigo/50 bg-transparent text-accentlight hover:bg-indigo/10'
                    }`}
                    variant={pack.popular ? "default" : "outline"}
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
