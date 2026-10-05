-- TEMPORARY: controlled failure for the Lot 4 test, dropped right after.
CREATE OR REPLACE FUNCTION public.tmp_fail_ref_copy() RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.project_assets WHERE id = NEW.asset_id AND label = 'ECHEC-TEST') THEN
    RAISE EXCEPTION 'Controlled test failure';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER tmp_fail_ref_copy BEFORE INSERT ON public.brief_asset_refs FOR EACH ROW EXECUTE FUNCTION public.tmp_fail_ref_copy();