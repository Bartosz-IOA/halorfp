// src/components/layout/TopBar.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';

const routeToTitle: Record<string, string> = {
  '/rfp': 'RFP Analysis',
  '/rfp/new': 'New Analysis',
};

export const TopBar: React.FC = () => {
  const location = useLocation();
  
  // Custom title logic for dynamic routes
  let title = routeToTitle[location.pathname] || 'Dashboard';
  if (location.pathname.startsWith('/rfp/')) {
    if (location.pathname.endsWith('/processing')) {
      title = 'Analysis In Progress';
    } else if (location.pathname !== '/rfp/new') {
      title = 'Analysis Results';
    }
  }

  return (
    <header className="h-topbar bg-surface-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-navy-primary">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Actions Area */}
        <div className="flex items-center gap-4 text-text-secondary">
          <button className="hover:text-navy-primary transition-fast">
            <Search size={20} />
          </button>
          <button className="hover:text-navy-primary transition-fast">
            <Bell size={20} />
          </button>
        </div>

      </div>
    </header>
  );
};
