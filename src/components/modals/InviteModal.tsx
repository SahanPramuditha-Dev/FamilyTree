import React, { useState } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { QRCodeSVG } from 'qrcode.react';
import { X, UserPlus, Copy, Check, Mail, Link as LinkIcon } from 'lucide-react';
import { Role } from '../../types';
import { SelectDropdown, SelectOption } from '../ui/Dropdown';

const roleOptions: SelectOption[] = [
  { value: 'contributor', label: 'Contributor', description: 'Can add photos, stories, and relatives' },
  { value: 'editor', label: 'Editor', description: 'Can edit tree records and details' },
  { value: 'viewer', label: 'Viewer', description: 'Read-only access to tree archives' },
  { value: 'admin', label: 'Admin', description: 'Full administrative management' }
];

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose }) => {
  const { family, createInvitation } = useFamily();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('contributor');
  const [copied, setCopied] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [lastInviteToken, setLastInviteToken] = useState<string | null>(null);
  const [lastInviteEmail, setLastInviteEmail] = useState<string | null>(null);

  if (!isOpen) return null;

  const shareableUrl = `${window.location.origin}/invite/join?family=${family.id}&role=contributor&ref=share_link`;
  const emailInviteUrl = lastInviteToken
    ? `${window.location.origin}/invite/join?family=${family.id}&token=${lastInviteToken}`
    : shareableUrl;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const invite = createInvitation(email, role);
    setLastInviteToken(invite.token);
    setLastInviteEmail(invite.email);
    setSentSuccess(true);
    setEmail('');
    setTimeout(() => setSentSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200 dark:border-stone-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-forest-800 to-forest-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-forest-200" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-white">Invite Family Members</h3>
              <p className="text-xs text-forest-200">Collaborate on {family.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Email Invite form */}
          <form onSubmit={handleSendInvite} className="space-y-3">
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
              Invite by Email Address
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="relative@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 text-xs rounded-xl border border-stone-300 dark:border-stone-700 focus:border-forest-500 focus:ring-forest-500 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 p-2.5 shadow-sm"
                />
              </div>
              <div className="w-36 flex-shrink-0">
                <SelectDropdown
                  options={roleOptions}
                  value={role}
                  onChange={(val) => setRole(val as Role)}
                  fullWidth
                  size="md"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-forest-700 hover:bg-forest-800 dark:bg-forest-600 dark:hover:bg-forest-500 text-white text-xs font-semibold rounded-xl shadow-md transition active:scale-95"
            >
              Send Invitation Email
            </button>

            {sentSuccess && (
              <div className="space-y-1 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium text-center">
                  Invitation created for {lastInviteEmail || 'recipient'}!
                </p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 text-center break-all font-mono">
                  Link: {emailInviteUrl}
                </p>
              </div>
            )}
          </form>

          {/* Shareable Link & QR */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-stone-400" /> Shareable Family Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareableUrl}
                  className="flex-1 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl p-2.5 text-stone-600 dark:text-stone-300 truncate"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-2.5 bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition active:scale-95"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* QR Code */}
            <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200/80 dark:border-stone-700/80 flex items-center gap-4">
              <div className="p-2 bg-white rounded-xl shadow-xs border border-stone-200">
                <QRCodeSVG value={shareableUrl} size={70} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-stone-900 dark:text-stone-100">Scan QR Code</p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  Relatives can scan this QR code on mobile devices to instantly request access to the tree.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
