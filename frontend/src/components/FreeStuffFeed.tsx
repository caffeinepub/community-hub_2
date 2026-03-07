import { useState } from 'react';
import { useGetFreeStuffPosts } from '../hooks/useGetFreeStuffPosts';
import FreeStuffPostCard from './FreeStuffPostCard';
import { Loader2 } from 'lucide-react';
import { FreeStuffCategory } from '../backend';

const FILTER_BUTTONS: { label: string; value: FreeStuffCategory | null }[] = [
  { label: '🌟 All', value: null },
  { label: '🎟️ Promo Codes', value: FreeStuffCategory.promoCode },
  { label: '👕 Free UGC', value: FreeStuffCategory.freeUGC },
  { label: '🎮 Game Passes', value: FreeStuffCategory.freeGamePass },
  { label: '💡 Tips & Tricks', value: FreeStuffCategory.tipsAndTricks },
  { label: '📢 General', value: FreeStuffCategory.general },
];

export default function FreeStuffFeed() {
  const [activeCategory, setActiveCategory] = useState<FreeStuffCategory | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'likes'>('newest');
  const [availableOnly, setAvailableOnly] = useState(false);

  const { data: posts, isLoading } = useGetFreeStuffPosts(
    activeCategory,
    null,
    sortBy === 'likes' ? 'likes' : null
  );

  const filteredPosts = availableOnly
    ? (posts ?? []).filter((p) => p.isAvailable)
    : (posts ?? []);

  return (
    <div className="space-y-4">
      {/* Sort + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTER_BUTTONS.map((btn) => (
            <button
              key={btn.label}
              onClick={() => setActiveCategory(btn.value)}
              className={`px-3 py-1.5 rounded-game text-xs font-black border-2 transition-all ${
                activeCategory === btn.value
                  ? 'bg-roblox-red text-white border-roblox-red-dark shadow-game-sm'
                  : 'bg-white text-roblox-gray-700 border-roblox-gray-200 hover:border-roblox-red hover:text-roblox-red'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          {/* Available Only toggle */}
          <button
            onClick={() => setAvailableOnly((prev) => !prev)}
            className={`px-3 py-1.5 rounded-game text-xs font-black border-2 transition-all flex items-center gap-1.5 ${
              availableOnly
                ? 'bg-green-600 text-white border-green-700 shadow-game-sm'
                : 'bg-white text-roblox-gray-700 border-roblox-gray-200 hover:border-green-600 hover:text-green-600'
            }`}
          >
            ✅ Available Only
          </button>
          <button
            onClick={() => setSortBy('newest')}
            className={`px-3 py-1.5 rounded-game text-xs font-black border-2 transition-all ${
              sortBy === 'newest'
                ? 'bg-roblox-dark text-white border-roblox-dark'
                : 'bg-white text-roblox-gray-700 border-roblox-gray-200 hover:border-roblox-dark'
            }`}
          >
            🕐 Newest
          </button>
          <button
            onClick={() => setSortBy('likes')}
            className={`px-3 py-1.5 rounded-game text-xs font-black border-2 transition-all ${
              sortBy === 'likes'
                ? 'bg-roblox-dark text-white border-roblox-dark'
                : 'bg-white text-roblox-gray-700 border-roblox-gray-200 hover:border-roblox-dark'
            }`}
          >
            🔥 Top Liked
          </button>
        </div>
      </div>

      {/* Posts */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-roblox-red" />
        </div>
      ) : !filteredPosts || filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-game border-2 border-roblox-gray-200">
          <div className="text-5xl mb-3">🎮</div>
          <p className="font-black text-roblox-dark text-lg">
            {availableOnly ? 'No available items right now!' : 'No free stuff here yet!'}
          </p>
          <p className="text-roblox-gray-500 font-semibold text-sm mt-1">
            {availableOnly
              ? 'Try turning off the "Available Only" filter to see all posts.'
              : 'Be the first to share a promo code or tip.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredPosts.map((post) => (
            <FreeStuffPostCard key={post.id.toString()} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
