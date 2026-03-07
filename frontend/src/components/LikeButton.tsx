import { Button } from './ui/button';
import { Heart } from 'lucide-react';
import { useLikePost } from '../hooks/useLikePost';
import { useGetLikeCount } from '../hooks/useGetLikeCount';
import type { PostId } from '../backend';

interface LikeButtonProps {
  postId: PostId;
}

export default function LikeButton({ postId }: LikeButtonProps) {
  const { data: likeCount = 0n } = useGetLikeCount(postId);
  const { mutate: likePost, isPending } = useLikePost();

  const handleLike = () => {
    likePost(postId);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={isPending}
      className="text-roblox-gray-500 hover:text-roblox-red hover:bg-roblox-red-light rounded-game font-bold transition-all"
    >
      <Heart className="w-4 h-4 mr-2" />
      {Number(likeCount)} {Number(likeCount) === 1 ? 'Like' : 'Likes'}
    </Button>
  );
}
