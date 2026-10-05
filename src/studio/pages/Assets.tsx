import { Link, useSearchParams } from "react-router-dom";
import { useProjects } from "../data";
import { AssetLibrary } from "../components/AssetLibrary";
import { EmptyState, ErrorLine, Loading } from "../components/Bits";
import { Button } from "@/components/ui/button";

export default function Assets() {
  const { data: projects, isLoading, error } = useProjects();
  const [params, setParams] = useSearchParams();
  const id = params.get("projet") ?? "";
  const current = projects?.find(p => p.id === id);
  return (
    <div className="studio-page">
      <header className="studio-page-head">
        <p className="eyebrow">Assets</p>
        <h1 className="studio-h1">Médiathèques des projets</h1>
        <p className="studio-muted">Chaque fichier appartient à un projet. Choisissez le projet concerné.</p>
      </header>
      {isLoading ? <Loading /> : error ? <ErrorLine error={error} /> : !projects?.length ? (
        <EmptyState title="Aucun projet" text="Créez d’abord un projet pour y ajouter des fichiers." action={<Button asChild variant="outline"><Link to="/studio/projets">Projets</Link></Button>} />
      ) : (
        <>
          <div className="studio-field asset-project-pick">
            <label htmlFor="asset-project">Projet</label>
            <select id="asset-project" className="studio-select" value={id} onChange={e => setParams(e.target.value ? { projet: e.target.value } : {})}>
              <option value="">Choisir un projet…</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}{p.clients ? ` — ${p.clients.company_name}` : ""}</option>)}
            </select>
          </div>
          {current ? (
            <>
              <p className="studio-client-line">Projet : <Link to={`/studio/projets/${current.id}`}>{current.name}</Link>{current.clients && <> · Client : <Link to={`/studio/clients/${current.clients.id}`}>{current.clients.company_name}</Link></>}</p>
              <AssetLibrary key={current.id} projectId={current.id} locked={current.deleting} />
            </>
          ) : <p className="studio-muted">Aucun projet sélectionné.</p>}
        </>
      )}
    </div>
  );
}
