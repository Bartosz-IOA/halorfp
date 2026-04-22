// src/components/layout/TopBar.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, Menu } from 'lucide-react';

const routeToTitle: Record<string, string> = {
  '/rfp': 'RFP Analysis',
  '/rfp/new': 'New Analysis',
};

interface TopBarProps {
  setMobileMenuOpen: (open: boolean) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ setMobileMenuOpen }) => {
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
    <header className="h-topbar bg-surface-white border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button 
          className="md:hidden p-1.5 -ml-1.5 text-text-secondary hover:text-navy-primary transition-colors"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu size={22} />
        </button>
        <h1 className="text-lg md:text-xl font-bold text-navy-primary truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        {/* Actions Area */}
        <div className="flex items-center gap-3 md:gap-4 text-text-secondary">
          <button className="hover:text-navy-primary transition-fast p-1">
            <Search size={18} className="md:w-[20px] md:h-[20px]" />
          </button>
          <button className="hover:text-navy-primary transition-fast p-1">
            <Bell size={18} className="md:w-[20px] md:h-[20px]" />
          </button>
        </div>
      </div>
    </header>
  );
};
