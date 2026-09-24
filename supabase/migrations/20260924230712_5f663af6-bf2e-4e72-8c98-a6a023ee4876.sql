REVOKE ALL ON public.clients FROM anon;
REVOKE ALL ON public.projects FROM anon;
REVOKE ALL ON public.user_roles FROM anon;
REVOKE ALL ON public.studio_admin_allowlist FROM anon, authenticated;