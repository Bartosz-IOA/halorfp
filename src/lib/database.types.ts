// ============================================================
// Database types — matches the schema in supabase/migrations/
//
// To regenerate from the live schema, run:
//   npx supabase gen types typescript \
//     --project-id YOUR_PROJECT_REF \
//     --schema public \
//     > src/lib/database.types.ts
// ============================================================

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type MemberRole = 'owner' | 'admin' | 'member';
export type AnalysisStatus = 'queued' | 'processing' | 'complete' | 'failed';
export type SectionKind =
  | 'summary'
  | 'go_no_go'
  | 'scoring_breakdown'
  | 'contract_analysis'
  | 'subcontractors_analysis'
  | 'post_contract_analysis'
  | 'fee_analysis';

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id:         string;
          name:       string;
          slug:       string;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?:        string;
          name:       string;
          slug:       string;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?:        string;
          name?:      string;
          slug?:      string;
          created_by?: string;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: 'organizations_created_by_fkey'; columns: ['created_by']; referencedRelation: 'users'; referencedColumns: ['id'] }
        ];
      };

      organization_members: {
        Row: {
          organization_id: string;
          user_id:         string;
          role:            MemberRole;
          joined_at:       string;
        };
        Insert: {
          organization_id: string;
          user_id:         string;
          role?:           MemberRole;
          joined_at?:      string;
        };
        Update: {
          organization_id?: string;
          user_id?:         string;
          role?:            MemberRole;
          joined_at?:       string;
        };
        Relationships: [
          { foreignKeyName: 'organization_members_organization_id_fkey'; columns: ['organization_id']; referencedRelation: 'organizations'; referencedColumns: ['id'] },
          { foreignKeyName: 'organization_members_user_id_fkey';         columns: ['user_id'];         referencedRelation: 'users';         referencedColumns: ['id'] }
        ];
      };

      analyses: {
        Row: {
          id:              string;
          organization_id: string;
          created_by:      string;
          name:            string;
          title:           string | null;
          comment:         string | null;
          status:          AnalysisStatus;
          created_at:      string;
          updated_at:      string;
          completed_at:    string | null;
        };
        Insert: {
          id?:             string;
          organization_id: string;
          created_by:      string;
          name:            string;
          title?:          string | null;
          comment?:        string | null;
          status?:         AnalysisStatus;
          created_at?:     string;
          updated_at?:     string;
          completed_at?:   string | null;
        };
        Update: {
          id?:             string;
          organization_id?: string;
          created_by?:     string;
          name?:           string;
          title?:          string | null;
          comment?:        string | null;
          status?:         AnalysisStatus;
          created_at?:     string;
          updated_at?:     string;
          completed_at?:   string | null;
        };
        Relationships: [
          { foreignKeyName: 'analyses_organization_id_fkey'; columns: ['organization_id']; referencedRelation: 'organizations'; referencedColumns: ['id'] },
          { foreignKeyName: 'analyses_created_by_fkey';      columns: ['created_by'];      referencedRelation: 'users';         referencedColumns: ['id'] }
        ];
      };

      analysis_files: {
        Row: {
          id:                string;
          analysis_id:       string;
          storage_path:      string;
          file_name:         string;
          mime_type:         string | null;
          size_bytes:        number | null;
          short_description: string | null;
          long_description:  string | null;
          uploaded_by:       string;
          created_at:        string;
        };
        Insert: {
          id?:               string;
          analysis_id:       string;
          storage_path:      string;
          file_name:         string;
          mime_type?:        string | null;
          size_bytes?:       number | null;
          short_description?: string | null;
          long_description?: string | null;
          uploaded_by:       string;
          created_at?:       string;
        };
        Update: {
          id?:               string;
          analysis_id?:      string;
          storage_path?:     string;
          file_name?:        string;
          mime_type?:        string | null;
          size_bytes?:       number | null;
          short_description?: string | null;
          long_description?: string | null;
          uploaded_by?:      string;
          created_at?:       string;
        };
        Relationships: [
          { foreignKeyName: 'analysis_files_analysis_id_fkey';  columns: ['analysis_id'];  referencedRelation: 'analyses'; referencedColumns: ['id'] },
          { foreignKeyName: 'analysis_files_uploaded_by_fkey';  columns: ['uploaded_by'];  referencedRelation: 'users';    referencedColumns: ['id'] }
        ];
      };

      analysis_sections: {
        Row: {
          id:           string;
          analysis_id:  string;
          kind:         SectionKind;
          position:     number;
          title:        string;
          content_path: string;
          created_at:   string;
        };
        Insert: {
          id?:          string;
          analysis_id:  string;
          kind:         SectionKind;
          position:     number;
          title:        string;
          content_path: string;
          created_at?:  string;
        };
        Update: {
          id?:          string;
          analysis_id?: string;
          kind?:        SectionKind;
          position?:    number;
          title?:       string;
          content_path?: string;
          created_at?:  string;
        };
        Relationships: [
          { foreignKeyName: 'analysis_sections_analysis_id_fkey'; columns: ['analysis_id']; referencedRelation: 'analyses'; referencedColumns: ['id'] }
        ];
      };

      analysis_images: {
        Row: {
          id:           string;
          analysis_id:  string;
          storage_path: string;
          description:  string | null;
          source:       string | null;
          position:     number;
          created_at:   string;
        };
        Insert: {
          id?:          string;
          analysis_id:  string;
          storage_path: string;
          description?: string | null;
          source?:      string | null;
          position?:    number;
          created_at?:  string;
        };
        Update: {
          id?:          string;
          analysis_id?: string;
          storage_path?: string;
          description?: string | null;
          source?:      string | null;
          position?:    number;
          created_at?:  string;
        };
        Relationships: [
          { foreignKeyName: 'analysis_images_analysis_id_fkey'; columns: ['analysis_id']; referencedRelation: 'analyses'; referencedColumns: ['id'] }
        ];
      };
    };

    Functions: {
      is_org_member: {
        Args:    { org_id: string };
        Returns: boolean;
      };
      is_org_admin: {
        Args:    { org_id: string };
        Returns: boolean;
      };
    };

    Enums: Record<string, never>;
  };
};

// ── Convenience row types ─────────────────────────────────────
// Import these in components and hooks instead of reaching into Database directly.

export type Organization     = Database['public']['Tables']['organizations']['Row'];
export type OrgMember        = Database['public']['Tables']['organization_members']['Row'];
export type Analysis         = Database['public']['Tables']['analyses']['Row'];
export type AnalysisFile     = Database['public']['Tables']['analysis_files']['Row'];
export type AnalysisSection  = Database['public']['Tables']['analysis_sections']['Row'];
export type AnalysisImage    = Database['public']['Tables']['analysis_images']['Row'];
