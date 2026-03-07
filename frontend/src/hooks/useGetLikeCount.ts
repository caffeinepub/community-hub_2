import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { PostId } from '../backend';

export function useGetLikeCount(postId: PostId) {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['likeCount', postId.toString()],
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getLikeCount(postId);
    },
    enabled: !!actor && !isFetching,
  });
}
