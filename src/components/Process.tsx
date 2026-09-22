import { useLanguage } from "@/i18n";
export function Process() {
  const { t } = useLanguage();
  return <section id="methode" className="section section-raised scroll-mt-24"><div className="site-container method-layout">
    <div><p className="eyebrow">{t.method.eyebrow}</p><h2>{t.method.title}</h2><p className="method-note">{t.method.ai}</p></div>
    <ol className="method-list">{t.method.steps.map((step, i) => <li key={step.title}><span>0{i + 1}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}</ol>
  </div></section>;
}