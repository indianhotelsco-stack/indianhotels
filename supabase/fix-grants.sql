-- RLS policies only matter if the role also has the base SQL-level GRANT.
-- Tables created outside Supabase's own table editor sometimes never get
-- these grants for anon/authenticated, which silently blocks all reads
-- regardless of how permissive the RLS policies are.

grant usage on schema public to anon, authenticated;

grant select on destinations to anon, authenticated;
grant select on listings to anon, authenticated;
grant select on amenities to anon, authenticated;
grant select on listing_amenities to anon, authenticated;
grant select on reviews to anon, authenticated;
grant insert on affiliate_clicks to anon, authenticated;
