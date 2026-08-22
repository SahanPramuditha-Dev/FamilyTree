import React, { useState } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { useAuth } from '../../context/AuthContext';
import { SelectDropdown } from '../../components/ui/Dropdown';
import { InviteModal } from '../../components/modals/InviteModal';
import { 
  UserPlus, 
  ShieldCheck, 
  Users, 
  Mail, 
  Clock, 
  Check, 
  X, 
  Sparkles, 
  ShieldAlert, 
  ChevronDown,
  Trash2
} from 'lucide-react';
import { Role } from '../../types';

export const CollaborationPage: React.FC = () => {
  const { collaborators, invitations, updateCollaboratorRole, removeCollaborator, family } = useFamily();
  const { user } = useAuth();
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const roleDescriptions: Record<Role, string> = {
    owner: 'Full control over tree, privacy settings, billing, and collaborator permissions.',
    admin: 'Manage family records, invite relatives, and resolve conflicting information.',
    editor: 'Add, update, and edit relatives, vital dates, and relationship connections.',
    contributor: 'Upload photos, documents, and publish oral family stories.',
    viewer: 'Read-only access to explore the tree and family directory.'
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold mb-2">
            <UserPlus className="w-3.5 h-3.5 text-forest-600" />
            <span>Family Collaboration & Governance</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
            Family Collaborators & Roles
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-2xl mt-1">
            Invite extended relatives to contribute photos, memories, and records with granular permission controls.
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="px-4 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 active:scale-95 self-start sm:self-center"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Invite Relative</span>
        </button>
      </div>

      {/* Active Collaborators List */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-forest-700" />
            <span>Active Collaborators ({collaborators.length})</span>
          </h3>
        </div>

        <div className="divide-y divide-stone-100">
          {collaborators.map((c) => (
            <div key={c.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50 transition">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-forest-100 text-forest-800 font-bold flex items-center justify-center text-sm font-serif">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-900">{c.name}</h4>
                  <p className="text-xs text-stone-500">{c.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <SelectDropdown
                  value={c.role}
                  onChange={(val) => updateCollaboratorRole(c.id, val as Role)}
                  disabled={c.role === 'owner'}
                  menuWidth="w-56"
                  options={[
                    { value: 'owner', label: 'Owner', description: 'Full account & billing control' },
                    { value: 'admin', label: 'Administrator', description: 'Can manage members and settings' },
                    { value: 'editor', label: 'Editor', description: 'Can edit tree and add stories' },
                    { value: 'contributor', label: 'Contributor', description: 'Can submit photos and comments' },
                    { value: 'viewer', label: 'Viewer', description: 'Read-only family access' }
                  ]}
                />

                {c.role !== 'owner' && (
                  <button
                    onClick={() => removeCollaborator(c.id)}
                    className="p-2 text-stone-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                    title="Remove access"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Matrix Explanation */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-soft space-y-4">
        <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-forest-700" />
          <span>Role Permissions Breakdown</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {(Object.entries(roleDescriptions) as [Role, string][]).map(([role, desc]) => (
            <div key={role} className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
              <span className="font-bold text-stone-900 uppercase tracking-wider block capitalize">
                {role}
              </span>
              <p className="text-stone-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />

    </div>
  );
};
