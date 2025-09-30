import { motion } from "framer-motion";
import { MessageSquare, Palette, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Consultation initiale",
    description: "Partagez votre vision, vos objectifs et vos préférences de design.",
  },
  {
    number: "02",
    icon: Palette,
    title: "Création et développement",
    description: "Notre équipe conçoit et développe votre site selon vos spécifications.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Livraison et mise en ligne",
    description: "Recevez votre site finalisé et publié en 48-72h.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-medium text-foreground">
            Comment ça marche
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un processus simple et efficace en trois étapes
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                className="text-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-secondary/30 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-foreground" />
                  </div>
                </div>
                <div className="text-4xl font-light text-muted-foreground">
                  {step.number}
                </div>
                <h3 className="text-2xl font-medium text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
