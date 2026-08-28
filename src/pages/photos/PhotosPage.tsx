import React, { useState, useMemo } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { useAuth } from '../../context/AuthContext';
import { useFamilyAccess } from '../../hooks/useFamilyAccess';
import { uploadFamilyFile } from '../../services/storage';
import { 
  Image as ImageIcon, 
  Plus, 
  FolderPlus, 
  Heart, 
  MessageSquare, 
  Tag, 
  X, 
  Send
} from 'lucide-react';
import { Photo } from '../../types';
import { SelectDropdown, SelectOption } from '../../components/ui/Dropdown';

export const PhotosPage: React.FC = () => {
  const { family, photos, albums, members, addPhoto, likePhoto, addPhotoComment, addAlbum } = useFamily();
  const { user, firebaseUser } = useAuth();
  const { canUploadMedia } = useFamilyAccess();

  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('all');
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);

  // Upload Photo Modal
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [url, setUrl] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dateTaken, setDateTaken] = useState('');
  const [location, setLocation] = useState('');
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

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') resolve(reader.result);
        else reject(new Error('Failed to read file'));
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleUploadPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setUploading(true);
    try {
      let photoUrl = url.trim();
      if (uploadFile) {
        if (firebaseUser) {
          try {
            photoUrl = await uploadFamilyFile(firebaseUser.uid, family.id, 'photos', uploadFile);
          } catch (uploadErr) {
            console.warn('Storage upload error, using local fallback:', uploadErr);
            photoUrl = await readFileAsDataUrl(uploadFile);
          }
        } else {
          photoUrl = await readFileAsDataUrl(uploadFile);
        }
      } else if (!photoUrl) {
        return;
      }

      addPhoto({
        title,
        caption: caption || undefined,
        url: photoUrl,
        dateTaken: dateTaken || undefined,
        location: location || undefined,
        albumId: albumId || undefined,
        taggedMemberIds,
        uploadedBy: user?.displayName || 'Family Historian'
      });

      setTitle('');
      setCaption('');
      setUrl('');
      setUploadFile(null);
      setDateTaken('');
      setLocation('');
      setAlbumId('');
      setTaggedMemberIds([]);
      setIsUploadOpen(false);
    } catch (err) {
      console.error('Failed to upload photo:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumName.trim()) return;

    addAlbum(albumName, albumDesc || undefined);
    setAlbumName('');
    setAlbumDesc('');
    setIsAlbumOpen(false);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePhoto || !commentText.trim()) return;

    addPhotoComment(activePhoto.id, commentText);
    setCommentText('');
    const updated = photos.find(p => p.id === activePhoto.id);
    if (updated) setActivePhoto(updated);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-transparent dark:border-rose-800/50 text-xs font-semibold mb-2">
            <ImageIcon className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>Historical Visual Archive</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
            Family Photo Gallery & Albums
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-2xl mt-1">
            Preserve antique portraits, restored memories, tagged individuals, and ancestral moments in high-resolution albums.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setIsAlbumOpen(true)}
            className="px-4 py-2.5 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>New Album</span>
          </button>
          {canUploadMedia && (
          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>
          )}
        </div>
      </div>

      {/* Albums Carousel Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedAlbumId('all')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex-shrink-0 ${
            selectedAlbumId === 'all' 
              ? 'bg-forest-800 dark:bg-forest-700 text-white shadow-sm' 
              : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800'
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
                ? 'bg-forest-800 dark:bg-forest-700 text-white shadow-sm' 
                : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800'
            }`}
          >
            <span>📁 {alb.name}</span>
          </button>
        ))}
      </div>

      {/* Photos Masonry / Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-500 space-y-2">
          <ImageIcon className="w-8 h-8 mx-auto text-stone-300 dark:text-stone-600" />
          <p className="text-xs">No photos uploaded in this album yet. Upload ancestral and family portraits to build your gallery.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPhotos.map((photo) => {
          const isLiked = photo.likes.includes(user?.uid || 'user-demo');

          return (
            <div
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-soft hover:shadow-elevated transition cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] bg-stone-100 dark:bg-stone-800 overflow-hidden">
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
                <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 truncate group-hover:text-forest-700 dark:group-hover:text-forest-400">
                  {photo.title}
                </h3>
                {photo.caption && (
                  <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                    {photo.caption}
                  </p>
                )}

                {/* Tagged members preview */}
                {photo.taggedMemberIds.length > 0 && (
                  <div className="flex items-center gap-1 text-[11px] text-forest-700 dark:text-forest-400 pt-1 font-medium">
                    <Tag className="w-3 h-3 text-forest-600 dark:text-forest-400" />
                    <span>{photo.taggedMemberIds.length} relatives tagged</span>
                  </div>
                )}

                {/* Interaction icons */}
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-400 dark:text-stone-500">
                  <span className="text-[10px] text-stone-400 dark:text-stone-500 truncate max-w-[120px]">
                    By {photo.uploadedBy}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        likePhoto(photo.id);
                      }}
                      className="flex items-center gap-1 hover:text-rose-500 transition"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'text-rose-500 fill-rose-500' : 'text-stone-400'}`} />
                      <span className="text-[11px] font-mono">{photo.likes.length}</span>
                    </button>
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
      )}

      {/* Photo Lightbox & Discussion Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row border border-stone-200 dark:border-stone-800 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Left: Photo View */}
            <div className="md:w-3/5 bg-stone-950 flex items-center justify-center p-4 relative">
              <img
                src={activePhoto.url}
                alt={activePhoto.title}
                className="max-h-[70vh] w-auto object-contain rounded-2xl"
              />
            </div>

            {/* Right: Info & Comments */}
            <div className="md:w-2/5 p-6 flex flex-col justify-between overflow-y-auto bg-stone-50/50 dark:bg-stone-850">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">{activePhoto.title}</h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      {activePhoto.dateTaken} {activePhoto.location ? `• ${activePhoto.location}` : ''}
                    </p>
                  </div>
                  <button onClick={() => setActivePhoto(null)} className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {activePhoto.caption && (
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed bg-white dark:bg-stone-800 p-3.5 rounded-2xl border border-stone-200/70 dark:border-stone-700">
                    {activePhoto.caption}
                  </p>
                )}

                {/* Tagged members list */}
                {activePhoto.taggedMemberIds.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">Tagged In This Photo</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activePhoto.taggedMemberIds.map(mId => {
                        const m = members.find(item => item.id === mId);
                        if (!m) return null;
                        return (
                          <span key={mId} className="text-xs bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-300 px-2.5 py-0.5 rounded-full font-semibold border border-forest-200 dark:border-forest-800">
                            {m.firstName} {m.lastName}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Comments List */}
                <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">Family Comments & Memories</span>
                  <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                    {activePhoto.comments.length === 0 ? (
                      <p className="text-xs text-stone-400 dark:text-stone-500 italic">No comments yet. Share what you remember!</p>
                    ) : (
                      activePhoto.comments.map(c => (
                        <div key={c.id} className="p-2.5 bg-white dark:bg-stone-800 rounded-xl border border-stone-200/70 dark:border-stone-700 text-xs">
                          <span className="font-bold text-stone-900 dark:text-stone-100 block">{c.userName}</span>
                          <p className="text-stone-600 dark:text-stone-300 mt-0.5">{c.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* Comment Input */}
              <form onSubmit={handlePostComment} className="pt-4 border-t border-stone-200 dark:border-stone-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Write a comment or memory..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 p-2.5"
                />
                <button type="submit" className="p-2.5 bg-forest-700 text-white rounded-xl hover:bg-forest-800 dark:bg-forest-600 dark:hover:bg-forest-500">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* Upload Photo Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-stone-200 dark:border-stone-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">Upload Family Photo</h3>
              <button onClick={() => setIsUploadOpen(false)} className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadPhoto} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Photo Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grandma Alice in Galle Garden"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 p-2.5 focus:ring-forest-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Upload Image File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-2.5 file:mr-3 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-forest-50 dark:file:bg-forest-950 file:text-forest-800 dark:file:text-forest-300 file:text-xs file:font-semibold"
                />
                <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-1">
                  {firebaseUser ? 'Files upload to Firebase Storage when signed in.' : 'Sign in to persist uploads to cloud storage.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Or Image URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 p-2.5 focus:ring-forest-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Date Taken</label>
                  <input
                    type="date"
                    value={dateTaken}
                    onChange={(e) => setDateTaken(e.target.value)}
                    className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-2.5 focus:ring-forest-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="City, Country"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 p-2.5 focus:ring-forest-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">Album</label>
                <SelectDropdown
                  options={[
                    { value: '', label: 'No Album (General Gallery)' },
                    ...albums.map(a => ({ value: a.id, label: a.name }))
                  ]}
                  value={albumId}
                  onChange={setAlbumId}
                  fullWidth
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Caption / Story</label>
                <textarea
                  rows={2}
                  placeholder="Add memory context, photographer, or anecdote..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 p-2.5 focus:ring-forest-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 bg-forest-700 hover:bg-forest-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow transition"
                >
                  {uploading ? 'Uploading...' : 'Upload & Tag'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Album Modal */}
      {isAlbumOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-stone-200 dark:border-stone-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">Create New Photo Album</h3>
              <button onClick={() => setIsAlbumOpen(false)} className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAlbum} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Album Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weddings Across Generations"
                  value={albumName}
                  onChange={(e) => setAlbumName(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 p-2.5 focus:ring-forest-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="What era or theme does this album preserve?"
                  value={albumDesc}
                  onChange={(e) => setAlbumDesc(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 p-2.5 focus:ring-forest-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAlbumOpen(false)}
                  className="px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-semibold shadow transition"
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
