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
    <section id="process" className="py-20 bg-card/30 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-card/50 pointer-events-none" />
      
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">Comment ça marche ?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un process simple et efficace en 3 étapes pour transformer votre idée en réalité
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card 
                className="relative overflow-hidden glass border-border/50 hover:border-primary/30 transition-all group h-full hover-glow"
              >
                <CardContent className="p-8">
                  {/* Step Number Badge */}
                  <motion.div 
                    className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center glow-blue"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-2xl font-bold gradient-text">{index + 1}</span>
                  </motion.div>

                  {/* Icon/Image */}
                  <motion.div 
                    className="mb-6 relative"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-24 h-24 mx-auto object-contain"
                    />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
