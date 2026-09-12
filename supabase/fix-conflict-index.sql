-- The partial unique index (with a WHERE clause) can't be used as an
-- ON CONFLICT target by Supabase's upsert() helper. Replace it with a
-- plain unique index — NULLs still don't collide in Postgres unique
-- indexes, so this is safe for any existing rows without a place id.

drop index if exists idx_listings_google_place_id;
create unique index if not exists idx_listings_google_place_id on listings(google_place_id);
