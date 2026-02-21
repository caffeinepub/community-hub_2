import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useSaveCallerUserProfile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Loader2 } from 'lucide-react';

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
      <DialogContent className="sm:max-w-md rounded-3xl" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Welcome! 👋</DialogTitle>
          <DialogDescription className="text-gray-600">
            Let's set up your profile to get started in the community.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-700 font-medium">Username *</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
              className="rounded-xl border-2 focus:border-coral"
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-gray-700 font-medium">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              className="rounded-xl border-2 focus:border-coral resize-none"
              disabled={isPending}
            />
          </div>
          <Button
            type="submit"
            disabled={!username.trim() || isPending}
            className="w-full bg-coral hover:bg-coral-dark text-white rounded-xl py-6 text-lg font-medium shadow-lg transition-all hover:shadow-xl"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating Profile...
              </>
            ) : (
              'Create Profile'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
