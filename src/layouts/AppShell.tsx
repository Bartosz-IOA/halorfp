// src/layouts/AppShell.tsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';

export const AppShell: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-off-white">
      <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      
      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col w-full min-w-0 md:ml-[var(--sidebar-width)] transition-all">
        <TopBar setMobileMenuOpen={setMobileMenuOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Backdrop overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-navy-primary/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};
