import { Heart, MapPin, Mail } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card/50 backdrop-blur-md border-t border-border/50 relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
      
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto py-12 relative z-10">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-3">
              <span className="gradient-text">Human + AI Project Builder</span>
            </h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Transformez votre idée en site professionnel en 48–72h ou en mode Express 4–8h.
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                <strong className="text-foreground">Fondateur:</strong> Adhurim MUSTAFA
              </p>
              <p className="text-muted-foreground flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <span>Rue Roland Garros, 33160 Saint-Médard-en-Jalles</span>
              </p>
              <p className="text-muted-foreground flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:adhurimustafa@gmail.com" className="hover:text-primary transition-colors">
                  adhurimustafa@gmail.com
                </a>
              </p>
              <p className="text-sm text-muted-foreground mt-3">
                <strong className="text-foreground">SIRET:</strong> [À COMPLÉTER]
              </p>
            </div>
          </div>

          {/* Links - Services */}
          <div>
            <h4 className="font-semibold mb-4 text-primary">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#pricing" className="hover:text-primary transition-colors">
                  Pack A - Landing (249€)
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-primary transition-colors">
                  Pack B - Mini Brand (449€)
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-primary transition-colors">
                  Pack C - Prototype Sprint (899€)
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-accent transition-colors">
                  Option Express 4–8h
                </a>
              </li>
            </ul>
          </div>

          {/* Links - Company */}
          <div>
            <h4 className="font-semibold mb-4 text-secondary">Informations</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#process" className="hover:text-primary transition-colors">
                  Process
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="/mentions-legales" className="hover:text-primary transition-colors">
                  Mentions légales
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Human + AI Project Builder. Tous droits réservés.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Fait avec <Heart className="w-4 h-4 text-primary fill-primary" /> et l'IA
          </p>
        </div>
      </div>
    </footer>
  );
};
