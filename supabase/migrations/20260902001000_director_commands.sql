create table if not exists
  public.director_commands (

  id bigint
    generated always as identity
    primary key,

  room_id text
    not null
    default 'sala-corazon-vivo',

  session_id uuid
    references
      public.live_sessions(id)
    on delete set null,

  command_type text
    not null
    check (
      command_type in (
        'SCENE',
        'BLACKOUT',
        'SILENCE',
        'CAMERA',
        'VIDEO',
        'PROJECT_MESSAGE'
      )
    ),

  payload jsonb
    not null
    default '{}'::jsonb,

  created_at timestamptz
    not null
    default now()
);

create index if not exists
  director_commands_room_created_idx
on public.director_commands (
  room_id,
  created_at desc,
  id desc
);

alter table
  public.director_commands
enable row level security;


-- La Sala puede LEER órdenes.
-- No puede crearlas.

drop policy if exists
  "director_commands_public_read"
on public.director_commands;

create policy
  "director_commands_public_read"
on public.director_commands

for select
to anon, authenticated

using (true);


do $$
begin

  alter publication
    supabase_realtime
  add table
    public.director_commands;

exception
  when duplicate_object then
    null;

end $$;
