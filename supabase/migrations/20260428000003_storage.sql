-- ============================================================
-- MIGRATION 003 — Storage buckets and policies
-- Run after 001 and 002.
-- ============================================================
--
-- Two buckets, both private (never public):
--   rfp-uploads      — raw documents uploaded by users
--   analysis-content — section JSON files and project images written by n8n
--
-- Path convention (enforced by policy, not by Postgres):
--   rfp-uploads/{org_id}/{analysis_id}/{file_id}__{original_name}
--   analysis-content/{org_id}/{analysis_id}/sections/{kind}.json
--   analysis-content/{org_id}/{analysis_id}/images/{image_id}__{filename}
--
-- The first path segment is always {org_id}.
-- Storage policies extract this segment and verify org membership.
-- ============================================================


-- ── Create buckets ───────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'rfp-uploads',
    'rfp-uploads',
    false,
    -- 50 MB per file: covers large PDF tender packages
    52428800,
    array[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
  ),
  (
    'analysis-content',
    'analysis-content',
    false,
    -- 100 MB: accommodates large site-plan images and accumulated JSON
    104857600,
    array[
      'application/json',
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      -- Some site plans are delivered as PDFs, not raster images
      'application/pdf'
    ]
  );


-- ════════════════════════════════════════════════════════════
-- STORAGE POLICIES — rfp-uploads
--
-- (storage.foldername(name))[1] extracts the first path segment,
-- which is always the {org_id}. Casting to uuid lets is_org_member
-- compare it against the membership table.
-- ════════════════════════════════════════════════════════════

-- Members can upload documents.
create policy "members can upload rfp files"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'rfp-uploads'
    and public.is_org_member(((storage.foldername(name))[1])::uuid)
  );

-- Members can read (download) documents — app generates signed URLs.
create policy "members can read rfp files"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'rfp-uploads'
    and public.is_org_member(((storage.foldername(name))[1])::uuid)
  );

-- Members can replace (re-upload) a file at the same path.
create policy "members can update rfp files"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'rfp-uploads'
    and public.is_org_member(((storage.foldername(name))[1])::uuid)
  );

-- Only admins/owners can delete uploaded files.
create policy "admins can delete rfp files"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'rfp-uploads'
    and public.is_org_admin(((storage.foldername(name))[1])::uuid)
  );


-- ════════════════════════════════════════════════════════════
-- STORAGE POLICIES — analysis-content
--
-- n8n writes to this bucket using the service_role key, which
-- bypasses RLS entirely — no INSERT or UPDATE policies needed
-- for authenticated users.
-- ════════════════════════════════════════════════════════════

-- Members can read section JSON files and images — app generates signed URLs.
create policy "members can read analysis content"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'analysis-content'
    and public.is_org_member(((storage.foldername(name))[1])::uuid)
  );

-- Only admins/owners can delete analysis content.
-- Typically triggered when an analysis is deleted in the app.
create policy "admins can delete analysis content"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'analysis-content'
    and public.is_org_admin(((storage.foldername(name))[1])::uuid)
  );
