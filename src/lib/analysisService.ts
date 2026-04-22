// src/lib/analysisService.ts
// All Supabase database calls related to analyses live here.
// This keeps our components clean and the data layer easy to swap out later.

import { supabase } from './supabase';
import type { Analysis } from '../types/analysis';

// ─── STORAGE ────────────────────────────────────────────────────────────────

/**
 * Upload a single file to Supabase Storage.
 * Path structure: rfp-uploads/{user_id}/{analysis_id}/{filename}
 * Returns the file's storage path (not a public URL — we generate signed URLs separately).
 */
export async function uploadFile(
  userId: string,
  analysisId: string,
  file: File
): Promise<string> {
  const path = `${userId}/${analysisId}/${file.name}`;
  const { error } = await supabase.storage
    .from('rfp-uploads')
    .upload(path, file, { upsert: false });

  if (error) throw error;
  return path;
}

/**
 * Generate a signed URL for a storage path (valid for 1 hour).
 * n8n uses these to download files without needing our auth token.
 */
export async function getSignedUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('rfp-uploads')
    .createSignedUrl(path, 3600); // 1 hour expiry

  if (error) throw error;
  return data.signedUrl;
}

// ─── DATABASE: CREATE ────────────────────────────────────────────────────────

/**
 * Create a new analysis row in PROCESSING state.
 * Called immediately after files are uploaded, before n8n is triggered.
 */
export async function createAnalysis(params: {
  userId: string;
  name: string;
  comment: string;
  fileUrls: string[];
  fileNames: string[];
  fileSizes: number[];
}): Promise<Analysis> {
  const { data, error } = await supabase
    .from('analyses')
    .insert({
      user_id: params.userId,
      name: params.name,
      comment: params.comment || null,
      status: 'PROCESSING',
      file_urls: params.fileUrls,
      file_names: params.fileNames,
      file_sizes: params.fileSizes,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Analysis;
}

// ─── DATABASE: READ ──────────────────────────────────────────────────────────

/**
 * Fetch all analyses for the current user (list view).
 * Ordered by most recent first. Does NOT include the full results JSON
 * to keep the list fast.
 */
export async function listAnalyses(): Promise<Analysis[]> {
  const { data, error } = await supabase
    .from('analyses')
    .select('id, user_id, name, status, created_at, updated_at, file_names, file_sizes, error_message')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Analysis[];
}

/**
 * Fetch a single analysis by ID, including the full results JSON.
 * Used on the Results and Processing pages.
 */
export async function getAnalysis(id: string): Promise<Analysis> {
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Analysis;
}

/**
 * Poll for a status change. Returns the analysis once status is no longer PROCESSING.
 * The ProcessingPage repeatedly calls this on a timer.
 */
export async function pollAnalysisStatus(id: string): Promise<Analysis> {
  return getAnalysis(id);
}

// ─── N8N WEBHOOK ────────────────────────────────────────────────────────────

/**
 * Trigger the n8n workflow by sending the analysis ID and signed file URLs.
 * n8n will download the files, run the AI, and update the DB when done.
 */
export async function triggerN8nWorkflow(params: {
  analysisId: string;
  userId: string;
  signedFileUrls: string[];
  fileNames: string[];
  comment: string;
}): Promise<void> {
  const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
  if (!n8nWebhookUrl) {
    console.warn('VITE_N8N_WEBHOOK_URL not set — skipping n8n trigger');
    return;
  }

  const response = await fetch(n8nWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      analysis_id: params.analysisId,
      user_id: params.userId,
      file_urls: params.signedFileUrls,
      file_names: params.fileNames,
      comment: params.comment,
    }),
  });

  if (!response.ok) {
    throw new Error(`n8n webhook failed: ${response.status} ${response.statusText}`);
  }
}
