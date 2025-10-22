import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "Qu'est-ce que TADAM exactement ?",
    answer: "TADAM, c'est la rencontre entre l'expertise humaine et la puissance de l'intelligence artificielle. Nous proposons des solutions digitales rapides, simples et accessibles à tous : création de sites web, chatbots, conseil IA et accompagnement personnalisé."
  },
  {
    question: "Comment l'IA et l'humain travaillent ensemble ?",
    answer: "L'IA nous permet d'être plus rapides et efficaces, mais c'est l'humain qui guide, décide et apporte l'empathie. Chaque projet bénéficie de cette synergie : la rapidité de l'IA et la créativité humaine."
  },
  {
    question: "Est-ce adapté aux personnes peu à l'aise avec la technologie ?",
    answer: "Absolument ! C'est justement notre force. Nous prenons le temps d'expliquer, d'accompagner et de former. TADAM rend la technologie accessible à tous, quel que soit votre niveau."
  },
  {
    question: "Quels types de projets acceptez-vous ?",
    answer: "Nous travaillons sur une grande variété de projets : sites web, boutiques en ligne, chatbots, automatisations, conseil stratégique IA, formation digitale... Si vous avez un besoin, contactez-nous pour en discuter !"
  },
  {
    question: "Combien de temps prend un projet typique ?",
    answer: "Cela dépend du projet ! Un site web simple peut être prêt en quelques jours, tandis qu'un projet plus complexe peut prendre quelques semaines. Nous discutons toujours des délais dès le début."
  },
  {
    question: "Proposez-vous un accompagnement après la livraison ?",
    answer: "Oui, toujours ! Nous incluons une formation de prise en main et restons disponibles pour vos questions. Nous proposons également des forfaits de maintenance et support sur mesure."
  },
  {
    question: "Travaillez-vous avec des seniors ?",
    answer: "Bien sûr ! Nous avons une approche particulièrement patiente et pédagogique pour accompagner les seniors. Chaque étape est expliquée clairement, à votre rythme."
  },
  {
    question: "Comment se passe le premier contact ?",
    answer: "Simple comme bonjour ! Utilisez le formulaire de contact ci-dessous ou appelez-nous directement. Nous prendrons le temps d'écouter votre besoin et de vous proposer la meilleure solution."
  }
];

export const FAQ = () => {
  return (
    <section id="faq" className="py-24 px-4 relative overflow-hidden bg-midnight">
      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-12 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold">
            <span className="bg-gradient-to-r from-purple via-golden to-turquoise bg-clip-text text-transparent">
              Questions Fréquentes
            </span>
          </h2>
          <p className="text-xl text-accentlight/80">
            Tout ce que vous devez savoir sur TADAM
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="glass-card border-purple/30 px-6 hover:border-golden/40 transition-all"
              >
                <AccordionTrigger className="text-left font-semibold text-accentlight hover:text-golden">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-accentlight/70 leading-relaxed pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="text-center mt-12 p-6 rounded-2xl glass-card border-golden/30"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <p className="text-accentlight/70 mb-4">
            Vous avez une autre question ?
          </p>
          <a 
            href="#contact" 
            className="text-golden font-bold hover:text-turquoise transition-colors inline-flex items-center gap-2"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Contactez-nous directement 
            <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
