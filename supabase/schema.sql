-- ============================================================
-- HALO RFP — Supabase Database Schema
-- Run this entire file in Supabase SQL Editor
-- Project: ishymjhrkpoxomeyymcz
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: analyses
-- ============================================================
CREATE TABLE IF NOT EXISTS public.analyses (
  -- Identity
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Submission metadata
  name            TEXT NOT NULL,
  comment         TEXT,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT now() NOT NULL,

  -- Processing status
  status          TEXT NOT NULL DEFAULT 'PROCESSING'
                  CHECK (status IN ('PROCESSING', 'COMPLETE', 'FAILED')),
  error_message   TEXT,

  -- Uploaded file references
  file_urls       TEXT[]  NOT NULL DEFAULT '{}',
  file_names      TEXT[]  NOT NULL DEFAULT '{}',
  file_sizes      BIGINT[] NOT NULL DEFAULT '{}',

  -- AI Output (populated by n8n when COMPLETE)
  results         JSONB
);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.analyses;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.analyses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_analyses_user_id  ON public.analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_status   ON public.analyses(status);
CREATE INDEX IF NOT EXISTS idx_analyses_created  ON public.analyses(created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

-- Users can read their own analyses
CREATE POLICY "Users can view own analyses"
  ON public.analyses FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert analyses for themselves
CREATE POLICY "Users can create own analyses"
  ON public.analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Service role (n8n) can update any analysis
CREATE POLICY "Service role can update analyses"
  ON public.analyses FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- DONE — Verify with:
-- SELECT * FROM public.analyses LIMIT 1;
-- ============================================================
