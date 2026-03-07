import { useGetUserProfile } from '../hooks/useGetUserProfile';
import type { Comment } from '../backend';

interface CommentItemProps {
  comment: Comment;
}

function BlockyAvatar({ username }: { username: string }) {
  const initial = username.charAt(0).toUpperCase();
  const colors = [
    'bg-roblox-red text-white',
    'bg-roblox-dark text-white',
    'bg-roblox-gold text-roblox-dark',
    'bg-blue-600 text-white',
    'bg-green-600 text-white',
  ];
  const colorIndex = username.charCodeAt(0) % colors.length;
  return (
    <div className={`w-8 h-8 rounded-blocky flex items-center justify-center font-black text-sm ${colors[colorIndex]} flex-shrink-0`}>
      {initial}
    </div>
  );
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

  return (
    <div className="flex gap-3 p-3 rounded-game bg-roblox-gray-100 border border-roblox-gray-200">
      <BlockyAvatar username={authorProfile?.username || '?'} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <p className="font-black text-sm text-roblox-dark">{authorProfile?.username || 'Loading...'}</p>
          <p className="text-xs text-roblox-gray-500 font-semibold">{formatTimestamp(comment.timestamp)}</p>
        </div>
        <p className="text-sm text-roblox-gray-700 mt-1 font-semibold">{comment.content}</p>
      </div>
    </div>
  );
}
