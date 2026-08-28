import React, { useState, useRef } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { useFamilyAccess } from '../../hooks/useFamilyAccess';
import { exportToGEDCOM, downloadFile, parseGEDCOM, parseJSONArchive } from '../../utils/gedcom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { 
  Download, 
  Printer, 
  FileCode, 
  FileSpreadsheet, 
  FileText, 
  Check, 
  Trees, 
  Upload,
  AlertTriangle,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { SelectDropdown, SelectOption } from '../../components/ui/Dropdown';
import { MemoirBookModal } from '../../components/export/MemoirBookModal';

const formatOptions: SelectOption[] = [
  { value: 'A4', label: 'A4 Standard Sheet' },
  { value: 'A3', label: 'A3 Presentation Frame' },
  { value: 'Poster', label: 'Large Wall Poster' }
];

const orientationOptions: SelectOption[] = [
  { value: 'landscape', label: 'Landscape (Recommended)' },
  { value: 'portrait', label: 'Portrait' }
];

export const ExportPrintPage: React.FC = () => {
  const { family, members, branches, photos, stories, importTreeData } = useFamily();
  const { canManageFamily } = useFamilyAccess();
  const printPosterRef = useRef<HTMLDivElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  const [paperFormat, setPaperFormat] = useState<'A4' | 'A3' | 'Poster'>('A3');
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importWarnings, setImportWarnings] = useState<string[]>([]);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [isMemoirOpen, setIsMemoirOpen] = useState(false);

  const posterMembers = selectedBranch === 'all'
    ? members
    : members.filter(m => m.branchId === selectedBranch);

  const handleExportGEDCOM = () => {
    const gedcomStr = exportToGEDCOM(family, members);
    const filename = `${family.name.replace(/\s+/g, '_')}_Genealogy.ged`;
    downloadFile(gedcomStr, filename, 'text/plain');
    showSuccess('GEDCOM 5.5');
  };

  const handleExportJSON = () => {
    const payload = {
      family,
      members,
      branches,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    downloadFile(JSON.stringify(payload, null, 2), `${family.name.replace(/\s+/g, '_')}_Archive.json`, 'application/json');
    showSuccess('JSON Database');
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'FirstName', 'LastName', 'MaidenName', 'Gender', 'BirthDate', 'BirthPlace', 'DeathDate', 'DeathPlace', 'Generation', 'Occupation', 'Branch'];
    const rows = members.map(m => [
      m.id,
      `"${m.firstName}"`,
      `"${m.lastName}"`,
      `"${m.maidenName || ''}"`,
      m.gender,
      m.birthDate || '',
      `"${m.birthPlace || ''}"`,
      m.deathDate || '',
      `"${m.deathPlace || ''}"`,
      m.generation,
      `"${m.occupation || ''}"`,
      `"${m.branchId || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadFile(csvContent, `${family.name.replace(/\s+/g, '_')}_Members.csv`, 'text/csv');
    showSuccess('CSV Spreadsheet');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    if (!printPosterRef.current) return;
    setExportingPdf(true);
    try {
      const canvas = await html2canvas(printPosterRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#faf7f2',
      });

      const pdf = new jsPDF({
        orientation: orientation === 'landscape' ? 'landscape' : 'portrait',
        unit: 'mm',
        format: paperFormat === 'A4' ? 'a4' : paperFormat === 'A3' ? 'a3' : [420, 297],
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      const imgRatio = canvas.width / canvas.height;
      let renderWidth = pageWidth - 16;
      let renderHeight = renderWidth / imgRatio;

      if (renderHeight > pageHeight - 16) {
        renderHeight = pageHeight - 16;
        renderWidth = renderHeight * imgRatio;
      }

      pdf.addImage(imgData, 'JPEG', 8, 8, renderWidth, renderHeight);
      pdf.save(`${family.name.replace(/\s+/g, '_')}_Poster.pdf`);
      showSuccess('PDF Poster');
    } catch {
      setImportError('PDF export failed. Try using Print instead.');
    } finally {
      setExportingPdf(false);
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportWarnings([]);

    if (!canManageFamily) {
      setImportError('You do not have permission to import tree data.');
      e.target.value = '';
      return;
    }

    const replaceExisting = window.confirm(
      `Import "${file.name}"? This will replace your current member records.`
    );
    if (!replaceExisting) {
      e.target.value = '';
      return;
    }

    try {
      const content = await file.text();
      const ext = file.name.toLowerCase();

      if (ext.endsWith('.ged') || ext.endsWith('.gedcom')) {
        const result = parseGEDCOM(content, family.id);
        importTreeData(result.members, result.familyName ? { name: result.familyName } : undefined);
        setImportWarnings(result.warnings.slice(0, 5));
        showSuccess(`GEDCOM Import (${result.members.length} members)`);
      } else if (ext.endsWith('.json')) {
        const archive = parseJSONArchive(content);
        importTreeData(archive.members, archive.family);
        showSuccess(`JSON Import (${archive.members.length} members)`);
      } else {
        setImportError('Unsupported file type. Use .ged, .gedcom, or .json.');
      }
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Import failed. Check the file format.');
    } finally {
      e.target.value = '';
    }
  };

  const showSuccess = (name: string) => {
    setDownloadSuccess(name);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-transparent dark:border-emerald-800/50 text-xs font-semibold mb-2">
          <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Archival Export & Poster Studio</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
          Export & Print Family Tree
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-2xl mt-1">
          Generate archival GEDCOM 5.5 files for genealogy software or format beautiful high-resolution printable family tree posters.
        </p>
      </div>

      {downloadSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Successfully exported {downloadSuccess} archive! Check your browser downloads.</span>
        </div>
      )}

      {importError && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>{importError}</span>
        </div>
      )}

      {importWarnings.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs space-y-1">
          <p className="font-semibold">Import completed with warnings:</p>
          <ul className="list-disc pl-4 space-y-0.5">
            {importWarnings.map((warning, i) => (
              <li key={i}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Import Section */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Upload className="w-5 h-5 text-forest-700 dark:text-forest-400" />
              <span>Import Family Tree Data</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Restore from a GEDCOM 5.5 file or a JSON backup exported from FamilyTree.
            </p>
          </div>
          {canManageFamily && (
            <>
              <input
                ref={importInputRef}
                type="file"
                accept=".ged,.gedcom,.json"
                className="hidden"
                onChange={handleImportFile}
              />
              <button
                onClick={() => importInputRef.current?.click()}
                className="px-5 py-2.5 bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2 self-start active:scale-95"
              >
                <Upload className="w-4 h-4" />
                <span>Choose Import File</span>
              </button>
            </>
          )}
        </div>
        {!canManageFamily && (
          <p className="text-xs text-stone-500 dark:text-stone-400">
            You have view-only access. Contact a family owner or admin to import tree data.
          </p>
        )}
      </div>

      {/* Export Formats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Hardcover Memoir Book */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/40 dark:from-stone-900 dark:to-stone-850 rounded-3xl p-6 border border-amber-200/80 dark:border-amber-900/40 shadow-soft hover:shadow-elevated transition space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-200/60 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-300/40">
                Print Book Edition
              </span>
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 mt-1">Family Memoir Book</h3>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Multi-page printable digital book complete with front cover, biographies, portraits, and written memoirs.
            </p>
          </div>

          <button
            onClick={() => setIsMemoirOpen(true)}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center justify-center gap-2 active:scale-95"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Open Book Studio</span>
          </button>
        </div>

        {/* GEDCOM 5.5 */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-soft hover:shadow-elevated transition space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-300 flex items-center justify-center border border-forest-200 dark:border-forest-800">
              <FileCode className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700 dark:text-forest-300 bg-forest-50 dark:bg-forest-950/80 px-2 py-0.5 rounded-full border border-forest-200 dark:border-forest-800/40">
                Industry Standard
              </span>
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 mt-1">GEDCOM 5.5 File</h3>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Standard genealogical lineage format. Compatible with Ancestry, MyHeritage, FamilySearch, and desktop genealogy engines.
            </p>
          </div>

          <button
            onClick={handleExportGEDCOM}
            className="w-full py-2.5 bg-forest-700 hover:bg-forest-800 dark:bg-forest-600 dark:hover:bg-forest-500 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-2 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .GED File</span>
          </button>
        </div>

        {/* JSON Archive */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-soft hover:shadow-elevated transition space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 flex items-center justify-center border border-blue-200 dark:border-blue-800">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800/40">
                Complete Backup
              </span>
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 mt-1">JSON Full Archive</h3>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Complete raw structured data including branch definitions, relationship matrix, vital dates, and metadata.
            </p>
          </div>

          <button
            onClick={handleExportJSON}
            className="w-full py-2.5 bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-2 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .JSON Backup</span>
          </button>
        </div>

        {/* CSV Spreadsheet */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-soft hover:shadow-elevated transition space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-300 flex items-center justify-center border border-stone-200 dark:border-stone-700">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-800 px-2 py-0.5 rounded-full border border-stone-200 dark:border-stone-700">
                Spreadsheet
              </span>
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 mt-1">CSV Members Table</h3>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Export all family member records into Microsoft Excel, Google Sheets, or Numbers for statistical review.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="w-full py-2.5 bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-2 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .CSV Table</span>
          </button>
        </div>

      </div>

      {/* Poster Print Studio Section */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Printer className="w-5 h-5 text-forest-700 dark:text-forest-400" />
              <span>Printable Wall Poster Studio</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Format a museum-grade heirloom family tree poster suitable for framing and physical print.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-6 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print Heirloom Poster</span>
            </button>
            <button
              onClick={handleExportPDF}
              disabled={exportingPdf}
              className="px-6 py-2.5 bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{exportingPdf ? 'Generating PDF...' : 'Download PDF Poster'}</span>
            </button>
          </div>
        </div>

        {/* Poster Options */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-700 dark:text-stone-300">Branch:</span>
            <SelectDropdown
              options={[
                { value: 'all', label: 'All Branches' },
                ...branches.map(b => ({ value: b.id, label: b.name }))
              ]}
              value={selectedBranch}
              onChange={setSelectedBranch}
              size="sm"
              menuWidth="w-48"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-700 dark:text-stone-300">Format:</span>
            <SelectDropdown
              options={formatOptions}
              value={paperFormat}
              onChange={(val) => setPaperFormat(val as any)}
              size="sm"
              menuWidth="w-48"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-700 dark:text-stone-300">Orientation:</span>
            <SelectDropdown
              options={orientationOptions}
              value={orientation}
              onChange={(val) => setOrientation(val as any)}
              size="sm"
              menuWidth="w-56"
            />
          </div>
        </div>

        {/* Live Poster Preview Canvas */}
        <div 
          ref={printPosterRef}
          className="p-8 sm:p-12 rounded-3xl bg-[#faf7f2] border-4 border-[#e6decb] shadow-inner space-y-8 print:p-0 print:border-none text-stone-900"
        >
          {/* Poster Header */}
          <div className="text-center space-y-2 border-b-2 border-[#e6decb] pb-6">
            <div className="w-12 h-12 rounded-2xl bg-forest-900 text-white flex items-center justify-center mx-auto mb-2 shadow">
              <Trees className="w-6 h-6 text-forest-200" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              {family.name}
            </h2>
            <p className="text-xs text-stone-700 italic max-w-xl mx-auto font-serif">
              "{family.motto || 'Preserving the heritage of our ancestors for generations to come'}"
            </p>
            <div className="text-[11px] font-mono text-stone-600 pt-1">
              {family.foundedYear ? `Established: ${family.foundedYear} • ` : ''}Origin: {family.originCountry}
            </div>
          </div>

          {/* Generational Tree Hierarchy Chart */}
          <div className="space-y-8">
            {[1, 2, 3, 4].map(gen => {
              const genMembers = posterMembers.filter(m => m.generation === gen);
              if (genMembers.length === 0) return null;

              return (
                <div key={gen} className="space-y-3">
                  <div className="text-center">
                    <span className="text-[11px] font-serif font-bold uppercase tracking-widest text-stone-800 bg-[#ede4d3] px-3 py-1 rounded-full border border-[#d8cdb8]">
                      Generation {gen} {gen === 1 ? '— Lineage Founders' : gen === 2 ? '— Elders & Parents' : ''}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {genMembers.map(m => (
                      <div
                        key={m.id}
                        className="w-48 p-3 rounded-2xl bg-white border border-[#e6decb] shadow-xs text-center space-y-1"
                      >
                        <h4 className="font-serif font-bold text-xs text-stone-900 truncate">
                          {m.firstName} {m.lastName}
                        </h4>
                        <p className="text-[10px] text-stone-500 font-mono">
                          {m.birthDate ? m.birthDate.split('-')[0] : '?'} – {m.isLiving ? 'Present' : (m.deathDate ? m.deathDate.split('-')[0] : '✝')}
                        </p>
                        {m.occupation && (
                          <p className="text-[10px] text-stone-600 truncate">{m.occupation}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Poster Footer Stamp */}
          <div className="pt-8 border-t-2 border-[#e6decb] flex items-center justify-between text-[10px] text-stone-600 font-serif">
            <span>Archived with FamilyTree Heritage Studio</span>
            <span>Certified Genealogy Record</span>
          </div>

        </div>

      </div>

      {/* Hardcover Memoir Book Modal */}
      <MemoirBookModal
        isOpen={isMemoirOpen}
        onClose={() => setIsMemoirOpen(false)}
        family={family}
        members={members}
        branches={branches}
        photos={photos}
        stories={stories}
      />

    </div>
  );
};
