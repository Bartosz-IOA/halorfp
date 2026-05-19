import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { useAuthStore } from '../../store/useAuthStore';
import { useCommentsStore } from '../../store/useCommentsStore';

interface CreateAnalysisInput {
  organizationId: string;
  name: string;
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
          comment:         null,
          status:          'queued' as const,
        })
        .select('id')
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, input) => {
      useCommentsStore.getState().clearCommentsForAnalysis(data.id);
      useCommentsStore.getState().closeCommentMode();
      queryClient.invalidateQueries({ queryKey: ['analyses', input.organizationId] });
    },
  });
}
