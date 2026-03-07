import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPost(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPosts'] });
    },
  });
}
