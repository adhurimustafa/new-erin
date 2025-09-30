import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Sparkles, FileText, Users } from "lucide-react";
import { motion } from "framer-motion";

const solutions = [
  {
    icon: Briefcase,
    title: "Entrepreneurs",
    description: "Lancez votre activité rapidement avec un site professionnel qui inspire confiance.",
  },
  {
    icon: Sparkles,
    title: "Créateurs de contenu",
    description: "Présentez votre travail et votre expertise avec un portfolio élégant.",
  },
  {
    icon: FileText,
    title: "Consultants",
    description: "Établissez votre crédibilité avec une présence en ligne professionnelle.",
  },
  {
    icon: Users,
    title: "Petites entreprises",
    description: "Développez votre visibilité en ligne avec une solution clé en main.",
  },
];

export const SolutionsSection = () => {
  return (
    <section className="py-24 px-4 bg-card/30">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-medium text-foreground">
            Pour qui ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Des solutions adaptées à vos besoins spécifiques
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="h-full professional-card">
                  <CardContent className="p-8 space-y-4">
                    <div className="w-14 h-14 rounded-lg bg-secondary/30 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-foreground" />
                    </div>
                    <h3 className="text-2xl font-medium text-foreground">
                      {solution.title}
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {solution.description}
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
