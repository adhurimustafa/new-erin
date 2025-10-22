import { Card, CardContent } from "@/components/ui/card";
import { Users, Briefcase, Heart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const publics = [
  {
    icon: Users,
    title: "Particuliers",
    description: "Vous avez un projet personnel ? Besoin d'aide avec la technologie ? Nous rendons le digital accessible et simple pour tous.",
    color: "from-purple/20 to-golden/20"
  },
  {
    icon: Briefcase,
    title: "Professionnels",
    description: "Entrepreneurs, TPE, indépendants : gagnez du temps et boostez votre activité grâce à des solutions IA adaptées à vos besoins.",
    color: "from-golden/20 to-turquoise/20"
  },
  {
    icon: Heart,
    title: "Seniors",
    description: "Un accompagnement patient et bienveillant pour apprivoiser le numérique et l'IA. À votre rythme, en toute confiance.",
    color: "from-turquoise/20 to-purple/20"
  },
  {
    icon: Sparkles,
    title: "Jeunes",
    description: "Apprenez à maîtriser l'IA de façon créative et innovante. Préparez-vous aux métiers de demain avec des outils d'aujourd'hui.",
    color: "from-purple/20 to-golden/20"
  }
];

export const PublicsCibles = () => {
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
            <span className="bg-gradient-to-r from-golden via-turquoise to-purple bg-clip-text text-transparent">
              Pour qui ?
            </span>
          </h2>
          <p className="text-xl text-accentlight/80 max-w-2xl mx-auto">
            TADAM s'adresse à tous, quel que soit votre âge ou votre niveau
          </p>
        </motion.div>

        {/* Publics grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {publics.map((public_item, index) => {
            const Icon = public_item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Card className="h-full glass-card border-purple/30">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${public_item.color} flex items-center justify-center mb-4 shadow-glow mx-auto`}>
                      <Icon className="w-7 h-7 text-golden" />
                    </div>
                    <h3 className="text-xl font-bold text-accentlight mb-3 text-center">
                      {public_item.title}
                    </h3>
                    <p className="text-accentlight/70 text-center text-sm leading-relaxed">
                      {public_item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Quote */}
        <motion.div
          className="mt-16 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <p className="text-2xl font-semibold text-accentlight/90 italic">
            "Avec TADAM, la technologie devient accessible, 
            <span className="gradient-tadam"> humaine et magique</span>."
          </p>
        </motion.div>
      </div>
    </section>
  );
};
