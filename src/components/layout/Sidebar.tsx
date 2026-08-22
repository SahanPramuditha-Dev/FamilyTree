import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useFamily } from '../../context/FamilyContext';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  GitFork, 
  Users, 
  Split, 
  Clock, 
  Route, 
  Calendar, 
  Image, 
  BookOpen, 
  FileText, 
  Map, 
  BarChart3, 
  Download, 
  UserPlus, 
  ShieldCheck, 
  History, 
  Settings, 
  ShieldAlert, 
  PlusCircle, 
  Printer,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  onOpenAddMember: () => void;
  onOpenInvite: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenAddMember, onOpenInvite }) => {
  const { family, members, branches, photos, stories } = useFamily();
  const { user } = useAuth();
  const navigate = useNavigate();

  const primaryNav = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/tree', label: 'Interactive Tree', icon: GitFork, badge: 'Main' },
    { to: '/members', label: 'Family Members', icon: Users, count: members.length },
    { to: '/branches', label: 'Family Branches', icon: Split, count: branches.length },
    { to: '/relationships', label: 'Relationship Finder', icon: Route, badge: 'Smart' },
    { to: '/timeline', label: 'Family Timeline', icon: Clock },
    { to: '/events', label: 'Events & Reunions', icon: Calendar },
    { to: '/photos', label: 'Photo Archives', icon: Image, count: photos.length },
    { to: '/stories', label: 'Family Stories', icon: BookOpen, count: stories.length },
    { to: '/documents', label: 'Heritage Documents', icon: FileText },
    { to: '/map', label: 'Family Geography', icon: Map },
    { to: '/reports', label: 'Statistics & Reports', icon: BarChart3 },
    { to: '/export', label: 'Export & Print', icon: Download },
  ];

  const adminNav = [
    { to: '/collaboration', label: 'Family Collaboration', icon: UserPlus },
    { to: '/activity', label: 'Activity Logs', icon: History },
    { to: '/privacy', label: 'Privacy Center', icon: ShieldCheck },
    { to: '/settings/family', label: 'Family Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-stone-900 text-stone-300 flex flex-col h-full select-none border-r border-stone-800">
      
      {/* Quick Action Bar */}
      <div className="p-3.5 border-b border-stone-800 space-y-2">
        <button
          onClick={onOpenAddMember}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-forest-600 hover:bg-forest-500 text-white text-xs font-semibold shadow-md shadow-forest-950/40 transition active:scale-98"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Family Member</span>
        </button>
        <button
          onClick={onOpenInvite}
          className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700/60 transition"
        >
          <UserPlus className="w-3.5 h-3.5 text-forest-400" />
          <span>Invite Relatives</span>
        </button>
      </div>

      {/* Main Navigation links */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-6 scrollbar-thin scrollbar-thumb-stone-800">
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Genealogy & Heritage
          </div>
          <nav className="space-y-0.5">
            {primaryNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                      isActive
                        ? 'bg-forest-900/60 text-forest-300 font-semibold border-l-2 border-forest-400 pl-2.5'
                        : 'text-stone-300 hover:bg-stone-800/70 hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] bg-forest-500/20 text-forest-300 px-1.5 py-0.2 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && (
                    <span className="text-[10px] text-stone-400 font-mono">
                      {item.count}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Governance & Privacy
          </div>
          <nav className="space-y-0.5">
            {adminNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
                      isActive
                        ? 'bg-forest-900/60 text-forest-300 font-semibold border-l-2 border-forest-400 pl-2.5'
                        : 'text-stone-300 hover:bg-stone-800/70 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}

            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-amber-950/60 text-amber-300 font-semibold'
                      : 'text-amber-400 hover:bg-stone-800/70'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0 text-amber-400" />
                  <span>Admin Dashboard</span>
                </div>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-full font-bold">
                  System
                </span>
              </NavLink>
            )}
          </nav>
        </div>
      </div>

      {/* Footer Family summary card */}
      <div className="p-3 bg-stone-950/80 border-t border-stone-800 text-[11px] text-stone-400">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-stone-300 truncate max-w-[120px]">{family.name}</span>
          <span className="text-forest-400 font-mono">{members.length} Members</span>
        </div>
        <div className="w-full bg-stone-800 h-1.5 rounded-full mt-2 overflow-hidden">
          <div className="bg-forest-500 h-full w-4/5 rounded-full" />
        </div>
        <p className="text-[10px] text-stone-400 mt-1">Archival lineage active</p>
      </div>

    </aside>
  );
};
