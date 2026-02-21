import { useGetUserProfile } from '../hooks/useGetUserProfile';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import type { Comment } from '../backend';

interface CommentItemProps {
  comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
  const { data: authorProfile } = useGetUserProfile(comment.author);

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex gap-3 p-3 rounded-2xl bg-gray-50">
      <Avatar className="w-8 h-8 border-2 border-teal">
        {authorProfile?.avatar && (
          <AvatarImage src={authorProfile.avatar.getDirectURL()} alt={authorProfile.username} />
        )}
        <AvatarFallback className="bg-teal text-white text-xs font-semibold">
          {authorProfile ? getInitials(authorProfile.username) : '?'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <p className="font-semibold text-sm text-gray-900">{authorProfile?.username || 'Loading...'}</p>
          <p className="text-xs text-gray-500">{formatTimestamp(comment.timestamp)}</p>
        </div>
        <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
      </div>
    </div>
  );
}
