import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "Quels sont les délais de livraison ?",
    answer: "En standard : 48–72h après réception du formulaire complet et paiement de l'acompte. Avec l'option Express : 4–8h (même jour) après paiement intégral."
  },
  {
    question: "Qu'en est-il du nom de domaine ?",
    answer: "Si vous avez déjà un domaine et nous donnez accès DNS, nous le connectons gratuitement. Sinon, nous publions sur un sous-domaine provisoire et vous guidons pour l'achat."
  },
  {
    question: "Combien d'aller-retours de modifications ?",
    answer: "Pack A : 1 aller-retour. Packs B & C : 2 aller-retours. En option Express : 1 aller-retour limité à 15 minutes de modifications."
  },
  {
    question: "Comment se fait le paiement ?",
    answer: "En standard : acompte de 50% à la commande, solde avant mise en ligne. En Express : paiement 100% à la commande pour démarrage immédiat."
  },
  {
    question: "Le site sera-t-il optimisé pour mobile ?",
    answer: "Oui, absolument ! Tous nos sites sont mobile-first, 100% responsive et optimisés pour tous les appareils (smartphone, tablette, desktop)."
  },
  {
    question: "Puis-je modifier le contenu après la livraison ?",
    answer: "Oui ! Vous recevez un mini-tutoriel pour les modifications simples. Pour des changements plus importants, nous proposons un forfait maintenance à tarif préférentiel."
  },
  {
    question: "Qu'inclut le SEO de base ?",
    answer: "Titre et meta description optimisés, balises structurées, sitemap XML, intégration Analytics et Open Graph pour les réseaux sociaux. Le SEO avancé (+70€) inclut l'optimisation de contenu et la stratégie de mots-clés."
  },
  {
    question: "Que se passe-t-il si je ne suis pas satisfait ?",
    answer: "Nous travaillons en étroite collaboration avec vous et incluons des aller-retours dans chaque pack. Notre objectif est votre satisfaction totale. Si un problème survient, nous le résolvons ensemble."
  }
];

export const FAQ = () => {
  return (
    <section id="faq" className="py-20 bg-card/30 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-card/50 pointer-events-none" />

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="gradient-text">Questions Fréquentes</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Tout ce que vous devez savoir sur nos services
            </p>
          </motion.div>

          {/* FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border border-border/50 rounded-lg px-6 glass hover:border-primary/30 transition-all"
                >
                  <AccordionTrigger className="text-left font-semibold hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* CTA */}
          <motion.div 
            className="text-center mt-12 p-6 rounded-lg glass border border-border/50 hover:border-accent/30 transition-all"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-muted-foreground mb-4">
              Vous avez une autre question ?
            </p>
            <a 
              href="#contact" 
              className="text-primary font-medium hover:text-accent transition-colors inline-flex items-center gap-2"
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
      </div>
    </section>
  );
};
