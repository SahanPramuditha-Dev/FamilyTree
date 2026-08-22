import React from 'react';
import { useFamily } from '../../context/FamilyContext';
import { 
  History, 
  User, 
  FileText, 
  Image as ImageIcon, 
  BookOpen, 
  Calendar, 
  PlusCircle, 
  Edit, 
  Trash2,
  Clock
} from 'lucide-react';

export const ActivityLogsPage: React.FC = () => {
  const { activityLogs } = useFamily();

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'add_member':
        return <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Added Member</span>;
      case 'edit_member':
        return <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Updated Record</span>;
      case 'delete_member':
        return <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">Deleted Member</span>;
      case 'add_photo':
        return <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Uploaded Photo</span>;
      case 'create_story':
        return <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Published Story</span>;
      case 'add_event':
        return <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">Created Event</span>;
      default:
        return <span className="text-[10px] font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full">System Action</span>;
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold mb-2">
          <History className="w-3.5 h-3.5 text-forest-600" />
          <span>Audit Trail & Historical Changes</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
          Family Tree Activity & Change Logs
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-2xl mt-1">
          Complete transparent record of additions, modifications, and contributions made by family members.
        </p>
      </div>

      {/* Activity Logs Timeline */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-stone-100">
          <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-forest-700" />
            <span>Audit History ({activityLogs.length} Events)</span>
          </h3>
        </div>

        <div className="divide-y divide-stone-100">
          {activityLogs.map((log) => (
            <div key={log.id} className="p-5 flex items-start gap-4 hover:bg-stone-50 transition">
              <div className="w-10 h-10 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center font-bold flex-shrink-0 text-sm font-serif">
                {log.userName.charAt(0)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-xs text-stone-900">{log.userName}</span>
                  {getActionBadge(log.action)}
                  <span className="text-[10px] text-stone-400 font-mono">
                    {new Date(log.timestamp).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>

                <p className="text-xs text-stone-700">
                  Target: <strong className="text-stone-900">{log.targetName}</strong>
                </p>

                {log.details && (
                  <p className="text-xs text-stone-500">{log.details}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
