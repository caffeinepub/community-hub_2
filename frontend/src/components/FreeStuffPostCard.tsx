import { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { useGetUserProfile } from '../hooks/useGetUserProfile';
import { Heart, ExternalLink, Clock, CheckCircle, Tag, Eye, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useLikeFreeStuffPost } from '../hooks/useLikeFreeStuffPost';
import type { FreeStuffPost } from '../backend';
import { FreeStuffCategory } from '../backend';

interface FreeStuffPostCardProps {
  post: FreeStuffPost;
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
    <div className={`w-9 h-9 rounded-blocky flex items-center justify-center font-black text-sm ${colors[colorIndex]} flex-shrink-0`}>
      {initial}
    </div>
  );
}

const CATEGORY_CONFIG: Record<FreeStuffCategory, { label: string; emoji: string; className: string }> = {
  [FreeStuffCategory.promoCode]: {
    label: 'Promo Code',
    emoji: '🎟️',
    className: 'bg-roblox-red text-white border-roblox-red-dark',
  },
  [FreeStuffCategory.freeUGC]: {
    label: 'Free UGC',
    emoji: '👕',
    className: 'bg-blue-600 text-white border-blue-700',
  },
  [FreeStuffCategory.freeGamePass]: {
    label: 'Free Game Pass',
    emoji: '🎮',
    className: 'bg-green-600 text-white border-green-700',
  },
  [FreeStuffCategory.tipsAndTricks]: {
    label: 'Tips & Tricks',
    emoji: '💡',
    className: 'bg-roblox-gold text-roblox-dark border-yellow-500',
  },
  [FreeStuffCategory.general]: {
    label: 'General',
    emoji: '📢',
    className: 'bg-roblox-gray-700 text-white border-roblox-gray-900',
  },
};

export default function FreeStuffPostCard({ post }: FreeStuffPostCardProps) {
  const { data: authorProfile } = useGetUserProfile(post.author);
  const { mutate: likePost, isPending: isLiking } = useLikeFreeStuffPost();
  const [showContent, setShowContent] = useState(false);

  const categoryConfig = CATEGORY_CONFIG[post.category] ?? CATEGORY_CONFIG[FreeStuffCategory.general];

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

  const isExpired = post.expirationTime
    ? Number(post.expirationTime) / 1000000 < Date.now()
    : false;

  return (
    <Card className={`rounded-game border-2 bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg ${isExpired ? 'opacity-60 border-roblox-gray-200' : 'border-roblox-gray-200 shadow-card'}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <BlockyAvatar username={authorProfile?.username || '?'} />
            <div className="min-w-0">
              <p className="font-black text-sm text-roblox-dark truncate">{authorProfile?.username || 'Loading...'}</p>
              <p className="text-xs text-roblox-gray-500 font-semibold">{formatTimestamp(post.timestamp)}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {post.verified && (
              <span title="Verified by moderator">
                <CheckCircle className="w-4 h-4 text-green-500" />
              </span>
            )}
            {/* Availability badge */}
            {post.isAvailable ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-blocky text-xs font-black bg-green-100 text-green-700 border border-green-300">
                ✅ Available
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-blocky text-xs font-black bg-roblox-gray-100 text-roblox-gray-500 border border-roblox-gray-300">
                ❌ Unavailable
              </span>
            )}
            {isExpired && (
              <Badge variant="outline" className="text-xs font-bold text-roblox-gray-500 border-roblox-gray-300">
                Expired
              </Badge>
            )}
          </div>
        </div>

        {/* Category badge */}
        <div className="mt-2">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-blocky text-xs font-black border ${categoryConfig.className}`}>
            {categoryConfig.emoji} {categoryConfig.label}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Title */}
        <h3 className="font-black text-roblox-dark text-base leading-tight">{post.title}</h3>

        {/* Description */}
        <p className="text-sm text-roblox-gray-700 font-semibold leading-relaxed">{post.description}</p>

        {/* Content reveal */}
        {post.content && (
          <div>
            {showContent ? (
              <div className="bg-roblox-gray-100 border-2 border-roblox-gray-200 rounded-game p-3">
                <p className="text-sm font-black text-roblox-dark break-all">{post.content}</p>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowContent(true)}
                className="w-full rounded-game border-2 border-roblox-red text-roblox-red hover:bg-roblox-red hover:text-white font-black transition-all"
              >
                🔓 Reveal {post.contentType || 'Content'}
              </Button>
            )}
          </div>
        )}

        {/* Link */}
        {post.link && (
          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-bold truncate"
          >
            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{post.link}</span>
          </a>
        )}

        {/* Proof */}
        {post.proof && (
          <div className="text-xs text-roblox-gray-500 font-semibold bg-roblox-gray-100 rounded-game px-2 py-1">
            📸 Proof: {post.proof}
          </div>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-roblox-gray-100 border border-roblox-gray-200 rounded-blocky text-xs font-bold text-roblox-gray-700"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Expiration */}
        {post.expirationTime && !isExpired && (
          <div className="flex items-center gap-1.5 text-xs text-roblox-gold font-bold">
            <Clock className="w-3.5 h-3.5" />
            Expires: {new Date(Number(post.expirationTime) / 1000000).toLocaleDateString()}
          </div>
        )}

        {/* Footer: likes & views */}
        <div className="flex items-center gap-3 pt-2 border-t border-roblox-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => likePost(post.id)}
            disabled={isLiking}
            className="text-roblox-gray-500 hover:text-roblox-red hover:bg-roblox-red-light rounded-game font-bold transition-all"
          >
            {isLiking ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Heart className="w-4 h-4 mr-2" />
            )}
            {Number(post.likes)} {Number(post.likes) === 1 ? 'Like' : 'Likes'}
          </Button>
          <span className="flex items-center gap-1 text-xs text-roblox-gray-500 font-semibold ml-auto">
            <Eye className="w-3.5 h-3.5" />
            {Number(post.views)} views
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
