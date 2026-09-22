import { useLanguage } from "@/i18n";
export function About() {
  const { t } = useLanguage();
  return <section id="apropos" className="section about-section scroll-mt-24"><div className="site-container about-layout"><div className="about-monogram" aria-hidden="true">AM</div><div><p className="eyebrow">{t.about.eyebrow}</p><h2>{t.about.title}</h2>{t.about.paragraphs.map(p => <p key={p}>{p}</p>)}</div></div></section>;
}