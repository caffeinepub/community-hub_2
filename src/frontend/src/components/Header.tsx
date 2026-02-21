import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/generated/community-icon.dim_128x128.png" 
              alt="Community Hub" 
              className="w-12 h-12 rounded-full shadow-md"
            />
            <h1 className="text-2xl font-bold text-gray-900">Community Hub</h1>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            className="rounded-full border-2 border-coral text-coral hover:bg-coral hover:text-white transition-all"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
