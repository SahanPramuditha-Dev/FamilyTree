import React, { useState, useEffect } from 'react';
import { MigrationEvent, MigrationReason, LocationDetails, FamilyMember } from '../../types';
import { LocationSelector } from '../common/LocationSelector';
import { MIGRATION_REASONS, getMigrationMeta } from '../../utils/migrationRegistry';
import { createLocationDetails } from '../../utils/locationResolver';
import { X, Plane, Plus, MapPin, Calendar, FileText, Check } from 'lucide-react';

export interface AddMigrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: FamilyMember;
  onSaveMigration: (event: MigrationEvent) => void;
  editingMigration?: MigrationEvent;
}

export const AddMigrationModal: React.FC<AddMigrationModalProps> = ({
  isOpen,
  onClose,
  member,
  onSaveMigration,
  editingMigration
}) => {
  const defaultOrigin = member.birthPlaceDetails || (member.birthPlace ? createLocationDetails({ countryCode: 'LK', locality: member.birthPlace }) : createLocationDetails({ countryCode: 'LK' }));
  const defaultDestination = member.currentLocationDetails || createLocationDetails({ countryCode: 'LK' });

  const [fromLocation, setFromLocation] = useState<LocationDetails>(editingMigration?.fromLocation || defaultOrigin);
  const [toLocation, setToLocation] = useState<LocationDetails>(editingMigration?.toLocation || defaultDestination);
  const [year, setYear] = useState<number>(editingMigration?.year || new Date().getFullYear());
  const [reason, setReason] = useState<MigrationReason>(editingMigration?.reason || 'career');
  const [notes, setNotes] = useState<string>(editingMigration?.notes || '');

  useEffect(() => {
    if (isOpen) {
      if (editingMigration) {
        setFromLocation(editingMigration.fromLocation);
        setToLocation(editingMigration.toLocation);
        setYear(editingMigration.year || new Date().getFullYear());
        setReason(editingMigration.reason);
        setNotes(editingMigration.notes || '');
      } else {
        setFromLocation(defaultOrigin);
        setToLocation(defaultDestination);
        setYear(new Date().getFullYear());
        setReason('career');
        setNotes('');
      }
    }
  }, [isOpen, editingMigration]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const event: MigrationEvent = {
      id: editingMigration?.id || `mig-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      year: Number(year) || undefined,
      fromLocation,
      toLocation,
      reason,
      notes: notes.trim() || undefined
    };
    onSaveMigration(event);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl max-w-xl w-full flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-850/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                {editingMigration ? 'Edit Migration Milestone' : 'Record Life Relocation'}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Document geographical movement for <strong>{member.firstName} {member.lastName}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* Year */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              <span>Year of Relocation</span>
            </label>
            <input
              type="number"
              min={1800}
              max={2100}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              required
              className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-2.5 shadow-xs focus:ring-forest-500 font-mono font-bold"
            />
          </div>

          {/* Reason for Movement */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              Reason for Movement / Relocation
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.values(MIGRATION_REASONS).map((meta) => {
                const isSelected = reason === meta.reason;
                return (
                  <button
                    key={meta.reason}
                    type="button"
                    onClick={() => setReason(meta.reason)}
                    className={`p-3 rounded-2xl border text-left text-xs transition flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'border-emerald-600 dark:border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/40 text-stone-900 dark:text-stone-100 font-bold'
                        : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div className="p-1.5 rounded-xl bg-stone-100 dark:bg-stone-700/60 w-fit">
                      {meta.icon}
                    </div>
                    <span className="text-[11px] leading-tight block">{meta.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Origin Location */}
          <div className="p-3.5 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 block">
              1. Moving From (Origin)
            </span>
            <LocationSelector
              value={fromLocation}
              onChange={setFromLocation}
              required
            />
          </div>

          {/* Destination Location */}
          <div className="p-3.5 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 block">
              2. Moving To (Destination)
            </span>
            <LocationSelector
              value={toLocation}
              onChange={setToLocation}
              required
            />
          </div>

          {/* Notes / Narrative */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-stone-400" />
              <span>Historical Context & Family Notes (Optional)</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Moved to establish new family residence / career transfer..."
              className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-2.5 shadow-xs focus:ring-forest-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold bg-forest-700 hover:bg-forest-800 dark:bg-forest-600 dark:hover:bg-forest-500 text-white rounded-xl shadow-md transition flex items-center gap-1.5 active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Save Migration Record</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
