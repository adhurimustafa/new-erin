import { Link } from "react-router-dom";
import { Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudioAuth } from "../auth";
import { useClients, useDraftBriefs, useProjects, type ProjectStatus } from "../data";
import { EmptyState, ErrorLine, Loading, ProjectList } from "../components/Bits";

const roadmap = [
  { title: "Assets", text: "Logos, photos, vidéos et documents rangés par projet.", lot: "Lot 4" },
  { title: "Structure recommandée", text: "Pages, sections et résumé à valider.", lot: "Lot 5" },
];

export default function Dashboard() {
  const { session } = useStudioAuth();
  const clients = useClients();
  const projects = useProjects();
  const drafts = useDraftBriefs();
  const loading = clients.isLoading || projects.isLoading;
  const err = clients.error || projects.error;
  const list = projects.data ?? [];
  const by = (s: ProjectStatus) => list.filter(p => p.status === s).length;
  const stats = [
    { label: "Clients", value: clients.data?.length ?? 0, to: "/studio/clients" },
    { label: "Projets actifs", value: by("draft") + by("preparing") + by("ready"), to: "/studio/projets" },
    { label: "Brouillons", value: by("draft"), to: "/studio/projets" },
    { label: "En préparation", value: by("preparing"), to: "/studio/projets" },
    { label: "Prêts", value: by("ready"), to: "/studio/projets" },
    { label: "Statut « Publié »", value: by("published"), to: "/studio/projets" },
  ];

  return (
    <div className="studio-page">
      <header className="studio-page-head studio-head-row">
        <div><p className="eyebrow">Studio TADAM</p><h1 className="studio-h1">Tableau de bord</h1></div>
        <Button asChild><Link to="/studio/nouveau-site"><Plus aria-hidden="true" />Créer un nouveau site</Link></Button>
      </header>

      <section className="studio-status" aria-label="Session">
        <ShieldCheck aria-hidden="true" />
        <div><p className="studio-status-title">Accès administrateur vérifié par le serveur</p><p className="studio-muted">{session?.user.email}</p></div>
      </section>

      {loading ? <Loading /> : err ? <ErrorLine error={err} /> : (
        <>
          <section aria-label="Chiffres réels">
            <dl className="studio-stats">
              {stats.map(s => <Link key={s.label} to={s.to} className="studio-stat"><dt>{s.label}</dt><dd>{s.value}</dd></Link>)}
            </dl>
          </section>

          {!!drafts.data?.length && (
            <section aria-labelledby="drafts">
              <h2 id="drafts" className="studio-h2">Briefs en cours</h2>
              <ul className="studio-list">
                {drafts.data.map(b => (
                  <li key={b.id}><Link to={`/studio/briefs/${b.id}`} className="studio-row">
                    <span className="studio-row-main"><span className="studio-row-title">{b.projects?.name}</span><span className="studio-row-meta">{b.projects?.clients?.company_name} · version {b.version} · étape {Math.min(b.current_step + 3, 9)} sur 9</span></span>
                    <span className="studio-pill">Reprendre</span>
                  </Link></li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="recent">
            <div className="studio-head-row studio-section-head">
              <h2 id="recent" className="studio-h2">Projets récemment modifiés</h2>
              {list.length > 0 && <Link to="/studio/projets" className="studio-link">Tous les projets</Link>}
            </div>
            {list.length ? <ProjectList projects={list.slice(0, 5)} /> : clients.data?.length ? (
              <EmptyState title="Aucun projet" text="Créez un projet depuis la fiche d’un client." action={<Button asChild><Link to="/studio/projets">Créer mon premier projet</Link></Button>} />
            ) : (
              <EmptyState title="Votre Studio est vide" text="Commencez par ajouter un client, puis créez ses projets." action={<Button asChild><Link to="/studio/clients">Créer mon premier client</Link></Button>} />
            )}
          </section>
        </>
      )}

      <section aria-labelledby="roadmap-title">
        <h2 id="roadmap-title" className="studio-h2">Modules à venir</h2>
        <ol className="studio-roadmap">
          {roadmap.map(item => (
            <li key={item.title}><span className="studio-lot">{item.lot}</span><h3>{item.title}</h3><p className="studio-muted">{item.text}</p><span className="studio-state">Prévu</span></li>
          ))}
        </ol>
      </section>
    </div>
  );
}
