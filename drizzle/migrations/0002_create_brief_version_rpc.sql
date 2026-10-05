CREATE OR REPLACE FUNCTION public.create_brief_version(_source uuid)
 RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path TO 'public'
AS $function$
DECLARE _b public.project_briefs; _new uuid; _v int; _copied int; _skipped int;
BEGIN
  SELECT * INTO _b FROM public.project_briefs WHERE id = _source;
  IF NOT FOUND THEN RAISE EXCEPTION 'Brief not found' USING ERRCODE = 'P0002'; END IF;
  IF _b.status <> 'validated' THEN RAISE EXCEPTION 'Source must be a validated version' USING ERRCODE = 'check_violation'; END IF;
  SELECT coalesce(max(version), 0) + 1 INTO _v FROM public.project_briefs WHERE project_id = _b.project_id;
  INSERT INTO public.project_briefs (project_id, sector, version, data, current_step)
    VALUES (_b.project_id, _b.sector, _v, _b.data, 0) RETURNING id INTO _new;
  -- References only, never stored files. Files removed since are excluded on purpose.
  INSERT INTO public.brief_asset_refs (brief_id, asset_id)
    SELECT _new, r.asset_id FROM public.brief_asset_refs r JOIN public.project_assets a ON a.id = r.asset_id
    WHERE r.brief_id = _source AND a.status = 'ready';
  GET DIAGNOSTICS _copied = ROW_COUNT;
  SELECT count(*) INTO _skipped FROM public.brief_asset_refs r JOIN public.project_assets a ON a.id = r.asset_id
    WHERE r.brief_id = _source AND a.status <> 'ready';
  RETURN jsonb_build_object('id', _new, 'version', _v, 'copied', _copied, 'skipped', _skipped);
END $function$;
REVOKE EXECUTE ON FUNCTION public.create_brief_version(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_brief_version(uuid) TO authenticated;