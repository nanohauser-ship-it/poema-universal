alter table public.poema_universal_vertebrae
  drop constraint if exists poema_universal_vertebrae_fragment_check;

alter table public.poema_universal_vertebrae
  add constraint poema_universal_vertebrae_fragment_check
  check (char_length(fragment) between 1 and 12000);

-- Retira únicamente las seis voces de demostración que pertenecían al
-- rediseño provisional. Las aportaciones reales usan identificadores "voz-*".
delete from public.poema_universal_vertebrae
where id in (
  'fundacional-01',
  'fundacional-02',
  'fundacional-03',
  'fundacional-04',
  'fundacional-05',
  'fundacional-06'
);
