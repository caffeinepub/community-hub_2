import PostCreationForm from '../components/PostCreationForm';
import PostFeed from '../components/PostFeed';

export default function FeedPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 rounded-3xl overflow-hidden shadow-xl">
        <img 
          src="/assets/generated/hero-banner.dim_1200x400.png" 
          alt="Community Hub Banner" 
          className="w-full h-auto object-cover"
        />
      </div>
      
      <div className="mb-8">
        <PostCreationForm />
      </div>
      
      <PostFeed />
    </main>
  );
}
