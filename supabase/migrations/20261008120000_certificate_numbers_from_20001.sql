-- Certificate numbers start at WS-20001 so the first certificates issued don't read as the first.
-- Never moves the sequence backwards: if it is already past 20000 it carries on from where it is.
-- Certificates already issued keep the number printed on them.

select setval(
  'public.certificate_number_seq',
  greatest(20000, (select last_value from public.certificate_number_seq)),
  true
);
