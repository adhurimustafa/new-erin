CREATE TYPE public.structure_status AS ENUM ('draft', 'validated', 'archived');

CREATE TABLE public.site_structures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  brief_id uuid NOT NULL REFERENCES public.project_briefs(id) ON DELETE CASCADE,
  version integer NOT NULL,
  status public.structure_status NOT NULL DEFAULT 'draft',
  rules_version integer NOT NULL,
  generated jsonb NOT NULL,
  structure jsonb NOT NULL,
  assets_snapshot jsonb NOT NULL DEFAULT '[]'::jsonb,
  assets_fingerprint text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  validated_at timestamptz,
  archived_at timestamptz,
  UNIQUE (project_id, version)
);
CREATE UNIQUE INDEX site_structures_one_draft ON public.site_structures (project_id) WHERE status = 'draft';
CREATE INDEX site_structures_brief ON public.site_structures (brief_id);

GRANT SELECT, INSERT, UPDATE ON public.site_structures TO authenticated;
GRANT ALL ON public.site_structures TO service_role;
ALTER TABLE public.site_structures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin owners read own structures" ON public.site_structures FOR SELECT TO authenticated
  USING (owner_id = auth.uid() AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin owners create own structures" ON public.site_structures FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid() AND public.has_role(auth.uid(), 'admin')
    AND EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.owner_id = auth.uid() AND NOT p.deleting));
CREATE POLICY "Admin owners adjust own draft structures" ON public.site_structures FOR UPDATE TO authenticated
  USING (owner_id = auth.uid() AND public.has_role(auth.uid(), 'admin') AND status = 'draft')
  WITH CHECK (owner_id = auth.uid() AND public.has_role(auth.uid(), 'admin'));

-- Format of the generated proposal and scope of the allowed adjustments.
CREATE OR REPLACE FUNCTION public.check_site_structure(_g jsonb, _a jsonb)
RETURNS void LANGUAGE plpgsql IMMUTABLE SET search_path = public AS $$
DECLARE p jsonb; s jsonb; gp text[] := '{}'; gs text[]; opt text[] := '{}'; ids text[]; compat text[];
BEGIN
  IF jsonb_typeof(_g) IS DISTINCT FROM 'object' OR jsonb_typeof(_g->'pages') IS DISTINCT FROM 'array'
     OR jsonb_array_length(_g->'pages') NOT BETWEEN 1 AND 20 OR octet_length(_g::text) > 200000
     OR jsonb_typeof(_g->'cta_options') IS DISTINCT FROM 'array' OR jsonb_array_length(_g->'cta_options') NOT BETWEEN 1 AND 20 THEN
    RAISE EXCEPTION 'Invalid structure format' USING ERRCODE = 'check_violation';
  END IF;
  IF jsonb_typeof(_a) IS DISTINCT FROM 'object' OR (SELECT array_agg(k ORDER BY k) FROM jsonb_object_keys(_a) k) IS DISTINCT FROM ARRAY['cta','hidden','page_order','page_titles','section_order']
     OR jsonb_typeof(_a->'page_order') IS DISTINCT FROM 'array' OR jsonb_typeof(_a->'page_titles') IS DISTINCT FROM 'object'
     OR jsonb_typeof(_a->'section_order') IS DISTINCT FROM 'object' OR jsonb_typeof(_a->'hidden') IS DISTINCT FROM 'array'
     OR jsonb_typeof(_a->'cta') IS DISTINCT FROM 'string' OR octet_length(_a::text) > 50000 THEN
    RAISE EXCEPTION 'Invalid adjustments format' USING ERRCODE = 'check_violation';
  END IF;
  FOR p IN SELECT e FROM jsonb_array_elements(_g->'pages') e LOOP
    IF jsonb_typeof(p->'id') IS DISTINCT FROM 'string' OR (p->>'id') !~ '^[a-z0-9_]{1,40}$' OR (p->>'id') = ANY(gp)
       OR jsonb_typeof(p->'title') IS DISTINCT FROM 'string' OR length(p->>'title') NOT BETWEEN 1 AND 80
       OR jsonb_typeof(p->'essential') IS DISTINCT FROM 'boolean' OR jsonb_typeof(p->'reason') IS DISTINCT FROM 'string'
       OR jsonb_typeof(p->'sections') IS DISTINCT FROM 'array' OR jsonb_array_length(p->'sections') NOT BETWEEN 1 AND 30 THEN
      RAISE EXCEPTION 'Invalid page' USING ERRCODE = 'check_violation';
    END IF;
    gp := gp || (p->>'id'); gs := '{}';
    FOR s IN SELECT e FROM jsonb_array_elements(p->'sections') e LOOP
      IF jsonb_typeof(s->'id') IS DISTINCT FROM 'string' OR (s->>'id') !~ '^[a-z0-9_]{1,40}$' OR (s->>'id') = ANY(gs)
         OR jsonb_typeof(s->'title') IS DISTINCT FROM 'string' OR length(s->>'title') NOT BETWEEN 1 AND 120
         OR jsonb_typeof(s->'essential') IS DISTINCT FROM 'boolean' OR jsonb_typeof(s->'reason') IS DISTINCT FROM 'string' THEN
        RAISE EXCEPTION 'Invalid section' USING ERRCODE = 'check_violation';
      END IF;
      gs := gs || (s->>'id');
      IF NOT (s->>'essential')::boolean THEN opt := opt || ((p->>'id') || '/' || (s->>'id')); END IF;
    END LOOP;
    IF jsonb_typeof(_a->'section_order'->(p->>'id')) IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'Invalid section order' USING ERRCODE = 'check_violation'; END IF;
    ids := ARRAY(SELECT jsonb_array_elements_text(_a->'section_order'->(p->>'id')));
    IF cardinality(ids) <> cardinality(gs) OR NOT (ids @> gs AND gs @> ids) THEN RAISE EXCEPTION 'Section order must reorder existing sections only' USING ERRCODE = 'check_violation'; END IF;
    IF jsonb_typeof(_a->'page_titles'->(p->>'id')) IS DISTINCT FROM 'string' OR length(btrim(_a->'page_titles'->>(p->>'id'))) NOT BETWEEN 1 AND 80 THEN
      RAISE EXCEPTION 'Invalid page title' USING ERRCODE = 'check_violation';
    END IF;
  END LOOP;
  ids := ARRAY(SELECT jsonb_array_elements_text(_a->'page_order'));
  IF cardinality(ids) <> cardinality(gp) OR NOT (ids @> gp AND gp @> ids)
     OR (SELECT count(*) FROM jsonb_object_keys(_a->'page_titles')) <> cardinality(gp)
     OR (SELECT count(*) FROM jsonb_object_keys(_a->'section_order')) <> cardinality(gp) THEN
    RAISE EXCEPTION 'Page order must reorder existing pages only' USING ERRCODE = 'check_violation';
  END IF;
  ids := ARRAY(SELECT jsonb_array_elements_text(_a->'hidden'));
  IF cardinality(ids) <> (SELECT count(DISTINCT x) FROM unnest(ids) x) OR NOT (opt @> ids) THEN
    RAISE EXCEPTION 'Only optional sections can be hidden' USING ERRCODE = 'check_violation';
  END IF;
  compat := ARRAY(SELECT o->>'key' FROM jsonb_array_elements(_g->'cta_options') o WHERE o->'compatible' = 'true'::jsonb);
  IF NOT ((_a->>'cta') = ANY(compat)) THEN RAISE EXCEPTION 'CTA not compatible with the brief' USING ERRCODE = 'check_violation'; END IF;
END $$;

CREATE OR REPLACE FUNCTION public.guard_site_structure()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE _rpc boolean := coalesce(current_setting('app.site_structure_rpc', true), '') = 'on';
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NOT _rpc OR NEW.status <> 'draft' THEN RAISE EXCEPTION 'Use create_site_structure' USING ERRCODE = 'check_violation'; END IF;
  ELSE
    IF OLD.status <> 'draft' THEN RAISE EXCEPTION 'Validated or archived structures are immutable' USING ERRCODE = 'check_violation'; END IF;
    IF NEW.id <> OLD.id OR NEW.owner_id <> OLD.owner_id OR NEW.project_id <> OLD.project_id OR NEW.brief_id <> OLD.brief_id
       OR NEW.version <> OLD.version OR NEW.rules_version <> OLD.rules_version OR NEW.generated <> OLD.generated
       OR NEW.assets_snapshot <> OLD.assets_snapshot OR NEW.assets_fingerprint <> OLD.assets_fingerprint OR NEW.created_at <> OLD.created_at THEN
      RAISE EXCEPTION 'Only adjustments and status can change' USING ERRCODE = 'check_violation';
    END IF;
    IF NEW.status = 'archived' AND NOT _rpc THEN RAISE EXCEPTION 'Archiving happens only when recalculating' USING ERRCODE = 'check_violation'; END IF;
    NEW.updated_at := now();
    NEW.validated_at := CASE WHEN NEW.status = 'validated' THEN now() END;
    NEW.archived_at := CASE WHEN NEW.status = 'archived' THEN now() END;
  END IF;
  PERFORM public.check_site_structure(NEW.generated, NEW.structure);
  RETURN NEW;
END $$;
CREATE TRIGGER site_structures_guard BEFORE INSERT OR UPDATE ON public.site_structures FOR EACH ROW EXECUTE FUNCTION public.guard_site_structure();

-- Fingerprint of ready files (ids + useful metadata): detects replacements even when counts are unchanged.
CREATE OR REPLACE FUNCTION public.project_assets_fingerprint(_project uuid)
RETURNS text LANGUAGE sql STABLE SET search_path = public AS $$
  SELECT md5(coalesce(string_agg(concat_ws('|', id, category, label, kind, mime, size_bytes, validated_at), ';' ORDER BY id), ''))
  FROM public.project_assets WHERE project_id = _project AND status = 'ready'
$$;

-- All-or-nothing: archive the current draft (if confirmed) and create the new proposal.
CREATE OR REPLACE FUNCTION public.create_site_structure(_brief uuid, _generated jsonb, _rules_version integer, _asset_keys text[], _replace uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SET search_path = public AS $$
DECLARE _b public.project_briefs; _d uuid; _v int; _new uuid; _keys text[];
BEGIN
  SELECT * INTO _b FROM public.project_briefs WHERE id = _brief;
  IF NOT FOUND THEN RAISE EXCEPTION 'Brief not found' USING ERRCODE = 'P0002'; END IF;
  IF _b.status <> 'validated' THEN RAISE EXCEPTION 'Brief must be validated' USING ERRCODE = 'check_violation'; END IF;
  PERFORM 1 FROM public.projects WHERE id = _b.project_id AND NOT deleting FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Project unavailable' USING ERRCODE = 'check_violation'; END IF;
  _keys := ARRAY(SELECT id::text || ':' || category FROM public.project_assets WHERE project_id = _b.project_id AND status = 'ready' ORDER BY 1);
  IF _keys IS DISTINCT FROM ARRAY(SELECT x FROM unnest(coalesce(_asset_keys, '{}')) x ORDER BY 1) THEN
    RAISE EXCEPTION 'Files changed during calculation' USING ERRCODE = 'SA001';
  END IF;
  SELECT id INTO _d FROM public.site_structures WHERE project_id = _b.project_id AND status = 'draft' FOR UPDATE;
  IF _d IS NOT NULL AND _replace IS DISTINCT FROM _d THEN RAISE EXCEPTION 'A draft structure exists' USING ERRCODE = '23505'; END IF;
  PERFORM set_config('app.site_structure_rpc', 'on', true);
  IF _d IS NOT NULL THEN UPDATE public.site_structures SET status = 'archived' WHERE id = _d; END IF;
  SELECT coalesce(max(version), 0) + 1 INTO _v FROM public.site_structures WHERE project_id = _b.project_id;
  INSERT INTO public.site_structures (project_id, brief_id, version, rules_version, generated, structure, assets_snapshot, assets_fingerprint)
  VALUES (_b.project_id, _b.id, _v, _rules_version, _generated,
    jsonb_build_object(
      'page_order', coalesce((SELECT jsonb_agg(p->'id' ORDER BY i) FROM jsonb_array_elements(_generated->'pages') WITH ORDINALITY t(p, i)), '[]'::jsonb),
      'page_titles', coalesce((SELECT jsonb_object_agg(p->>'id', p->'title') FROM jsonb_array_elements(_generated->'pages') p), '{}'::jsonb),
      'section_order', coalesce((SELECT jsonb_object_agg(p->>'id', (SELECT jsonb_agg(s->'id' ORDER BY j) FROM jsonb_array_elements(p->'sections') WITH ORDINALITY u(s, j)))
                        FROM jsonb_array_elements(_generated->'pages') p), '{}'::jsonb),
      'hidden', '[]'::jsonb,
      'cta', _generated->'cta_default'),
    coalesce((SELECT jsonb_agg(jsonb_build_object('id', id, 'label', label, 'category', category, 'kind', kind, 'mime', mime, 'size', size_bytes, 'validated_at', validated_at) ORDER BY id)
      FROM public.project_assets WHERE project_id = _b.project_id AND status = 'ready'), '[]'::jsonb),
    public.project_assets_fingerprint(_b.project_id))
  RETURNING id INTO _new;
  PERFORM set_config('app.site_structure_rpc', '', true);
  RETURN jsonb_build_object('id', _new, 'version', _v, 'archived', _d);
END $$;

REVOKE EXECUTE ON FUNCTION public.create_site_structure(uuid, jsonb, integer, text[], uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.create_site_structure(uuid, jsonb, integer, text[], uuid) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.project_assets_fingerprint(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.project_assets_fingerprint(uuid) TO authenticated;