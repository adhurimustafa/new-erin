import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar as CalendarIcon, Linkedin, Facebook, Instagram, Twitter, CheckCircle2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const Reserver = () => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
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
    console.log("Form submitted:", formData, "Date:", selectedDate);
    setIsSubmitted(true);
    
    toast({
      title: "Demande envoyée !",
      description: "Nous vous recontacterons très vite.",
    });
  };

  const socialLinks = [
    { name: "LinkedIn", icon: Linkedin, url: "https://linkedin.com", color: "from-[#0077B5] to-cyan" },
    { name: "Facebook", icon: Facebook, url: "https://facebook.com", color: "from-[#1877F2] to-indigo" },
    { name: "Instagram", icon: Instagram, url: "https://instagram.com", color: "from-[#E4405F] to-salmon" },
    { name: "X", icon: Twitter, url: "https://x.com", color: "from-accentlight to-violet" },
  ];

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
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Header with halo effect and decorative icon */}
          <div className="text-center mb-12 relative">
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              {/* Decorative Calendar Icon */}
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-cyan/20 to-violet/20 border border-cyan/30 shadow-glow"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4, type: "spring" }}
              >
                <CalendarIcon className="w-10 h-10 text-cyan drop-shadow-[0_0_8px_rgba(33,240,255,0.6)]" />
              </motion.div>

              {/* Enhanced halo glow */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan/20 rounded-full blur-3xl -z-10 animate-pulseGlow" />
              
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
              className="text-lg text-accentlight/80 max-w-xl mx-auto flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Sparkles className="w-5 h-5 text-gold" />
              Renseignez vos coordonnées, nous vous contactons sous 24h.
              <Sparkles className="w-5 h-5 text-gold" />
            </motion.p>
          </div>

          {!isSubmitted ? (
            <div className="grid md:grid-cols-[1.5fr_1fr] gap-8">
              {/* Form Section */}
              <motion.div
                className="glass-card p-8 md:p-10 rounded-2xl border-2 border-cyan/30 shadow-glass backdrop-blur-md bg-surface/95"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan via-indigo to-violet bg-clip-text text-transparent mb-6">
                  Formulaire de contact
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nom */}
                  <div className="space-y-2">
                    <Label htmlFor="nom" className="text-accentlight font-medium text-base">
                      Nom complet <span className="text-salmon">*</span>
                    </Label>
                    <Input
                      id="nom"
                      type="text"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      placeholder="Votre nom et prénom"
                      className="bg-midnight/50 border-2 border-cyan/20 text-accentlight placeholder:text-accentlight/40 focus:border-cyan focus:ring-2 focus:ring-cyan/30 rounded-xl h-12 transition-all"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-accentlight font-medium text-base">
                      Email <span className="text-salmon">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="votre@email.com"
                      className="bg-midnight/50 border-2 border-cyan/20 text-accentlight placeholder:text-accentlight/40 focus:border-cyan focus:ring-2 focus:ring-cyan/30 rounded-xl h-12 transition-all"
                      required
                    />
                  </div>

                  {/* Téléphone */}
                  <div className="space-y-2">
                    <Label htmlFor="telephone" className="text-accentlight font-medium text-base">
                      Téléphone <span className="text-accentlight/50 text-sm">(optionnel)</span>
                    </Label>
                    <Input
                      id="telephone"
                      type="tel"
                      value={formData.telephone}
                      onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                      placeholder="+33 6 12 34 56 78"
                      className="bg-midnight/50 border-2 border-cyan/20 text-accentlight placeholder:text-accentlight/40 focus:border-cyan focus:ring-2 focus:ring-cyan/30 rounded-xl h-12 transition-all"
                    />
                  </div>

                  {/* Projet */}
                  <div className="space-y-2">
                    <Label htmlFor="projet" className="text-accentlight font-medium text-base">
                      Votre projet <span className="text-salmon">*</span>
                    </Label>
                    <Textarea
                      id="projet"
                      value={formData.projet}
                      onChange={(e) => setFormData({ ...formData, projet: e.target.value })}
                      placeholder="Décrivez brièvement votre projet, vos besoins et vos attentes..."
                      rows={5}
                      className="bg-midnight/50 border-2 border-cyan/20 text-accentlight placeholder:text-accentlight/40 focus:border-cyan focus:ring-2 focus:ring-cyan/30 rounded-xl resize-none transition-all"
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

                {/* Social Media Links */}
                <motion.div
                  className="mt-8 pt-8 border-t border-cyan/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  <p className="text-center text-accentlight/60 text-sm mb-4">Suivez-nous sur les réseaux</p>
                  <div className="flex gap-4 justify-center">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-3 rounded-full bg-surface/80 backdrop-blur-sm border border-cyan/20 shadow-neon hover:shadow-glow hover:scale-110 focus:ring-2 focus:ring-cyan/70 transition-all duration-200"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                        whileHover={{ y: -4 }}
                        aria-label={social.name}
                      >
                        <social.icon className="w-6 h-6 text-accentlight group-hover:text-cyan transition-colors" />
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              {/* Calendar Section */}
              <motion.div
                className="glass-card p-6 rounded-2xl border-2 border-violet/30 shadow-glow backdrop-blur-md bg-surface/95"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <h2 className="text-xl font-bold bg-gradient-to-r from-violet via-cyan to-indigo bg-clip-text text-transparent mb-4">
                  Sélectionnez une date
                </h2>
                
                <div className="calendar-widget rounded-xl bg-midnight/30 p-4 border border-cyan/20">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-lg pointer-events-auto"
                    classNames={{
                      months: "flex flex-col space-y-4",
                      month: "space-y-4",
                      caption: "flex justify-center pt-1 relative items-center text-accentlight",
                      caption_label: "text-sm font-medium",
                      nav: "space-x-1 flex items-center",
                      nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-accentlight",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex",
                      head_cell: "text-accentlight/60 rounded-md w-9 font-normal text-[0.8rem]",
                      row: "flex w-full mt-2",
                      cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-cyan/20 rounded-lg",
                      day: "h-9 w-9 p-0 font-normal text-accentlight hover:bg-cyan/30 hover:text-white rounded-lg transition-all aria-selected:opacity-100",
                      day_selected: "bg-gradient-to-br from-cyan to-violet text-white hover:bg-gradient-to-br hover:from-cyan hover:to-violet shadow-neon font-bold",
                      day_today: "bg-violet/20 text-cyan font-bold border border-cyan/40",
                      day_outside: "text-accentlight/30 opacity-50",
                      day_disabled: "text-accentlight/20 opacity-30",
                    }}
                  />
                </div>

                {selectedDate && (
                  <motion.div
                    className="mt-6 p-4 bg-cyan/10 border border-cyan/30 rounded-xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-accentlight text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-cyan" />
                      <span>
                        Date sélectionnée : <strong className="text-cyan">{format(selectedDate, "PPP", { locale: fr })}</strong>
                      </span>
                    </p>
                  </motion.div>
                )}

                {/* Available Slots Info */}
                <motion.div
                  className="mt-6 p-4 bg-violet/10 border border-violet/30 rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  <h3 className="text-accentlight font-semibold mb-2 text-sm">Créneaux disponibles</h3>
                  <div className="space-y-2">
                    {["9h - 12h", "14h - 17h", "17h - 19h"].map((slot, index) => (
                      <motion.div
                        key={slot}
                        className="px-3 py-2 bg-midnight/50 border border-cyan/20 rounded-lg text-accentlight text-sm hover:bg-cyan/10 hover:border-cyan/40 transition-all cursor-pointer"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.2 }}
                        whileHover={{ x: 4 }}
                      >
                        {slot}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          ) : (
            <motion.div
              className="glass-card p-10 rounded-2xl border-2 border-cyan/40 shadow-glow text-center backdrop-blur-md bg-surface/95 max-w-2xl mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan to-violet flex items-center justify-center shadow-glow animate-pulseGlow">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
              </motion.div>
              
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan via-indigo to-violet bg-clip-text text-transparent mb-4">
                Votre demande a bien été envoyée !
              </h2>
              
              <p className="text-lg text-accentlight/80 mb-2">
                Nous vous recontactons très vite, sous 24h maximum.
              </p>

              {selectedDate && (
                <motion.p
                  className="text-accentlight/60 mb-8 flex items-center justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <CalendarIcon className="w-4 h-4" />
                  Date préférée : {format(selectedDate, "PPP", { locale: fr })}
                </motion.p>
              )}

              <Link to="/">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-cyan/50 bg-transparent text-accentlight hover:bg-cyan/10 hover:border-cyan rounded-xl transition-all hover:scale-105"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Retour à l'accueil
                </Button>
              </Link>

              {/* Social Media in Success State */}
              <motion.div
                className="mt-8 pt-8 border-t border-cyan/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <p className="text-center text-accentlight/60 text-sm mb-4">Restez connecté</p>
                <div className="flex gap-4 justify-center">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-3 rounded-full bg-surface/80 backdrop-blur-sm border border-cyan/20 shadow-neon hover:shadow-glow hover:scale-110 focus:ring-2 focus:ring-cyan/70 transition-all duration-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                      whileHover={{ y: -4 }}
                      aria-label={social.name}
                    >
                      <social.icon className="w-6 h-6 text-accentlight group-hover:text-cyan transition-colors" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Reserver;
