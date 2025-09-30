import { Shield, Lock, Server } from "lucide-react";
import { motion } from "framer-motion";

export const SecuritySection = () => {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          className="text-center space-y-8 border border-border rounded-xl p-12 bg-card/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-secondary/30 flex items-center justify-center">
              <Shield className="w-8 h-8 text-foreground" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-medium text-foreground">
            Sécurité et confidentialité
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Vos données et celles de vos clients sont protégées. Hébergement sécurisé, 
            certificat SSL inclus, et conformité RGPD garantie.
          </p>

          <div className="grid md:grid-cols-3 gap-8 pt-8">
            <div className="space-y-2">
              <Lock className="w-6 h-6 text-foreground mx-auto" />
              <h3 className="font-medium text-foreground">HTTPS activé</h3>
              <p className="text-sm text-muted-foreground">Connexion sécurisée</p>
            </div>
            <div className="space-y-2">
              <Server className="w-6 h-6 text-foreground mx-auto" />
              <h3 className="font-medium text-foreground">Hébergement fiable</h3>
              <p className="text-sm text-muted-foreground">99.9% de disponibilité</p>
            </div>
            <div className="space-y-2">
              <Shield className="w-6 h-6 text-foreground mx-auto" />
              <h3 className="font-medium text-foreground">Protection DDoS</h3>
              <p className="text-sm text-muted-foreground">Sécurité renforcée</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
