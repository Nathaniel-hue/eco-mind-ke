CREATE TABLE public.investigations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  kind text NOT NULL,
  title text NOT NULL,
  input jsonb NOT NULL DEFAULT '{}'::jsonb,
  result jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.investigations TO authenticated;
GRANT ALL ON public.investigations TO service_role;
ALTER TABLE public.investigations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own investigations" ON public.investigations FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX investigations_user_idx ON public.investigations (user_id, created_at DESC);