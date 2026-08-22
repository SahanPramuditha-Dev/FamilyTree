import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { SearchModal } from '../modals/SearchModal';
import { AddMemberModal } from '../modals/AddMemberModal';
import { InviteModal } from '../modals/InviteModal';

export const AppLayout: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-stone-100 font-sans text-stone-900 antialiased selection:bg-forest-500 selection:text-white">
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
        <main className="flex-1 h-full overflow-y-auto bg-stone-50/70 p-4 sm:p-8">
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
