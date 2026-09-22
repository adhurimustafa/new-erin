import { ArrowDownRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n";

export const Hero = () => {
  const { t } = useLanguage();
  return (
    <section className="hero-section">
      <div className="site-container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1>{t.hero.title}</h1>
          <p className="hero-description">{t.hero.description}</p>
          <div className="hero-actions">
            <Button asChild size="lg"><a href="#contact">{t.hero.primary}<ArrowDownRight /></a></Button>
            <Button asChild size="lg" variant="outline"><a href="#realisations">{t.hero.secondary}</a></Button>
          </div>
        </div>
        <div className="hero-mark" aria-hidden="true"><span>T</span><small>TADAM</small></div>
        <ul className="hero-points">
          {t.hero.points.map(point => <li key={point}><Check aria-hidden="true" />{point}</li>)}
        </ul>
      </div>
    </section>
  );
};
