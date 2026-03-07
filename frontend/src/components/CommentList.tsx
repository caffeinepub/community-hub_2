import { useGetComments } from '../hooks/useGetComments';
import CommentItem from './CommentItem';
import { Loader2 } from 'lucide-react';
import type { PostId } from '../backend';

interface CommentListProps {
  postId: PostId;
}

export default function CommentList({ postId }: CommentListProps) {
  const { data: comments, isLoading } = useGetComments(postId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <CommentItem key={comment.id.toString()} comment={comment} />
      ))}
    </div>
  );
}
