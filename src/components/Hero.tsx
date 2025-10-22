import { Button } from "@/components/ui/button";
import { Sparkles, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const Hero = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20 pt-32">
      {/* Radial gradient background with mesh */}
      <div 
        className="absolute inset-0 z-0 noise-overlay bg-gradient-radial"
      />

      {/* Content */}
      <div className="container mx-auto relative z-10">
        <motion.div
          className="text-center max-w-5xl mx-auto space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card border border-golden/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <Sparkles className="w-4 h-4 text-golden" fill="currentColor" />
            <span className="text-sm font-semibold text-golden">Human + IA</span>
          </motion.div>

          {/* Main heading with gradient text */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight font-heading">
              <span className="gradient-tadam text-glow">
                La magie de
                <br />
                la simplicité
              </span>
              <span className="block mt-6 text-xl md:text-3xl font-medium text-ivory/90">
                Des solutions rapides et humaines,
                <br />
                amplifiées par <span className="text-golden">l'intelligence artificielle</span>
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            Avec TADAM, tout devient simple. Une touche humaine, une pincée d'IA…
            <span className="block mt-2 text-ivory/80">et le problème disparaît. Comme par magie.</span>
          </motion.p>

          {/* Location indicator */}
          <motion.div
            className="flex items-center justify-center gap-2 text-accentlight/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <MapPin className="w-5 h-5 text-golden" />
            <span className="font-medium">Bordeaux Métropole • Services accessibles à tous</span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <Button
              size="lg"
              onClick={scrollToContact}
              className="text-lg font-semibold px-10 py-7 bg-gradient-tadam rounded-2xl text-midnight transition-all duration-300 hover:shadow-glow hover:scale-105 focus:ring-4 focus:ring-golden/50"
            >
              Découvrir nos services
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                const servicesSection = document.getElementById('services');
                servicesSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-lg font-semibold px-10 py-7 border-2 border-golden/40 bg-transparent text-ivory hover:bg-golden/10 hover:border-golden rounded-2xl transition-all duration-300"
            >
              En savoir plus
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 pt-8 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-purple"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="font-medium">Humain + IA</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-golden"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
              />
              <span className="font-medium">Rapide & efficace</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-turquoise"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
              />
              <span className="font-medium">Pour tous les âges</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
