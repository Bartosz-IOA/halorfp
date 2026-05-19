// src/layouts/AppShell.tsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';
import { CommentsProvider } from '../contexts/CommentsContext';
import { CommentsPanel } from '../components/comments/CommentsPanel';
import { useCommentsStore } from '../store/useCommentsStore';
import { cn } from '../components/rfp/ResultPrimitives';

function AppShellMain() {
  const isPanelOpen = useCommentsStore((s) => s.isPanelOpen);

  return (
    <main
      className={cn(
        'flex-1 overflow-x-hidden overflow-y-auto transition-[margin] duration-200',
        isPanelOpen && 'md:mr-[380px]',
      )}
    >
      <Outlet />
    </main>
  );
}

export const AppShell: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <CommentsProvider>
      <div className="flex min-h-screen bg-off-white">
        <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

        <div className="flex-1 flex flex-col w-full min-w-0 md:ml-[var(--sidebar-width)] transition-all">
          <TopBar setMobileMenuOpen={setMobileMenuOpen} />
          <AppShellMain />
          <CommentsPanel />
        </div>

        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-navy-primary/40 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </div>
    </CommentsProvider>
  );
};
