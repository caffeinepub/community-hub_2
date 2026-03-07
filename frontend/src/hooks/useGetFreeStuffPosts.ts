import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { FreeStuffPost } from '../backend';
import { FreeStuffCategory } from '../backend';

export function useGetFreeStuffPosts(
  category: FreeStuffCategory | null = null,
  tag: string | null = null,
  sortBy: string | null = null
) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<FreeStuffPost[]>({
    queryKey: ['freeStuffPosts', category, tag, sortBy],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFreeStuffPosts(category, tag, sortBy);
    },
    enabled: !!actor && !actorFetching,
  });
}
