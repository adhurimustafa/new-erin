import { motion } from "framer-motion";
import { Star } from "lucide-react";

export const ClientsSection = () => {
  return (
    <section className="py-16 px-4 bg-card/20 border-y border-border">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-foreground text-foreground" />
              ))}
            </div>
            <span className="text-lg font-medium text-foreground">5.0</span>
          </div>

          <p className="text-xl text-muted-foreground italic max-w-3xl mx-auto">
            "Service exceptionnel. Mon site était prêt en 48h exactement comme promis, 
            avec un niveau de qualité qui dépasse mes attentes."
          </p>

          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Marie Dubois</p>
            <p>Consultante Marketing</p>
          </div>

          <div className="pt-8">
            <p className="text-sm text-muted-foreground">
              Utilisé par plus de <span className="font-medium text-foreground">50 entrepreneurs</span> et <span className="font-medium text-foreground">créateurs</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
