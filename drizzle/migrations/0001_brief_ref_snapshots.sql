ALTER TABLE public.brief_asset_refs
  ADD COLUMN label_snapshot text,
  ADD COLUMN category_snapshot public.asset_category,
  ADD COLUMN original_name_snapshot text;

CREATE OR REPLACE FUNCTION public.guard_brief_asset_ref()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE _b record; _a record;
BEGIN
  IF TG_OP = 'INSERT' THEN
    SELECT owner_id, project_id, status INTO _b FROM public.project_briefs WHERE id = NEW.brief_id;
    SELECT owner_id, project_id, status, label, category, original_name INTO _a FROM public.project_assets WHERE id = NEW.asset_id;
    IF _b IS NULL OR _a IS NULL OR _b.status <> 'draft' OR _a.status <> 'ready'
       OR _b.project_id <> _a.project_id OR _b.owner_id <> NEW.owner_id OR _a.owner_id <> NEW.owner_id THEN
      RAISE EXCEPTION 'Only ready files of the same project can be linked to a draft brief' USING ERRCODE = 'check_violation';
    END IF;
    NEW.label_snapshot := _a.label; NEW.category_snapshot := _a.category; NEW.original_name_snapshot := _a.original_name;
    RETURN NEW;
  END IF;
  SELECT b.status, p.deleting INTO _b FROM public.project_briefs b JOIN public.projects p ON p.id = b.project_id WHERE b.id = OLD.brief_id;
  IF FOUND AND _b.status = 'validated' AND NOT _b.deleting THEN
    RAISE EXCEPTION 'References of a validated brief are immutable' USING ERRCODE = 'check_violation';
  END IF;
  RETURN OLD;
END $function$;

-- Freeze file metadata as seen at the moment of validation.
CREATE OR REPLACE FUNCTION public.freeze_brief_refs()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.status = 'validated' AND OLD.status = 'draft' THEN
    UPDATE public.brief_asset_refs r SET label_snapshot = a.label, category_snapshot = a.category, original_name_snapshot = a.original_name
    FROM public.project_assets a WHERE a.id = r.asset_id AND r.brief_id = NEW.id;
  END IF;
  RETURN NEW;
END $function$;
REVOKE EXECUTE ON FUNCTION public.freeze_brief_refs() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER project_briefs_freeze_refs AFTER UPDATE ON public.project_briefs
  FOR EACH ROW EXECUTE FUNCTION public.freeze_brief_refs();