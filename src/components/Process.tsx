import { Card, CardContent } from "@/components/ui/card";
import { Clock, Cog, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import step1 from "@/assets/step-1.png";
import step2 from "@/assets/step-2.png";
import step3 from "@/assets/step-3.png";

const steps = [
  {
    icon: Clock,
    image: step1,
    title: "1. Formulaire 10 min + paiement",
    description: "Remplissez un brief structuré et validez votre commande. Acompte 50% en standard, 100% pour l'option Express."
  },
  {
    icon: Cog,
    image: step2,
    title: "2. Production (copie, visuels, build)",
    description: "Je structure le contenu, génère les visuels avec l'IA et construit votre site. Express 4–8h ou Standard 48–72h."
  },
  {
    icon: Rocket,
    image: step3,
    title: "3. Mise en ligne + mini-tuto + analytics",
    description: "Votre site est déployé, vous recevez un guide de prise en main et les analytics sont configurés."
  }
];

export const Process = () => {
  return (
    <section id="process" className="py-24 px-4 bg-card/20">
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-medium text-foreground">
            Comment ça marche ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un processus simple en 3 étapes
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <Card className="professional-card h-full">
                  <CardContent className="p-8">
                    {/* Icon */}
                    <div className="mb-6">
                      <div className="w-16 h-16 rounded-full bg-secondary/30 flex items-center justify-center mx-auto">
                        <Icon className="w-8 h-8 text-foreground" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-medium mb-3 text-foreground text-center">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-center">
                      {step.description}
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
