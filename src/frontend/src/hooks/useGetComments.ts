import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Comment, PostId } from '../backend';

export function useGetComments(postId: PostId) {
  const { actor, isFetching } = useActor();

  return useQuery<Comment[]>({
    queryKey: ['comments', postId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getComments(postId);
    },
    enabled: !!actor && !isFetching,
  });
}
