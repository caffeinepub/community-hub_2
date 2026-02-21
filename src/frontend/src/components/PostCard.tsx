import { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { useGetUserProfile } from '../hooks/useGetUserProfile';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import LikeButton from './LikeButton';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import { MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import type { Post } from '../backend';

interface PostCardProps {
  post: Post;
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

  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="rounded-3xl shadow-lg border-2 border-gray-100 bg-white hover:shadow-xl transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 border-2 border-coral">
            {authorProfile?.avatar && (
              <AvatarImage src={authorProfile.avatar.getDirectURL()} alt={authorProfile.username} />
            )}
            <AvatarFallback className="bg-coral text-white font-semibold">
              {authorProfile ? getInitials(authorProfile.username) : '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{authorProfile?.username || 'Loading...'}</p>
            <p className="text-sm text-gray-500">{formatTimestamp(post.timestamp)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">{post.content}</p>
        
        <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
          <LikeButton postId={post.id} />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="text-gray-600 hover:text-teal hover:bg-teal/10 rounded-xl"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Comments
          </Button>
        </div>

        {showComments && (
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <CommentForm postId={post.id} />
            <CommentList postId={post.id} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
