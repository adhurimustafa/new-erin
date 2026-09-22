import { Building2, LayoutGrid, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/i18n";

const icons = [Building2, LayoutGrid, ShoppingBag];
export function Services() {
  const { t } = useLanguage();
  return <section id="services" className="section scroll-mt-24"><div className="site-container">
    <p className="eyebrow">{t.services.eyebrow}</p><div className="section-heading"><h2>{t.services.title}</h2><p>{t.services.intro}</p></div>
    <div className="service-grid">{t.services.items.map((item, i) => { const Icon = icons[i]; return <article key={item.title} className="service-item"><span className="icon-box"><Icon /></span><span className="service-number">0{i + 1}</span><h3>{item.title}</h3><p>{item.description}</p></article>; })}</div>
    <p className="service-note">{t.services.note}</p>
  </div></section>;
}