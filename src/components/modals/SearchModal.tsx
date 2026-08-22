import React, { useState, useEffect, useMemo } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  X, 
  User, 
  BookOpen, 
  Image, 
  FileText, 
  MapPin, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { members, stories, photos, documents } = useFamily();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Keyboard shortcut Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { members: [], stories: [], photos: [], documents: [] };

    const matchedMembers = members.filter(m => 
      `${m.firstName} ${m.middleName || ''} ${m.lastName} ${m.nickname || ''} ${m.maidenName || ''}`.toLowerCase().includes(q) ||
      (m.occupation && m.occupation.toLowerCase().includes(q)) ||
      (m.birthPlace && m.birthPlace.toLowerCase().includes(q))
    );

    const matchedStories = stories.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.content.toLowerCase().includes(q) ||
      s.tags.some(t => t.toLowerCase().includes(q))
    );

    const matchedPhotos = photos.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.caption && p.caption.toLowerCase().includes(q)) ||
      (p.location && p.location.toLowerCase().includes(q))
    );

    const matchedDocs = documents.filter(d =>
      d.title.toLowerCase().includes(q) ||
      (d.description && d.description.toLowerCase().includes(q)) ||
      d.category.toLowerCase().includes(q)
    );

    return {
      members: matchedMembers.slice(0, 5),
      stories: matchedStories.slice(0, 3),
      photos: matchedPhotos.slice(0, 4),
      documents: matchedDocs.slice(0, 3)
    };
  }, [query, members, stories, photos, documents]);

  if (!isOpen) return null;

  const totalMatches = 
    searchResults.members.length + 
    searchResults.stories.length + 
    searchResults.photos.length + 
    searchResults.documents.length;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search input bar */}
        <div className="p-4 border-b border-stone-200 flex items-center gap-3 bg-stone-50/50">
          <Search className="w-5 h-5 text-forest-600 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search relatives, stories, historical documents, places..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-0 focus:ring-0 text-sm placeholder-stone-400 text-stone-900 outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-stone-200 text-stone-600 rounded">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query.trim() ? (
            <div className="py-8 text-center text-stone-400">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-stone-300" />
              <p className="text-xs">Type a name, place (e.g. "Colombo"), occupation, or tag to explore records.</p>
            </div>
          ) : totalMatches === 0 ? (
            <div className="py-8 text-center text-stone-400 text-xs">
              No matching records found for "{query}".
            </div>
          ) : (
            <>
              {/* Member Matches */}
              {searchResults.members.length > 0 && (
                <div>
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Family Members ({searchResults.members.length})
                  </h5>
                  <div className="space-y-1.5">
                    {searchResults.members.map(m => (
                      <div
                        key={m.id}
                        onClick={() => {
                          navigate(`/members/${m.id}`);
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-forest-50/70 border border-transparent hover:border-forest-100 cursor-pointer transition"
                      >
                        <div className="flex items-center gap-3">
                          {m.avatarUrl ? (
                            <img src={m.avatarUrl} alt="" className="w-9 h-9 rounded-lg object-cover" />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                              {m.firstName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-bold text-stone-900 leading-snug">
                              {m.firstName} {m.lastName} {m.nickname && <span className="font-normal text-stone-500 text-[11px]">({m.nickname})</span>}
                            </p>
                            <p className="text-[11px] text-stone-500">
                              Gen {m.generation} • {m.occupation || (m.isLiving ? 'Living' : 'Deceased')}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Story Matches */}
              {searchResults.stories.length > 0 && (
                <div>
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Stories ({searchResults.stories.length})
                  </h5>
                  <div className="space-y-1.5">
                    {searchResults.stories.map(s => (
                      <div
                        key={s.id}
                        onClick={() => {
                          navigate(`/stories`);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-stone-100 cursor-pointer transition flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-semibold text-stone-900">{s.title}</p>
                          <p className="text-[11px] text-stone-500 line-clamp-1">{s.content}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Document Matches */}
              {searchResults.documents.length > 0 && (
                <div>
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Historical Documents ({searchResults.documents.length})
                  </h5>
                  <div className="space-y-1.5">
                    {searchResults.documents.map(d => (
                      <div
                        key={d.id}
                        onClick={() => {
                          navigate(`/documents`);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-stone-100 cursor-pointer transition flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-semibold text-stone-900">{d.title}</p>
                          <p className="text-[11px] text-stone-500">{d.fileName} ({d.fileSize})</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};
