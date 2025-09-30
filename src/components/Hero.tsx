import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-bg.jpg";

export const Hero = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background via-background to-card/50" />
      
      {/* Neon grid effect */}
      <div className="absolute inset-0 z-0 opacity-20" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(91, 140, 255, 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} 
      />

      {/* Hero image with overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      {/* Glowing orbs */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-[120px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-secondary/20 blur-[120px]"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
      />

      {/* Content */}
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full glass border border-primary/30 hover-glow"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Human + AI Project Builder
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            De l'idée au site/à la marque en{" "}
            <span className="gradient-text animate-gradient">
              48–72 h en domaine final
            </span>
            <br />
            <span className="text-2xl sm:text-3xl lg:text-4xl text-muted-foreground mt-4 block">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-accent/10 border border-accent/30 text-accent">
                <Zap className="w-5 h-5" />
                option Express 4–8 h déjà prêt en domaine demo
              </span>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Vous parlez, je structure et j'opère avec l'IA pour livrer un site clair, 
            mobile et prêt à convertir — en une demi-journée ou sous 72 h.
          </motion.p>

          {/* Location badge */}
          <motion.div 
            className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-accent/30"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <MapPin className="w-4 h-4 text-accent" />
            <span className="text-sm text-foreground">Bordeaux Métropole + alentours</span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button 
              size="lg" 
              onClick={scrollToContact}
              className="group text-lg px-8 py-6 bg-primary hover:bg-primary/90 glow-blue hover-glow relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Réserver un créneau
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
              className="text-lg px-8 py-6 glass border-primary/30 hover:border-primary/50 hover-glow"
            >
              Voir les forfaits
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="flex items-center gap-2">
              <motion.div 
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span>Livraison garantie</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.div 
                className="w-2 h-2 rounded-full bg-accent"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              />
              <span>Support inclus</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.div 
                className="w-2 h-2 rounded-full bg-secondary"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              />
              <span>100% responsive</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
