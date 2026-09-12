-- IndianHotels.co — initial schema, matching IndianHotels_Build_Prompt.md
-- Run this once in Supabase Dashboard → SQL Editor → New query → paste → Run.

create extension if not exists "pgcrypto";

create table if not exists destinations (
  id uuid primary key default gen_random_uuid(),
  name varchar(255) not null,
  slug varchar(255) unique not null,
  description text,
  image_url varchar(500),
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  monthly_searches int default 0,
  region varchar(100),
  created_at timestamp default now(),
  updated_at timestamp default now()
);
create index if not exists idx_destinations_slug on destinations(slug);

create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  destination_id uuid not null references destinations(id) on delete cascade,
  name varchar(255) not null,
  description text,
  price_per_night int not null,
  star_rating decimal(2, 1) default 0,
  review_count int default 0,
  rating_text varchar(500),
  image_urls text[] default array[]::text[],
  google_place_id varchar(255),
  booking_com_id varchar(100),
  booking_com_affiliate_link varchar(1000),
  agoda_id varchar(100),
  agoda_affiliate_link varchar(1000),
  makemytrip_id varchar(100),
  makemytrip_affiliate_link varchar(1000),
  address text,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  phone varchar(20),
  email varchar(255),
  website varchar(500),
  is_featured boolean default false,
  created_at timestamp default now(),
  updated_at timestamp default now()
);
create index if not exists idx_listings_destination_id on listings(destination_id);
create index if not exists idx_listings_price on listings(price_per_night);
create index if not exists idx_listings_rating on listings(star_rating);
create unique index if not exists idx_listings_google_place_id on listings(google_place_id) where google_place_id is not null;

create table if not exists amenities (
  id uuid primary key default gen_random_uuid(),
  name varchar(100) unique not null,
  icon varchar(50),
  category varchar(50),
  created_at timestamp default now()
);

insert into amenities (name, icon, category) values
  ('Pool', '🏊', 'Recreation'),
  ('WiFi', '📶', 'Connectivity'),
  ('Spa', '💆', 'Wellness'),
  ('Parking', '🅿️', 'Parking'),
  ('AC', '❄️', 'Climate'),
  ('Restaurant', '🍽️', 'Dining'),
  ('Gym', '💪', 'Fitness'),
  ('Elevator', '🛗', 'Accessibility')
on conflict (name) do nothing;

create table if not exists listing_amenities (
  listing_id uuid not null references listings(id) on delete cascade,
  amenity_id uuid not null references amenities(id) on delete cascade,
  primary key (listing_id, amenity_id)
);
create index if not exists idx_listing_amenities_amenity on listing_amenities(amenity_id);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  reviewer_name varchar(255),
  reviewer_country varchar(100),
  rating int check (rating >= 1 and rating <= 5),
  review_text text,
  date_posted timestamp,
  source varchar(50),
  created_at timestamp default now()
);
create index if not exists idx_reviews_listing_id on reviews(listing_id);

create table if not exists affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete set null,
  destination_id uuid references destinations(id) on delete set null,
  click_source varchar(50),
  affiliate_type varchar(50),
  user_ip varchar(45),
  user_agent text,
  timestamp timestamp default now()
);
create index if not exists idx_affiliate_clicks_listing on affiliate_clicks(listing_id);
create index if not exists idx_affiliate_clicks_destination on affiliate_clicks(destination_id);
create index if not exists idx_affiliate_clicks_timestamp on affiliate_clicks(timestamp);

-- Row Level Security: public read-only access (no auth in MVP), writes only via service role.
alter table destinations enable row level security;
alter table listings enable row level security;
alter table amenities enable row level security;
alter table listing_amenities enable row level security;
alter table reviews enable row level security;
alter table affiliate_clicks enable row level security;

create policy "public read destinations" on destinations for select using (true);
create policy "public read listings" on listings for select using (true);
create policy "public read amenities" on amenities for select using (true);
create policy "public read listing_amenities" on listing_amenities for select using (true);
create policy "public read reviews" on reviews for select using (true);
-- affiliate_clicks: no public read policy — writes happen via the service role key from
-- our own API route only, and there's no need for the browser to read click logs back.
create policy "service role insert affiliate_clicks" on affiliate_clicks for insert with check (true);
