import React, { useState, useRef, useMemo } from 'react';
import { Family, FamilyMember, Branch, Photo, Story } from '../../types';
import { generateAIBiography } from '../../services/aiBiographer';
import { 
  BookOpen, 
  Download, 
  Printer, 
  X, 
  Sparkles, 
  Shield, 
  MapPin, 
  Heart, 
  Calendar, 
  Users, 
  Image as ImageIcon,
  Check
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export interface MemoirBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  family: Family;
  members: FamilyMember[];
  branches: Branch[];
  photos: Photo[];
  stories: Story[];
}

export const MemoirBookModal: React.FC<MemoirBookModalProps> = ({
  isOpen,
  onClose,
  family,
  members,
  branches,
  photos,
  stories
}) => {
  const bookContainerRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Group members chronologically by generation
  const generationGroups = useMemo(() => {
    const map = new Map<number, FamilyMember[]>();
    members.forEach(m => {
      const g = m.generation || 1;
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(m);
    });
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [members]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    if (!bookContainerRef.current) return;
    setGenerating(true);

    try {
      const canvas = await html2canvas(bookContainerRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#fbf9f5'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = pdfWidth / imgWidth;
      const totalPdfHeight = imgHeight * ratio;

      let heightLeft = totalPdfHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, totalPdfHeight);
      heightLeft -= pdfHeight;

      // Subsequent pages if long
      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, totalPdfHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${family.name.replace(/\s+/g, '_')}_Family_Memoir_Book.pdf`);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to generate Memoir PDF:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl max-w-5xl w-full flex flex-col max-h-[94vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-gradient-to-r from-forest-900 via-forest-850 to-forest-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-white">Hardcover Family Memoir Book</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-forest-950 text-[10px] font-bold uppercase">
                  Print Ready
                </span>
              </div>
              <p className="text-xs text-forest-200">
                Printable multi-page historical chronicle for <strong>{family.name}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-forest-800 hover:bg-forest-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border border-forest-600"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={handleExportPDF}
              disabled={generating}
              className="px-4 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-forest-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow disabled:opacity-50"
            >
              {generating ? (
                <span>Generating Book...</span>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-forest-900" />
                  <span>PDF Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Book</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-forest-300 hover:text-white rounded-xl hover:bg-forest-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Book Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-stone-100 dark:bg-stone-950 flex justify-center">
          
          <div
            ref={bookContainerRef}
            className="w-full max-w-3xl bg-[#fcfaf7] text-stone-900 shadow-xl border-4 border-[#e9e2d3] rounded-2xl p-8 sm:p-12 space-y-12 select-text"
          >
            
            {/* FRONT COVER */}
            <div className="text-center py-16 border-b-2 border-[#dcd4c0] space-y-6">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-forest-800 text-amber-300 flex items-center justify-center shadow-lg border-2 border-amber-300/40">
                <Shield className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest font-bold text-stone-500 font-serif">
                  The Complete Genealogical Chronicle & Heritage Archive
                </span>
                <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight">
                  {family.name}
                </h1>
                {(family.geName || family.geNameNative) && (
                  <p className="font-serif text-base sm:text-lg text-forest-800 font-semibold italic">
                    වාසගම: {family.geName} {family.geNameNative ? `(${family.geNameNative})` : ''}
                  </p>
                )}
                {family.motto && (
                  <p className="text-xs italic text-stone-600 font-serif">"{family.motto}"</p>
                )}
              </div>

              <div className="pt-6 flex justify-center gap-6 text-xs text-stone-500 font-mono">
                <span>{members.length} Chronicle Relatives</span>
                <span>•</span>
                <span>{generationGroups.length} Generations</span>
                <span>•</span>
                <span>Origin: {family.originCountry}</span>
              </div>
            </div>

            {/* CHAPTER 1: ANCESTRAL ORIGIN & PROCLAMATION */}
            <div className="space-y-4 pt-4 border-b border-[#e9e2d3] pb-8">
              <h2 className="font-serif font-bold text-xl text-forest-900 uppercase tracking-wide border-b border-forest-800/20 pb-1">
                Chapter I: Ancestral Lands & Foundations
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-stone-700 font-serif">
                {family.description || `This historical volume preserves the generational narrative of the ${family.name}, honoring our ancestors whose resilience, devotion, and character paved the path for all who follow.`}
              </p>

              {family.ancestralEstate && (
                <div className="p-4 bg-[#f4eee1] rounded-xl border border-[#ded4be] text-xs font-serif space-y-1">
                  <span className="font-bold text-stone-900 block">Ancestral Seat (මහ ගෙදර / Walauwa):</span>
                  <p className="text-stone-700">{family.ancestralEstate}</p>
                </div>
              )}
            </div>

            {/* CHAPTER 2: INDIVIDUAL BIOGRAPHICAL CHRONICLES */}
            <div className="space-y-8 pt-4 border-b border-[#e9e2d3] pb-8">
              <h2 className="font-serif font-bold text-xl text-forest-900 uppercase tracking-wide border-b border-forest-800/20 pb-1">
                Chapter II: Lineage Biographies & Portraits
              </h2>

              {generationGroups.map(([gen, genMembers]) => (
                <div key={gen} className="space-y-6">
                  <div className="bg-[#ede5d5] px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-forest-950 font-serif">
                    Generation {gen} Descendants ({genMembers.length})
                  </div>

                  <div className="space-y-6">
                    {genMembers.map(m => {
                      const bio = generateAIBiography(m, members, 'warm');
                      return (
                        <div key={m.id} className="p-5 bg-white rounded-2xl border border-[#ded4be] space-y-3 shadow-2xs">
                          <div className="flex items-start gap-4">
                            {m.avatarUrl ? (
                              <img src={m.avatarUrl} alt="" className="w-16 h-16 rounded-xl object-cover border border-stone-300 flex-shrink-0" />
                            ) : (
                              <div className="w-16 h-16 rounded-xl bg-[#e5decb] text-forest-900 font-serif font-bold text-xl flex items-center justify-center flex-shrink-0">
                                {m.firstName.charAt(0)}
                              </div>
                            )}

                            <div className="space-y-1 flex-1">
                              <h3 className="font-serif font-bold text-base text-stone-900">
                                {m.firstName} {m.middleName ? `${m.middleName} ` : ''}{m.lastName}
                                {m.nameNative && <span className="text-forest-800 text-sm font-normal ml-1">({m.nameNative})</span>}
                              </h3>
                              <p className="text-[11px] text-stone-500 font-mono">
                                {m.birthDate || 'Unknown'} — {m.isLiving ? 'Present' : (m.deathDate || '✝')} • Gen {m.generation}
                                {m.occupation && ` • ${m.occupation}`}
                              </p>
                              {m.birthPlace && (
                                <p className="text-[11px] text-stone-600 font-serif">
                                  Birthplace: {m.birthPlace}
                                </p>
                              )}
                            </div>
                          </div>

                          <p className="text-xs leading-relaxed text-stone-700 font-serif whitespace-pre-line border-t border-stone-100 pt-2">
                            {m.biography || bio.narrative}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* CHAPTER 3: WRITTEN MEMORIES & ARCHIVES */}
            {stories.length > 0 && (
              <div className="space-y-6 pt-4 border-b border-[#e9e2d3] pb-8">
                <h2 className="font-serif font-bold text-xl text-forest-900 uppercase tracking-wide border-b border-forest-800/20 pb-1">
                  Chapter III: Living Memories & Stories
                </h2>

                <div className="space-y-4">
                  {stories.map(s => (
                    <div key={s.id} className="p-5 bg-white rounded-2xl border border-[#ded4be] space-y-2">
                      <h3 className="font-serif font-bold text-base text-stone-900">{s.title}</h3>
                      <p className="text-[10px] text-stone-500 font-mono">Chronicled by {s.authorName} • {s.publicationDate}</p>
                      <p className="text-xs leading-relaxed text-stone-700 font-serif whitespace-pre-line">{s.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BACK COVER */}
            <div className="text-center py-12 space-y-3">
              <p className="font-serif italic text-xs text-stone-600">
                "A family that honors its roots nurtures blossoms that withstand all seasons."
              </p>
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 font-mono block">
                Preserved Forever in FamilyTree Archives
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
