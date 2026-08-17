-- Embrión · Atlas histórico de la sensibilidad poética
-- Esquema inicial normalizado. El JSON piloto local puede migrarse sin cambiar la UI.

create extension if not exists pgcrypto;

create table if not exists embrion_corpora (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  scope_note text not null default '',
  territory_scope jsonb not null default '[]'::jsonb,
  language_scope jsonb not null default '[]'::jsonb,
  version text not null,
  created_at timestamptz not null default now()
);

create table if not exists embrion_authors (
  id uuid primary key default gen_random_uuid(),
  authority_key text unique,
  display_name text not null,
  birth_year integer,
  death_year integer,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists embrion_sources (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  title text not null,
  url text not null,
  edition_note text not null default '',
  reliability text not null check (reliability in ('institutional_edition','institutional_study','catalogue_record')),
  accessed_at date not null
);

create table if not exists embrion_works (
  id uuid primary key default gen_random_uuid(),
  corpus_id uuid not null references embrion_corpora(id) on delete cascade,
  author_id uuid references embrion_authors(id),
  source_id uuid references embrion_sources(id),
  title text not null,
  date_start integer,
  date_end integer,
  date_label text not null,
  date_precision text not null,
  movements jsonb not null default '[]'::jsonb,
  territory text not null,
  language text not null,
  rights_status text not null check (rights_status in ('public_domain','licensed','excerpt_only','unknown')),
  rights_note text not null default '',
  curatorial_tags jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists embrion_work_texts (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references embrion_works(id) on delete cascade,
  text_content text,
  text_status text not null check (text_status in ('metadata_only','excerpt_indexed','full_text_indexed')),
  license_note text not null default '',
  checksum text,
  unique(work_id)
);

create table if not exists embrion_periodizations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  version text not null,
  description text not null default ''
);

create table if not exists embrion_periods (
  id uuid primary key default gen_random_uuid(),
  periodization_id uuid not null references embrion_periodizations(id) on delete cascade,
  parent_id uuid references embrion_periods(id),
  slug text not null,
  label text not null,
  start_year integer not null,
  end_year integer not null,
  display_order numeric not null,
  metadata jsonb not null default '{}'::jsonb,
  unique(periodization_id, slug),
  check (end_year >= start_year)
);

create table if not exists embrion_work_periods (
  work_id uuid not null references embrion_works(id) on delete cascade,
  period_id uuid not null references embrion_periods(id) on delete cascade,
  membership_weight numeric not null default 1 check (membership_weight between 0 and 1),
  curator_note text not null default '',
  primary key (work_id, period_id)
);

create table if not exists embrion_concepts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  description text not null default '',
  status text not null default 'draft'
);

create table if not exists embrion_concept_aliases (
  id uuid primary key default gen_random_uuid(),
  concept_id uuid not null references embrion_concepts(id) on delete cascade,
  lemma text not null,
  language text not null default 'es',
  valid_from integer,
  valid_to integer,
  curator_note text not null default ''
);

create table if not exists embrion_passages (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references embrion_works(id) on delete cascade,
  locator jsonb not null,
  excerpt text,
  legal_display text not null check (legal_display in ('metadata_only','short_excerpt','full_excerpt')),
  token_start integer,
  token_end integer
);

create table if not exists embrion_annotations (
  id uuid primary key default gen_random_uuid(),
  passage_id uuid not null references embrion_passages(id) on delete cascade,
  concept_id uuid not null references embrion_concepts(id) on delete cascade,
  annotation_type text not null,
  value jsonb not null,
  created_by text not null,
  reviewed_by text,
  created_at timestamptz not null default now()
);

create table if not exists embrion_analysis_runs (
  id uuid primary key default gen_random_uuid(),
  corpus_id uuid not null references embrion_corpora(id),
  concept_id uuid not null references embrion_concepts(id),
  version text not null,
  method text not null,
  parameters jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists embrion_claims (
  id uuid primary key default gen_random_uuid(),
  analysis_run_id uuid not null references embrion_analysis_runs(id) on delete cascade,
  period_id uuid references embrion_periods(id),
  claim_kind text not null check (claim_kind in ('documental_fact','curatorial_annotation','computational_interpretation')),
  title text not null,
  statement text not null,
  method text not null,
  limitations jsonb not null default '[]'::jsonb,
  evidence_grade text not null check (evidence_grade in ('limited','suggestive','solid_in_corpus')),
  evidence_dimensions jsonb not null,
  review_status text not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists embrion_claim_evidence (
  claim_id uuid not null references embrion_claims(id) on delete cascade,
  passage_id uuid not null references embrion_passages(id) on delete cascade,
  relation text not null check (relation in ('supports','qualifies','contradicts')),
  weight numeric not null check (weight between 0 and 1),
  note text not null default '',
  primary key (claim_id, passage_id)
);

create table if not exists embrion_genealogy_nodes (
  id uuid primary key default gen_random_uuid(),
  analysis_run_id uuid not null references embrion_analysis_runs(id) on delete cascade,
  period_id uuid not null references embrion_periods(id),
  claim_id uuid not null references embrion_claims(id),
  label text not null,
  description text not null,
  metrics jsonb not null default '{}'::jsonb
);

create table if not exists embrion_genealogy_edges (
  id uuid primary key default gen_random_uuid(),
  from_node_id uuid not null references embrion_genealogy_nodes(id) on delete cascade,
  to_node_id uuid not null references embrion_genealogy_nodes(id) on delete cascade,
  claim_id uuid not null references embrion_claims(id),
  relation text not null check (relation in ('persistence','transformation','rupture','reappearance','coexistence')),
  confidence numeric not null check (confidence between 0 and 1)
);

create table if not exists embrion_genome_snapshots (
  id uuid primary key default gen_random_uuid(),
  analysis_run_id uuid not null references embrion_analysis_runs(id) on delete cascade,
  period_id uuid not null references embrion_periods(id),
  metrics jsonb not null,
  sample_size integer not null,
  generated_at timestamptz not null default now(),
  unique(analysis_run_id, period_id)
);

create index if not exists embrion_works_date_idx on embrion_works(date_start, date_end);
create index if not exists embrion_passages_work_idx on embrion_passages(work_id);
create index if not exists embrion_annotations_concept_idx on embrion_annotations(concept_id);
create index if not exists embrion_claims_period_idx on embrion_claims(period_id);

alter table embrion_corpora enable row level security;
alter table embrion_authors enable row level security;
alter table embrion_sources enable row level security;
alter table embrion_works enable row level security;
alter table embrion_work_texts enable row level security;
alter table embrion_periodizations enable row level security;
alter table embrion_periods enable row level security;
alter table embrion_work_periods enable row level security;
alter table embrion_concepts enable row level security;
alter table embrion_concept_aliases enable row level security;
alter table embrion_passages enable row level security;
alter table embrion_annotations enable row level security;
alter table embrion_analysis_runs enable row level security;
alter table embrion_claims enable row level security;
alter table embrion_claim_evidence enable row level security;
alter table embrion_genealogy_nodes enable row level security;
alter table embrion_genealogy_edges enable row level security;
alter table embrion_genome_snapshots enable row level security;
