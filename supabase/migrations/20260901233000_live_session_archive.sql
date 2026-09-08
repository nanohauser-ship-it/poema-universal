create extension if not exists pgcrypto;

-- =========================================================
-- POEMA UNIVERSAL
-- ARCHIVO DE SESIONES EN VIVO
-- =========================================================

create table if not exists public.live_sessions (

  id uuid
    primary key
    default gen_random_uuid(),

  room_id text
    not null
    default 'sala-corazon-vivo',

  status text
    not null
    default 'live'
    check (
      status in (
        'live',
        'closed'
      )
    ),

  started_at timestamptz
    not null
    default now(),

  ended_at timestamptz,

  peak_presence integer
    not null
    default 0
    check (
      peak_presence >= 0
    ),

  message_count integer
    not null
    default 0
    check (
      message_count >= 0
    ),

  final_pulse integer,

  final_emotional_state text,

  final_intensity double precision
    check (
      final_intensity is null
      or (
        final_intensity >= 0
        and final_intensity <= 1
      )
    ),

  dominant_words text[]
    not null
    default array[]::text[],

  metadata jsonb
    not null
    default '{}'::jsonb,

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now(),

  constraint
    live_sessions_status_time_check
  check (
    (
      status = 'live'
      and ended_at is null
    )
    or
    (
      status = 'closed'
      and ended_at is not null
    )
  )
);

create unique index if not exists
  live_sessions_one_live_per_room_idx
on public.live_sessions (
  room_id
)
where status = 'live';

create index if not exists
  live_sessions_room_started_idx
on public.live_sessions (
  room_id,
  started_at desc
);


-- =========================================================
-- CRONOLOGÍA DE LA SESIÓN
-- =========================================================

create table if not exists
  public.live_session_events (

  id bigint
    generated always as identity
    primary key,

  session_id uuid
    not null
    references
      public.live_sessions(id)
    on delete cascade,

  event_type text
    not null
    check (
      char_length(event_type)
      between 1 and 80
    ),

  payload jsonb
    not null
    default '{}'::jsonb,

  created_at timestamptz
    not null
    default now()
);

create index if not exists
  live_session_events_session_created_idx
on public.live_session_events (
  session_id,
  created_at,
  id
);


-- =========================================================
-- SEGURIDAD
-- El archivo NO es escribible directamente
-- desde el navegador.
-- =========================================================

alter table
  public.live_sessions
enable row level security;

alter table
  public.live_session_events
enable row level security;

-- Deliberadamente:
-- no hay policies públicas.
--
-- El service role del servidor
-- administra este archivo.
