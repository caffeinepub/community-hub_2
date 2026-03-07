import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useLikeFreeStuffPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.likeFreeStuffPost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freeStuffPosts'] });
    },
  });
}
