import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logoWordmark from "@/assets/logo-tadam-wordmark.png";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n";

export const Header = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const links: [string, string][] = [["#realisations", t.nav.work], ["#services", t.nav.services], ["#methode", t.nav.method], ["#apropos", t.nav.about], ["#contact", t.nav.contact]];
  const homeHref = (hash: string) => location.pathname === "/" ? hash : `/${hash}`;
  const closeMenu = (restore = false) => { setOpen(false); if (restore) requestAnimationFrame(() => triggerRef.current?.focus()); };
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") closeMenu(true); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <header className="site-header">
      <div className="site-container header-inner">
        <Link to="/" className="brand-link" aria-label="TADAM"><span className="logo-crop"><img src={logoWordmark} alt="TADAM" /></span></Link>
        <nav className="desktop-nav" aria-label="Navigation principale">
          {links.map(([href, label]) => <a key={href} href={homeHref(href)}>{label}</a>)}
        </nav>
        <div className="header-actions">
          <LanguageSwitcher />
          <Button asChild className="header-cta"><a href={homeHref("#contact")}>{t.nav.quote}</a></Button>
          <Button ref={triggerRef} variant="ghost" size="icon" className="menu-trigger" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? t.nav.close : t.nav.menu}>
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {open && <nav id="mobile-menu" className="mobile-nav" aria-label="Navigation mobile">
        {links.map(([href, label]) => <a key={href} href={homeHref(href)} onClick={() => closeMenu()}>{label}</a>)}
        <a className="mobile-quote" href={homeHref("#contact")} onClick={() => closeMenu()}>{t.nav.quote}</a>
      </nav>}
    </header>
  );
};
