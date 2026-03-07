import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

interface UpdateAvailabilityParams {
  postId: bigint;
  isAvailable: boolean;
}

export function useUpdateFreeStuffAvailability() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, isAvailable }: UpdateAvailabilityParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateFreeStuffAvailability(postId, isAvailable);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freeStuffPosts'] });
    },
  });
}
