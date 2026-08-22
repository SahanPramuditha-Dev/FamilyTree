import React, { useState, useMemo } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Image as ImageIcon, 
  Plus, 
  FolderPlus, 
  Heart, 
  MessageSquare, 
  Tag, 
  Calendar, 
  MapPin, 
  X, 
  Send,
  Sparkles,
  Layers
} from 'lucide-react';
import { Photo, Album } from '../../types';

export const PhotosPage: React.FC = () => {
  const { photos, albums, members, addPhoto, likePhoto, addPhotoComment, addAlbum } = useFamily();
  const { user } = useAuth();

  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('all');
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);

  // Upload Photo Modal
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [url, setUrl] = useState('https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80');
  const [dateTaken, setDateTaken] = useState('1975-06-15');
  const [location, setLocation] = useState('Colombo, Sri Lanka');
  const [albumId, setAlbumId] = useState('');
  const [taggedMemberIds, setTaggedMemberIds] = useState<string[]>([]);

  // Create Album Modal
  const [isAlbumOpen, setIsAlbumOpen] = useState(false);
  const [albumName, setAlbumName] = useState('');
  const [albumDesc, setAlbumDesc] = useState('');

  // Comment input
  const [commentText, setCommentText] = useState('');

  const filteredPhotos = useMemo(() => {
    if (selectedAlbumId === 'all') return photos;
    return photos.filter(p => p.albumId === selectedAlbumId);
  }, [photos, selectedAlbumId]);

  const handleUploadPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    addPhoto({
      title,
      caption: caption || undefined,
      url,
      dateTaken: dateTaken || undefined,
      location: location || undefined,
      albumId: albumId || undefined,
      taggedMemberIds,
      uploadedBy: user?.displayName || 'Family Historian'
    });

    setTitle('');
    setCaption('');
    setIsUploadOpen(false);
  };

  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumName.trim()) return;
    addAlbum(albumName, albumDesc);
    setAlbumName('');
    setAlbumDesc('');
    setIsAlbumOpen(false);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePhoto || !commentText.trim()) return;
    addPhotoComment(activePhoto.id, commentText);
    setCommentText('');
    // Refresh active photo modal view
    const updated = photos.find(p => p.id === activePhoto.id);
    if (updated) setActivePhoto(updated);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold mb-2">
            <ImageIcon className="w-3.5 h-3.5 text-rose-600" />
            <span>Family Photographic Archives</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
            Family Photo Gallery & Albums
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-2xl mt-1">
            Preserve high-resolution portraits, vintage archival scans, weddings, and generational reunions with face tags.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setIsAlbumOpen(true)}
            className="px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>New Album</span>
          </button>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>
        </div>
      </div>

      {/* Albums Carousel Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedAlbumId('all')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex-shrink-0 ${
            selectedAlbumId === 'all' 
              ? 'bg-forest-800 text-white shadow-sm' 
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          All Photos ({photos.length})
        </button>

        {albums.map(alb => (
          <button
            key={alb.id}
            onClick={() => setSelectedAlbumId(alb.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex-shrink-0 flex items-center gap-2 ${
              selectedAlbumId === alb.id 
                ? 'bg-forest-800 text-white shadow-sm' 
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <span>📁 {alb.name}</span>
          </button>
        ))}
      </div>

      {/* Photos Masonry / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPhotos.map((photo) => {
          const isLiked = photo.likes.includes(user?.uid || 'user-demo');

          return (
            <div
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-soft hover:shadow-elevated transition cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                {photo.dateTaken && (
                  <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                    {photo.dateTaken.split('-')[0]}
                  </span>
                )}
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-serif font-bold text-sm text-stone-900 truncate group-hover:text-forest-700">
                  {photo.title}
                </h3>
                {photo.caption && (
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {photo.caption}
                  </p>
                )}

                {/* Tagged members preview */}
                {photo.taggedMemberIds.length > 0 && (
                  <div className="flex items-center gap-1 text-[11px] text-forest-700 pt-1 font-medium">
                    <Tag className="w-3 h-3 text-forest-600" />
                    <span>{photo.taggedMemberIds.length} relatives tagged</span>
                  </div>
                )}

                {/* Interaction icons */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                  <span className="text-[10px] text-stone-400 truncate max-w-[120px]">
                    By {photo.uploadedBy}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'text-rose-500 fill-rose-500' : 'text-stone-400'}`} />
                      <span className="text-[11px] font-mono">{photo.likes.length}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
                      <span className="text-[11px] font-mono">{photo.comments.length}</span>
                    </span>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Photo Lightbox & Discussion Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row border border-stone-200 animate-in fade-in zoom-in-95">
            
            {/* Left: Photo View */}
            <div className="md:w-3/5 bg-stone-950 flex items-center justify-center p-4 relative">
              <img
                src={activePhoto.url}
                alt={activePhoto.title}
                className="max-h-[70vh] w-auto object-contain rounded-2xl"
              />
            </div>

            {/* Right: Info & Comments */}
            <div className="md:w-2/5 p-6 flex flex-col justify-between overflow-y-auto bg-stone-50/50">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-900">{activePhoto.title}</h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {activePhoto.dateTaken} {activePhoto.location ? `• ${activePhoto.location}` : ''}
                    </p>
                  </div>
                  <button onClick={() => setActivePhoto(null)} className="p-1 rounded-full text-stone-400 hover:text-stone-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {activePhoto.caption && (
                  <p className="text-xs text-stone-600 leading-relaxed bg-white p-3.5 rounded-2xl border border-stone-200/70">
                    {activePhoto.caption}
                  </p>
                )}

                {/* Tagged members list */}
                {activePhoto.taggedMemberIds.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Tagged In This Photo</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activePhoto.taggedMemberIds.map(mId => {
                        const m = members.find(item => item.id === mId);
                        if (!m) return null;
                        return (
                          <span key={mId} className="text-xs bg-forest-100 text-forest-800 px-2.5 py-0.5 rounded-full font-semibold">
                            {m.firstName} {m.lastName}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Comments List */}
                <div className="space-y-2 pt-2 border-t border-stone-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Family Comments & Memories</span>
                  <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                    {activePhoto.comments.length === 0 ? (
                      <p className="text-xs text-stone-400 italic">No comments yet. Share what you remember!</p>
                    ) : (
                      activePhoto.comments.map(c => (
                        <div key={c.id} className="p-2.5 bg-white rounded-xl border border-stone-200/70 text-xs">
                          <span className="font-bold text-stone-900 block">{c.userName}</span>
                          <p className="text-stone-600 mt-0.5">{c.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* Comment Input */}
              <form onSubmit={handlePostComment} className="pt-4 border-t border-stone-200 flex gap-2">
                <input
                  type="text"
                  placeholder="Write a comment or memory..."
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
      )}

      {/* Upload Photo Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-serif font-bold text-base text-stone-900">Upload Family Photo</h3>
              <button onClick={() => setIsUploadOpen(false)} className="p-1 rounded-full text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadPhoto} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Photo Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grandma Alice in Galle Garden"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Date Taken</label>
                  <input
                    type="date"
                    value={dateTaken}
                    onChange={(e) => setDateTaken(e.target.value)}
                    className="w-full text-xs rounded-xl border border-stone-300 p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="City, Country"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-xs rounded-xl border border-stone-300 p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Album</label>
                <select
                  value={albumId}
                  onChange={(e) => setAlbumId(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 p-2.5"
                >
                  <option value="">No Album (General Gallery)</option>
                  {albums.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Caption / Story</label>
                <textarea
                  rows={2}
                  placeholder="Add memory context, photographer, or anecdote..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 p-2.5"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 bg-stone-100 rounded-xl text-xs font-semibold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-semibold shadow"
                >
                  Upload & Tag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Album Modal */}
      {isAlbumOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-serif font-bold text-base text-stone-900">Create New Photo Album</h3>
              <button onClick={() => setIsAlbumOpen(false)} className="p-1 rounded-full text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAlbum} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Album Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weddings Across Generations"
                  value={albumName}
                  onChange={(e) => setAlbumName(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="What era or theme does this album preserve?"
                  value={albumDesc}
                  onChange={(e) => setAlbumDesc(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 p-2.5"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAlbumOpen(false)}
                  className="px-4 py-2 bg-stone-100 rounded-xl text-xs font-semibold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-semibold shadow"
                >
                  Create Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
