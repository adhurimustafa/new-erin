import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n";
import { siteConfig } from "@/config";
export function ContactForm() {
  const { t } = useLanguage();
  return <section id="contact" className="section contact-section scroll-mt-24"><div className="site-container contact-layout"><div><p className="eyebrow">{t.contact.eyebrow}</p><h2>{t.contact.title}</h2><p>{t.contact.text}</p></div><div className="contact-panel"><Mail aria-hidden="true" /><p>{t.contact.unavailable}</p><Button asChild size="lg"><a href={`mailto:${siteConfig.email}`}>{t.contact.direct}</a></Button><a className="email-address" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></div></div></section>;
}