-- ============================================================
-- MIGRATION 002 — Row Level Security
-- Helper functions + policies for every table.
-- Run after 001_initial_schema.sql.
-- ============================================================
--
-- The security model in one sentence:
--   "You can only see or touch rows that belong to an org you are a member of."
--
-- n8n writes sections and images via the service_role key, which
-- bypasses RLS entirely. No INSERT/UPDATE policies are needed for
-- those two tables for authenticated users.
-- ============================================================


-- ── Enable RLS on every table ────────────────────────────────
alter table public.organizations        enable row level security;
alter table public.organization_members enable row level security;
alter table public.analyses             enable row level security;
alter table public.analysis_files       enable row level security;
alter table public.analysis_sections    enable row level security;
alter table public.analysis_images      enable row level security;


-- ════════════════════════════════════════════════════════════
-- HELPER FUNCTIONS
-- Called inside every policy to check org membership.
-- security definer: runs with the function owner's privileges so
-- the lookup into organization_members is not blocked by its own RLS.
-- stable: tells Postgres the result won't change within a query,
-- allowing the planner to cache the result across rows.
-- ════════════════════════════════════════════════════════════

create or replace function public.is_org_member(org_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from   public.organization_members
    where  organization_id = org_id
    and    user_id          = auth.uid()
  );
$$;

create or replace function public.is_org_admin(org_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from   public.organization_members
    where  organization_id = org_id
    and    user_id          = auth.uid()
    and    role             in ('owner', 'admin')
  );
$$;


-- ════════════════════════════════════════════════════════════
-- ORGANISATIONS
-- ════════════════════════════════════════════════════════════

-- Any authenticated user can create an org.
-- The handle_new_organization() trigger (from migration 001)
-- automatically inserts them as owner after the INSERT.
create policy "authenticated users can create an organisation"
  on public.organizations
  for insert
  to authenticated
  with check (created_by = auth.uid());

-- Members can view their own org.
create policy "members can view their organisation"
  on public.organizations
  for select
  to authenticated
  using (public.is_org_member(id));

-- Admins and owners can update org details (name, slug).
create policy "admins can update organisation"
  on public.organizations
  for update
  to authenticated
  using      (public.is_org_admin(id))
  with check (public.is_org_admin(id));

-- Only owners can delete the org (irreversible — all data cascades).
create policy "owners can delete organisation"
  on public.organizations
  for delete
  to authenticated
  using (exists (
    select 1
    from   public.organization_members
    where  organization_id = id
    and    user_id          = auth.uid()
    and    role             = 'owner'
  ));


-- ════════════════════════════════════════════════════════════
-- ORGANISATION MEMBERS
-- ════════════════════════════════════════════════════════════

-- Members can see who else is in their org.
create policy "members can view other members"
  on public.organization_members
  for select
  to authenticated
  using (public.is_org_member(organization_id));

-- Only admins/owners can add new members.
-- Note: the first owner row is inserted by the trigger (security definer),
-- which bypasses this policy — so org creation still works.
create policy "admins can add members"
  on public.organization_members
  for insert
  to authenticated
  with check (public.is_org_admin(organization_id));

-- Only admins/owners can change roles.
create policy "admins can update member roles"
  on public.organization_members
  for update
  to authenticated
  using      (public.is_org_admin(organization_id))
  with check (public.is_org_admin(organization_id));

-- Members can leave themselves; admins can remove anyone.
create policy "members can leave or be removed by admins"
  on public.organization_members
  for delete
  to authenticated
  using (
    user_id = auth.uid()
    or public.is_org_admin(organization_id)
  );


-- ════════════════════════════════════════════════════════════
-- ANALYSES
-- ════════════════════════════════════════════════════════════

-- All members of an org can view all analyses in that org.
create policy "members can view analyses"
  on public.analyses
  for select
  to authenticated
  using (public.is_org_member(organization_id));

-- Any org member can start a new analysis.
create policy "members can create analyses"
  on public.analyses
  for insert
  to authenticated
  with check (
    public.is_org_member(organization_id)
    and created_by = auth.uid()
  );

-- Members can update name/comment/title.
-- n8n updates status and completed_at via service_role — not covered here.
create policy "members can update analyses"
  on public.analyses
  for update
  to authenticated
  using      (public.is_org_member(organization_id))
  with check (public.is_org_member(organization_id));

-- Only admins/owners can delete an analysis (cascades to all child rows).
create policy "admins can delete analyses"
  on public.analyses
  for delete
  to authenticated
  using (public.is_org_admin(organization_id));


-- ════════════════════════════════════════════════════════════
-- ANALYSIS FILES
-- No direct organization_id — access is checked via the parent analysis.
-- The join is one hop and is covered by idx_files_analysis.
-- ════════════════════════════════════════════════════════════

create policy "members can view files"
  on public.analysis_files
  for select
  to authenticated
  using (exists (
    select 1
    from   public.analyses a
    where  a.id = analysis_id
    and    public.is_org_member(a.organization_id)
  ));

create policy "members can upload files"
  on public.analysis_files
  for insert
  to authenticated
  with check (
    uploaded_by = auth.uid()
    and exists (
      select 1
      from   public.analyses a
      where  a.id = analysis_id
      and    public.is_org_member(a.organization_id)
    )
  );

-- Admins can delete file metadata rows.
-- Deleting the object from storage must be done separately in the app.
create policy "admins can delete files"
  on public.analysis_files
  for delete
  to authenticated
  using (exists (
    select 1
    from   public.analyses a
    where  a.id = analysis_id
    and    public.is_org_admin(a.organization_id)
  ));


-- ════════════════════════════════════════════════════════════
-- ANALYSIS SECTIONS
-- Read-only for authenticated users.
-- n8n inserts and updates via service_role, which bypasses RLS —
-- no write policies are needed here.
-- ════════════════════════════════════════════════════════════

create policy "members can view sections"
  on public.analysis_sections
  for select
  to authenticated
  using (exists (
    select 1
    from   public.analyses a
    where  a.id = analysis_id
    and    public.is_org_member(a.organization_id)
  ));


-- ════════════════════════════════════════════════════════════
-- ANALYSIS IMAGES
-- Same pattern as sections — read-only for users, written by n8n.
-- ════════════════════════════════════════════════════════════

create policy "members can view images"
  on public.analysis_images
  for select
  to authenticated
  using (exists (
    select 1
    from   public.analyses a
    where  a.id = analysis_id
    and    public.is_org_member(a.organization_id)
  ));
