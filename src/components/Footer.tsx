import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n";
import { siteConfig } from "@/config";
import logo from "@/assets/logo-tadam-wordmark.png";

export function Footer() {
  const { t } = useLanguage();
  const location = useLocation();
  const anchor = (hash: string) => location.pathname === "/" ? hash : `/${hash}`;
  return <footer className="site-footer"><div className="site-container footer-grid">
    <div className="footer-brand"><span className="logo-crop"><img src={logo} alt="TADAM" /></span><p>{t.footer.description}</p><p>{t.footer.region}</p></div>
    <div><p className="footer-name">Adhurim Mustafa</p><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a><p className="footer-signature">{t.footer.signature}</p></div>
    <nav aria-label="Footer"><a href={anchor("#realisations")}>{t.nav.work}</a><a href={anchor("#services")}>{t.nav.services}</a><a href={anchor("#contact")}>{t.nav.contact}</a><Link to="/mentions-legales">{t.footer.legal}</Link><Link to="/confidentialite">{t.footer.privacy}</Link></nav>
  </div><div className="site-container copyright">© {new Date().getFullYear()} TADAM — Adhurim Mustafa</div></footer>;
}