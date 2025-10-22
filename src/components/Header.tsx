import { Link } from "react-router-dom";
import logoWordmark from "@/assets/logo-tadam-wordmark.png";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img 
              src={logoWordmark} 
              alt="Tadam!" 
              className="h-8 w-auto"
            />
          </Link>

          {/* Tagline */}
          <div className="hidden md:block text-sm text-muted-foreground font-medium">
            La magie de la simplicité
          </div>

          {/* CTA */}
          <Link 
            to="/reserver"
            className="px-6 py-2.5 bg-gradient-tadam rounded-xl text-midnight font-semibold text-sm hover:shadow-glow transition-all duration-300 hover:scale-105"
          >
            Réserver
          </Link>
        </div>
      </div>
    </header>
  );
};
