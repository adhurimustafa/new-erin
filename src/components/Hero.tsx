import { Button } from "@/components/ui/button";
import { Zap, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export const Hero = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Gradient background with mesh animation */}
      <div 
        className="absolute inset-0 z-0 noise-overlay animate-mesh"
        style={{
          background: 'radial-gradient(ellipse 120% 80% at 50% 35%, #21F0FF 0%, #962FFF 40%, #0A1025 100%)',
          backgroundSize: '200% 200%',
        }}
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-cyan/30 animate-pulseGlow"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <Zap className="w-4 h-4 text-cyan" fill="currentColor" />
            <span className="text-sm font-bold text-accentlight">Option Express 4-8h déjà prête</span>
          </motion.div>

          {/* Main heading with gradient text and halo */}
          <motion.div
            className="relative halo-glow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight">
              <span 
                className="bg-gradient-to-br from-cyan via-indigo to-violet bg-clip-text text-transparent"
                style={{ 
                  filter: 'drop-shadow(0 0 30px rgba(33, 240, 255, 0.5))',
                }}
              >
                48–72 heures,
                <br />
                site finalisé
              </span>
              <span className="block mt-4 text-xl md:text-2xl font-medium bg-gradient-to-r from-salmon via-gold to-cyan bg-clip-text text-transparent">
                De l'idée à votre marque en ligne, sans stress
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-accentlight/80 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            Landing page optimisée, domaine personnalisé et publication garantie.
            Parfait pour entrepreneurs et créateurs qui veulent lancer vite.
          </motion.p>

          {/* Location indicator */}
          <motion.div
            className="flex items-center justify-center gap-2 text-accentlight/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <MapPin className="w-5 h-5 text-cyan" />
            <span className="font-medium">Bordeaux Métropole • Présentiel disponible</span>
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
              className="text-xl font-semibold px-8 py-6 bg-gradient-to-r from-indigo via-cyan to-violet rounded-2xl shadow-neon hover:brightness-125 focus:ring-4 focus:ring-cyan/70 transition-all duration-200"
            >
              Réserver un créneau
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                const pricingSection = document.getElementById('pricing');
                pricingSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xl font-semibold px-8 py-6 border-2 border-cyan/50 bg-transparent text-accentlight hover:bg-cyan/10 hover:border-cyan rounded-2xl transition-all duration-200"
            >
              Voir les forfaits
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-accentlight/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-cyan shadow-glow"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="font-medium">Livraison garantie</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-violet shadow-glow"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
              <span className="font-medium">Paiement sécurisé</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-indigo shadow-glow"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
              <span className="font-medium">Support inclus</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
