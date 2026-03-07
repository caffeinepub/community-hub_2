import { useState } from 'react';
import { useCreatePost } from '../hooks/useCreatePost';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Loader2, Send } from 'lucide-react';

export default function PostCreationForm() {
  const [content, setContent] = useState('');
  const { mutate: createPost, isPending } = useCreatePost();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      createPost(content.trim(), {
        onSuccess: () => {
          setContent('');
        },
      });
    }
  };

  return (
    <Card className="rounded-game shadow-card border-2 border-roblox-gray-200 bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-black text-roblox-dark">💬 Share with the Community</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share news, ask questions, or chat with fellow Roblox fans..."
            rows={3}
            className="rounded-game border-2 focus:border-roblox-red resize-none text-base font-semibold"
            disabled={isPending}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!content.trim() || isPending}
              className="bg-roblox-red hover:bg-roblox-red-dark text-white rounded-game px-6 font-black shadow-game transition-all hover:translate-y-0.5 hover:shadow-game-sm"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Post
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
