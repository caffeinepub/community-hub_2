import { useState } from 'react';
import { useAddComment } from '../hooks/useAddComment';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2, Send } from 'lucide-react';
import type { PostId } from '../backend';

interface CommentFormProps {
  postId: PostId;
}

export default function CommentForm({ postId }: CommentFormProps) {
  const [content, setContent] = useState('');
  const { mutate: addComment, isPending } = useAddComment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      addComment(
        { postId, content: content.trim() },
        {
          onSuccess: () => {
            setContent('');
          },
        }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        className="rounded-xl border-2 focus:border-teal"
        disabled={isPending}
      />
      <Button
        type="submit"
        disabled={!content.trim() || isPending}
        size="sm"
        className="bg-teal hover:bg-teal-dark text-white rounded-xl px-4"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
}
