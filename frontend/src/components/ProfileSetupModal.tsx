import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useSaveCallerUserProfile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Loader2, Gamepad2 } from 'lucide-react';

export default function ProfileSetupModal() {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      saveProfile({ username: username.trim(), bio: bio.trim() });
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md rounded-game border-2 border-roblox-gray-200" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Gamepad2 className="w-6 h-6 text-roblox-red" />
            <DialogTitle className="text-2xl font-black text-roblox-dark">Create Your Player!</DialogTitle>
          </div>
          <DialogDescription className="text-roblox-gray-500 font-semibold">
            Set up your profile to start sharing free Roblox stuff with the community.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-roblox-dark font-bold">Username *</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose your player name"
              required
              className="rounded-game border-2 focus:border-roblox-red font-semibold"
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-roblox-dark font-bold">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell the community about yourself..."
              rows={3}
              className="rounded-game border-2 focus:border-roblox-red resize-none font-semibold"
              disabled={isPending}
            />
          </div>
          <Button
            type="submit"
            disabled={!username.trim() || isPending}
            className="w-full bg-roblox-red hover:bg-roblox-red-dark text-white rounded-game py-5 text-base font-black shadow-game transition-all hover:translate-y-0.5 hover:shadow-game-sm"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating Profile...
              </>
            ) : (
              '🎮 Start Playing!'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
