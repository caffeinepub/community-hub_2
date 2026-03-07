import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { FreeStuffCategory } from '../backend';

interface CreateFreeStuffPostParams {
  title: string;
  description: string;
  category: FreeStuffCategory;
  contentType: string;
  content: string;
  tags: string[];
  expirationTime: bigint | null;
  link: string | null;
  proof: string | null;
  isAvailable?: boolean;
}

export function useCreateFreeStuffPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateFreeStuffPostParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createFreeStuffPost(
        params.title,
        params.description,
        params.category,
        params.contentType,
        params.content,
        params.tags,
        params.expirationTime,
        params.link,
        params.proof
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freeStuffPosts'] });
    },
  });
}
