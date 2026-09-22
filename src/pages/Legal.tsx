import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/i18n";
import { siteConfig } from "@/config";

export default function Legal() {
  const { t } = useLanguage();
  return <><Header /><main className="page-shell"><div className="site-container prose-page"><p className="eyebrow">TADAM</p><h1>{t.legal.title}</h1><p className="lead">{t.legal.intro}</p><section><h2>{t.legal.knownTitle}</h2><ul>{t.legal.known.map(item => <li key={item}>{item}</li>)}</ul></section><section><h2>{t.legal.missingTitle}</h2><p>{t.legal.missing}</p></section><p>{t.legal.contact} <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></p></div></main><Footer /></>;
}