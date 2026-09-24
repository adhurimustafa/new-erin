import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { LANGUAGES, SECTORS, formatDate, useClients, useDeleteProject, useProject, useSaveProject } from "../data";
import { ProjectForm } from "../components/ProjectForm";
import { ConfirmDelete } from "../components/ConfirmDelete";
import { EmptyState, ErrorLine, Loading, StatusBadge } from "../components/Bits";

export default function ProjectDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { data: project, isLoading, error } = useProject(id);
  const { data: clients } = useClients();
  const save = useSaveProject();
  const del = useDeleteProject();
  const [editing, setEditing] = useState(false);

  if (isLoading) return <div className="studio-page"><Loading /></div>;
  if (error) return <div className="studio-page"><ErrorLine error={error} /></div>;
  if (!project) return <div className="studio-page"><EmptyState title="Projet introuvable" text="Ce projet n’existe pas ou n’est pas accessible avec ce compte." action={<Button asChild variant="outline"><Link to="/studio/projets">Retour aux projets</Link></Button>} /></div>;

  return (
    <div className="studio-page">
      <Link to="/studio/projets" className="studio-back"><ArrowLeft aria-hidden="true" />Projets</Link>
      <header className="studio-page-head studio-head-row">
        <div>
          <p className="eyebrow">Fiche projet</p>
          <h1 className="studio-h1">{project.name}</h1>
          {project.clients && <p className="studio-client-line">Client : <Link to={`/studio/clients/${project.clients.id}`}>{project.clients.company_name}</Link></p>}
        </div>
        <div className="studio-actions">
          <Button variant="outline" onClick={() => setEditing(true)}><Pencil aria-hidden="true" />Modifier</Button>
          <ConfirmDelete name={project.name} label="ce projet" busy={del.isPending}
            onConfirm={() => del.mutate(project.id, { onSuccess: () => { toast.success("Projet supprimé."); nav(`/studio/clients/${project.client_id}`); }, onError: e => toast.error(e.message) })} />
        </div>
      </header>

      <section className="studio-panel" aria-label="Informations du projet">
        <dl className="studio-dl studio-dl-cols">
          <div><dt>Statut</dt><dd><StatusBadge status={project.status} />{project.status === "published" && <p className="studio-help">Statut de gestion : aucune publication technique n’est effectuée par le Studio.</p>}</dd></div>
          <div><dt>Secteur</dt><dd>{SECTORS[project.sector] ?? project.sector}</dd></div>
          <div><dt>Langues</dt><dd>{project.languages.map(l => LANGUAGES[l] ?? l).join(", ")}</dd></div>
          <div><dt>Créé le</dt><dd>{formatDate(project.created_at)}</dd></div>
          <div><dt>Dernière modification</dt><dd>{formatDate(project.updated_at)}</dd></div>
        </dl>
      </section>

      <section className="studio-panel" aria-labelledby="desc">
        <h2 id="desc" className="studio-h2">Description</h2>
        <p className="studio-pre">{project.description || <span className="studio-missing">Aucune description.</span>}</p>
      </section>

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="studio-dialog">
          <DialogHeader><DialogTitle>Modifier le projet</DialogTitle><DialogDescription>Le client associé peut être changé parmi vos clients.</DialogDescription></DialogHeader>
          <ProjectForm initial={project} clients={clients ?? []} busy={save.isPending} onCancel={() => setEditing(false)} onSubmit={values => save.mutate({ id: project.id, values }, {
            onSuccess: () => { toast.success("Projet mis à jour."); setEditing(false); }, onError: e => toast.error(e.message),
          })} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
