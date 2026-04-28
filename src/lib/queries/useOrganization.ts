import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { useAuthStore } from '../../store/useAuthStore';
import type { Organization, MemberRole } from '../database.types';

export interface OrgMembership {
  organization_id: string;
  role: MemberRole;
  joined_at: string;
  organizations: Organization;
}

// Returns the current user's first organisation and their role within it.
// For MVP every user belongs to one org. When multi-org switching is needed,
// replace the .limit(1) with a store that tracks the active org id.
export function useCurrentOrg() {
  const user = useAuthStore(state => state.user);

  return useQuery({
    queryKey: ['organization', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organization_members')
        .select('organization_id, role, joined_at, organizations(*)')
        .eq('user_id', user!.id)
        .limit(1)
        .single();

      if (error) throw error;
      return data as OrgMembership;
    },
  });
}
