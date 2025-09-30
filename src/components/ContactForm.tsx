import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation basique
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse email valide.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Simulation d'envoi (en attendant le backend)
    setTimeout(() => {
      console.log("Formulaire soumis:", formData);
      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });
      
      // Redirection vers la page de confirmation
      navigate("/merci");
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Parlons de votre projet
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Remplissez le formulaire ci-dessous et nous vous répondrons dans les 24h
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6 animate-slide-up">
              <div className="p-6 rounded-lg bg-card border-2">
                <h3 className="font-semibold text-lg mb-6">Informations de contact</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-muted-foreground mb-1">Email</p>
                      <p className="text-foreground">[EMAIL CONTACT]</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-muted-foreground mb-1">Téléphone</p>
                      <p className="text-foreground">[TÉLÉPHONE]</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-muted-foreground mb-1">Localisation</p>
                      <p className="text-foreground">[VILLE/PAYS]</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Disponibilité :</strong> Nous répondons généralement sous 24h en semaine. 
                  Pour une réponse immédiate, préférez l'appel téléphonique.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <form onSubmit={handleSubmit} className="p-8 rounded-lg bg-card border-2 space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Nom complet <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Jean Dupont"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="jean@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone (optionnel)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+33 6 12 34 56 78"
                    value={formData.phone}
                    onChange={handleChange}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">
                    Votre projet <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Décrivez-nous votre projet, vos besoins, vos délais..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="min-h-[150px] resize-none"
                  />
                  <p className="text-sm text-muted-foreground">
                    Plus vous êtes précis, plus nous pourrons vous répondre rapidement et efficacement.
                  </p>
                </div>

                <Button 
                  type="submit" 
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto group"
                >
                  {isSubmitting ? (
                    <>Envoi en cours...</>
                  ) : (
                    <>
                      Envoyer le message
                      <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
