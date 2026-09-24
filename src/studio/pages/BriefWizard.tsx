import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SECTORS, createBriefDraft, formatDate, saveBriefDraft, updateProjectSector, useBrief, useValidateBrief } from "../data";
import { STEPS, isFilled, visibleFields, type BriefData, type BriefValue } from "../brief/config";
import { BriefFieldInput } from "../brief/BriefFieldInput";
import { BriefSummary } from "../brief/BriefSummary";
import { BriefProgress } from "../brief/BriefProgress";
import { EmptyState, ErrorLine, Loading } from "../components/Bits";

const REVIEW = STEPS.length; // wizard index of the review screen
type SaveState = "idle" | "saving" | "saved" | "error";

export default function BriefWizard() {
  const { id } = useParams();
  const nav = useNavigate();
  const { data: brief, isLoading, error, refetch } = useBrief(id);
  const validate = useValidateBrief();
  const [data, setData] = useState<BriefData | null>(null);
  const [sector, setSector] = useState("other");
  const [step, setStep] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [save, setSave] = useState<{ state: SaveState; at?: Date }>({ state: "idle" });
  const dirty = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!brief || data) return;
    setData((brief.data ?? {}) as BriefData);
    setSector(brief.sector);
    const s = Math.min(brief.current_step, REVIEW);
    setStep(s); setMaxReached(s);
  }, [brief, data]);

  const isDraft = brief?.status === "draft";

  const persist = useCallback(async (patch: Parameters<typeof saveBriefDraft>[1]) => {
    if (!id || !isDraft) return;
    setSave({ state: "saving" });
    try { await saveBriefDraft(id, patch); setSave({ state: "saved", at: new Date() }); }
    catch { setSave({ state: "error" }); }
  }, [id, isDraft]);

  // Debounced autosave of answers.
  useEffect(() => {
    if (!data || !dirty.current) return;
    const t = setTimeout(() => { dirty.current = false; persist({ data }); }, 700);
    return () => clearTimeout(t);
  }, [data, persist]);

  const setField = (k: string, v: BriefValue) => { dirty.current = true; setData(d => ({ ...(d ?? {}), [k]: v })); setErrors(e => { const n = { ...e }; delete n[k]; return n; }); };

  const goTo = (s: number) => {
    setStep(s); setMaxReached(m => Math.max(m, s));
    dirty.current = false;
    persist({ current_step: s, data: data ?? {} });
    requestAnimationFrame(() => { headingRef.current?.focus(); window.scrollTo({ top: 0 }); });
  };

  const next = () => {
    const missing = visibleFields(STEPS[step], sector).filter(f => f.importance === "required" && !isFilled(data?.[f.key]));
    if (missing.length) {
      setErrors(Object.fromEntries(missing.map(f => [f.key, "Ce champ est obligatoire pour continuer."])));
      document.getElementById(`f-${missing[0].key}`)?.focus();
      return;
    }
    goTo(step + 1);
  };

  const changeSector = async (s: string) => {
    if (!brief?.projects) return;
    setSector(s);
    await persist({ sector: s });
    try { await updateProjectSector(brief.projects.id, s); } catch { toast.error("Le secteur du projet n’a pas pu être mis à jour."); }
  };

  const doValidate = () => {
    if (!id || !data) return;
    const reqMissing = STEPS.flatMap((s, i) => visibleFields(s, sector).filter(f => f.importance === "required" && !isFilled(data[f.key])).map(() => i));
    if (reqMissing.length) { toast.error("Des champs obligatoires sont vides."); goTo(reqMissing[0]); return; }
    validate.mutate({ id, data }, { onSuccess: () => { toast.success("Brief validé et enregistré comme version du projet."); refetch(); }, onError: e => toast.error(e.message) });
  };

  const newVersion = async () => {
    if (!brief?.projects) return;
    try { const b = await createBriefDraft(brief.projects.id, brief.sector, brief.data as Record<string, unknown>); nav(`/studio/briefs/${b.id}`); }
    catch (e) { toast.error((e as Error).message); }
  };

  if (isLoading || (brief && !data)) return <div className="studio-page"><Loading /></div>;
  if (error) return <div className="studio-page"><ErrorLine error={error} /></div>;
  if (!brief || !data) return <div className="studio-page"><EmptyState title="Brief introuvable" text="Ce brief n’existe pas ou n’est pas accessible avec ce compte." action={<Button asChild variant="outline"><Link to="/studio/projets">Retour aux projets</Link></Button>} /></div>;

  const project = brief.projects;
  const header = (
    <>
      {project && <Link to={`/studio/projets/${project.id}`} className="studio-back"><ArrowLeft aria-hidden="true" />{project.name}</Link>}
      <header className="studio-page-head studio-head-row">
        <div>
          <p className="eyebrow">Brief · version {brief.version} · {isDraft ? "brouillon" : "validé"}</p>
          <h1 className="studio-h1" ref={headingRef} tabIndex={-1}>{isDraft ? (step === REVIEW ? "Vérification du brief" : STEPS[step].title) : "Brief validé"}</h1>
          <p className="studio-muted">{project?.clients?.company_name} · {SECTORS[sector] ?? sector}</p>
        </div>
        {isDraft && <p className="brief-save" role="status" aria-live="polite">
          {save.state === "saving" ? "Enregistrement…" : save.state === "saved" ? `Brouillon enregistré à ${save.at!.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}` : save.state === "error" ? "Échec de l’enregistrement — vos saisies restent à l’écran" : "Brouillon sauvegardé automatiquement"}
        </p>}
      </header>
    </>
  );

  if (!isDraft) {
    return (
      <div className="studio-page">
        {header}
        <section className="studio-status"><Lock aria-hidden="true" /><div><p className="studio-status-title">Version figée</p><p className="studio-muted">Validée le {brief.validated_at ? formatDate(brief.validated_at) : "—"}. Pour modifier, créez une nouvelle version : celle-ci reste conservée.</p></div></section>
        <BriefSummary data={data} sector={sector} />
        <div className="studio-form-actions"><Button onClick={newVersion}>Créer une nouvelle version</Button></div>
      </div>
    );
  }

  return (
    <div className="studio-page">
      {header}
      <BriefProgress current={step + 2} maxReached={maxReached + 2} onJump={i => goTo(i - 2)} />

      {step < REVIEW ? (
        <form className="studio-panel brief-panel" onSubmit={e => { e.preventDefault(); next(); }} noValidate>
          <p className="studio-muted">{STEPS[step].intro}</p>
          {step === 0 && (
            <div className="studio-field is-wide">
              <label htmlFor="brief-sector" className="text-sm font-medium">Secteur (détermine les questions de l’étape Offre)</label>
              <select id="brief-sector" className="studio-select" value={sector} onChange={e => changeSector(e.target.value)}>
                {Object.entries(SECTORS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </div>
          )}
          <div className="studio-form-grid">
            {visibleFields(STEPS[step], sector).map(f => <BriefFieldInput key={f.key} field={f} value={data[f.key]} error={errors[f.key]} onChange={v => setField(f.key, v)} />)}
          </div>
          <div className="studio-form-actions brief-nav">
            <Button type="button" variant="outline" disabled={step === 0} onClick={() => goTo(step - 1)}><ArrowLeft aria-hidden="true" />Précédent</Button>
            <Button type="submit">{step === REVIEW - 1 ? "Vérifier le brief" : "Suivant"}<ArrowRight aria-hidden="true" /></Button>
          </div>
        </form>
      ) : (
        <>
          <BriefSummary data={data} sector={sector} onEdit={goTo} />
          <div className="studio-form-actions brief-nav">
            <Button type="button" variant="outline" onClick={() => goTo(REVIEW - 1)}><ArrowLeft aria-hidden="true" />Précédent</Button>
            <Button type="button" onClick={doValidate} disabled={validate.isPending}><CheckCircle2 aria-hidden="true" />{validate.isPending ? "Validation…" : "Valider et enregistrer cette version"}</Button>
          </div>
        </>
      )}
    </div>
  );
}
