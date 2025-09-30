import { Card, CardContent } from "@/components/ui/card";
import { Clock, Shield, Smartphone, Zap, TrendingUp, Headphones } from "lucide-react";
import { motion } from "framer-motion";

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
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background glow */}
      <motion.div 
        className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full bg-secondary/10 blur-[120px]"
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
            <span className="gradient-text">Pourquoi nous choisir ?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Une approche moderne qui combine expertise humaine et puissance de l'IA
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card 
                  className="glass border-border/50 hover:border-primary/30 transition-all group h-full hover-glow"
                >
                  <CardContent className="p-6">
                    {/* Icon */}
                    <motion.div 
                      className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors glow-blue"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Icon className="w-6 h-6 text-primary" />
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
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
