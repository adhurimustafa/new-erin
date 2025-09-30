import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const HeroHarvey = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card/30" />

      {/* Content */}
      <div className="container mx-auto relative z-10 max-w-5xl">
        <motion.div
          className="text-center space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Main heading - serif, large, elegant */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium leading-tight text-foreground">
            Sites Web Professionnels
            <br />
            Livrés en 48-72h
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Landing pages optimisées pour entrepreneurs et créateurs qui veulent lancer rapidement.
          </p>

          {/* CTA */}
          <motion.div
            className="pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Button
              size="lg"
              className="text-base px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-all duration-200"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Demander une démo
            </Button>
          </motion.div>

          {/* Trust indicator */}
          <motion.div
            className="flex items-center justify-center gap-6 pt-8 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">+50</span>
              <span>projets livrés</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">48-72h</span>
              <span>de délai</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
