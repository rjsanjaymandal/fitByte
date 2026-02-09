-- fitByte: COMPREHENSIVE DATABASE SETUP
-- Version: 2.0.0 (FMCG Overhaul)
-- Includes: All core tables, triggers, RLS, and helper functions.

-- 0. PRE-REQUISITES
create extension if not exists "uuid-ossp";

-- 1. ENUMS & TYPES
DO $$ BEGIN
    create type public.user_role as enum ('user', 'admin');
    create type public.fit_preference_type as enum ('oversized', 'regular', 'fitted');
    create type public.order_status as enum ('pending', 'paid', 'shipped', 'delivered', 'cancelled');
    create type public.discount_type as enum ('percentage', 'fixed');
    create type public.concept_status as enum ('voting', 'approved', 'launched');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. CORE TABLES

-- Profiles (Extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text,
  pronouns text,
  fit_preference public.fit_preference_type,
  role public.user_role default 'user'::public.user_role,
  loyalty_points integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Categories
create table if not exists public.categories (
  id uuid default uuid_generate_v4() primary key,
  parent_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Products
create table if not exists public.products (
  id uuid default uuid_generate_v4() primary key,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text unique not null,
  description text,
  price numeric not null,
  original_price numeric,
  expression_tags text[] default '{}',
  size_options text[] default '{}',
  color_options text[] default '{}',
  fit_options text[] default '{}',
  main_image_url text,
  gallery_image_urls text[] default '{}',
  is_active boolean default true,
  is_carousel_featured boolean default false,
  status text default 'draft' check (status in ('draft', 'active', 'archived')),
  seo_title text,
  seo_description text,
  sale_count integer default 0,
  average_rating numeric(3,2) default 0,
  review_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Product Stock
create table if not exists public.product_stock (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade,
  size text not null,
  color text not null,
  quantity int default 0,
  sku text,
  cost_price numeric,
  unique (product_id, size, color)
);

-- Orders
create table if not exists public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  status public.order_status default 'pending'::public.order_status,
  subtotal numeric not null,
  shipping_fee numeric default 0,
  total numeric not null,
  discount_amount numeric default 0,
  coupon_code text,
  payment_provider text,
  payment_reference text,
  payment_method text,
  paid_amount numeric default 0,
  due_amount numeric default 0,
  tracking_number text,
  shipping_name text,
  phone text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  pincode text,
  country text default 'India',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Order Items
create table if not exists public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  name_snapshot text,
  size text,
  color text,
  quantity int not null,
  unit_price numeric not null,
  fit text
);

-- 3. SUPPLEMENTAL TABLES

-- Cart & Wishlist
create table if not exists public.cart_items (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    product_id uuid references public.products(id) on delete cascade not null,
    size text not null,
    color text not null,
    fit text,
    quantity integer not null default 1,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique(user_id, product_id, size, color)
);

create table if not exists public.wishlist_items (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    product_id uuid references public.products(id) on delete cascade not null,
    created_at timestamptz default now(),
    unique(user_id, product_id)
);

-- Notifications & Push
create table if not exists public.notifications (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    title text not null,
    message text not null,
    type text check (type in ('info', 'success', 'warning', 'error')) default 'info',
    is_read boolean default false,
    action_url text,
    created_at timestamptz default now()
);

create table if not exists public.push_subscriptions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade,
    subscription_json jsonb not null,
    created_at timestamptz default now()
);

-- Marketing: Coupons, Reviews, Newsletter
create table if not exists public.coupons (
  id uuid default gen_random_uuid() primary key,
  code text not null unique,
  discount_type public.discount_type not null,
  value numeric not null,
  active boolean default true,
  max_uses integer,
  used_count integer default 0,
  min_order_amount numeric default 0,
  expires_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  comment text,
  user_name text,
  is_featured boolean default false,
  is_approved boolean default true,
  is_verified boolean default false,
  reply_text text,
  media_urls text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  created_at timestamptz default now()
);

-- Content: Blog, Lab/Concepts, Addresses
create table if not exists public.blog_posts (
    id uuid primary key default gen_random_uuid(),
    slug text unique not null,
    title text not null,
    excerpt text,
    content text not null,
    cover_image text,
    author_id uuid references public.profiles(id),
    category text,
    tags text[] default '{}',
    is_published boolean default false,
    is_featured boolean default false,
    meta_title text,
    meta_description text,
    published_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists public.concepts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  image_url text,
  vote_count integer default 0,
  vote_goal integer default 50,
  status public.concept_status default 'voting'::public.concept_status,
  created_at timestamptz default now()
);

create table if not exists public.concept_votes (
  user_id uuid references public.profiles(id) on delete cascade not null,
  concept_id uuid references public.concepts(id) on delete cascade not null,
  created_at timestamptz default now(),
  primary key (user_id, concept_id)
);

create table if not exists public.addresses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text not null,
  pincode text not null,
  country text not null default 'India',
  phone text not null,
  is_default boolean default false,
  created_at timestamptz default now()
);

-- Logs: Audit & System
create table if not exists public.admin_audit_logs (
    id uuid default gen_random_uuid() primary key,
    admin_id uuid references public.profiles(id),
    action_type text not null,
    table_name text not null,
    record_id uuid not null,
    changes jsonb,
    ip_address text,
    created_at timestamptz default now()
);

create table if not exists public.system_logs (
    id uuid default gen_random_uuid() primary key,
    severity text check (severity in ('INFO', 'WARN', 'ERROR', 'CRITICAL')),
    component text not null,
    message text not null,
    metadata jsonb,
    created_at timestamptz default now()
);

-- 4. HELPER FUNCTIONS & TRIGGERS

-- is_admin() helper
create or replace function public.is_admin()
returns boolean as $$
begin
  return (select role from public.profiles where id = auth.uid()) = 'admin';
end;
$$ language plpgsql security definer set search_path = public;

-- handle_new_user() trigger function
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, role)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'full_name', new.email), 
    case when new.email = 'rjsanjaymandal@gmail.com' then 'admin'::public.user_role else 'user'::public.user_role end
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql set search_path = public;

-- Apply updated_at triggers
create trigger tr_profiles_updated before update on public.profiles for each row execute procedure update_updated_at_column();
create trigger tr_categories_updated before update on public.categories for each row execute procedure update_updated_at_column();
create trigger tr_products_updated before update on public.products for each row execute procedure update_updated_at_column();
create trigger tr_orders_updated before update on public.orders for each row execute procedure update_updated_at_column();
create trigger tr_blog_updated before update on public.blog_posts for each row execute procedure update_updated_at_column();

-- refresh_product_rating()
create or replace function public.refresh_product_rating(pid uuid)
returns void as $$
begin
  update public.products
  set 
    average_rating = coalesce((select avg(rating) from public.reviews where product_id = pid), 0),
    review_count = (select count(*) from public.reviews where product_id = pid)
  where id = pid;
end;
$$ language plpgsql security definer set search_path = public;

-- tr_review_change trigger
create or replace function public.on_review_change()
returns trigger as $$
begin
  if (TG_OP = 'INSERT' or TG_OP = 'UPDATE') then
    perform public.refresh_product_rating(NEW.product_id);
    return NEW;
  elsif (TG_OP = 'DELETE') then
    perform public.refresh_product_rating(OLD.product_id);
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql security definer set search_path = public;

create trigger tr_review_change after insert or update or delete on public.reviews for each row execute procedure public.on_review_change();

-- 5. RLS POLICIES (Consolidated & Hardened)

-- Profiles
alter table public.profiles enable row level security;
create policy "Read Own" on public.profiles for select using (auth.uid() = id);
create policy "Update Own" on public.profiles for update using (auth.uid() = id);
create policy "Admin All" on public.profiles for all using (public.is_admin());

-- Products & Categories (Public Read, Admin Write)
alter table public.products enable row level security;
create policy "Public Read" on public.products for select using (is_active = true or public.is_admin());
create policy "Admin All" on public.products for all using (public.is_admin());

alter table public.categories enable row level security;
create policy "Public Read" on public.categories for select using (is_active = true or public.is_admin());
create policy "Admin All" on public.categories for all using (public.is_admin());

-- Orders (Own Only, Admin All)
alter table public.orders enable row level security;
create policy "User Read Own" on public.orders for select using (auth.uid() = user_id);
create policy "User Insert Own" on public.orders for insert with check (auth.uid() = user_id);
create policy "Admin All" on public.orders for all using (public.is_admin());

alter table public.order_items enable row level security;
create policy "Read Own" on public.order_items for select using (exists (select 1 from public.orders where id = order_id and user_id = auth.uid()) or public.is_admin());
create policy "Admin All" on public.order_items for all using (public.is_admin());

-- Cart, Wishlist & Addresses (Own Only)
alter table public.cart_items enable row level security;
create policy "Own All" on public.cart_items for all using (auth.uid() = user_id);

alter table public.wishlist_items enable row level security;
create policy "Own All" on public.wishlist_items for all using (auth.uid() = user_id);

alter table public.addresses enable row level security;
create policy "Own All" on public.addresses for all using (auth.uid() = user_id);

-- Marketing & Logs (Admin Only for management)
alter table public.coupons enable row level security;
create policy "Public Read" on public.coupons for select using (true);
create policy "Admin All" on public.coupons for all using (public.is_admin());

alter table public.system_logs enable row level security;
create policy "Admin Read" on public.system_logs for select using (public.is_admin());
grant insert on public.system_logs to service_role;

alter table public.admin_audit_logs enable row level security;
create policy "Admin Read" on public.admin_audit_logs for select using (public.is_admin());
grant insert on public.admin_audit_logs to service_role;

-- 6. INDEXES for Performance
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_stock_composite on public.product_stock(product_id, size, color);
create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_notifications_unread on public.notifications(user_id) where is_read = false;
create index if not exists idx_blog_slug on public.blog_posts(slug);

-- 7. STORAGE BUCKETS (Note: Policies only, actual creation via dashboard or API usually best)
-- insert into storage.buckets (id, name, public) values ('products', 'products', true) on conflict do nothing;
-- insert into storage.buckets (id, name, public) values ('concepts', 'concepts', true) on conflict do nothing;
-- insert into storage.buckets (id, name, public) values ('blog', 'blog', true) on conflict do nothing;

create policy "Public Select" on storage.objects for select using (bucket_id in ('products', 'concepts', 'blog'));
create policy "Admin Insert" on storage.objects for insert with check (bucket_id in ('products', 'concepts', 'blog') and public.is_admin());

-- FINISH
NOTIFY pgrst, 'reload schema';
