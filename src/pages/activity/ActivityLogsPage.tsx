import React from 'react';
import { useFamily } from '../../context/FamilyContext';
import { 
  History, 
  Clock
} from 'lucide-react';

export const ActivityLogsPage: React.FC = () => {
  const { activityLogs } = useFamily();

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'add_member':
        return <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-transparent dark:border-emerald-800">Added Member</span>;
      case 'edit_member':
        return <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full border border-transparent dark:border-blue-800">Updated Record</span>;
      case 'delete_member':
        return <span className="text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 px-2 py-0.5 rounded-full border border-transparent dark:border-rose-800">Deleted Member</span>;
      case 'add_photo':
        return <span className="text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded-full border border-transparent dark:border-purple-800">Uploaded Photo</span>;
      case 'create_story':
        return <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full border border-transparent dark:border-amber-800">Published Story</span>;
      case 'add_event':
        return <span className="text-[10px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded-full border border-transparent dark:border-teal-800">Created Event</span>;
      case 'upload_doc':
        return <span className="text-[10px] font-bold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 px-2 py-0.5 rounded-full border border-transparent dark:border-sky-800">Uploaded Document</span>;
      case 'join_family':
        return <span className="text-[10px] font-bold bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-300 px-2 py-0.5 rounded-full border border-transparent dark:border-forest-800">Joined Family</span>;
      case 'edit_settings':
        return <span className="text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-2 py-0.5 rounded-full border border-transparent dark:border-stone-700">Settings Changed</span>;
      default:
        return <span className="text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-2 py-0.5 rounded-full border border-transparent dark:border-stone-700">System Action</span>;
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 dark:bg-forest-950/60 text-forest-800 dark:text-forest-300 border border-transparent dark:border-forest-700/50 text-xs font-semibold mb-2">
          <History className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400" />
          <span>Audit Trail & Historical Changes</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
          Family Tree Activity & Change Logs
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-2xl mt-1">
          Complete transparent record of additions, modifications, and contributions made by family members.
        </p>
      </div>

      {/* Activity Logs Timeline */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-stone-100 dark:border-stone-800">
          <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-forest-700 dark:text-forest-400" />
            <span>Audit History ({activityLogs.length} Events)</span>
          </h3>
        </div>

        <div className="divide-y divide-stone-100 dark:divide-stone-800">
          {activityLogs.length === 0 ? (
            <div className="p-12 text-center text-stone-400 dark:text-stone-500 space-y-2">
              <Clock className="w-8 h-8 mx-auto text-stone-300 dark:text-stone-600" />
              <p className="text-xs">No activity logs recorded yet.</p>
            </div>
          ) : (
            activityLogs.map((log) => (
              <div key={log.id} className="p-5 flex items-start gap-4 hover:bg-stone-50 dark:hover:bg-stone-800/40 transition">
                <div className="w-10 h-10 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center font-bold flex-shrink-0 text-sm font-serif border border-stone-200 dark:border-stone-700">
                  {log.userName.charAt(0)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-xs text-stone-900 dark:text-stone-100">{log.userName}</span>
                    {getActionBadge(log.action)}
                    <span className="text-[10px] text-stone-400 dark:text-stone-500 font-mono">
                      {new Date(log.timestamp).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>

                  <p className="text-xs text-stone-700 dark:text-stone-300">
                    Target: <strong className="text-stone-900 dark:text-stone-100">{log.targetName}</strong>
                  </p>

                  {log.details && (
                    <p className="text-xs text-stone-500 dark:text-stone-400">{log.details}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
