import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/i18n";
import { siteConfig } from "@/config";

export default function Privacy() {
  const { t } = useLanguage();
  return <><Header /><main className="page-shell"><div className="site-container prose-page"><p className="eyebrow">TADAM</p><h1>{t.privacy.title}</h1><p className="lead">{t.privacy.intro}</p><section><h2>{t.privacy.currentTitle}</h2><p>{t.privacy.current}</p></section><section><h2>{t.privacy.missingTitle}</h2><p>{t.privacy.missing}</p></section><p>{t.privacy.contact} <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></p></div></main><Footer /></>;
}