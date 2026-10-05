CREATE TYPE public.asset_status AS ENUM ('pending','ready','deleting','removed');
CREATE TYPE public.asset_category AS ENUM ('logo','photos','videos','documents','menu_pricing','portfolio','other');

ALTER TABLE public.projects ADD COLUMN deleting boolean NOT NULL DEFAULT false;

CREATE TABLE public.project_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE RESTRICT,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
  label text NOT NULL CHECK (char_length(btrim(label)) BETWEEN 1 AND 150),
  category public.asset_category NOT NULL DEFAULT 'other',
  original_name text NOT NULL CHECK (char_length(original_name) BETWEEN 1 AND 255),
  declared_mime text CHECK (declared_mime IS NULL OR char_length(declared_mime) <= 100),
  declared_size bigint CHECK (declared_size IS NULL OR declared_size >= 0),
  mime text,
  kind text CHECK (kind IS NULL OR kind IN ('image','video','pdf')),
  size_bytes bigint,
  status public.asset_status NOT NULL DEFAULT 'pending',
  storage_path text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  validated_at timestamptz,
  removed_at timestamptz
);
CREATE INDEX project_assets_project_idx ON public.project_assets(project_id, status);
CREATE INDEX project_assets_owner_idx ON public.project_assets(owner_id, status);

GRANT SELECT ON public.project_assets TO authenticated;
GRANT INSERT (project_id, label, category, original_name, declared_mime, declared_size) ON public.project_assets TO authenticated;
GRANT UPDATE (label, category) ON public.project_assets TO authenticated;
GRANT ALL ON public.project_assets TO service_role;
ALTER TABLE public.project_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin owners read own assets" ON public.project_assets FOR SELECT TO authenticated
  USING (owner_id = auth.uid() AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin owners add assets to own projects" ON public.project_assets FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid() AND public.has_role(auth.uid(),'admin') AND status = 'pending'
    AND EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.owner_id = auth.uid() AND NOT p.deleting));
CREATE POLICY "Admin owners edit ready assets" ON public.project_assets FOR UPDATE TO authenticated
  USING (owner_id = auth.uid() AND public.has_role(auth.uid(),'admin') AND status = 'ready')
  WITH CHECK (owner_id = auth.uid() AND public.has_role(auth.uid(),'admin') AND status = 'ready');

CREATE OR REPLACE FUNCTION public.guard_project_asset()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _svc boolean := coalesce(auth.role(),'') = 'service_role';
DECLARE _p record;
BEGIN
  IF TG_OP = 'INSERT' THEN
    SELECT owner_id, client_id, deleting INTO _p FROM public.projects WHERE id = NEW.project_id;
    IF NOT FOUND OR _p.deleting THEN RAISE EXCEPTION 'Project unavailable' USING ERRCODE = 'check_violation'; END IF;
    IF NOT _svc THEN
      NEW.owner_id := auth.uid();
      NEW.status := 'pending'; NEW.mime := NULL; NEW.kind := NULL; NEW.size_bytes := NULL;
      NEW.validated_at := NULL; NEW.removed_at := NULL;
    END IF;
    IF _p.owner_id <> NEW.owner_id THEN RAISE EXCEPTION 'Owner mismatch' USING ERRCODE = 'check_violation'; END IF;
    NEW.client_id := _p.client_id;
    NEW.storage_path := NEW.owner_id::text || '/' || NEW.project_id::text || '/' || NEW.id::text;
    NEW.label := btrim(NEW.label);
    RETURN NEW;
  END IF;
  IF NEW.id <> OLD.id OR NEW.project_id <> OLD.project_id OR NEW.owner_id <> OLD.owner_id OR NEW.storage_path <> OLD.storage_path THEN
    RAISE EXCEPTION 'Asset identity cannot change' USING ERRCODE = 'check_violation';
  END IF;
  IF NOT _svc AND (NEW.status <> OLD.status OR NEW.mime IS DISTINCT FROM OLD.mime OR NEW.size_bytes IS DISTINCT FROM OLD.size_bytes
      OR NEW.kind IS DISTINCT FROM OLD.kind OR NEW.client_id <> OLD.client_id) THEN
    RAISE EXCEPTION 'Only the server can change asset state' USING ERRCODE = 'check_violation';
  END IF;
  NEW.client_id := (SELECT client_id FROM public.projects WHERE id = NEW.project_id);
  NEW.label := btrim(NEW.label);
  NEW.updated_at := now();
  RETURN NEW;
END $$;
CREATE TRIGGER project_assets_guard BEFORE INSERT OR UPDATE ON public.project_assets FOR EACH ROW EXECUTE FUNCTION public.guard_project_asset();

-- Keep asset client in sync when a project moves to another client
CREATE OR REPLACE FUNCTION public.sync_asset_client()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.client_id <> OLD.client_id THEN
    UPDATE public.project_assets SET client_id = NEW.client_id WHERE project_id = NEW.id;
  END IF;
  RETURN NEW;
END $$;

CREATE OR REPLACE FUNCTION public.guard_project_lifecycle()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    IF EXISTS (SELECT 1 FROM public.project_assets WHERE project_id = OLD.id) THEN
      RAISE EXCEPTION 'Project still has files; delete it from the Studio' USING ERRCODE = 'foreign_key_violation';
    END IF;
    RETURN OLD;
  END IF;
  IF coalesce(auth.role(),'') <> 'service_role' AND (OLD.deleting OR NEW.deleting IS DISTINCT FROM OLD.deleting) THEN
    RAISE EXCEPTION 'Project is being deleted' USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER projects_lifecycle_guard BEFORE UPDATE OR DELETE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.guard_project_lifecycle();
CREATE TRIGGER projects_sync_asset_client AFTER UPDATE OF client_id ON public.projects FOR EACH ROW EXECUTE FUNCTION public.sync_asset_client();

CREATE TABLE public.brief_asset_refs (
  brief_id uuid NOT NULL REFERENCES public.project_briefs(id) ON DELETE CASCADE,
  asset_id uuid NOT NULL REFERENCES public.project_assets(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (brief_id, asset_id)
);
CREATE INDEX brief_asset_refs_asset_idx ON public.brief_asset_refs(asset_id);
GRANT SELECT, DELETE ON public.brief_asset_refs TO authenticated;
GRANT INSERT (brief_id, asset_id) ON public.brief_asset_refs TO authenticated;
GRANT ALL ON public.brief_asset_refs TO service_role;
ALTER TABLE public.brief_asset_refs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin owners read own refs" ON public.brief_asset_refs FOR SELECT TO authenticated
  USING (owner_id = auth.uid() AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin owners link own draft briefs" ON public.brief_asset_refs FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid() AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin owners unlink own draft briefs" ON public.brief_asset_refs FOR DELETE TO authenticated
  USING (owner_id = auth.uid() AND public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.guard_brief_asset_ref()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _b record; _a record;
BEGIN
  IF TG_OP = 'INSERT' THEN
    SELECT owner_id, project_id, status INTO _b FROM public.project_briefs WHERE id = NEW.brief_id;
    SELECT owner_id, project_id, status INTO _a FROM public.project_assets WHERE id = NEW.asset_id;
    IF _b IS NULL OR _a IS NULL OR _b.status <> 'draft' OR _a.status <> 'ready'
       OR _b.project_id <> _a.project_id OR _b.owner_id <> NEW.owner_id OR _a.owner_id <> NEW.owner_id THEN
      RAISE EXCEPTION 'Only ready files of the same project can be linked to a draft brief' USING ERRCODE = 'check_violation';
    END IF;
    RETURN NEW;
  END IF;
  SELECT b.status, p.deleting INTO _b FROM public.project_briefs b JOIN public.projects p ON p.id = b.project_id WHERE b.id = OLD.brief_id;
  IF FOUND AND _b.status = 'validated' AND NOT _b.deleting THEN
    RAISE EXCEPTION 'References of a validated brief are immutable' USING ERRCODE = 'check_violation';
  END IF;
  RETURN OLD;
END $$;
CREATE TRIGGER brief_asset_refs_guard BEFORE INSERT OR DELETE ON public.brief_asset_refs FOR EACH ROW EXECUTE FUNCTION public.guard_brief_asset_ref();

-- Real stored size / type, readable only by server code
CREATE OR REPLACE FUNCTION public.asset_object_info(_path text)
RETURNS TABLE(size bigint, mimetype text) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, storage AS $$
  SELECT (o.metadata->>'size')::bigint, o.metadata->>'mimetype' FROM storage.objects o
  WHERE o.bucket_id = 'project-assets' AND o.name = _path
$$;
REVOKE ALL ON FUNCTION public.asset_object_info(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.asset_object_info(text) TO service_role;
REVOKE ALL ON FUNCTION public.guard_project_asset() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.sync_asset_client() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.guard_brief_asset_ref() FROM PUBLIC, anon, authenticated;

-- Storage: upload only into a pending slot; read only validated files
CREATE POLICY "Assets upload into own pending slot" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'project-assets' AND public.has_role(auth.uid(),'admin') AND EXISTS (
    SELECT 1 FROM public.project_assets a WHERE a.storage_path = name AND a.status = 'pending' AND a.owner_id = auth.uid()));
CREATE POLICY "Assets read own ready files" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'project-assets' AND public.has_role(auth.uid(),'admin') AND EXISTS (
    SELECT 1 FROM public.project_assets a WHERE a.storage_path = name AND a.status = 'ready' AND a.owner_id = auth.uid()));