import React, { useState } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, 
  Plus, 
  Heart, 
  MessageSquare, 
  Tag, 
  Calendar, 
  User, 
  X, 
  Sparkles, 
  Send,
  ArrowRight,
  Share2
} from 'lucide-react';
import { Story } from '../../types';

export const StoriesPage: React.FC = () => {
  const { stories, members, addStory, likeStory, addStoryComment } = useFamily();
  const { user } = useAuth();

  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [isWriteOpen, setIsWriteOpen] = useState(false);

  // Write Story State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80');
  const [tags, setTags] = useState('Founders, Heritage, Ceylon');
  const [taggedMemberIds, setTaggedMemberIds] = useState<string[]>([]);

  // Comment input
  const [commentText, setCommentText] = useState('');

  const handleCreateStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addStory({
      title,
      content,
      authorId: user?.uid || 'user-demo',
      authorName: user?.displayName || 'Family Historian',
      coverImageUrl: coverImageUrl || undefined,
      taggedMemberIds,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      publicationDate: new Date().toISOString().split('T')[0],
      visibility: 'family'
    });

    setTitle('');
    setContent('');
    setIsWriteOpen(false);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStory || !commentText.trim()) return;
    addStoryComment(activeStory.id, commentText);
    setCommentText('');
    const updated = stories.find(s => s.id === activeStory.id);
    if (updated) setActiveStory(updated);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5 text-purple-600" />
            <span>Oral Traditions & Heritage Memoirs</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
            Family Stories & History
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-2xl mt-1">
            Preserve grandparent recollections, historic migration journeys, wedding anecdotes, and milestones for generations to read.
          </p>
        </div>

        <button
          onClick={() => setIsWriteOpen(true)}
          className="px-4 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 active:scale-95 self-start sm:self-center"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Write Family Story</span>
        </button>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stories.map((story) => {
          const isLiked = story.likes.includes(user?.uid || 'user-demo');

          return (
            <div
              key={story.id}
              onClick={() => setActiveStory(story)}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-soft hover:shadow-elevated transition cursor-pointer flex flex-col justify-between group"
            >
              {story.coverImageUrl && (
                <div className="h-48 w-full overflow-hidden relative">
                  <img
                    src={story.coverImageUrl}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded-full">
                    {story.publicationDate}
                  </div>
                </div>
              )}

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {story.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-forest-700 leading-snug">
                    {story.title}
                  </h3>

                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed whitespace-pre-line">
                    {story.content}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span className="font-medium">By {story.authorName}</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'text-rose-500 fill-rose-500' : 'text-stone-400'}`} />
                      <span className="text-[11px] font-mono">{story.likes.length}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
                      <span className="text-[11px] font-mono">{story.comments.length}</span>
                    </span>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Story Reader Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 animate-in fade-in zoom-in-95">
            
            {activeStory.coverImageUrl && (
              <div className="h-64 w-full relative">
                <img src={activeStory.coverImageUrl} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => setActiveStory(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <span>Published on {activeStory.publicationDate}</span>
                  <span>•</span>
                  <span>Recorded by {activeStory.authorName}</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
                  {activeStory.title}
                </h2>
              </div>

              {/* Story Narrative Text */}
              <div className="prose prose-stone text-xs sm:text-sm text-stone-700 leading-relaxed space-y-4 whitespace-pre-line border-y border-stone-100 py-6">
                {activeStory.content}
              </div>

              {/* Tagged Relative links */}
              {activeStory.taggedMemberIds.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Relatives In This Story</span>
                  <div className="flex flex-wrap gap-2">
                    {activeStory.taggedMemberIds.map(mId => {
                      const m = members.find(item => item.id === mId);
                      if (!m) return null;
                      return (
                        <span key={mId} className="text-xs bg-forest-100 text-forest-800 px-3 py-1 rounded-full font-semibold">
                          {m.firstName} {m.lastName}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Comments Section */}
              <div className="space-y-3 pt-4 border-t border-stone-100">
                <h4 className="font-serif font-bold text-sm text-stone-900">Family Comments & Memories</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {activeStory.comments.length === 0 ? (
                    <p className="text-xs text-stone-400 italic">No comments yet. Share your recollection!</p>
                  ) : (
                    activeStory.comments.map(c => (
                      <div key={c.id} className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs">
                        <span className="font-bold text-stone-900 block">{c.userName}</span>
                        <p className="text-stone-600 mt-0.5">{c.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Comment Input */}
                <form onSubmit={handlePostComment} className="pt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a family memory or thank the author..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 text-xs rounded-xl border border-stone-300 p-2.5"
                  />
                  <button type="submit" className="p-2.5 bg-forest-700 text-white rounded-xl hover:bg-forest-800">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Write Story Modal */}
      {isWriteOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-serif font-bold text-base text-stone-900">Write Family Story</h3>
              <button onClick={() => setIsWriteOpen(false)} className="p-1 rounded-full text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStory} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Story Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grandfather’s Journey to Colombo"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Story Content & Memoirs</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Type oral memories, childhood anecdotes, dates, places, quotes..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 p-2.5 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="Heritage, Migration, 1960s"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 p-2.5"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsWriteOpen(false)}
                  className="px-4 py-2 bg-stone-100 rounded-xl text-xs font-semibold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-semibold shadow"
                >
                  Publish Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
