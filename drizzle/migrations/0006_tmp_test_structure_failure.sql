CREATE OR REPLACE FUNCTION public.tmp_fail_structure() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN IF NEW.project_id = '50e87608-14d5-4fa3-b45c-24c2aacddfee' THEN RAISE EXCEPTION 'controlled test failure'; END IF; RETURN NEW; END $$;
CREATE TRIGGER tmp_fail_structure BEFORE INSERT ON public.site_structures FOR EACH ROW EXECUTE FUNCTION public.tmp_fail_structure();