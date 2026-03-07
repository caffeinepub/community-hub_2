import { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { useGetUserProfile } from '../hooks/useGetUserProfile';
import LikeButton from './LikeButton';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import { MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import type { Post } from '../backend';

interface PostCardProps {
  post: Post;
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
    <div className={`w-11 h-11 rounded-blocky flex items-center justify-center font-black text-lg ${colors[colorIndex]} flex-shrink-0`}>
      {initial}
    </div>
  );
}

export default function PostCard({ post }: PostCardProps) {
  const { data: authorProfile } = useGetUserProfile(post.author);
  const [showComments, setShowComments] = useState(false);

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="rounded-game shadow-card border-2 border-roblox-gray-200 bg-white hover:shadow-lg transition-all hover:-translate-y-0.5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <BlockyAvatar username={authorProfile?.username || '?'} />
          <div className="flex-1">
            <p className="font-black text-roblox-dark">{authorProfile?.username || 'Loading...'}</p>
            <p className="text-xs text-roblox-gray-500 font-semibold">{formatTimestamp(post.timestamp)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-roblox-gray-700 text-base leading-relaxed whitespace-pre-wrap font-semibold">{post.content}</p>

        <div className="flex items-center gap-3 pt-2 border-t border-roblox-gray-200">
          <LikeButton postId={post.id} />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="text-roblox-gray-500 hover:text-roblox-dark hover:bg-roblox-gray-100 rounded-game font-bold"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Comments
          </Button>
        </div>

        {showComments && (
          <div className="space-y-4 pt-4 border-t border-roblox-gray-200">
            <CommentForm postId={post.id} />
            <CommentList postId={post.id} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
