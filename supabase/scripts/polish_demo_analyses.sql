-- One-off: rename sandbox analyses and mark them complete.
-- Run in Supabase SQL editor (as a user with update rights on your org's rows).
-- Adjust organization_id if you need to scope further.

update public.analyses
set
  name = 'EDGNEX Data Centres — Dhahran & Dammam Tech',
  title = 'EDGNEX Data Centres — Dhahran & Dammam Tech',
  comment = null,
  status = 'complete',
  completed_at = coalesce(completed_at, now())
where lower(trim(name)) = 'test - a lot of files';

update public.analyses
set
  name = 'Qiddiya Public Golf Club — Lead Design Consultancy',
  title = 'Qiddiya Public Golf Club — Lead Design Consultancy',
  comment = null,
  status = 'complete',
  completed_at = coalesce(completed_at, now())
where lower(trim(name)) = 'test 2';

update public.analyses
set
  name = 'Riyadh Metro Depot 3 — Design Competition',
  title = 'Riyadh Metro Depot 3 — Design Competition',
  comment = null,
  status = 'complete',
  completed_at = coalesce(completed_at, now())
where lower(trim(name)) = 'test';
