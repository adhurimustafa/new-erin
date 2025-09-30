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
    <section id="faq" className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div 
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-medium text-foreground">
            Questions Fréquentes
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
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="professional-card px-6"
              >
                <AccordionTrigger className="text-left font-medium text-foreground">
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
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-muted-foreground mb-4">
            Vous avez une autre question ?
          </p>
          <a 
            href="#contact" 
            className="text-foreground hover:text-accent transition-colors font-medium"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Contactez-nous directement →
          </a>
        </motion.div>
      </div>
    </section>
  );
};
