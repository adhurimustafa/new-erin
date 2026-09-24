import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { STATUSES, useClients, useProjects, useSaveProject, type ProjectStatus } from "../data";
import { ProjectForm } from "../components/ProjectForm";
import { EmptyState, ErrorLine, Loading, ProjectList } from "../components/Bits";

export default function Projects() {
  const { data: projects, isLoading, error } = useProjects();
  const { data: clients } = useClients();
  const save = useSaveProject();
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "">("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (projects ?? []).filter(p => (!status || p.status === status) && (!s || p.name.toLowerCase().includes(s) || p.clients?.company_name.toLowerCase().includes(s)));
  }, [projects, q, status]);
  const noClients = clients && clients.length === 0;

  return (
    <div className="studio-page">
      <header className="studio-page-head studio-head-row">
        <div><p className="eyebrow">Studio TADAM</p><h1 className="studio-h1">Projets</h1></div>
        {!noClients && <Button onClick={() => setOpen(true)}><Plus aria-hidden="true" />Nouveau projet</Button>}
      </header>

      {isLoading ? <Loading /> : error ? <ErrorLine error={error} /> : noClients ? (
        <EmptyState title="Aucun client" text="Un projet doit être rattaché à un client. Créez d’abord un client." action={<Button asChild><Link to="/studio/clients">Créer mon premier client</Link></Button>} />
      ) : !projects?.length ? (
        <EmptyState title="Aucun projet pour le moment" text="Créez un projet pour l’un de vos clients." action={<Button onClick={() => setOpen(true)}><Plus aria-hidden="true" />Créer mon premier projet</Button>} />
      ) : (
        <section aria-label="Liste des projets">
          <div className="studio-filters">
            <div className="studio-search"><Search aria-hidden="true" /><Input type="search" aria-label="Rechercher un projet" placeholder="Rechercher par projet ou client" value={q} onChange={e => setQ(e.target.value)} /></div>
            <select className="studio-select" aria-label="Filtrer par statut" value={status} onChange={e => setStatus(e.target.value as ProjectStatus | "")}>
              <option value="">Tous les statuts</option>
              {Object.entries(STATUSES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
          </div>
          <p className="studio-muted studio-count" aria-live="polite">{filtered.length} projet{filtered.length > 1 ? "s" : ""}</p>
          {filtered.length ? <ProjectList projects={filtered} /> : <EmptyState title="Aucun résultat" text="Aucun projet ne correspond à ces critères." />}
        </section>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="studio-dialog">
          <DialogHeader><DialogTitle>Nouveau projet</DialogTitle><DialogDescription>Chaque projet est rattaché à un client.</DialogDescription></DialogHeader>
          <ProjectForm clients={clients ?? []} busy={save.isPending} onCancel={() => setOpen(false)} onSubmit={values => save.mutate({ values }, {
            onSuccess: p => { toast.success("Projet créé."); setOpen(false); nav(`/studio/projets/${p.id}`); }, onError: e => toast.error(e.message),
          })} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
