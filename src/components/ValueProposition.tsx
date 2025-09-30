import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  "Gagnez du temps : lancez votre site en 48-72h au lieu de plusieurs semaines",
  "Économisez de l'argent : prix transparent et fixe, pas de devis flou",
  "Boostez votre crédibilité : design professionnel qui inspire confiance",
  "Optimisé pour le SEO : visible sur Google dès le premier jour",
  "Mobile-first : parfait sur tous les appareils (téléphone, tablette, desktop)",
  "Support inclus : accompagnement post-livraison et mini-formation",
  "Analytics configurés : suivez vos performances dès le lancement",
  "Sécurisé et performant : hébergement rapide, site optimisé < 3s"
];

export const ValueProposition = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden" style={{ background: '#0A1025' }}>
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold">
            <span className="bg-gradient-to-r from-salmon via-gold to-cyan bg-clip-text text-transparent">
              Ce que votre site va vous apporter
            </span>
          </h2>
          <p className="text-xl text-accentlight/80 max-w-3xl mx-auto">
            Une présence en ligne professionnelle qui fait la différence
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4 p-6 glass-card border-indigo/30 rounded-xl"
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan/20 to-violet/20 flex items-center justify-center shadow-glow">
                  <CheckCircle2 className="w-5 h-5 text-cyan" />
                </div>
              </div>
              <p className="text-accentlight/90 leading-relaxed">
                {benefit}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 p-8 glass-card border-2 border-cyan/40 rounded-2xl text-center max-w-4xl mx-auto animate-pulseGlow"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-accentlight mb-4">
            En résumé : votre site en ligne rapidement, sans stress
          </h3>
          <p className="text-accentlight/80 text-lg leading-relaxed">
            De l'idée au lancement, nous gérons tout. Vous obtenez un site professionnel, 
            optimisé, responsive et prêt à convertir vos visiteurs en clients. 
            Plus besoin d'attendre des semaines ou de gérer des dizaines d'allers-retours.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
