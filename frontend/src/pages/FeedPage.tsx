import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import FreeStuffFeed from '../components/FreeStuffFeed';
import FreeStuffCreationForm from '../components/FreeStuffCreationForm';
import PostCreationForm from '../components/PostCreationForm';
import PostFeed from '../components/PostFeed';
import { Button } from '../components/ui/button';
import { Plus, X, MessageSquare, Gift } from 'lucide-react';

type ActiveTab = 'freestuff' | 'community';

export default function FeedPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [activeTab, setActiveTab] = useState<ActiveTab>('freestuff');
  const [showFreeStuffForm, setShowFreeStuffForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);

  return (
    <main className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Hero Banner */}
      <div className="mb-6 rounded-game overflow-hidden shadow-lg border-2 border-roblox-gray-200">
        <img
          src="/assets/generated/hero-banner.dim_1200x400.png"
          alt="RoFree Hub — Roblox Fan Community"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Welcome strip */}
      <div className="bg-roblox-red rounded-game px-4 py-3 mb-6 flex items-center justify-between">
        <div>
          <p className="text-white font-black text-base">🎮 Welcome to RoFree Hub!</p>
          <p className="text-white/80 text-xs font-semibold">Share & discover legit free Roblox content — promo codes, UGC, tips & more.</p>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-2 mb-6 border-b-2 border-roblox-gray-200 pb-0">
        <button
          onClick={() => setActiveTab('freestuff')}
          className={`flex items-center gap-2 px-4 py-2.5 font-black text-sm rounded-t-game border-2 border-b-0 transition-all -mb-0.5 ${
            activeTab === 'freestuff'
              ? 'bg-white border-roblox-gray-200 text-roblox-red border-b-white'
              : 'bg-roblox-gray-100 border-transparent text-roblox-gray-500 hover:text-roblox-dark'
          }`}
        >
          <Gift className="w-4 h-4" />
          Free Stuff
        </button>
        <button
          onClick={() => setActiveTab('community')}
          className={`flex items-center gap-2 px-4 py-2.5 font-black text-sm rounded-t-game border-2 border-b-0 transition-all -mb-0.5 ${
            activeTab === 'community'
              ? 'bg-white border-roblox-gray-200 text-roblox-red border-b-white'
              : 'bg-roblox-gray-100 border-transparent text-roblox-gray-500 hover:text-roblox-dark'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Community
        </button>
      </div>

      {/* Free Stuff Tab */}
      {activeTab === 'freestuff' && (
        <div className="space-y-5">
          {isAuthenticated && (
            <div>
              {showFreeStuffForm ? (
                <div>
                  <FreeStuffCreationForm onClose={() => setShowFreeStuffForm(false)} />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFreeStuffForm(false)}
                    className="mt-2 text-roblox-gray-500 font-bold rounded-game"
                  >
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowFreeStuffForm(true)}
                  className="bg-roblox-red hover:bg-roblox-red-dark text-white rounded-game font-black shadow-game transition-all hover:translate-y-0.5 hover:shadow-game-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Share Free Stuff
                </Button>
              )}
            </div>
          )}
          {!isAuthenticated && (
            <div className="bg-roblox-red-light border-2 border-roblox-red rounded-game px-4 py-3">
              <p className="text-roblox-red font-black text-sm">🔒 Log in to share free stuff with the community!</p>
            </div>
          )}
          <FreeStuffFeed />
        </div>
      )}

      {/* Community Tab */}
      {activeTab === 'community' && (
        <div className="space-y-5">
          {isAuthenticated && (
            <div>
              {showPostForm ? (
                <div>
                  <PostCreationForm />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPostForm(false)}
                    className="mt-2 text-roblox-gray-500 font-bold rounded-game"
                  >
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowPostForm(true)}
                  className="bg-roblox-dark hover:bg-roblox-gray-700 text-white rounded-game font-black shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              )}
            </div>
          )}
          {!isAuthenticated && (
            <div className="bg-roblox-gray-100 border-2 border-roblox-gray-200 rounded-game px-4 py-3">
              <p className="text-roblox-gray-700 font-black text-sm">🔒 Log in to post in the community!</p>
            </div>
          )}
          <PostFeed />
        </div>
      )}
    </main>
  );
}
