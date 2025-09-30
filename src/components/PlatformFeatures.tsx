import { Card, CardContent } from "@/components/ui/card";
import { Palette, Code, Smartphone, Search, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Palette,
    title: "Design sur mesure",
    description: "Interface moderne et attractive, cohérente avec votre marque.",
  },
  {
    icon: Code,
    title: "Développement optimisé",
    description: "Code propre, performant et technologies modernes.",
  },
  {
    icon: Smartphone,
    title: "Responsive parfait",
    description: "Adapté à tous les écrans pour une expérience fluide.",
  },
  {
    icon: Search,
    title: "SEO intégré",
    description: "Optimisé pour les moteurs de recherche dès le départ.",
  },
  {
    icon: Shield,
    title: "Sécurisé",
    description: "HTTPS, hébergement performant et sauvegardes automatiques.",
  },
  {
    icon: Zap,
    title: "Performance maximale",
    description: "Temps de chargement ultra-rapide et score Lighthouse élevé.",
  },
];

export const PlatformFeatures = () => {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-medium text-foreground">
            Ce qui est inclus
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tous les éléments essentiels pour un site web professionnel
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="h-full professional-card">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-secondary/30 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-foreground" />
                    </div>
                    <h3 className="text-xl font-medium text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
