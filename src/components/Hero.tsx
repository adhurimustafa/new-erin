import { Button } from "@/components/ui/button";
import { Zap, MapPin, Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir au moins votre nom et email.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Demande reçue !",
      description: "Nous vous contactons sous 24h.",
    });
    navigate("/merci");
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
      <div className="container mx-auto relative z-10 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Main content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-cyan/30 animate-pulseGlow"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <Zap className="w-4 h-4 text-cyan" fill="currentColor" />
              <span className="text-sm font-bold text-accentlight">Option Express 4-8h disponible</span>
            </motion.div>

            {/* Main heading with gradient text and halo */}
            <motion.div
              className="relative halo-glow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
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
              className="text-lg md:text-xl text-accentlight/80 max-w-2xl leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              Landing page optimisée, domaine personnalisé et publication garantie.
              Parfait pour entrepreneurs et créateurs qui veulent lancer vite.
            </motion.p>

            {/* Rating & Location */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                  ))}
                </div>
                <span className="text-accentlight/70 font-medium">5/5 • +50 projets</span>
              </div>
              <div className="flex items-center gap-2 text-accentlight/70">
                <MapPin className="w-5 h-5 text-cyan" />
                <span className="font-medium">Bordeaux Métropole</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <button
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-lg font-semibold px-8 py-4 bg-gradient-to-r from-indigo via-cyan to-violet rounded-2xl shadow-neon text-white transition-all duration-150 hover:from-cyan hover:via-indigo hover:to-salmon hover:brightness-125 hover:shadow-glow hover:scale-105 focus:ring-4 focus:ring-cyan/70"
              >
                Voir les forfaits
                <ArrowRight className="inline-block ml-2 w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>

          {/* Right side - Quick form */}
          <motion.div
            className="lg:block"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="glass-card border-2 border-cyan/40 rounded-2xl p-8 shadow-glow">
              <h3 className="text-2xl font-bold text-accentlight mb-2">
                Obtenir le programme
              </h3>
              <p className="text-accentlight/70 mb-6">
                Remplissez ce formulaire, nous vous contactons sous 24h
              </p>
              
              <form onSubmit={handleQuickSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="hero-name" className="text-accentlight">
                    Nom complet *
                  </Label>
                  <Input
                    id="hero-name"
                    placeholder="Jean Dupont"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="mt-1 h-11 bg-midnight/50 border-cyan/30 text-accentlight"
                  />
                </div>
                
                <div>
                  <Label htmlFor="hero-email" className="text-accentlight">
                    Email *
                  </Label>
                  <Input
                    id="hero-email"
                    type="email"
                    placeholder="jean@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="mt-1 h-11 bg-midnight/50 border-cyan/30 text-accentlight"
                  />
                </div>

                <div>
                  <Label htmlFor="hero-phone" className="text-accentlight">
                    Téléphone (optionnel)
                  </Label>
                  <Input
                    id="hero-phone"
                    type="tel"
                    placeholder="+33 6 12 34 56 78"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="mt-1 h-11 bg-midnight/50 border-cyan/30 text-accentlight"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full text-lg font-semibold py-6 bg-gradient-to-r from-indigo via-cyan to-violet rounded-xl shadow-neon text-white transition-all duration-150 hover:brightness-125 hover:shadow-glow"
                >
                  Envoyer ma demande
                </Button>
              </form>

              <p className="text-xs text-accentlight/60 mt-4 text-center">
                Vos données sont sécurisées et ne seront jamais partagées
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
