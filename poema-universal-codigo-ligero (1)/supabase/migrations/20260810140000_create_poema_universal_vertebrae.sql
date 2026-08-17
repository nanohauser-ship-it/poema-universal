create table if not exists public.poema_universal_vertebrae (
  id text primary key,
  edition_year integer not null default 2026,
  voice text not null check (char_length(voice) between 1 and 120),
  territory text not null check (char_length(territory) between 1 and 120),
  fragment text not null check (char_length(fragment) between 1 and 900),
  created_label text not null,
  is_public boolean not null default true,
  display_order bigint generated always as identity,
  created_at timestamptz not null default now()
);

create index if not exists poema_universal_vertebrae_public_order_idx
  on public.poema_universal_vertebrae (edition_year, is_public, display_order);

alter table public.poema_universal_vertebrae enable row level security;

insert into public.poema_universal_vertebrae
  (id, edition_year, voice, territory, fragment, created_label, is_public)
values
  (
    'fundacional-01',
    2026,
    'Voz I',
    'Galicia',
    'Toda lengua guarda una casa que todavía no ha sido construida.',
    'Edición fundacional · 2026',
    true
  ),
  (
    'fundacional-02',
    2026,
    'Voz II',
    'México',
    'Lo que decimos juntos deja de pertenecerle al miedo.',
    'Edición fundacional · 2026',
    true
  ),
  (
    'fundacional-03',
    2026,
    'Voz III',
    'Japón',
    'Una luz pequeña también puede regresar descalza.',
    'Edición fundacional · 2026',
    true
  ),
  (
    'fundacional-04',
    2026,
    'Voz IV',
    'Senegal',
    'Llegar vivo es a veces el primer verso de una vida nueva.',
    'Edición fundacional · 2026',
    true
  ),
  (
    'fundacional-05',
    2026,
    'Voz V',
    'Colombia',
    'El tiempo no se compra: se protege dentro de aquello que amamos.',
    'Edición fundacional · 2026',
    true
  ),
  (
    'fundacional-06',
    2026,
    'Voz VI',
    'Italia',
    'Dos desconocidos pueden sostener el mismo silencio sin saberlo.',
    'Edición fundacional · 2026',
    true
  )
on conflict (id) do nothing;
