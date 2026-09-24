CREATE TYPE public.brief_status AS ENUM ('draft', 'validated');

CREATE TABLE public.project_briefs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  version integer NOT NULL CHECK (version > 0),
  status public.brief_status NOT NULL DEFAULT 'draft',
  sector text NOT NULL CHECK (sector IN ('restaurant','hotel','real_estate','barber_salon','beauty','fitness','local_shop','artisan','professional_services','association','ecommerce','other')),
  schema_version integer NOT NULL DEFAULT 1,
  current_step integer NOT NULL DEFAULT 0 CHECK (current_step BETWEEN 0 AND 20),
  data jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(data) = 'object' AND octet_length(data::text) <= 100000),
  validated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, version)
);
CREATE UNIQUE INDEX project_briefs_one_draft ON public.project_briefs(project_id) WHERE status = 'draft';
CREATE INDEX project_briefs_owner_idx ON public.project_briefs(owner_id, updated_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_briefs TO authenticated;
GRANT ALL ON public.project_briefs TO service_role;
ALTER TABLE public.project_briefs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin owners manage own briefs" ON public.project_briefs FOR ALL TO authenticated
  USING (owner_id = auth.uid() AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (owner_id = auth.uid() AND public.has_role(auth.uid(), 'admin')
    AND EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.owner_id = auth.uid()));

CREATE OR REPLACE FUNCTION public.guard_project_brief()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF OLD.status = 'validated' THEN
      RAISE EXCEPTION 'Validated brief versions are immutable' USING ERRCODE = 'check_violation';
    END IF;
    IF NEW.project_id <> OLD.project_id OR NEW.version <> OLD.version OR NEW.owner_id <> OLD.owner_id THEN
      RAISE EXCEPTION 'Brief identity cannot change' USING ERRCODE = 'check_violation';
    END IF;
    NEW.updated_at = now();
  END IF;
  IF NEW.status = 'validated' THEN
    NEW.validated_at = now();
  ELSE
    NEW.validated_at = NULL;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER project_briefs_guard BEFORE INSERT OR UPDATE ON public.project_briefs FOR EACH ROW EXECUTE FUNCTION public.guard_project_brief();

REVOKE ALL ON public.project_briefs FROM anon;