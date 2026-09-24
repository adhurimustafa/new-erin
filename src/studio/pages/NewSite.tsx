import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SECTORS, LANGUAGES, clientSchema, createBriefDraft, useClients, useSaveClient, useSaveProject, type Client } from "../data";
import { BriefProgress } from "../brief/BriefProgress";
import { ErrorLine, Loading } from "../components/Bits";

export default function NewSite() {
  const nav = useNavigate();
  const { data: clients, isLoading, error } = useClients();
  const saveClient = useSaveClient();
  const saveProject = useSaveProject();
  const [phase, setPhase] = useState<0 | 1>(0);
  const [mode, setMode] = useState<"existing" | "new">("existing");
  const [q, setQ] = useState("");
  const [client, setClient] = useState<Client | null>(null);
  const [quick, setQuick] = useState({ company_name: "", email: "", phone: "" });
  const [quickErr, setQuickErr] = useState<Record<string, string>>({});
  const [sector, setSector] = useState("");
  const [projectName, setProjectName] = useState("");
  const [languages, setLanguages] = useState<string[]>(["sq"]);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (clients ?? []).filter(c => !s || c.company_name.toLowerCase().includes(s) || c.contact_name?.toLowerCase().includes(s));
  }, [clients, q]);

  const nextFromClient = async (e: FormEvent) => {
    e.preventDefault();
    if (mode === "existing") {
      if (!client) return setErr("Choisissez un client.");
      setErr(null); setPhase(1); return;
    }
    const r = clientSchema.safeParse(quick);
    if (!r.success) { setQuickErr(Object.fromEntries(r.error.issues.map(i => [String(i.path[0]), i.message]))); return; }
    setQuickErr({});
    try { const c = await saveClient.mutateAsync({ values: quick }); setClient(c); setMode("existing"); setErr(null); setPhase(1); toast.success("Client créé."); }
    catch (x) { setErr((x as Error).message); }
  };

  const start = async (e: FormEvent) => {
    e.preventDefault();
    if (!client) return;
    if (!sector) return setErr("Choisissez un secteur.");
    if (!projectName.trim()) return setErr("Donnez un nom au projet.");
    if (!languages.length) return setErr("Choisissez au moins une langue.");
    setErr(null); setBusy(true);
    try {
      const project = await saveProject.mutateAsync({ values: { name: projectName, client_id: client.id, sector, languages, status: "draft", description: "" } });
      // Prefill with what is already known — never invent missing values.
      const prefill: Record<string, unknown> = { languages };
      const map: [string, string | null][] = [["business_name", client.company_name], ["location", client.location], ["phone", client.phone], ["email", client.email], ["socials", client.socials], ["existing_website", client.website]];
      map.forEach(([k, v]) => { if (v) prefill[k] = v; });
      const brief = await createBriefDraft(project.id, sector, prefill);
      nav(`/studio/briefs/${brief.id}`);
    } catch (x) { setErr((x as Error).message); setBusy(false); }
  };

  return (
    <div className="studio-page">
      <Link to="/studio" className="studio-back"><ArrowLeft aria-hidden="true" />Tableau de bord</Link>
      <header className="studio-page-head"><p className="eyebrow">Nouveau site</p><h1 className="studio-h1">Créer un nouveau site</h1>
        <p className="studio-muted">Choisissez le client, puis le secteur : le brief s’adaptera à l’activité.</p></header>
      <BriefProgress current={phase} />

      {phase === 0 ? (
        <form className="studio-panel brief-panel" onSubmit={nextFromClient} noValidate>
          <h2 className="studio-h2">Client</h2>
          <div className="brief-toggle" role="radiogroup" aria-label="Type de client">
            <label className={`studio-chip${mode === "existing" ? " is-on" : ""}`}><input type="radio" name="mode" checked={mode === "existing"} onChange={() => setMode("existing")} />Client existant</label>
            <label className={`studio-chip${mode === "new" ? " is-on" : ""}`}><input type="radio" name="mode" checked={mode === "new"} onChange={() => setMode("new")} />Nouveau client</label>
          </div>
          {mode === "existing" ? (
            isLoading ? <Loading /> : error ? <ErrorLine error={error} /> : !clients?.length ? (
              <p className="studio-muted">Aucun client enregistré. Choisissez « Nouveau client ».</p>
            ) : (
              <>
                <div className="studio-search"><Search aria-hidden="true" /><Input type="search" aria-label="Rechercher un client" placeholder="Rechercher un client" value={q} onChange={e => setQ(e.target.value)} /></div>
                <div className="brief-client-list" role="radiogroup" aria-label="Clients">
                  {filtered.map(c => (
                    <label key={c.id} className={`brief-client${client?.id === c.id ? " is-on" : ""}`}>
                      <input type="radio" name="client" checked={client?.id === c.id} onChange={() => setClient(c)} />
                      <span><strong>{c.company_name}</strong><span className="studio-row-meta">{[c.contact_name, c.location].filter(Boolean).join(" · ") || "Aucune coordonnée"}</span></span>
                    </label>
                  ))}
                  {!filtered.length && <p className="studio-muted">Aucun résultat.</p>}
                </div>
              </>
            )
          ) : (
            <div className="studio-form-grid">
              {([["company_name", "Nom de l’entreprise *", "text"], ["email", "Email (facultatif)", "email"], ["phone", "Téléphone (facultatif)", "tel"]] as const).map(([k, l, t]) => (
                <div key={k} className={`studio-field${k === "company_name" ? " is-wide" : ""}`}>
                  <Label htmlFor={`q-${k}`}>{l}</Label>
                  <Input id={`q-${k}`} type={t} value={quick[k]} aria-invalid={!!quickErr[k]} aria-describedby={quickErr[k] ? `q-${k}-err` : undefined} onChange={e => setQuick(s => ({ ...s, [k]: e.target.value }))} />
                  {quickErr[k] && <p id={`q-${k}-err`} className="studio-field-error">{quickErr[k]}</p>}
                </div>
              ))}
            </div>
          )}
          {err && <p className="studio-error" role="alert">{err}</p>}
          <div className="studio-form-actions"><Button type="submit" disabled={saveClient.isPending}>{saveClient.isPending ? "Création…" : <>Suivant<ArrowRight aria-hidden="true" /></>}</Button></div>
        </form>
      ) : (
        <form className="studio-panel brief-panel" onSubmit={start} noValidate>
          <h2 className="studio-h2">Secteur et projet</h2>
          <p className="studio-muted">Client : <strong>{client?.company_name}</strong></p>
          <fieldset className="studio-field is-wide">
            <legend className="studio-legend">Secteur d’activité *</legend>
            <div className="brief-sector-grid" role="radiogroup">
              {Object.entries(SECTORS).map(([k, l]) => (
                <label key={k} className={`brief-sector${sector === k ? " is-on" : ""}`}><input type="radio" name="sector" checked={sector === k} onChange={() => setSector(k)} />{l}</label>
              ))}
            </div>
          </fieldset>
          <div className="studio-field is-wide">
            <Label htmlFor="project-name">Nom du projet *</Label>
            <Input id="project-name" maxLength={150} value={projectName} placeholder={client ? `Site ${client.company_name}` : ""} onChange={e => setProjectName(e.target.value)} />
          </div>
          <fieldset className="studio-field is-wide">
            <legend className="studio-legend">Langues du site *</legend>
            <div className="studio-chips">
              {Object.entries(LANGUAGES).map(([k, l]) => { const on = languages.includes(k); return (
                <label key={k} className={`studio-chip${on ? " is-on" : ""}`}><input type="checkbox" checked={on} onChange={() => setLanguages(on ? languages.filter(x => x !== k) : [...languages, k])} />{l}</label>
              ); })}
            </div>
          </fieldset>
          {err && <p className="studio-error" role="alert">{err}</p>}
          <div className="studio-form-actions">
            <Button type="button" variant="outline" onClick={() => { setErr(null); setPhase(0); }}><ArrowLeft aria-hidden="true" />Précédent</Button>
            <Button type="submit" disabled={busy}>{busy ? "Création…" : <>Démarrer le brief<ArrowRight aria-hidden="true" /></>}</Button>
          </div>
        </form>
      )}
    </div>
  );
}
