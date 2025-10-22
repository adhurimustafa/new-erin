import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Sparkles, Rocket, Heart } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: MessageCircle,
    title: "1. Discussion",
    description: "Nous prenons le temps d'écouter et de comprendre votre besoin. Un échange humain et bienveillant pour définir la meilleure solution."
  },
  {
    icon: Sparkles,
    title: "2. Création IA + Humaine",
    description: "L'intelligence artificielle travaille à vos côtés, guidée par notre expertise humaine. Le meilleur des deux mondes pour un résultat optimal."
  },
  {
    icon: Rocket,
    title: "3. Livraison",
    description: "Votre solution est prête ! Rapide, efficace, et exactement comme vous l'avez imaginée. Sans stress, sans complication."
  },
  {
    icon: Heart,
    title: "4. Accompagnement",
    description: "Nous restons à vos côtés après la livraison. Formation, support, conseils : vous n'êtes jamais seul avec TADAM."
  }
];

export const Process = () => {
  return (
    <section id="process" className="py-24 px-4 relative overflow-hidden" style={{ background: '#0A1025' }}>
      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div 
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold">
            <span className="bg-gradient-to-r from-turquoise via-golden to-purple bg-clip-text text-transparent">
              Comment ça marche ?
            </span>
          </h2>
          <p className="text-xl text-accentlight/80 max-w-2xl mx-auto">
            Un processus simple et humain en 4 étapes
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Card className="relative overflow-hidden glass-card border-purple/30 h-full">
                  <CardContent className="p-6">
                    {/* Step Number Badge */}
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gradient-to-br from-golden/20 to-purple/20 flex items-center justify-center shadow-glow">
                      <span className="text-xl font-bold bg-gradient-to-r from-golden to-purple bg-clip-text text-transparent">{index + 1}</span>
                    </div>

                    {/* Icon */}
                    <div className="mb-6">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple/20 to-turquoise/20 flex items-center justify-center mx-auto shadow-glow">
                        <Icon className="w-8 h-8 text-golden" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold mb-3 text-accentlight text-center">
                      {step.title}
                    </h3>
                    <p className="text-accentlight/70 leading-relaxed text-center text-sm">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <p className="text-lg text-accentlight/80 mb-4">
            Prêt à découvrir la magie de TADAM ?
          </p>
          <button
            onClick={() => {
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-3 bg-gradient-tadam rounded-xl text-midnight font-semibold hover:shadow-glow transition-all duration-300 hover:scale-105"
          >
            Contactez-nous
          </button>
        </motion.div>
      </div>
    </section>
  );
};
