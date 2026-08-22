import React, { useState } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { QRCodeSVG } from 'qrcode.react';
import { X, UserPlus, Copy, Check, Mail, Shield, Link as LinkIcon } from 'lucide-react';
import { Role } from '../../types';

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

  if (!isOpen) return null;

  const shareableUrl = `${window.location.origin}/invite/join?family=${family.id}&ref=share_link`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    createInvitation(email, role);
    setSentSuccess(true);
    setEmail('');
    setTimeout(() => setSentSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-100 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-6 bg-forest-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-forest-200" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base">Invite Family Members</h3>
              <p className="text-xs text-forest-200">Collaborate on the {family.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-forest-800 text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Email Invite form */}
          <form onSubmit={handleSendInvite} className="space-y-3">
            <label className="block text-xs font-semibold text-stone-700">
              Invite by Email Address
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="relative@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 text-xs rounded-xl border-stone-200 focus:border-forest-500 focus:ring-forest-500 p-2.5 shadow-sm"
                />
              </div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="text-xs rounded-xl border-stone-200 focus:border-forest-500 focus:ring-forest-500 p-2.5 bg-stone-50 capitalize"
              >
                <option value="editor">Editor</option>
                <option value="contributor">Contributor</option>
                <option value="viewer">Viewer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-forest-700 hover:bg-forest-800 text-white text-xs font-semibold rounded-xl shadow transition"
            >
              Send Invitation Email
            </button>

            {sentSuccess && (
              <p className="text-xs text-emerald-600 font-medium text-center animate-fade-in">
                ✓ Invitation generated and sent successfully!
              </p>
            )}
          </form>

          {/* Shareable Link & QR */}
          <div className="pt-4 border-t border-stone-100 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-stone-400" /> Shareable Family Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareableUrl}
                  className="flex-1 text-xs bg-stone-50 border-stone-200 rounded-xl p-2.5 text-stone-500 truncate"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* QR Code */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center gap-4">
              <div className="p-2 bg-white rounded-xl shadow-xs border border-stone-200">
                <QRCodeSVG value={shareableUrl} size={70} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-stone-900">Scan QR Code</p>
                <p className="text-[11px] text-stone-500 mt-0.5">
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
