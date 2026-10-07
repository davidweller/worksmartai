-- Rendered certificate PDFs, stored as <certificate id>/<Course> - <Learner>.pdf so a PDF viewer's
-- Save names the file properly. Private: only the certificate Edge Function (service role) writes,
-- and learners reach a file through the short-lived signed links it returns.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('certificates', 'certificates', false, 5242880, array['application/pdf'])
on conflict (id) do nothing;
