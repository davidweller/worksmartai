-- Extend leads table for schools contact form fields

alter table public.leads add column if not exists school_org text;
alter table public.leads add column if not exists role text;
alter table public.leads add column if not exists message text;
