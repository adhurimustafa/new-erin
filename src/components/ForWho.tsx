import { Briefcase, Users, Sparkles, TrendingUp, Heart, Megaphone } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const targetAudiences = [
  {
    icon: Briefcase,
    title: "Entrepreneurs & Startups",
    description: "Vous lancez votre activité et avez besoin d'une présence en ligne rapidement pour tester votre marché"
  },
  {
    icon: Users,
    title: "PME & Artisans",
    description: "Vous voulez moderniser votre image et être visible sur le web sans investir des milliers d'euros"
  },
  {
    icon: Sparkles,
    title: "Créateurs de contenu",
    description: "Vous avez besoin d'un portfolio ou d'une vitrine pour présenter votre travail de manière professionnelle"
  },
  {
    icon: TrendingUp,
    title: "Consultants & Freelances",
    description: "Vous cherchez à gagner en crédibilité avec un site pro qui inspire confiance à vos prospects"
  },
  {
    icon: Heart,
    title: "Associations & Événements",
    description: "Vous organisez un événement ou gérez une association et avez besoin d'un site rapidement"
  },
  {
    icon: Megaphone,
    title: "Marketeurs & Agences",
    description: "Vous avez besoin de landing pages efficaces pour vos campagnes ou vos clients"
  }
];

export const ForWho = () => {
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
            <span className="bg-gradient-to-r from-indigo via-violet to-cyan bg-clip-text text-transparent">
              À qui s'adresse cette offre ?
            </span>
          </h2>
          <p className="text-xl text-accentlight/80 max-w-3xl mx-auto">
            Cette solution est parfaite pour tous ceux qui veulent un site pro sans attendre des semaines
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {targetAudiences.map((audience, index) => {
            const Icon = audience.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.3 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Card className="h-full glass-card border-violet/30">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet/20 to-cyan/20 flex items-center justify-center shadow-glow">
                      <Icon className="w-8 h-8 text-violet" />
                    </div>
                    <h3 className="text-xl font-bold text-accentlight mb-3">
                      {audience.title}
                    </h3>
                    <p className="text-accentlight/70 leading-relaxed">
                      {audience.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center p-8 glass-card border-2 border-cyan/40 rounded-2xl max-w-4xl mx-auto animate-pulseGlow"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-accentlight mb-4">
            Vous vous reconnaissez ?
          </h3>
          <p className="text-accentlight/80 text-lg mb-6">
            Si vous avez besoin d'un site rapidement, sans compliquer, et avec un budget maîtrisé, 
            vous êtes au bon endroit. Discutons de votre projet !
          </p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-gradient-to-r from-indigo via-cyan to-violet rounded-2xl shadow-neon text-white font-semibold text-lg transition-all duration-150 hover:brightness-125 hover:shadow-glow hover:scale-105 focus:ring-4 focus:ring-cyan/70"
          >
            Démarrer mon projet
          </button>
        </motion.div>
      </div>
    </section>
  );
};
