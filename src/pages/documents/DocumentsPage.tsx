import React, { useState, useMemo } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { useAuth } from '../../context/AuthContext';
import { useFamilyAccess } from '../../hooks/useFamilyAccess';
import { uploadFamilyFile } from '../../services/storage';
import { 
  FileText, 
  Plus, 
  Download, 
  Trash2, 
  Search, 
  X, 
  Filter 
} from 'lucide-react';
import { Document } from '../../types';
import { SelectDropdown, SelectOption } from '../../components/ui/Dropdown';

const documentCategoryOptions: SelectOption[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'birth_certificate', label: 'Birth Certificates' },
  { value: 'marriage_certificate', label: 'Marriage Certificates' },
  { value: 'legal', label: 'Legal & Land Deeds' },
  { value: 'school_record', label: 'School & Degrees' },
  { value: 'letter', label: 'Historical Letters' }
];

const uploadCategoryOptions: SelectOption[] = [
  { value: 'birth_certificate', label: 'Birth Certificate' },
  { value: 'marriage_certificate', label: 'Marriage Certificate' },
  { value: 'legal', label: 'Legal & Deed' },
  { value: 'school_record', label: 'School Diploma' },
  { value: 'letter', label: 'Old Letter' }
];

export const DocumentsPage: React.FC = () => {
  const { family, documents, members, addDocument, deleteDocument } = useFamily();
  const { user, firebaseUser } = useAuth();
  const { canUploadMedia } = useFamilyAccess();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Document['category']>('birth_certificate');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [dateOfDocument, setDateOfDocument] = useState('');
  const [linkedMemberIds, setLinkedMemberIds] = useState<string[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const filteredDocs = useMemo(() => {
    return documents.filter(d => {
      const matchCat = selectedCategory === 'all' || d.category === selectedCategory;
      const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) || 
                          (d.description && d.description.toLowerCase().includes(search.toLowerCase())) ||
                          d.fileName.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [documents, selectedCategory, search]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setUploading(true);
    try {
      let fileUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
      let resolvedFileName = fileName || 'Archive_Record.pdf';
      let resolvedFileSize = fileSize || '1.2 MB';
      let resolvedFileType = 'application/pdf';

      if (uploadFile) {
        resolvedFileName = uploadFile.name;
        resolvedFileSize = `${(uploadFile.size / (1024 * 1024)).toFixed(1)} MB`;
        resolvedFileType = uploadFile.type || 'application/octet-stream';
        if (firebaseUser) {
          try {
            fileUrl = await uploadFamilyFile(firebaseUser.uid, family.id, 'documents', uploadFile);
          } catch (uploadErr) {
            console.warn('Storage upload error, using local fallback:', uploadErr);
            fileUrl = URL.createObjectURL(uploadFile);
          }
        } else {
          fileUrl = URL.createObjectURL(uploadFile);
        }
      }

      addDocument({
        title,
        category,
        description: description || undefined,
        fileUrl,
        fileName: resolvedFileName,
        fileSize: resolvedFileSize,
        fileType: resolvedFileType,
        dateOfDocument: dateOfDocument || undefined,
        linkedMemberIds,
        uploadedBy: user?.displayName || 'Family Historian'
      });

      setTitle('');
      setDescription('');
      setFileName('');
      setFileSize('');
      setDateOfDocument('');
      setUploadFile(null);
      setLinkedMemberIds([]);
      setIsUploadOpen(false);
    } catch (err) {
      console.error('Failed to upload document:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-transparent dark:border-purple-800/50 text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Official Certificates & Historical Records</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
            Heritage Documents & Archives
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-2xl mt-1">
            Store and preserve birth certificates, marriage registries, land deeds, and old letters linked to family members.
          </p>
        </div>

        {canUploadMedia && (
        <button
          onClick={() => setIsUploadOpen(true)}
          className="px-4 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 active:scale-95 self-start sm:self-center"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload Document</span>
        </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-soft flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search document title, description or file name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 p-2.5 focus:border-forest-500 focus:ring-forest-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <SelectDropdown
            options={documentCategoryOptions}
            value={selectedCategory}
            onChange={setSelectedCategory}
            icon={<Filter className="w-3.5 h-3.5" />}
            size="md"
            menuWidth="w-56"
          />
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocs.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-500 space-y-2">
          <FileText className="w-8 h-8 mx-auto text-stone-300 dark:text-stone-600" />
          <p className="text-xs">No documents uploaded in this category yet. Upload deeds, certificates, and historical letters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => {
          const linkedMembers = members.filter(m => doc.linkedMemberIds.includes(m.id));

          return (
            <div
              key={doc.id}
              className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-soft hover:shadow-elevated transition flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-300 flex items-center justify-center flex-shrink-0 border border-forest-200 dark:border-forest-800">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                    {doc.category.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 group-hover:text-forest-700 dark:group-hover:text-forest-400 leading-snug">
                    {doc.title}
                  </h3>
                  {doc.description && (
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                      {doc.description}
                    </p>
                  )}
                </div>

                {/* Metadata */}
                <div className="space-y-1 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-400 dark:text-stone-500 font-mono text-[11px]">
                  <div>File: {doc.fileName} ({doc.fileSize})</div>
                  {doc.dateOfDocument && <div>Date: {doc.dateOfDocument}</div>}
                </div>

                {/* Linked Relatives */}
                {linkedMembers.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 block mb-1">
                      Linked Relatives
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {linkedMembers.map(m => (
                        <span key={m.id} className="text-[11px] bg-forest-50 dark:bg-forest-950 text-forest-800 dark:text-forest-300 px-2 py-0.5 rounded-md font-semibold border border-forest-100 dark:border-forest-800/40">
                          {m.firstName} {m.lastName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-forest-50 dark:hover:bg-forest-950 text-forest-800 dark:text-forest-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border border-transparent dark:border-stone-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download / View</span>
                </a>

                <button
                  onClick={() => deleteDocument(doc.id)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition"
                  title="Remove Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>
      )}

      {/* Upload Document Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-stone-200 dark:border-stone-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">Upload Historical Record</h3>
              <button onClick={() => setIsUploadOpen(false)} className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1945 Church Marriage Registration Record"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 p-2.5 focus:ring-forest-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">Category</label>
                  <SelectDropdown
                    options={uploadCategoryOptions}
                    value={category}
                    onChange={(val) => setCategory(val as any)}
                    fullWidth
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Date on Document</label>
                  <input
                    type="date"
                    value={dateOfDocument}
                    onChange={(e) => setDateOfDocument(e.target.value)}
                    className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-2.5 focus:ring-forest-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Document File</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setUploadFile(file);
                    if (file) setFileName(file.name);
                  }}
                  className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-2.5 file:mr-3 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-forest-50 dark:file:bg-forest-950 file:text-forest-800 dark:file:text-forest-300 file:text-xs file:font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">File Name</label>
                <input
                  type="text"
                  placeholder="Marriage_Certificate_1945.pdf"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 p-2.5 focus:ring-forest-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Archival notes, registry location, certificate numbers..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 p-2.5 focus:ring-forest-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">Link to Relatives</label>
                <div className="max-h-32 overflow-y-auto p-2 border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 rounded-xl flex flex-wrap gap-1.5">
                  {members.map(m => {
                    const isSelected = linkedMemberIds.includes(m.id);
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => {
                          if (isSelected) {
                            setLinkedMemberIds(linkedMemberIds.filter(id => id !== m.id));
                          } else {
                            setLinkedMemberIds([...linkedMemberIds, m.id]);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                          isSelected
                            ? 'bg-forest-700 text-white shadow-xs'
                            : 'bg-stone-100 dark:bg-stone-700/60 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                        }`}
                      >
                        <span>{m.firstName} {m.lastName}</span>
                        {isSelected && <span className="text-[10px]">✕</span>}
                      </button>
                    );
                  })}
                </div>
                <span className="text-[10px] text-stone-400 dark:text-stone-500 mt-1 block">Click names to tag or remove relatives from this document</span>
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
                  {uploading ? 'Uploading...' : 'Upload & Archive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
