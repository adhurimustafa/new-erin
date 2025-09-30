import { Card, CardContent } from "@/components/ui/card";
import { Palette, Code, Smartphone, Zap, Search, BarChart, Shield } from "lucide-react";
import { motion } from "framer-motion";

const modules = [
  {
    icon: Palette,
    number: "01",
    title: "Design sur mesure",
    description: "Interface moderne et attractive, identité visuelle cohérente avec votre marque, palette de couleurs premium"
  },
  {
    icon: Code,
    number: "02",
    title: "Développement optimisé",
    description: "Code propre et performant, temps de chargement < 3s, technologies modernes (React, Tailwind)"
  },
  {
    icon: Smartphone,
    number: "03",
    title: "Responsive parfait",
    description: "Adapté à tous les écrans (mobile, tablette, desktop), expérience utilisateur fluide sur tous les appareils"
  },
  {
    icon: Zap,
    number: "04",
    title: "Performance maximale",
    description: "Score Lighthouse ≥ 90, optimisation des images, chargement rapide, PWA-ready"
  },
  {
    icon: Search,
    number: "05",
    title: "SEO intégré",
    description: "Meta tags optimisés, structure HTML sémantique, sitemap, robots.txt, Open Graph configuré"
  },
  {
    icon: BarChart,
    number: "06",
    title: "Analytics & suivi",
    description: "Google Analytics ou alternative configurée, tableau de bord de performances, suivi des conversions"
  },
  {
    icon: Shield,
    number: "07",
    title: "Sécurité & hébergement",
    description: "HTTPS activé, hébergement performant, sauvegardes automatiques, protection DDoS incluse"
  }
];

export const Modules = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden bg-midnight">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold">
            <span className="bg-gradient-to-r from-indigo via-cyan to-violet bg-clip-text text-transparent">
              Ce qui est inclus dans chaque projet
            </span>
          </h2>
          <p className="text-xl text-accentlight/80 max-w-3xl mx-auto">
            7 piliers essentiels pour un site web professionnel et performant
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.3 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Card className="h-full glass-card border-indigo/30 relative overflow-hidden">
                  <CardContent className="p-6">
                    {/* Module number badge */}
                    <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br from-violet/20 to-cyan/20 flex items-center justify-center shadow-glow">
                      <span className="text-sm font-bold bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent">
                        {module.number}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo/20 to-cyan/20 flex items-center justify-center mb-4 shadow-glow">
                      <Icon className="w-7 h-7 text-cyan" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-accentlight mb-3">
                      {module.title}
                    </h3>
                    <p className="text-accentlight/70 leading-relaxed">
                      {module.description}
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
