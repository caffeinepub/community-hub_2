import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { PostId } from '../backend';

export function useAddComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, content }: { postId: PostId; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addComment(postId, content);
    },
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId.toString()] });
    },
  });
}
