-- ============================================================
-- MIGRATION 001 — Initial schema
-- Tables, indexes, triggers
-- Run this first.
-- ============================================================


-- ── Helper: auto-stamp updated_at on every UPDATE ────────────
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ════════════════════════════════════════════════════════════
-- 1. ORGANISATIONS
-- Top-level access boundary. Every piece of data belongs to an org.
-- ════════════════════════════════════════════════════════════
create table public.organizations (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  slug        text        not null unique,
  created_by  uuid        not null references auth.users(id),
  created_at  timestamptz not null default now()
);

comment on table  public.organizations            is 'Top-level access boundary. Every piece of data belongs to an org.';
comment on column public.organizations.slug       is 'URL-safe unique identifier, e.g. halo-io. Used in routes.';
comment on column public.organizations.created_by is 'User who created the org. Automatically made owner via trigger.';


-- ── Trigger: make the creator an owner automatically ─────────
-- Runs after INSERT so the new org id is available.
-- Uses security definer so it can insert into organization_members
-- before that table's RLS policies are checked.

create or replace function public.handle_new_organization()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.organization_members (organization_id, user_id, role)
  values (new.id, new.created_by, 'owner');
  return new;
end;
$$;

create trigger on_organization_created
  after insert on public.organizations
  for each row execute function public.handle_new_organization();


-- ════════════════════════════════════════════════════════════
-- 2. ORGANISATION MEMBERS
-- Join table: users ↔ organisations.
-- Roles live here, not on the user, because the same user can be
-- owner in one org and member in another.
-- ════════════════════════════════════════════════════════════
create table public.organization_members (
  organization_id  uuid        not null references public.organizations(id) on delete cascade,
  user_id          uuid        not null references auth.users(id)           on delete cascade,
  role             text        not null default 'member'
                               check (role in ('owner', 'admin', 'member')),
  joined_at        timestamptz not null default now(),
  primary key (organization_id, user_id)
);

comment on table  public.organization_members       is 'Many-to-many: users ↔ organisations. A user can belong to multiple orgs with different roles.';
comment on column public.organization_members.role  is 'owner: full control. admin: manage members & analyses. member: read/write analyses.';


-- ════════════════════════════════════════════════════════════
-- 3. ANALYSES
-- One row per RFP analysis submission.
-- organization_id is the security boundary — all child rows
-- (files, sections, images) inherit access through this.
-- ════════════════════════════════════════════════════════════
create table public.analyses (
  id               uuid        primary key default gen_random_uuid(),
  organization_id  uuid        not null references public.organizations(id) on delete cascade,
  created_by       uuid        not null references auth.users(id),
  name             text        not null,
  title            text,
  comment          text,
  status           text        not null default 'queued'
                               check (status in ('queued', 'processing', 'complete', 'failed')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  completed_at     timestamptz
);

comment on table  public.analyses                 is 'One row per RFP analysis submission.';
comment on column public.analyses.organization_id is 'Security boundary — org members can see all analyses in their org.';
comment on column public.analyses.name            is 'User-typed label at submission time (informal reference name).';
comment on column public.analyses.title           is 'Formal display title extracted from the RFP document by n8n.';
comment on column public.analyses.status          is 'queued: submitted, not yet picked up. processing: n8n is running. complete | failed: terminal states.';
comment on column public.analyses.completed_at    is 'Null until processing finishes. Populated by n8n on completion or failure.';

create trigger set_analyses_updated_at
  before update on public.analyses
  for each row execute function public.handle_updated_at();


-- ════════════════════════════════════════════════════════════
-- 4. ANALYSIS FILES
-- Metadata for each uploaded document.
-- Actual bytes live in the rfp-uploads storage bucket.
-- ════════════════════════════════════════════════════════════
create table public.analysis_files (
  id                 uuid        primary key default gen_random_uuid(),
  analysis_id        uuid        not null references public.analyses(id) on delete cascade,
  storage_path       text        not null,
  file_name          text        not null,
  mime_type          text,
  size_bytes         bigint,
  short_description  text,
  long_description   text,
  uploaded_by        uuid        not null references auth.users(id),
  created_at         timestamptz not null default now()
);

comment on table  public.analysis_files                    is 'Metadata for uploaded documents. Bytes live in rfp-uploads storage bucket.';
comment on column public.analysis_files.storage_path       is 'Full key inside rfp-uploads: {org_id}/{analysis_id}/{file_id}__{original_name}';
comment on column public.analysis_files.short_description  is '1–2 sentence description of this file''s role in the analysis.';
comment on column public.analysis_files.long_description   is 'Full context: what the document contains, who authored it, what n8n should extract.';


-- ════════════════════════════════════════════════════════════
-- 5. ANALYSIS SECTIONS
-- One row per section of an analysis.
-- The actual structured content lives as a JSON file in the
-- analysis-content storage bucket (content_path).
--
-- Sections are write-only for n8n (service_role bypasses RLS).
-- Users only read them.
--
-- kind values map to TypeScript discriminated union types in the app.
-- ════════════════════════════════════════════════════════════
create table public.analysis_sections (
  id            uuid        primary key default gen_random_uuid(),
  analysis_id   uuid        not null references public.analyses(id) on delete cascade,
  kind          text        not null
                            check (kind in (
                              'summary',
                              'go_no_go',
                              'scoring_breakdown',
                              'contract_analysis',
                              'subcontractors_analysis',
                              'post_contract_analysis',
                              'fee_analysis'
                            )),
  position      int         not null,
  title         text        not null,
  content_path  text        not null,
  created_at    timestamptz not null default now(),
  unique (analysis_id, position),
  unique (analysis_id, kind)
);

comment on table  public.analysis_sections               is 'One row per section of an analysis. Content JSON lives in analysis-content bucket.';
comment on column public.analysis_sections.kind          is 'Discriminator: one section of each kind per analysis. Maps to TypeScript content type.';
comment on column public.analysis_sections.position      is 'Ascending display order. Enforced unique per analysis.';
comment on column public.analysis_sections.content_path  is 'Key in analysis-content bucket: {org_id}/{analysis_id}/sections/{kind}.json';


-- ════════════════════════════════════════════════════════════
-- 6. ANALYSIS IMAGES
-- Project images referenced in the Summary section.
-- Files live in the analysis-content storage bucket.
-- Metadata rows let the app list images and generate signed URLs
-- without parsing the content JSON file.
-- ════════════════════════════════════════════════════════════
create table public.analysis_images (
  id            uuid        primary key default gen_random_uuid(),
  analysis_id   uuid        not null references public.analyses(id) on delete cascade,
  storage_path  text        not null,
  description   text,
  source        text,
  position      int         not null default 0,
  created_at    timestamptz not null default now()
);

comment on table  public.analysis_images               is 'Project images for the Summary section. Files live in analysis-content bucket.';
comment on column public.analysis_images.storage_path  is 'Key in analysis-content bucket: {org_id}/{analysis_id}/images/{image_id}__{filename}';
comment on column public.analysis_images.source        is 'Provenance of the image, e.g. "Client brief, page 12".';
comment on column public.analysis_images.position      is 'Display order within the project images list.';


-- ════════════════════════════════════════════════════════════
-- INDEXES
-- Beyond PK indexes (created automatically), these cover the
-- hot queries visible in RfpListPage and ResultsPage.
-- ════════════════════════════════════════════════════════════

-- "List my org's analyses, newest first" (main list view)
create index idx_analyses_org_created
  on public.analyses (organization_id, created_at desc);

-- "Filter analyses by status"
create index idx_analyses_org_status
  on public.analyses (organization_id, status);

-- "Which orgs does this user belong to?" (used in RLS helpers)
create index idx_org_members_user
  on public.organization_members (user_id);

-- "List files for an analysis"
create index idx_files_analysis
  on public.analysis_files (analysis_id);

-- "List sections for an analysis in order" (results page)
create index idx_sections_analysis_position
  on public.analysis_sections (analysis_id, position);

-- "List images for an analysis in order" (summary section)
create index idx_images_analysis_position
  on public.analysis_images (analysis_id, position);
