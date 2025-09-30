import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sophie Laurent",
    role: "Créatrice de contenu",
    text: "Site livré en 48h comme promis ! Le design est exactement ce que je voulais et le processus était super simple. Je recommande vivement.",
    rating: 5,
    avatar: "SL"
  },
  {
    name: "Thomas Moreau",
    role: "Entrepreneur",
    text: "L'option Express m'a sauvé la vie. J'avais besoin d'un site pour un événement le lendemain, et tout était prêt en 6h. Incroyable !",
    rating: 5,
    avatar: "TM"
  },
  {
    name: "Marie Dubois",
    role: "Consultante Marketing",
    text: "Le meilleur rapport qualité/prix que j'ai trouvé. Design pro, site rapide, et le support post-livraison est vraiment appréciable.",
    rating: 5,
    avatar: "MD"
  },
  {
    name: "Alexandre Chen",
    role: "Développeur Freelance",
    text: "En tant que dev, je suis impressionné par la qualité du code et l'optimisation. Lighthouse à 95, c'est du solide !",
    rating: 5,
    avatar: "AC"
  },
  {
    name: "Camille Bernard",
    role: "Photographe",
    text: "Mon portfolio est magnifique et mes photos chargent super vite. Exactement ce dont j'avais besoin pour montrer mon travail.",
    rating: 5,
    avatar: "CB"
  },
  {
    name: "Lucas Martin",
    role: "Coach sportif",
    text: "Process ultra simple, résultat au-delà de mes attentes. Mes clients adorent le nouveau site et c'est 100% responsive.",
    rating: 5,
    avatar: "LM"
  }
];

export const Testimonials = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden" style={{ background: '#0A1025' }}>
      <div className="container mx-auto max-w-7xl">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold">
            <span className="bg-gradient-to-r from-salmon via-gold to-cyan bg-clip-text text-transparent">
              Ils nous ont fait confiance
            </span>
          </h2>
          <p className="text-xl text-accentlight/80 max-w-3xl mx-auto">
            Découvrez les retours de nos clients satisfaits
          </p>
          
          {/* Overall rating */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-gold text-gold" />
              ))}
            </div>
            <span className="text-2xl font-bold text-accentlight">5.0</span>
            <span className="text-accentlight/70">/ 5 basé sur +50 projets</span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <Card className="h-full glass-card border-cyan/30 relative">
                <CardContent className="p-6">
                  {/* Quote icon */}
                  <div className="absolute top-4 right-4 opacity-20">
                    <Quote className="w-12 h-12 text-cyan" />
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                  </div>

                  {/* Testimonial text */}
                  <p className="text-accentlight/90 mb-6 leading-relaxed relative z-10">
                    "{testimonial.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo to-cyan flex items-center justify-center font-bold text-white shadow-glow">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-accentlight">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-accentlight/60">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <p className="text-accentlight/70 text-lg">
            Rejoignez nos clients satisfaits et lancez votre projet dès aujourd'hui
          </p>
        </motion.div>
      </div>
    </section>
  );
};
