import { ArrowDownRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n";
import glam from "@/assets/portfolio/glam.webp";
import brizibatiment from "@/assets/portfolio/brizibatiment.webp";
import ergoPlus from "@/assets/portfolio/ergo-plus.webp";

const projectPreviews = [
  { image: glam, name: "Glam Fashion House", className: "hero-window-main" },
  { image: brizibatiment, name: "BRIZIBATIMENT", className: "hero-window-side" },
  { image: ergoPlus, name: "Ergo Plus Clinic", className: "hero-window-small" },
];

export const Hero = () => {
  const { t } = useLanguage();
  const accentEnd = t.hero.title.indexOf(" ", Math.max(8, Math.floor(t.hero.title.length * 0.32)));
  const splitAt = accentEnd > 0 ? accentEnd : t.hero.title.length;
  const accent = t.hero.title.slice(0, splitAt);
  const rest = t.hero.title.slice(splitAt).trim();
  return (
    <section className="hero-section">
      <div className="site-container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1><span className="gradient-text">{accent}</span>{rest && <> {rest}</>}</h1>
          <p className="hero-description">{t.hero.description}</p>
          <div className="hero-actions">
            <Button asChild size="lg"><a href="#contact">{t.hero.primary}<ArrowDownRight /></a></Button>
            <Button asChild size="lg" variant="outline"><a href="#realisations">{t.hero.secondary}</a></Button>
          </div>
        </div>
        <div className="hero-showcase" aria-label={t.work.intro}>
          <div className="showcase-glow" aria-hidden="true" />
          {projectPreviews.map((project) => (
            <figure className={`browser-window ${project.className}`} key={project.name}>
              <div className="browser-bar" aria-hidden="true"><i /><i /><i /><span>{project.name}</span></div>
              <img src={project.image} alt={`${project.name} — ${t.work.client}`} width="1200" height="731" />
            </figure>
          ))}
        </div>
        <ul className="hero-points">
          {t.hero.points.map(point => <li key={point}><Check aria-hidden="true" />{point}</li>)}
        </ul>
      </div>
    </section>
  );
};
