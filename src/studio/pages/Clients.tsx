import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useClients, useProjects, useSaveClient, formatDate } from "../data";
import { ClientForm } from "../components/ClientForm";
import { EmptyState, ErrorLine, Loading } from "../components/Bits";

export default function Clients() {
  const { data: clients, isLoading, error } = useClients();
  const { data: projects } = useProjects();
  const save = useSaveClient();
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const counts = useMemo(() => (projects ?? []).reduce<Record<string, number>>((a, p) => ({ ...a, [p.client_id]: (a[p.client_id] ?? 0) + 1 }), {}), [projects]);
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return clients ?? [];
    return (clients ?? []).filter(c => [c.company_name, c.contact_name, c.email, c.phone, c.location].some(v => v?.toLowerCase().includes(s)));
  }, [clients, q]);

  return (
    <div className="studio-page">
      <header className="studio-page-head studio-head-row">
        <div><p className="eyebrow">Studio TADAM</p><h1 className="studio-h1">Clients</h1></div>
        <Button onClick={() => setOpen(true)}><Plus aria-hidden="true" />Nouveau client</Button>
      </header>

      {isLoading ? <Loading /> : error ? <ErrorLine error={error} /> : !clients?.length ? (
        <EmptyState title="Aucun client pour le moment" text="Ajoutez votre premier client pour commencer à organiser vos projets." action={<Button onClick={() => setOpen(true)}><Plus aria-hidden="true" />Créer mon premier client</Button>} />
      ) : (
        <section aria-label="Liste des clients">
          <div className="studio-search">
            <Search aria-hidden="true" />
            <Input type="search" aria-label="Rechercher un client" placeholder="Rechercher par nom, contact, email, téléphone ou lieu" value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <p className="studio-muted studio-count" aria-live="polite">{filtered.length} client{filtered.length > 1 ? "s" : ""}{q && ` sur ${clients.length}`}</p>
          {filtered.length === 0 ? <EmptyState title="Aucun résultat" text="Aucun client ne correspond à cette recherche." /> : (
            <ul className="studio-list">
              {filtered.map(c => (
                <li key={c.id}>
                  <Link to={`/studio/clients/${c.id}`} className="studio-row">
                    <span className="studio-row-main">
                      <span className="studio-row-title">{c.company_name}</span>
                      <span className="studio-row-meta">{[c.contact_name, c.location].filter(Boolean).join(" · ") || "Aucune coordonnée"} · modifié le {formatDate(c.updated_at)}</span>
                    </span>
                    <span className="studio-pill">{counts[c.id] ?? 0} projet{(counts[c.id] ?? 0) > 1 ? "s" : ""}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="studio-dialog">
          <DialogHeader><DialogTitle>Nouveau client</DialogTitle><DialogDescription>Seul le nom de l’entreprise est obligatoire.</DialogDescription></DialogHeader>
          <ClientForm busy={save.isPending} onCancel={() => setOpen(false)} onSubmit={values => save.mutate({ values }, {
            onSuccess: c => { toast.success("Client créé."); setOpen(false); nav(`/studio/clients/${c.id}`); },
            onError: e => toast.error(e.message),
          })} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
