-- Allow anonymous inserts from the higher-education guide lead form.
-- Required after project restore when RLS is enabled with no insert policy.

drop policy if exists "web_lead_insert" on public.leads;

create policy "web_lead_insert"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

grant insert on table public.leads to anon;
grant insert on table public.leads to authenticated;
