import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { PostId } from '../backend';

export function useLikePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: PostId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.likePost(postId);
    },
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['likeCount', postId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['allPosts'] });
    },
    onError: (error: any) => {
      if (error.message?.includes('already liked')) {
        console.log('You already liked this post');
      }
    },
  });
}
