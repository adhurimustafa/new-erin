CREATE TYPE public.app_role AS ENUM ('admin', 'member', 'client');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.studio_admin_allowlist (
  email text PRIMARY KEY
);
GRANT ALL ON public.studio_admin_allowlist TO service_role;
ALTER TABLE public.studio_admin_allowlist ENABLE ROW LEVEL SECURITY;
INSERT INTO public.studio_admin_allowlist (email) VALUES ('adhurimustafa@gmail.com');

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.claim_studio_admin()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _uid uuid := auth.uid();
  _email text;
  _confirmed timestamptz;
BEGIN
  IF _uid IS NULL THEN RETURN false; END IF;
  SELECT lower(email), email_confirmed_at INTO _email, _confirmed FROM auth.users WHERE id = _uid;
  IF _confirmed IS NULL OR NOT EXISTS (SELECT 1 FROM public.studio_admin_allowlist WHERE lower(email) = _email) THEN
    RETURN public.has_role(_uid, 'admin');
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (_uid, 'admin') ON CONFLICT DO NOTHING;
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_studio_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_studio_admin() TO authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;