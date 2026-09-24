CREATE TYPE public.project_status AS ENUM ('draft', 'preparing', 'ready', 'published');

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL CHECK (char_length(btrim(company_name)) BETWEEN 1 AND 150),
  contact_name text CHECK (char_length(contact_name) <= 150),
  email text CHECK (char_length(email) <= 255 AND (email IS NULL OR email = '' OR email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')),
  phone text CHECK (char_length(phone) <= 40),
  location text CHECK (char_length(location) <= 255),
  website text CHECK (char_length(website) <= 500 AND (website IS NULL OR website = '' OR website ~* '^https?://')),
  socials text CHECK (char_length(socials) <= 1000),
  notes text CHECK (char_length(notes) <= 5000),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin owners manage own clients" ON public.clients FOR ALL TO authenticated
  USING (owner_id = auth.uid() AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (owner_id = auth.uid() AND public.has_role(auth.uid(), 'admin'));
CREATE INDEX clients_owner_idx ON public.clients(owner_id, updated_at DESC);
CREATE TRIGGER clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
  name text NOT NULL CHECK (char_length(btrim(name)) BETWEEN 1 AND 150),
  sector text NOT NULL DEFAULT 'other' CHECK (sector IN ('restaurant','hotel','real_estate','barber_salon','beauty','fitness','local_shop','artisan','professional_services','association','ecommerce','other')),
  languages text[] NOT NULL DEFAULT ARRAY['sq']::text[] CHECK (cardinality(languages) BETWEEN 1 AND 10 AND languages <@ ARRAY['sq','fr','en','de','it','sr','tr','es']::text[]),
  status public.project_status NOT NULL DEFAULT 'draft',
  description text CHECK (char_length(description) <= 5000),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin owners manage own projects" ON public.projects FOR ALL TO authenticated
  USING (owner_id = auth.uid() AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (owner_id = auth.uid() AND public.has_role(auth.uid(), 'admin')
    AND EXISTS (SELECT 1 FROM public.clients c WHERE c.id = client_id AND c.owner_id = auth.uid()));
CREATE INDEX projects_owner_idx ON public.projects(owner_id, updated_at DESC);
CREATE INDEX projects_client_idx ON public.projects(client_id);
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();