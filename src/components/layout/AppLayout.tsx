import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { SearchModal } from '../modals/SearchModal';
import { AddMemberModal } from '../modals/AddMemberModal';
import { InviteModal } from '../modals/InviteModal';
import { useFamily } from '../../context/FamilyContext';
import { Trees } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const { isCloudLoading } = useFamily();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // While syncing cloud data for a real user, show a loading screen to prevent
  // a flash of demo/sample data before the real (empty or cloud) state loads.
  if (isCloudLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-forest-800 to-forest-600 text-white flex items-center justify-center mx-auto shadow-lg animate-pulse">
            <Trees className="w-7 h-7 text-forest-100" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">Loading your family tree...</p>
            <p className="text-xs text-stone-400">Syncing your records from the cloud</p>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 bg-forest-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-forest-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-forest-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-stone-100 dark:bg-stone-950 font-sans text-stone-900 dark:text-stone-100 antialiased selection:bg-forest-500 selection:text-white">
      {/* Top Navbar - Fixed Header */}
      <Navbar 
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAddMember={() => setIsAddMemberOpen(true)}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Independent Fixed Navigation */}
        <Sidebar 
          onOpenAddMember={() => setIsAddMemberOpen(true)}
          onOpenInvite={() => setIsInviteOpen(true)}
        />

        {/* Main Content Viewport - Independent Smooth Scroll */}
        <main className="flex-1 h-full overflow-y-auto bg-stone-50/70 dark:bg-stone-900/50 p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />

      <AddMemberModal 
        isOpen={isAddMemberOpen} 
        onClose={() => setIsAddMemberOpen(false)} 
      />

      <InviteModal 
        isOpen={isInviteOpen} 
        onClose={() => setIsInviteOpen(false)} 
      />
    </div>
  );
};
