import { Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-background py-12 px-4 border-t border-border">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-medium text-foreground">Fast Brand Builder</h3>
            <p className="text-muted-foreground">
              Sites web professionnels livrés en 48-72h
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-foreground">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <a href="mailto:adhurimustafa@gmail.com" className="hover:text-foreground transition-colors">
                  adhurimustafa@gmail.com
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                Adhurim MUSTAFA<br />
                Saint-Médard-en-Jalles
              </p>
            </div>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-foreground">Informations</h4>
            <ul className="space-y-2">
              <li><a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
              <li><a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
              <li><a href="/mentions-legales" className="text-muted-foreground hover:text-foreground transition-colors">Mentions légales</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Fast Brand Builder. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};
