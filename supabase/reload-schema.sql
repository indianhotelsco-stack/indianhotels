-- Forces Supabase's PostgREST layer to reload its cached schema/permissions.
-- Needed after raw SQL changes to grants or policies, which don't always
-- trigger PostgREST's automatic reload the way Supabase's own dashboard does.

notify pgrst, 'reload schema';
