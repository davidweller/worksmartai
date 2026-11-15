-- The AI Use Hierarchy was renamed the 3Cs Framework on 2026-11-15.
update public.courses
set page_titles = array_replace(page_titles, 'The AI use hierarchy', 'The 3Cs Framework')
where id = 'ai-foundations';
