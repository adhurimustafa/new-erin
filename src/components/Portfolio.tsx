import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/i18n";
import { siteConfig } from "@/config";
import glam from "@/assets/portfolio/glam.webp";
import brizibatiment from "@/assets/portfolio/brizibatiment.webp";
import ergoPlus from "@/assets/portfolio/ergo-plus.webp";
import auBonGout from "@/assets/portfolio/au-bon-gout.webp";

const images = [glam, brizibatiment, ergoPlus];

export function Portfolio() {
  const { t } = useLanguage();
  return (
    <section id="realisations" className="section section-raised scroll-mt-24">
      <div className="site-container">
        <p className="eyebrow">{t.work.eyebrow}</p>
        <div className="section-heading">
          <h2>{t.work.title}</h2>
          <p>{t.work.intro}</p>
        </div>
        <div className="portfolio-grid">
          {t.work.projects.map((project, index) => (
            <article className="project-card" key={project.name}>
              <div className="project-image"><img src={images[index]} alt={project.alt} width="1200" height="731" loading="lazy" /></div>
              <div className="project-content">
                <span className="badge">{t.work.client}</span>
                <p className="project-category">{project.category}</p>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <a href={siteConfig.portfolio[index]} target="_blank" rel="noopener noreferrer" className="text-link">
                  {t.work.visit}<span className="sr-only"> — {project.name}, {t.common.external}</span><ExternalLink aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
        <article className="concept-block">
          <div className="concept-image"><img src={auBonGout} alt={`${t.work.conceptTitle} — Au Bon Goût`} width="1200" height="731" loading="lazy" /></div>
          <div className="concept-copy">
            <span className="badge badge-muted">{t.work.conceptBadge}</span>
            <p className="project-category">{t.work.conceptTitle} • Au Bon Goût • France</p>
            <h3>Au Bon Goût</h3>
            <p>{t.work.conceptDescription}</p>
            <a href={siteConfig.portfolio[3]} target="_blank" rel="noopener noreferrer" className="text-link">
              {t.work.conceptVisit}<span className="sr-only"> — Au Bon Goût, {t.common.external}</span><ExternalLink aria-hidden="true" />
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}