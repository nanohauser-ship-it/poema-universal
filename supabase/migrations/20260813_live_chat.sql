create extension if not exists pgcrypto;

create table if not exists public.live_chat_messages (
  id uuid
    primary key
    default gen_random_uuid(),

  room_id text
    not null
    default 'sala-corazon-vivo',

  user_name text
    not null,

  user_place text,

  text text
    not null,

  created_at timestamptz
    not null
    default now()
);

create index if not exists
  live_chat_messages_room_created_idx
on public.live_chat_messages (
  room_id,
  created_at
);

alter table
  public.live_chat_messages
enable row level security;


drop policy if exists
  "chat_read_public"
on public.live_chat_messages;

create policy
  "chat_read_public"
on public.live_chat_messages
for select
to anon, authenticated
using (true);


drop policy if exists
  "chat_insert_public"
on public.live_chat_messages;

create policy
  "chat_insert_public"
on public.live_chat_messages
for insert
to anon, authenticated
with check (
  char_length(user_name)
    between 1 and 60

  and char_length(text)
    between 1 and 500

  and (
    user_place is null
    or char_length(user_place)
      <= 80
  )
);


do $$
begin
  alter publication
    supabase_realtime
  add table
    public.live_chat_messages;
exception
  when duplicate_object then
    null;
end $$;
