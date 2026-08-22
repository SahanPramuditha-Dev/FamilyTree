import React, { useState, useMemo } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { useAuth } from '../../context/AuthContext';
import { 
  FileText, 
  Plus, 
  Download, 
  Tag, 
  Trash2, 
  ExternalLink, 
  Search, 
  X, 
  FileCheck, 
  Filter 
} from 'lucide-react';
import { Document } from '../../types';

export const DocumentsPage: React.FC = () => {
  const { documents, members, addDocument, deleteDocument } = useFamily();
  const { user } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Document['category']>('birth_certificate');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('Certificate_Scan.pdf');
  const [fileSize, setFileSize] = useState('1.8 MB');
  const [dateOfDocument, setDateOfDocument] = useState('1945-05-12');
  const [linkedMemberIds, setLinkedMemberIds] = useState<string[]>([]);

  const filteredDocs = useMemo(() => {
    return documents.filter(d => {
      const matchCat = selectedCategory === 'all' || d.category === selectedCategory;
      const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) || 
                          (d.description && d.description.toLowerCase().includes(search.toLowerCase())) ||
                          d.fileName.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [documents, selectedCategory, search]);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addDocument({
      title,
      category,
      description: description || undefined,
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileName: fileName || 'Archive_Record.pdf',
      fileSize: fileSize || '1.2 MB',
      fileType: 'application/pdf',
      dateOfDocument: dateOfDocument || undefined,
      linkedMemberIds,
      uploadedBy: user?.displayName || 'Family Historian'
    });

    setTitle('');
    setDescription('');
    setIsUploadOpen(false);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>Genealogical Evidence & Archival Vault</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
            Historical Documents & Records
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-2xl mt-1">
            Store scanned birth/marriage certificates, handwritten letters, land deeds, and school diplomas linked directly to ancestral profiles.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="px-4 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 active:scale-95 self-start sm:self-center"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-soft flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search documents by title or record name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:border-forest-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs rounded-xl border border-stone-200 bg-stone-50 p-2 focus:ring-forest-500 capitalize"
          >
            <option value="all">All Categories</option>
            <option value="birth_certificate">Birth Certificates</option>
            <option value="marriage_certificate">Marriage Certificates</option>
            <option value="legal">Legal & Land Deeds</option>
            <option value="school_record">School & Degrees</option>
            <option value="letter">Historical Letters</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => {
          const linkedMembers = members.filter(m => doc.linkedMemberIds.includes(m.id));

          return (
            <div
              key={doc.id}
              className="bg-white rounded-3xl p-6 border border-stone-200 shadow-soft hover:shadow-elevated transition flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                    {doc.category.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900 group-hover:text-forest-700 leading-snug">
                    {doc.title}
                  </h3>
                  {doc.description && (
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                      {doc.description}
                    </p>
                  )}
                </div>

                {/* Metadata */}
                <div className="space-y-1 pt-2 border-t border-stone-100 text-xs text-stone-400 font-mono text-[11px]">
                  <div>File: {doc.fileName} ({doc.fileSize})</div>
                  {doc.dateOfDocument && <div>Date: {doc.dateOfDocument}</div>}
                </div>

                {/* Linked Relatives */}
                {linkedMembers.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                      Linked Relatives
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {linkedMembers.map(m => (
                        <span key={m.id} className="text-[11px] bg-forest-50 text-forest-800 px-2 py-0.5 rounded-md font-semibold">
                          {m.firstName} {m.lastName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 bg-stone-100 hover:bg-forest-50 text-forest-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download / View</span>
                </a>

                <button
                  onClick={() => deleteDocument(doc.id)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg"
                  title="Remove Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Upload Document Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-serif font-bold text-base text-stone-900">Upload Historical Record</h3>
              <button onClick={() => setIsUploadOpen(false)} className="p-1 rounded-full text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1945 Church Marriage Registration Record"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs rounded-xl border border-stone-300 p-2.5 capitalize"
                  >
                    <option value="birth_certificate">Birth Certificate</option>
                    <option value="marriage_certificate">Marriage Certificate</option>
                    <option value="legal">Legal & Deed</option>
                    <option value="school_record">School Diploma</option>
                    <option value="letter">Old Letter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Date on Document</label>
                  <input
                    type="date"
                    value={dateOfDocument}
                    onChange={(e) => setDateOfDocument(e.target.value)}
                    className="w-full text-xs rounded-xl border border-stone-300 p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">File Name</label>
                <input
                  type="text"
                  placeholder="Marriage_Certificate_1945.pdf"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Archival notes, registry location, certificate numbers..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Link to Relative</label>
                <select
                  multiple
                  value={linkedMemberIds}
                  onChange={(e) => setLinkedMemberIds(Array.from(e.target.selectedOptions, option => option.value))}
                  className="w-full text-xs rounded-xl border border-stone-300 p-2 h-24"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>
                  ))}
                </select>
                <span className="text-[10px] text-stone-400">Hold Ctrl/Cmd to select multiple relatives</span>
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
                  Upload & Archive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
