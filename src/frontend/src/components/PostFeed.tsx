import { useGetAllPosts } from '../hooks/useGetAllPosts';
import PostCard from './PostCard';
import { Loader2 } from 'lucide-react';

export default function PostFeed() {
  const { data: posts, isLoading } = useGetAllPosts();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-coral" />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No posts yet. Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id.toString()} post={post} />
      ))}
    </div>
  );
}
