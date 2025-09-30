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
    <section className="py-24 px-4 relative overflow-hidden bg-midnight">
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold">
            <span className="bg-gradient-to-r from-indigo via-violet to-cyan bg-clip-text text-transparent">
              Pourquoi nous choisir
            </span>
          </h2>
          <p className="text-xl text-accentlight/80 max-w-2xl mx-auto">
            Une solution complète pour lancer votre présence en ligne rapidement et efficacement
          </p>
        </motion.div>

        {/* Benefits grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Card className="h-full glass-card border-indigo/30">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo/20 to-cyan/20 flex items-center justify-center mb-4 shadow-glow">
                      <Icon className="w-6 h-6 text-cyan" />
                    </div>
                    <h3 className="text-xl font-bold text-accentlight mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-accentlight/70">
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
