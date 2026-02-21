import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useGetCallerUserProfile';
import { useQueryClient } from '@tanstack/react-query';
import ProfileSetupModal from './components/ProfileSetupModal';
import FeedPage from './pages/FeedPage';
import Header from './components/Header';
import { Button } from './components/ui/button';
import { Loader2 } from 'lucide-react';

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-teal-50 to-amber-50">
        <Loader2 className="w-8 h-8 animate-spin text-coral" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-teal-50 to-amber-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <img 
              src="/assets/generated/community-icon.dim_128x128.png" 
              alt="Community Hub" 
              className="w-32 h-32 mx-auto mb-8 rounded-full shadow-lg"
            />
            <h1 className="text-5xl font-bold mb-4 text-gray-900">Welcome to Community Hub</h1>
            <p className="text-xl text-gray-600 mb-8">
              Connect, share, and engage with your community. Join conversations, share your thoughts, and build meaningful connections.
            </p>
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              size="lg"
              className="bg-coral hover:bg-coral-dark text-white px-8 py-6 text-lg rounded-2xl shadow-lg transition-all hover:shadow-xl"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Get Started'
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-teal-50 to-amber-50">
      <Header onLogout={handleAuth} />
      {showProfileSetup ? (
        <ProfileSetupModal />
      ) : (
        <FeedPage />
      )}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>
            © {new Date().getFullYear()} Community Hub. Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-coral hover:text-coral-dark font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
