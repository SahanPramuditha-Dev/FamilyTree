import React, { useState, useRef } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { exportToGEDCOM, downloadFile } from '../../utils/gedcom';
import { 
  Download, 
  Printer, 
  FileCode, 
  FileSpreadsheet, 
  FileText, 
  Check, 
  Sparkles, 
  Trees, 
  Layers,
  Eye
} from 'lucide-react';

export const ExportPrintPage: React.FC = () => {
  const { family, members, branches } = useFamily();
  const printPosterRef = useRef<HTMLDivElement>(null);

  const [paperFormat, setPaperFormat] = useState<'A4' | 'A3' | 'Poster'>('A3');
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

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

  const showSuccess = (name: string) => {
    setDownloadSuccess(name);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
          <Download className="w-3.5 h-3.5 text-emerald-600" />
          <span>Archival Export & Poster Studio</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
          Export & Print Family Tree
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-2xl mt-1">
          Generate archival GEDCOM 5.5 files for genealogy software or format beautiful high-resolution printable family tree posters.
        </p>
      </div>

      {downloadSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Successfully exported {downloadSuccess} archive! Check your browser downloads.</span>
        </div>
      )}

      {/* Export Formats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* GEDCOM 5.5 */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-soft hover:shadow-elevated transition space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center">
              <FileCode className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-2 py-0.5 rounded-full">
                Industry Standard
              </span>
              <h3 className="font-serif font-bold text-lg text-stone-900 mt-1">GEDCOM 5.5 File</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Standard genealogical lineage format. Compatible with Ancestry, MyHeritage, FamilySearch, and desktop genealogy engines.
            </p>
          </div>

          <button
            onClick={handleExportGEDCOM}
            className="w-full py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .GED File</span>
          </button>
        </div>

        {/* JSON Archive */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-soft hover:shadow-elevated transition space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                Complete Backup
              </span>
              <h3 className="font-serif font-bold text-lg text-stone-900 mt-1">JSON Full Archive</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Complete raw structured data including branch definitions, relationship matrix, vital dates, and metadata.
            </p>
          </div>

          <button
            onClick={handleExportJSON}
            className="w-full py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .JSON Backup</span>
          </button>
        </div>

        {/* CSV Spreadsheet */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-soft hover:shadow-elevated transition space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                Spreadsheet
              </span>
              <h3 className="font-serif font-bold text-lg text-stone-900 mt-1">CSV Members Table</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Export all family member records into Microsoft Excel, Google Sheets, or Numbers for statistical review.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="w-full py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .CSV Table</span>
          </button>
        </div>

      </div>

      {/* Poster Print Studio Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif font-bold text-xl text-stone-900 flex items-center gap-2">
              <Printer className="w-5 h-5 text-forest-700" />
              <span>Printable Wall Poster Studio</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Format a museum-grade heirloom family tree poster suitable for framing and physical print.
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="px-6 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print Heirloom Poster</span>
          </button>
        </div>

        {/* Poster Options */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-700">Format:</span>
            <select
              value={paperFormat}
              onChange={(e) => setPaperFormat(e.target.value as any)}
              className="p-1.5 rounded-lg border border-stone-300 bg-white font-medium"
            >
              <option value="A4">A4 Standard Sheet</option>
              <option value="A3">A3 Presentation Frame</option>
              <option value="Poster">Large Wall Poster</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-700">Orientation:</span>
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value as any)}
              className="p-1.5 rounded-lg border border-stone-300 bg-white font-medium"
            >
              <option value="landscape">Landscape (Recommended)</option>
              <option value="portrait">Portrait</option>
            </select>
          </div>
        </div>

        {/* Live Poster Preview Canvas */}
        <div 
          ref={printPosterRef}
          className="p-8 sm:p-12 rounded-3xl bg-sepia-50 border-4 border-sepia-300 shadow-inner space-y-8 print:p-0 print:border-none"
        >
          {/* Poster Header */}
          <div className="text-center space-y-2 border-b-2 border-sepia-300 pb-6">
            <div className="w-12 h-12 rounded-2xl bg-forest-900 text-white flex items-center justify-center mx-auto mb-2 shadow">
              <Trees className="w-6 h-6 text-forest-200" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-sepia-900 tracking-tight">
              {family.name}
            </h2>
            <p className="text-xs text-sepia-700 italic max-w-xl mx-auto font-serif">
              "{family.motto || 'Preserving the heritage of our ancestors for generations to come'}"
            </p>
            <div className="text-[11px] font-mono text-sepia-600 pt-1">
              Established: {family.foundedYear || '1918'} • Origin: {family.originCountry}
            </div>
          </div>

          {/* Generational Tree Hierarchy Chart */}
          <div className="space-y-8">
            {[1, 2, 3, 4].map(gen => {
              const genMembers = members.filter(m => m.generation === gen);
              if (genMembers.length === 0) return null;

              return (
                <div key={gen} className="space-y-3">
                  <div className="text-center">
                    <span className="text-[11px] font-serif font-bold uppercase tracking-widest text-sepia-800 bg-sepia-200/60 px-3 py-1 rounded-full border border-sepia-300">
                      Generation {gen} {gen === 1 ? '— Lineage Founders' : gen === 2 ? '— Elders & Parents' : ''}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {genMembers.map(m => (
                      <div
                        key={m.id}
                        className="w-48 p-3 rounded-2xl bg-white border border-sepia-300 shadow-xs text-center space-y-1"
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
          <div className="pt-8 border-t-2 border-sepia-300 flex items-center justify-between text-[10px] text-sepia-600 font-serif">
            <span>Archived with FamilyTree Heritage Studio</span>
            <span>Certified Genealogy Record</span>
          </div>

        </div>

      </div>

    </div>
  );
};
