-- Idempotent version of the RLS policies — drops any existing policy of
-- the same name first, so this is safe to run regardless of what's
-- already there (unlike plain CREATE POLICY, which errors on a duplicate
-- name and can silently abort a multi-statement script).

alter table destinations enable row level security;
alter table listings enable row level security;
alter table amenities enable row level security;
alter table listing_amenities enable row level security;
alter table reviews enable row level security;
alter table affiliate_clicks enable row level security;

drop policy if exists "public read destinations" on destinations;
create policy "public read destinations" on destinations for select using (true);

drop policy if exists "public read listings" on listings;
create policy "public read listings" on listings for select using (true);

drop policy if exists "public read amenities" on amenities;
create policy "public read amenities" on amenities for select using (true);

drop policy if exists "public read listing_amenities" on listing_amenities;
create policy "public read listing_amenities" on listing_amenities for select using (true);

drop policy if exists "public read reviews" on reviews;
create policy "public read reviews" on reviews for select using (true);

drop policy if exists "service role insert affiliate_clicks" on affiliate_clicks;
create policy "service role insert affiliate_clicks" on affiliate_clicks for insert with check (true);
