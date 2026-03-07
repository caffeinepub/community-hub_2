import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useGetCallerUserProfile';
import { useQueryClient } from '@tanstack/react-query';
import ProfileSetupModal from './components/ProfileSetupModal';
import FeedPage from './pages/FeedPage';
import Header from './components/Header';
import { Button } from './components/ui/button';
import { Loader2, Gamepad2 } from 'lucide-react';

export default function App() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';
  const isInitializing = loginStatus === 'initializing';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-roblox-gray-100">
        <Loader2 className="w-10 h-10 animate-spin text-roblox-red" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-roblox-gray-100">
        {/* Top bar */}
        <div className="bg-roblox-red py-3 px-4 text-center">
          <p className="text-white text-sm font-bold tracking-wide">🎮 FREE STUFF ONLY — NO SCAMS, NO HACKS, 100% LEGIT</p>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <img
                src="/assets/generated/app-logo.dim_128x128.png"
                alt="RoFree Hub"
                className="w-20 h-20 rounded-game shadow-game"
              />
            </div>
            <h1 className="text-5xl font-black mb-3 text-roblox-dark tracking-tight">
              Ro<span className="text-roblox-red">Free</span> Hub
            </h1>
            <p className="text-lg font-semibold text-roblox-gray-700 mb-2">
              Your #1 Roblox Fan Community
            </p>
            <p className="text-base text-roblox-gray-500 mb-10">
              Discover legit promo codes, free UGC items, game passes, tips & tricks — all shared by real players like you.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
              {[
                { emoji: '🎟️', label: 'Promo Codes' },
                { emoji: '👕', label: 'Free UGC' },
                { emoji: '🎮', label: 'Game Passes' },
                { emoji: '💡', label: 'Tips & Tricks' },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-game border-2 border-roblox-gray-200 p-3 text-center shadow-sm">
                  <div className="text-2xl mb-1">{item.emoji}</div>
                  <div className="text-xs font-bold text-roblox-gray-700">{item.label}</div>
                </div>
              ))}
            </div>

            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              size="lg"
              className="bg-roblox-red hover:bg-roblox-red-dark text-white px-10 py-6 text-lg font-black rounded-game shadow-game transition-all hover:translate-y-0.5 hover:shadow-game-sm"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <Gamepad2 className="mr-2 h-5 w-5" />
                  Join the Community
                </>
              )}
            </Button>
            <p className="text-xs text-roblox-gray-500 mt-4">Free to join. No Robux required.</p>
          </div>
        </div>

        <footer className="border-t border-roblox-gray-200 mt-16 bg-white">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-roblox-gray-500">
            <p>
              © {new Date().getFullYear()} RoFree Hub. Not affiliated with Roblox Corporation. Built with{' '}
              <span className="text-roblox-red">♥</span> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-roblox-red hover:text-roblox-red-dark font-bold"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-roblox-gray-100">
      <Header onLogout={handleAuth} />
      {showProfileSetup ? (
        <ProfileSetupModal />
      ) : (
        <FeedPage />
      )}
      <footer className="border-t border-roblox-gray-200 mt-16 bg-white">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-roblox-gray-500">
          <p>
            © {new Date().getFullYear()} RoFree Hub. Not affiliated with Roblox Corporation. Built with{' '}
            <span className="text-roblox-red">♥</span> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-roblox-red hover:text-roblox-red-dark font-bold"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
