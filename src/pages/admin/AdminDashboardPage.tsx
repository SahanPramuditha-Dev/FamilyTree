import React, { useState } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { 
  ShieldAlert, 
  Users, 
  Trees, 
  HardDrive, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  ShieldCheck, 
  Trash2,
  Lock,
  Sparkles
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { family, members, photos, documents } = useFamily();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'families' | 'moderation'>('overview');

  // Sample admin user list
  const [usersList, setUsersList] = useState([
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          <span>System Administration & Platform Governance</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
          Admin Control Center
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-2xl mt-1">
          Monitor system health, manage platform users, inspect storage utilization, and resolve genealogical moderation reports.
        </p>
      </div>

      {/* Admin Tab Selectors */}
      <div className="flex border-b border-stone-200 gap-6">
        {[
          { key: 'overview', label: 'System Health & Metrics' },
          { key: 'users', label: 'User Directory & Permissions' },
          { key: 'families', label: 'Registered Families' },
          { key: 'moderation', label: 'Content Moderation Reports' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
              activeTab === tab.key 
                ? 'border-amber-600 text-amber-900' 
                : 'border-transparent text-stone-400 hover:text-stone-700'
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
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-soft">
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
                <Users className="w-5 h-5 text-forest-700" />
              </div>
              <span className="font-serif text-3xl font-bold text-stone-900">{usersList.length}</span>
              <p className="text-xs text-stone-500 mt-1">100% Verified accounts</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-soft">
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total Lineages</span>
                <Trees className="w-5 h-5 text-blue-700" />
              </div>
              <span className="font-serif text-3xl font-bold text-stone-900">1 Family</span>
              <p className="text-xs text-stone-500 mt-1">{members.length} Member Nodes</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-soft">
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Storage Usage</span>
                <HardDrive className="w-5 h-5 text-purple-700" />
              </div>
              <span className="font-serif text-3xl font-bold text-stone-900">42.8 MB</span>
              <p className="text-xs text-stone-500 mt-1">{photos.length + documents.length} Media & Document Assets</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-soft">
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">System Health</span>
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="font-serif text-2xl font-bold text-emerald-600">99.98% Healthy</span>
              <p className="text-xs text-stone-500 mt-1">Firebase Auth & DB Connected</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-stone-900 text-white space-y-4">
            <h3 className="font-serif font-bold text-base">Platform Diagnostics & Service Endpoints</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800">
                <span className="text-stone-400 block mb-1">Firebase Project</span>
                <span className="font-mono text-emerald-400 font-bold">familytree-6df76</span>
              </div>
              <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800">
                <span className="text-stone-400 block mb-1">Genealogy Graph Engine</span>
                <span className="font-mono text-emerald-400 font-bold">React Flow v12 + BFS</span>
              </div>
              <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800">
                <span className="text-stone-400 block mb-1">Database Standard</span>
                <span className="font-mono text-emerald-400 font-bold">GEDCOM 5.5 Spec</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-soft">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold">
              <tr>
                <th className="p-4">User Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Storage Used</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {usersList.map(u => (
                <tr key={u.id} className="hover:bg-stone-50">
                  <td className="p-4 font-bold text-stone-900">{u.name}</td>
                  <td className="p-4 text-stone-600">{u.email}</td>
                  <td className="p-4"><span className="px-2 py-0.5 rounded-full bg-forest-50 text-forest-800 font-bold text-[10px]">{u.role}</span></td>
                  <td className="p-4 font-mono">{u.storage}</td>
                  <td className="p-4"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">{u.status}</span></td>
                  <td className="p-4 text-right">
                    <button className="text-stone-400 hover:text-stone-700 text-xs mr-3">Reset Pass</button>
                    <button className="text-amber-600 hover:text-amber-800 text-xs font-semibold">Suspend</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Families Tab */}
      {activeTab === 'families' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-soft space-y-4">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-stone-900">{family.name}</h4>
              <p className="text-xs text-stone-500">{family.originCountry} • {members.length} registered members</p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs">
              Healthy & Verified
            </span>
          </div>
        </div>
      )}

      {/* Moderation Tab */}
      {activeTab === 'moderation' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-soft space-y-4">
          <h3 className="font-serif font-bold text-base text-stone-900">Reported Content Items</h3>
          {reports.map(r => (
            <div key={r.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-700">{r.itemType}</span>
                <h4 className="font-bold text-sm text-stone-900">{r.title}</h4>
                <p className="text-xs text-stone-500">Reported by {r.reportedBy}: "{r.reason}"</p>
              </div>
              <button
                onClick={() => handleResolveReport(r.id)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold ${r.status === 'Resolved' ? 'bg-stone-200 text-stone-600' : 'bg-forest-700 text-white'}`}
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
