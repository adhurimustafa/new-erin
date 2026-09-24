import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useClient, useDeleteClient, useProjects, useSaveClient, useSaveProject, formatDate } from "../data";
import { ClientForm } from "../components/ClientForm";
import { ProjectForm } from "../components/ProjectForm";
import { ConfirmDelete } from "../components/ConfirmDelete";
import { EmptyState, ErrorLine, Loading, ProjectList } from "../components/Bits";

export default function ClientDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { data: client, isLoading, error } = useClient(id);
  const { data: projects } = useProjects(id);
  const save = useSaveClient();
  const del = useDeleteClient();
  const saveProject = useSaveProject();
  const [editing, setEditing] = useState(false);
  const [newProject, setNewProject] = useState(false);

  if (isLoading) return <div className="studio-page"><Loading /></div>;
  if (error) return <div className="studio-page"><ErrorLine error={error} /></div>;
  if (!client) return <div className="studio-page"><EmptyState title="Client introuvable" text="Ce client n’existe pas ou n’est pas accessible avec ce compte." action={<Button asChild variant="outline"><Link to="/studio/clients">Retour aux clients</Link></Button>} /></div>;

  const info: [string, string | null][] = [
    ["Contact", client.contact_name], ["Email", client.email], ["Téléphone", client.phone],
    ["Adresse / localisation", client.location], ["Site actuel", client.website],
  ];
  const projectCount = projects?.length ?? 0;

  return (
    <div className="studio-page">
      <Link to="/studio/clients" className="studio-back"><ArrowLeft aria-hidden="true" />Clients</Link>
      <header className="studio-page-head studio-head-row">
        <div><p className="eyebrow">Fiche client</p><h1 className="studio-h1">{client.company_name}</h1>
          <p className="studio-muted">Créé le {formatDate(client.created_at)} · modifié le {formatDate(client.updated_at)}</p></div>
        <div className="studio-actions">
          <Button variant="outline" onClick={() => setEditing(true)}><Pencil aria-hidden="true" />Modifier</Button>
          <ConfirmDelete name={client.company_name} label="ce client" busy={del.isPending}
            blockedReason={projectCount ? `Ce client a ${projectCount} projet${projectCount > 1 ? "s" : ""}. Supprimez d’abord ses projets pour pouvoir le supprimer.` : undefined}
            onConfirm={() => del.mutate(client.id, { onSuccess: () => { toast.success("Client supprimé."); nav("/studio/clients"); }, onError: e => toast.error(e.message) })} />
        </div>
      </header>

      <div className="studio-detail-grid">
        <section aria-labelledby="coords" className="studio-panel">
          <h2 id="coords" className="studio-h2">Coordonnées</h2>
          <dl className="studio-dl">
            {info.map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v ? (k === "Email" ? <a href={`mailto:${v}`}>{v}</a> : k === "Site actuel" ? <a href={v} target="_blank" rel="noopener noreferrer">{v}</a> : v) : <span className="studio-missing">Non renseigné</span>}</dd></div>
            ))}
            <div><dt>Réseaux sociaux</dt><dd className="studio-pre">{client.socials || <span className="studio-missing">Non renseigné</span>}</dd></div>
          </dl>
        </section>
        <section aria-labelledby="notes" className="studio-panel">
          <h2 id="notes" className="studio-h2">Notes internes</h2>
          <p className="studio-pre">{client.notes || <span className="studio-missing">Aucune note.</span>}</p>
        </section>
      </div>

      <section aria-labelledby="client-projects">
        <div className="studio-head-row studio-section-head">
          <h2 id="client-projects" className="studio-h2">Projets ({projectCount})</h2>
          <Button variant="outline" onClick={() => setNewProject(true)}><Plus aria-hidden="true" />Nouveau projet</Button>
        </div>
        {projectCount ? <ProjectList projects={projects!} showClient={false} /> : <EmptyState title="Aucun projet" text="Ce client n’a pas encore de projet." />}
      </section>

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="studio-dialog">
          <DialogHeader><DialogTitle>Modifier le client</DialogTitle><DialogDescription>Les champs vides restent non renseignés.</DialogDescription></DialogHeader>
          <ClientForm initial={client} busy={save.isPending} onCancel={() => setEditing(false)} onSubmit={values => save.mutate({ id: client.id, values }, {
            onSuccess: () => { toast.success("Client mis à jour."); setEditing(false); }, onError: e => toast.error(e.message),
          })} />
        </DialogContent>
      </Dialog>

      <Dialog open={newProject} onOpenChange={setNewProject}>
        <DialogContent className="studio-dialog">
          <DialogHeader><DialogTitle>Nouveau projet</DialogTitle><DialogDescription>Rattaché à {client.company_name}.</DialogDescription></DialogHeader>
          <ProjectForm clients={[client]} fixedClientId={client.id} busy={saveProject.isPending} onCancel={() => setNewProject(false)} onSubmit={values => saveProject.mutate({ values }, {
            onSuccess: p => { toast.success("Projet créé."); setNewProject(false); nav(`/studio/projets/${p.id}`); }, onError: e => toast.error(e.message),
          })} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
