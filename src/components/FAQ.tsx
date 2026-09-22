import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/i18n";
export function FAQ() {
  const { t } = useLanguage();
  return <section id="faq" className="section scroll-mt-24"><div className="site-container faq-layout"><div><p className="eyebrow">{t.faq.eyebrow}</p><h2>{t.faq.title}</h2></div><Accordion type="single" collapsible className="faq-list">{t.faq.items.map((item, i) => <AccordionItem key={item.question} value={`faq-${i}`}><AccordionTrigger>{item.question}</AccordionTrigger><AccordionContent>{item.answer}</AccordionContent></AccordionItem>)}</Accordion></div></section>;
}