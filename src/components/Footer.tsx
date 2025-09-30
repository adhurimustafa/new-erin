import { Heart } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-3">[NOM D'AGENCE]</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Human + AI Project Builder. Transformez votre idée en site professionnel 
              en 48–72h ou en mode Express 4–8h.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>SIRET:</strong> [SIRET]
            </p>
          </div>

          {/* Links - Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#pricing" className="hover:text-primary transition-colors">
                  Pack A - Landing
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-primary transition-colors">
                  Pack B - Mini Brand
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-primary transition-colors">
                  Pack C - Prototype Sprint
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-primary transition-colors">
                  Option Express
                </a>
              </li>
            </ul>
          </div>

          {/* Links - Company */}
          <div>
            <h4 className="font-semibold mb-4">Informations</h4>
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
        <div className="pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} [NOM D'AGENCE]. Tous droits réservés.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Fait avec <Heart className="w-4 h-4 text-primary fill-primary" /> et l'IA
          </p>
        </div>
      </div>
    </footer>
  );
};
