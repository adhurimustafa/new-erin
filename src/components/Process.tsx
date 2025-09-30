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
            <span className="bg-gradient-to-r from-cyan via-violet to-indigo bg-clip-text text-transparent">
              Comment ça marche ?
            </span>
          </h2>
          <p className="text-xl text-accentlight/80 max-w-2xl mx-auto">
            Un processus simple et efficace en 3 étapes pour transformer votre idée en réalité
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <Card className="relative overflow-hidden glass-card border-indigo/30 h-full">
                <CardContent className="p-8">
                  {/* Step Number Badge */}
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br from-cyan/20 to-violet/20 flex items-center justify-center shadow-glow">
                    <span className="text-2xl font-bold bg-gradient-to-r from-cyan to-indigo bg-clip-text text-transparent">{index + 1}</span>
                  </div>

                  {/* Icon/Image */}
                  <div className="mb-6 relative">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-24 h-24 mx-auto object-contain"
                    />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3 text-accentlight">
                    {step.title}
                  </h3>
                  <p className="text-accentlight/70 leading-relaxed">
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
