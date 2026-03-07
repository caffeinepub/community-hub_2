import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  return (
    <header className="bg-roblox-red sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/app-logo.dim_128x128.png"
              alt="RoFree Hub"
              className="w-10 h-10 rounded-blocky shadow-sm"
            />
            <div>
              <h1 className="text-xl font-black text-white tracking-tight leading-none">
                Ro<span className="text-roblox-gold">Free</span> Hub
              </h1>
              <p className="text-xs text-white/70 font-semibold leading-none mt-0.5">Roblox Fan Community</p>
            </div>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="rounded-game border-2 border-white/40 text-white bg-white/10 hover:bg-white hover:text-roblox-red font-bold transition-all"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
