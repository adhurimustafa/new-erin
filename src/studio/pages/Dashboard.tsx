import { ShieldCheck } from "lucide-react";
import { useStudioAuth } from "../auth";

const roadmap = [
  { title: "Clients", text: "Fiches clients, coordonnées, notes et historique.", lot: "Lot 2" },
  { title: "Projets", text: "Projets liés à chaque client, avec statut et dernière modification.", lot: "Lot 2" },
  { title: "Nouveau site", text: "Assistant par secteur et brief dynamique.", lot: "Lot 3" },
  { title: "Assets", text: "Logos, photos, vidéos et documents rangés par projet.", lot: "Lot 4" },
  { title: "Structure recommandée", text: "Pages, sections et résumé à valider.", lot: "Lot 5" },
];

export default function Dashboard() {
  const { session } = useStudioAuth();
  const lastSignIn = session?.user.last_sign_in_at ? new Date(session.user.last_sign_in_at).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" }) : null;
  return (
    <div className="studio-page">
      <header className="studio-page-head">
        <p className="eyebrow">Studio TADAM</p>
        <h1 className="studio-h1">Tableau de bord</h1>
        <p className="studio-muted">Aucune donnée client n’est encore enregistrée : les modules de gestion arrivent dans les prochains lots.</p>
      </header>

      <section className="studio-status" aria-label="Session">
        <ShieldCheck aria-hidden="true" />
        <div>
          <p className="studio-status-title">Accès administrateur vérifié par le serveur</p>
          <p className="studio-muted">{session?.user.email}{lastSignIn && <> · dernière connexion le {lastSignIn}</>}</p>
        </div>
      </section>

      <section aria-labelledby="roadmap-title">
        <h2 id="roadmap-title" className="studio-h2">Modules à venir</h2>
        <ol className="studio-roadmap">
          {roadmap.map(item => (
            <li key={item.title}>
              <span className="studio-lot">{item.lot}</span>
              <h3>{item.title}</h3>
              <p className="studio-muted">{item.text}</p>
              <span className="studio-state">Prévu</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
