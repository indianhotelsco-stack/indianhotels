-- Comprehensive column fix — safe to run regardless of what currently
-- exists on your tables (every statement uses IF NOT EXISTS / OR REPLACE).
-- Run this in Supabase SQL Editor instead of chasing individual columns.

alter table destinations add column if not exists image_url varchar(500);
alter table destinations add column if not exists monthly_searches int default 0;
alter table destinations add column if not exists region varchar(100);

alter table listings add column if not exists rating_text varchar(500);
alter table listings add column if not exists image_urls text[] default array[]::text[];
alter table listings add column if not exists google_place_id varchar(255);
alter table listings add column if not exists booking_com_id varchar(100);
alter table listings add column if not exists booking_com_affiliate_link varchar(1000);
alter table listings add column if not exists agoda_id varchar(100);
alter table listings add column if not exists agoda_affiliate_link varchar(1000);
alter table listings add column if not exists makemytrip_id varchar(100);
alter table listings add column if not exists makemytrip_affiliate_link varchar(1000);
alter table listings add column if not exists address text;
alter table listings add column if not exists latitude decimal(10, 8);
alter table listings add column if not exists longitude decimal(11, 8);
alter table listings add column if not exists phone varchar(20);
alter table listings add column if not exists email varchar(255);
alter table listings add column if not exists website varchar(500);
alter table listings add column if not exists is_featured boolean default false;

create unique index if not exists idx_listings_google_place_id
  on listings(google_place_id) where google_place_id is not null;

alter table amenities add column if not exists icon varchar(50);
alter table amenities add column if not exists category varchar(50);

alter table reviews add column if not exists reviewer_name varchar(255);
alter table reviews add column if not exists reviewer_country varchar(100);
alter table reviews add column if not exists review_text text;
alter table reviews add column if not exists date_posted timestamp;
alter table reviews add column if not exists source varchar(50);
