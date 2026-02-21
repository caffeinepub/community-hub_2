import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, UserId } from '../backend';

export function useGetUserProfile(userId: UserId) {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['userProfile', userId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserProfile(userId);
    },
    enabled: !!actor && !isFetching,
  });
}
