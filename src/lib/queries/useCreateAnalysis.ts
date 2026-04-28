import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { useAuthStore } from '../../store/useAuthStore';

interface CreateAnalysisInput {
  organizationId: string;
  name: string;
  comment?: string;
}

// Creates a new analysis row and invalidates the list so RfpListPage
// refreshes automatically. Returns the new analysis id for navigation.
export function useCreateAnalysis() {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  return useMutation({
    mutationFn: async (input: CreateAnalysisInput) => {
      const { data, error } = await supabase
        .from('analyses')
        .insert({
          organization_id: input.organizationId,
          created_by:      user!.id,
          name:            input.name,
          comment:         input.comment ?? null,
          status:          'queued',
        })
        .select('id')
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, input) => {
      // Invalidate the list so it picks up the new row immediately.
      queryClient.invalidateQueries({ queryKey: ['analyses', input.organizationId] });
    },
  });
}
