import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFamily } from '../../context/FamilyContext';
import { useFamilyAccess } from '../../hooks/useFamilyAccess';
import { 
  Search, 
  Bell, 
  Shield, 
  LogOut, 
  User, 
  Settings, 
  Trees, 
  Plus, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Dropdown, DropdownItem, DropdownHeader, DropdownDivider } from '../ui/Dropdown';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenAddMember: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, onOpenAddMember }) => {
  const { user, logout } = useAuth();
  const { family, notifications, markNotificationRead, markAllNotificationsRead } = useFamily();
  const { canEditMembers } = useFamilyAccess();
  const navigate = useNavigate();
  const [avatarError, setAvatarError] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Notification Trigger Button
  const notificationTrigger = (
    <button
      className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl relative transition"
      title="Notifications"
    >
      <Bell className="w-4 h-4" />
      {unreadCount > 0 && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-stone-900 animate-pulse" />
      )}
    </button>
  );

  // User Profile Trigger Button
  const userTrigger = (
    <div className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer">
      {user?.photoURL && !avatarError ? (
        <img 
          src={user.photoURL} 
          alt={user.displayName || 'User'}
          onError={() => setAvatarError(true)}
          className="w-8 h-8 rounded-xl object-cover border border-stone-200 dark:border-stone-700 shadow-xs" 
        />
      ) : (
        <div className="w-8 h-8 rounded-xl bg-forest-100 dark:bg-forest-900 text-forest-800 dark:text-forest-200 font-bold flex items-center justify-center text-xs">
          {user?.displayName?.charAt(0) || 'U'}
        </div>
      )}
      <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden sm:block" />
    </div>
  );

  return (
    <header className="h-16 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left branding & family switcher */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-forest-800 to-forest-600 dark:from-forest-700 dark:to-forest-500 text-white flex items-center justify-center shadow-md shadow-forest-900/10">
            <Trees className="w-5 h-5 text-forest-100" />
          </div>
            <div>
              <span className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base leading-tight block">
                FamilyTree
              </span>
              <span className="text-[11px] font-medium text-forest-700 dark:text-forest-400 block truncate max-w-[140px] sm:max-w-[200px]">
                {family.name}
              </span>
            </div>
        </Link>
      </div>

      {/* Center Search Trigger */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-stone-100/80 dark:bg-stone-800/80 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs border border-stone-200/60 dark:border-stone-700/60 transition shadow-inner"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
            <span>Search people, stories, places, documents...</span>
          </span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded shadow-xs text-stone-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Theme Switcher */}
        <ThemeToggle />

        {/* Mobile search button */}
        <button
          onClick={onOpenSearch}
          className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl md:hidden"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {canEditMembers && (
          <button
            onClick={onOpenAddMember}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest-700 hover:bg-forest-800 dark:bg-forest-600 dark:hover:bg-forest-500 text-white text-xs font-semibold shadow-sm transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>
        )}

        {/* Centralised Notifications Dropdown */}
        <Dropdown trigger={notificationTrigger} width="w-80 sm:w-96" align="right">
          <div className="px-4 pb-2 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">Family Notifications</h4>
              {unreadCount > 0 && (
                <span className="text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 px-1.5 py-0.2 rounded-full font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button 
                onClick={markAllNotificationsRead}
                className="text-[11px] text-forest-700 dark:text-forest-400 hover:underline font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="divide-y divide-stone-100 dark:divide-stone-800 max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-400">
                No notifications
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id}
                  onClick={() => {
                    markNotificationRead(notif.id);
                    if (notif.linkUrl) navigate(notif.linkUrl);
                  }}
                  className={`p-3 text-xs hover:bg-stone-50 dark:hover:bg-stone-800/60 cursor-pointer transition flex items-start gap-2.5 ${
                    !notif.isRead ? 'bg-forest-50/50 dark:bg-forest-950/30' : ''
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!notif.isRead ? 'bg-forest-600' : 'bg-transparent'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-900 dark:text-stone-100 leading-snug">{notif.title}</p>
                    <p className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5 line-clamp-2">{notif.message}</p>
                    <span className="text-[10px] text-stone-400 dark:text-stone-500 mt-1 block">
                      {new Date(notif.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Dropdown>

        {/* Centralised User Profile Dropdown */}
        <Dropdown trigger={userTrigger} width="w-60" align="right">
          <DropdownHeader subtitle={user?.email}>
            {user?.displayName || 'Family Member'}
          </DropdownHeader>

          <div className="py-1">
            <DropdownItem 
              icon={<User className="w-3.5 h-3.5" />}
              onClick={() => navigate('/settings/account')}
            >
              Account Profile
            </DropdownItem>
            <DropdownItem 
              icon={<Settings className="w-3.5 h-3.5" />}
              onClick={() => navigate('/settings/family')}
            >
              Family Settings
            </DropdownItem>
            <DropdownItem 
              icon={<Sparkles className="w-3.5 h-3.5 text-amber-500" />}
              onClick={() => navigate('/onboarding')}
            >
              Run Setup Wizard
            </DropdownItem>
            <DropdownItem 
              icon={<Shield className="w-3.5 h-3.5" />}
              onClick={() => navigate('/privacy')}
            >
              Privacy Center
            </DropdownItem>
          </div>

          <DropdownDivider />

          <DropdownItem 
            variant="danger"
            icon={<LogOut className="w-3.5 h-3.5" />}
            onClick={() => { logout(); navigate('/login'); }}
          >
            Sign Out
          </DropdownItem>
        </Dropdown>

      </div>
    </header>
  );
};
