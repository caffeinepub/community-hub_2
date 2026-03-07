import { useState } from 'react';
import { useCreateFreeStuffPost } from '../hooks/useCreateFreeStuffPost';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Loader2, Plus, X } from 'lucide-react';
import { FreeStuffCategory } from '../backend';

const CATEGORIES = [
  { value: FreeStuffCategory.promoCode, label: '🎟️ Promo Code' },
  { value: FreeStuffCategory.freeUGC, label: '👕 Free UGC Item' },
  { value: FreeStuffCategory.freeGamePass, label: '🎮 Free Game Pass' },
  { value: FreeStuffCategory.tipsAndTricks, label: '💡 Tips & Tricks' },
  { value: FreeStuffCategory.general, label: '📢 General' },
];

const CONTENT_TYPES = [
  { value: 'Promo Code', label: 'Promo Code' },
  { value: 'Link', label: 'Link / URL' },
  { value: 'Instructions', label: 'Instructions' },
  { value: 'Tip', label: 'Tip / Trick' },
  { value: 'Other', label: 'Other' },
];

export default function FreeStuffCreationForm({ onClose }: { onClose?: () => void }) {
  const { mutate: createPost, isPending } = useCreateFreeStuffPost();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<FreeStuffCategory>(FreeStuffCategory.promoCode);
  const [contentType, setContentType] = useState('Promo Code');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [link, setLink] = useState('');
  const [proof, setProof] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed) && tags.length < 5) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    createPost(
      {
        title: title.trim(),
        description: description.trim(),
        category,
        contentType,
        content: content.trim(),
        tags,
        expirationTime: null,
        link: link.trim() || null,
        proof: proof.trim() || null,
        isAvailable,
      },
      {
        onSuccess: () => {
          setTitle('');
          setDescription('');
          setCategory(FreeStuffCategory.promoCode);
          setContentType('Promo Code');
          setContent('');
          setTags([]);
          setTagInput('');
          setLink('');
          setProof('');
          setIsAvailable(true);
          onClose?.();
        },
      }
    );
  };

  return (
    <Card className="rounded-game border-2 border-roblox-red shadow-card bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-black text-roblox-dark flex items-center gap-2">
          🎁 Share Free Stuff
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <Label className="font-black text-roblox-dark text-sm">Title *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Free hat promo code — expires soon!"
              required
              className="rounded-game border-2 focus:border-roblox-red font-semibold"
              disabled={isPending}
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label className="font-black text-roblox-dark text-sm">Category *</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as FreeStuffCategory)} disabled={isPending}>
              <SelectTrigger className="rounded-game border-2 focus:border-roblox-red font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-game">
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value} className="font-semibold">
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="font-black text-roblox-dark text-sm">Description *</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this is and how to get it..."
              rows={3}
              required
              className="rounded-game border-2 focus:border-roblox-red resize-none font-semibold"
              disabled={isPending}
            />
          </div>

          {/* Content Type + Content */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="font-black text-roblox-dark text-sm">Content Type</Label>
              <Select value={contentType} onValueChange={setContentType} disabled={isPending}>
                <SelectTrigger className="rounded-game border-2 focus:border-roblox-red font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-game">
                  {CONTENT_TYPES.map((ct) => (
                    <SelectItem key={ct.value} value={ct.value} className="font-semibold">
                      {ct.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="font-black text-roblox-dark text-sm">Content / Code</Label>
              <Input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="e.g. FREECAP2024"
                className="rounded-game border-2 focus:border-roblox-red font-semibold"
                disabled={isPending}
              />
            </div>
          </div>

          {/* Link */}
          <div className="space-y-1.5">
            <Label className="font-black text-roblox-dark text-sm">Link (optional)</Label>
            <Input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
              className="rounded-game border-2 focus:border-roblox-red font-semibold"
              disabled={isPending}
            />
          </div>

          {/* Proof */}
          <div className="space-y-1.5">
            <Label className="font-black text-roblox-dark text-sm">Proof (optional)</Label>
            <Input
              value={proof}
              onChange={(e) => setProof(e.target.value)}
              placeholder="Screenshot URL or description..."
              className="rounded-game border-2 focus:border-roblox-red font-semibold"
              disabled={isPending}
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <Label className="font-black text-roblox-dark text-sm">Tags (up to 5)</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add a tag..."
                className="rounded-game border-2 focus:border-roblox-red font-semibold"
                disabled={isPending || tags.length >= 5}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleAddTag}
                disabled={isPending || tags.length >= 5 || !tagInput.trim()}
                className="rounded-game border-2 border-roblox-gray-200 hover:border-roblox-red flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-roblox-gray-100 border border-roblox-gray-200 rounded-blocky text-xs font-bold text-roblox-gray-700"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-roblox-red transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Availability toggle */}
          <div className="flex items-center justify-between rounded-game border-2 border-roblox-gray-200 bg-roblox-gray-100 px-4 py-3">
            <div>
              <p className="font-black text-roblox-dark text-sm">Mark as Available</p>
              <p className="text-xs text-roblox-gray-500 font-semibold mt-0.5">
                Is this item currently available to claim?
              </p>
            </div>
            <Switch
              checked={isAvailable}
              onCheckedChange={setIsAvailable}
              disabled={isPending}
              className="data-[state=checked]:bg-green-600"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isPending || !title.trim() || !description.trim()}
            className="w-full rounded-game bg-roblox-red hover:bg-roblox-red-dark text-white font-black border-b-4 border-roblox-red-dark hover:border-roblox-red-darker transition-all active:border-b-0 active:translate-y-0.5"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : (
              '🎁 Share Free Stuff'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
