import React, { useState } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { 
  ShieldAlert, 
  Users, 
  Trees, 
  HardDrive, 
  Activity
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { family, members, photos, documents } = useFamily();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'families' | 'moderation'>('overview');

  // Sample admin user list
  const [usersList] = useState([
    { id: 'u1', name: 'Alex Johnson', email: 'alex@familytree.dev', role: 'Owner', status: 'Active', trees: 1, storage: '14.2 MB' },
    { id: 'u2', name: 'Dr. Robert Taylor', email: 'robert.taylor@example.com', role: 'Admin', status: 'Active', trees: 1, storage: '6.5 MB' },
    { id: 'u3', name: 'Sarah Williams', email: 'sarah.williams@example.co.uk', role: 'Editor', status: 'Active', trees: 1, storage: '22.1 MB' },
    { id: 'u4', name: 'Guest Explorer', email: 'guest@sample.com', role: 'Viewer', status: 'Active', trees: 0, storage: '0 MB' }
  ]);

  // Sample reported items
  const [reports, setReports] = useState([
    { id: 'rep-1', itemType: 'Photograph', title: 'Vintage Marriage Certificate Scan', reportedBy: 'David Miller', reason: 'Clarification on date spelling needed', status: 'Pending' }
  ]);

  const handleResolveReport = (repId: string) => {
    setReports(prev => prev.map(r => r.id === repId ? { ...r, status: 'Resolved' } : r));
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-transparent dark:border-amber-800/50 text-xs font-semibold mb-2">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>System Administration & Platform Governance</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
          Admin Control Center
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-2xl mt-1">
          Monitor system health, manage platform users, inspect storage utilization, and resolve genealogical moderation reports.
        </p>
      </div>

      {/* Admin Tab Selectors */}
      <div className="flex border-b border-stone-200 dark:border-stone-800 gap-6 overflow-x-auto">
        {[
          { key: 'overview', label: 'System Health & Metrics' },
          { key: 'users', label: 'User Directory & Permissions' },
          { key: 'families', label: 'Registered Families' },
          { key: 'moderation', label: 'Content Moderation Reports' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition whitespace-nowrap ${
              activeTab === tab.key 
                ? 'border-amber-600 text-amber-900 dark:text-amber-400 dark:border-amber-500' 
                : 'border-transparent text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-soft">
              <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
                <Users className="w-5 h-5 text-forest-700 dark:text-forest-400" />
              </div>
              <span className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100">{usersList.length}</span>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">100% Verified accounts</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-soft">
              <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total Lineages</span>
                <Trees className="w-5 h-5 text-blue-700 dark:text-blue-400" />
              </div>
              <span className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100">1 Family</span>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{members.length} Member Nodes</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-soft">
              <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Storage Usage</span>
                <HardDrive className="w-5 h-5 text-purple-700 dark:text-purple-400" />
              </div>
              <span className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100">42.8 MB</span>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{photos.length + documents.length} Media Assets</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-soft">
              <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">System Health</span>
                <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="font-serif text-2xl font-bold text-emerald-600 dark:text-emerald-400">99.98% Healthy</span>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Firebase Auth & DB Connected</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-stone-900 dark:bg-stone-950 text-white space-y-4 border border-transparent dark:border-stone-800">
            <h3 className="font-serif font-bold text-base">Platform Diagnostics & Service Endpoints</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-stone-950/70 dark:bg-stone-900/80 border border-stone-800">
                <span className="text-stone-400 block mb-1">Firebase Project</span>
                <span className="font-mono text-emerald-400 font-bold">familytree-6df76</span>
              </div>
              <div className="p-4 rounded-2xl bg-stone-950/70 dark:bg-stone-900/80 border border-stone-800">
                <span className="text-stone-400 block mb-1">Genealogy Graph Engine</span>
                <span className="font-mono text-emerald-400 font-bold">React Flow v12 + BFS</span>
              </div>
              <div className="p-4 rounded-2xl bg-stone-950/70 dark:bg-stone-900/80 border border-stone-800">
                <span className="text-stone-400 block mb-1">Database Standard</span>
                <span className="font-mono text-emerald-400 font-bold">GEDCOM 5.5 Spec</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-soft">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 uppercase font-semibold">
              <tr>
                <th className="p-4">User Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Storage Used</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-700 dark:text-stone-300">
              {usersList.map(u => (
                <tr key={u.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition">
                  <td className="p-4 font-bold text-stone-900 dark:text-stone-100">{u.name}</td>
                  <td className="p-4 text-stone-600 dark:text-stone-400">{u.email}</td>
                  <td className="p-4"><span className="px-2 py-0.5 rounded-full bg-forest-50 dark:bg-forest-950 text-forest-800 dark:text-forest-300 font-bold text-[10px] border border-forest-200 dark:border-forest-800">{u.role}</span></td>
                  <td className="p-4 font-mono">{u.storage}</td>
                  <td className="p-4"><span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">{u.status}</span></td>
                  <td className="p-4 text-right">
                    <button className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs mr-3">Reset Pass</button>
                    <button className="text-amber-600 dark:text-amber-400 hover:text-amber-800 text-xs font-semibold">Suspend</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Families Tab */}
      {activeTab === 'families' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-soft space-y-4">
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">{family.name}</h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">{family.originCountry} • {members.length} registered members</p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-full font-bold text-xs border border-transparent dark:border-emerald-800">
              Healthy & Verified
            </span>
          </div>
        </div>
      )}

      {/* Moderation Tab */}
      {activeTab === 'moderation' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-soft space-y-4">
          <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">Reported Content Items</h3>
          {reports.map(r => (
            <div key={r.id} className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400">{r.itemType}</span>
                <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">{r.title}</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">Reported by {r.reportedBy}: "{r.reason}"</p>
              </div>
              <button
                onClick={() => handleResolveReport(r.id)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${r.status === 'Resolved' ? 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300' : 'bg-forest-700 hover:bg-forest-800 text-white'}`}
              >
                {r.status === 'Resolved' ? 'Resolved ✓' : 'Mark Resolved'}
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
