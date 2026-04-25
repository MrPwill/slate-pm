-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. TABLES
-- Boards table
create table if not exists boards (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references auth.users (id) not null,
  title text not null,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Board Members table
create table if not exists board_members (
  board_id uuid references boards (id) on delete cascade,
  user_id uuid references auth.users (id) on delete cascade,
  role text check (role in ('owner', 'member')) default 'member',
  created_at timestamptz default now(),
  primary key (board_id, user_id)
);

-- Columns table
create table if not exists columns (
  id uuid default uuid_generate_v4() primary key,
  board_id uuid references boards (id) on delete cascade,
  title text not null,
  description text,
  order_index integer not null default 0,
  created_at timestamptz default now()
);

-- Cards table
create table if not exists cards (
  id uuid default uuid_generate_v4() primary key,
  column_id uuid references columns (id) on delete cascade,
  title text not null,
  details text,
  order_index integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Comments table
create table if not exists comments (
  id uuid default uuid_generate_v4() primary key,
  card_id uuid references cards (id) on delete cascade,
  user_id uuid references auth.users (id) not null,
  content text not null,
  created_at timestamptz default now()
);

-- Completed records table
create table if not exists completed_records (
  id uuid default uuid_generate_v4() primary key,
  card_id uuid references cards (id) not null,
  board_id uuid references boards (id) not null,
  title text not null,
  details text,
  completed_at timestamptz default now()
);

-- 2. SECURITY FUNCTIONS (The fix for recursion)
-- These functions use "security definer" to bypass RLS checks during the check itself.

create or replace function public.is_board_owner(board_uuid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from boards
    where id = board_uuid and owner_id = auth.uid()
  );
$$;

create or replace function public.is_board_member(board_uuid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from board_members
    where board_id = board_uuid and user_id = auth.uid()
  );
$$;

-- 3. ENABLE RLS
alter table boards enable row level security;
alter table board_members enable row level security;
alter table columns enable row level security;
alter table cards enable row level security;
alter table comments enable row level security;
alter table completed_records enable row level security;

-- 4. REALTIME
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
EXCEPTION
    WHEN others THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE boards, board_members, columns, cards, comments;
EXCEPTION
    WHEN others THEN NULL;
END $$;

-- 5. POLICIES (Simplified using functions)

-- Boards
drop policy if exists "Users can view boards they own or are members of" on boards;
create policy "Users can view boards they own or are members of"
  on boards for select
  using (owner_id = auth.uid() or is_board_member(id));

drop policy if exists "Users can create boards (becomes owner)" on boards;
create policy "Users can create boards (becomes owner)"
  on boards for insert
  with check (auth.uid() = owner_id);

drop policy if exists "Owners can update their boards" on boards;
create policy "Owners can update their boards"
  on boards for update
  using (owner_id = auth.uid());

drop policy if exists "Owners can delete their boards" on boards;
create policy "Owners can delete their boards"
  on boards for delete
  using (owner_id = auth.uid());

-- Board Members
drop policy if exists "Board members can view members" on board_members;
create policy "Board members can view members"
  on board_members for select
  using (is_board_owner(board_id) or is_board_member(board_id));

drop policy if exists "Board owners can add members" on board_members;
create policy "Board owners can add members"
  on board_members for insert
  with check (is_board_owner(board_id));

drop policy if exists "Board owners can remove members" on board_members;
create policy "Board owners can remove members"
  on board_members for delete
  using (is_board_owner(board_id) or user_id = auth.uid());

-- Columns
drop policy if exists "Board members can view columns" on columns;
create policy "Board members can view columns"
  on columns for select
  using (is_board_owner(board_id) or is_board_member(board_id));

drop policy if exists "Board owners can create columns" on columns;
create policy "Board owners can create columns"
  on columns for insert
  with check (is_board_owner(board_id));

drop policy if exists "Board owners can update columns" on columns;
create policy "Board owners can update columns"
  on columns for update
  using (is_board_owner(board_id));

drop policy if exists "Board owners can delete columns" on columns;
create policy "Board owners can delete columns"
  on columns for delete
  using (is_board_owner(board_id));

-- Cards
drop policy if exists "Board members can view cards" on cards;
create policy "Board members can view cards"
  on cards for select
  using (
    exists (
      select 1 from columns
      where columns.id = cards.column_id
      and (is_board_owner(columns.board_id) or is_board_member(columns.board_id))
    )
  );

drop policy if exists "Board members can create cards" on cards;
create policy "Board members can create cards"
  on cards for insert
  with check (
    exists (
      select 1 from columns
      where columns.id = column_id
      and (is_board_owner(columns.board_id) or is_board_member(columns.board_id))
    )
  );

drop policy if exists "Board members can update cards" on cards;
create policy "Board members can update cards"
  on cards for update
  using (
    exists (
      select 1 from columns
      where columns.id = column_id
      and (is_board_owner(columns.board_id) or is_board_member(columns.board_id))
    )
  );

drop policy if exists "Board members can delete cards" on cards;
create policy "Board members can delete cards"
  on cards for delete
  using (
    exists (
      select 1 from columns
      where columns.id = column_id
      and (is_board_owner(columns.board_id) or is_board_member(columns.board_id))
    )
  );

-- Comments
drop policy if exists "Board members can view comments" on comments;
create policy "Board members can view comments"
  on comments for select
  using (
    exists (
      select 1 from cards
      join columns on columns.id = cards.column_id
      where cards.id = comments.card_id
      and (is_board_owner(columns.board_id) or is_board_member(columns.board_id))
    )
  );

drop policy if exists "Board members can create comments" on comments;
create policy "Board members can create comments"
  on comments for insert
  with check (
    exists (
      select 1 from cards
      join columns on columns.id = cards.column_id
      where cards.id = card_id
      and (is_board_owner(columns.board_id) or is_board_member(columns.board_id))
    )
  );

-- Completed Records
drop policy if exists "Board members can view completed records" on completed_records;
create policy "Board members can view completed records"
  on completed_records for select
  using (is_board_owner(board_id) or is_board_member(board_id));

drop policy if exists "Board members can create completed records" on completed_records;
create policy "Board members can create completed records"
  on completed_records for insert
  with check (is_board_owner(board_id) or is_board_member(board_id));

drop policy if exists "Board owners can delete completed records" on completed_records;
create policy "Board owners can delete completed records"
  on completed_records for delete
  using (is_board_owner(board_id));

-- 6. INDEXES
create index if not exists idx_boards_owner on boards (owner_id);
create index if not exists idx_board_members_board on board_members (board_id);
create index if not exists idx_board_members_user on board_members (user_id);
create index if not exists idx_columns_board on columns (board_id);
create index if not exists idx_columns_order on columns (board_id, order_index);
create index if not exists idx_cards_column on cards (column_id);
create index if not exists idx_cards_order on cards (column_id, order_index);
create index if not exists idx_comments_card on comments (card_id);
create index if not exists idx_comments_user on comments (user_id);
create index if not exists idx_completed_records_board on completed_records (board_id);
create index if not exists idx_completed_records_card on completed_records (card_id);
