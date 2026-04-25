-- Profiles table for user metadata (name stored separately from auth.users)
create table if not exists profiles (
  id uuid references auth.users (id) on delete cascade primary key,
  name text not null,
  email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table profiles enable row level security;

-- Users can insert their own profile
create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Users can view their own profile
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

-- Auto-create profile trigger on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    new.email
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Index
create index if not exists idx_profiles_email on profiles (email);