import { useState } from 'react';
import { useCreatePost } from '../hooks/useCreatePost';
import { Card, CardContent } from './ui/card';
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
    <Card className="rounded-3xl shadow-lg border-2 border-gray-100 bg-white">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind? Share with the community..."
            rows={4}
            className="rounded-2xl border-2 focus:border-teal resize-none text-base"
            disabled={isPending}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!content.trim() || isPending}
              className="bg-teal hover:bg-teal-dark text-white rounded-xl px-6 py-5 font-medium shadow-md transition-all hover:shadow-lg"
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
