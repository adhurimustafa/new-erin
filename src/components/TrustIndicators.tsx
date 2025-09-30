import { Star, Award, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const indicators = [
  {
    icon: Star,
    title: "5/5",
    subtitle: "Satisfaction client",
    description: "Basé sur +50 projets livrés"
  },
  {
    icon: Award,
    title: "100% Livré",
    subtitle: "Engagement qualité",
    description: "Délais garantis ou remboursé"
  },
  {
    icon: TrendingUp,
    title: "Express 4-8h",
    subtitle: "Option ultra-rapide",
    description: "Publication le jour même"
  }
];

export const TrustIndicators = () => {
  return (
    <section className="py-16 px-4 relative overflow-hidden bg-midnight">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-cyan via-indigo to-violet bg-clip-text text-transparent">
              Une solution web d'exception
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {indicators.map((indicator, index) => {
            const Icon = indicator.icon;
            return (
              <motion.div
                key={index}
                className="glass-card border-cyan/30 p-8 text-center rounded-2xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo/20 to-cyan/20 flex items-center justify-center shadow-glow">
                  <Icon className="w-8 h-8 text-cyan" />
                </div>
                <h3 className="text-4xl font-extrabold bg-gradient-to-r from-cyan to-indigo bg-clip-text text-transparent mb-2">
                  {indicator.title}
                </h3>
                <p className="text-lg font-semibold text-accentlight mb-2">
                  {indicator.subtitle}
                </p>
                <p className="text-accentlight/70 text-sm">
                  {indicator.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
