import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Reserver = () => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    projet: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.nom || !formData.email || !formData.projet) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    // Simulate form submission
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
    
    toast({
      title: "Demande envoyée !",
      description: "Nous vous recontacterons très vite.",
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background matching Hero */}
      <div 
        className="absolute inset-0 z-0 noise-overlay animate-mesh"
        style={{
          background: 'radial-gradient(ellipse 120% 80% at 50% 35%, #21F0FF 0%, #962FFF 40%, #0A1025 100%)',
          backgroundSize: '200% 200%',
        }}
      />

      {/* Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Back button */}
        <Link to="/">
          <Button
            variant="ghost"
            className="mb-8 text-accentlight hover:text-cyan hover:bg-transparent transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Retour à l'accueil
          </Button>
        </Link>

        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Header with halo effect */}
          <div className="text-center mb-12 relative">
            <motion.div
              className="relative halo-glow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
                <span 
                  className="bg-gradient-to-br from-cyan via-indigo to-violet bg-clip-text text-transparent"
                  style={{ 
                    filter: 'drop-shadow(0 0 30px rgba(33, 240, 255, 0.5))',
                  }}
                >
                  Prise de RDV rapide
                  <br />
                  pour votre projet
                </span>
              </h1>
            </motion.div>
            
            <motion.p
              className="text-lg text-accentlight/80 max-w-xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              Renseignez vos coordonnées, nous vous contactons sous 24h.
            </motion.p>
          </div>

          {/* Form card */}
          {!isSubmitted ? (
            <motion.div
              className="glass-card p-8 md:p-10 rounded-2xl border border-cyan/30 shadow-glass"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nom */}
                <div className="space-y-2">
                  <Label htmlFor="nom" className="text-accentlight font-medium">
                    Nom complet <span className="text-salmon">*</span>
                  </Label>
                  <Input
                    id="nom"
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    placeholder="Votre nom et prénom"
                    className="bg-midnight/50 border-cyan/20 text-accentlight placeholder:text-accentlight/40 focus:border-cyan focus:ring-cyan/30"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-accentlight font-medium">
                    Email <span className="text-salmon">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="votre@email.com"
                    className="bg-midnight/50 border-cyan/20 text-accentlight placeholder:text-accentlight/40 focus:border-cyan focus:ring-cyan/30"
                    required
                  />
                </div>

                {/* Téléphone */}
                <div className="space-y-2">
                  <Label htmlFor="telephone" className="text-accentlight font-medium">
                    Téléphone <span className="text-accentlight/50 text-sm">(optionnel)</span>
                  </Label>
                  <Input
                    id="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    placeholder="+33 6 12 34 56 78"
                    className="bg-midnight/50 border-cyan/20 text-accentlight placeholder:text-accentlight/40 focus:border-cyan focus:ring-cyan/30"
                  />
                </div>

                {/* Projet */}
                <div className="space-y-2">
                  <Label htmlFor="projet" className="text-accentlight font-medium">
                    Votre projet <span className="text-salmon">*</span>
                  </Label>
                  <Textarea
                    id="projet"
                    value={formData.projet}
                    onChange={(e) => setFormData({ ...formData, projet: e.target.value })}
                    placeholder="Décrivez brièvement votre projet, vos besoins et vos attentes..."
                    rows={5}
                    className="bg-midnight/50 border-cyan/20 text-accentlight placeholder:text-accentlight/40 focus:border-cyan focus:ring-cyan/30 resize-none"
                    required
                  />
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-xl font-semibold px-8 py-6 bg-gradient-to-r from-indigo via-cyan to-violet rounded-2xl shadow-neon text-white transition-all duration-150 hover:from-cyan hover:via-indigo hover:to-salmon hover:brightness-125 hover:shadow-glow hover:scale-105 focus:ring-4 focus:ring-cyan/70"
                >
                  Envoyer ma demande
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              className="glass-card p-10 rounded-2xl border border-cyan/30 shadow-glow text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan to-violet flex items-center justify-center shadow-glow">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan via-indigo to-violet bg-clip-text text-transparent mb-4">
                Votre demande a bien été envoyée !
              </h2>
              
              <p className="text-lg text-accentlight/80 mb-8">
                Nous vous recontactons très vite, sous 24h maximum.
              </p>

              <Link to="/">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-cyan/50 bg-transparent text-accentlight hover:bg-cyan/10 hover:border-cyan rounded-xl"
                >
                  Retour à l'accueil
                </Button>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Reserver;
