// src/components/layout/Sidebar.tsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FileText, PlusCircle, LogOut, Database, ThumbsUp } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NavItem = ({ 
  to, 
  icon: Icon, 
  label, 
  disabled = false 
}: { 
  to: string; 
  icon: any; 
  label: string; 
  disabled?: boolean 
}) => {
  if (disabled) {
    return (
      <div className="flex items-center gap-3 px-3 py-2 text-text-inverse/40 cursor-default group relative">
        <Icon size={20} className="shrink-0" />
        <span className="text-sm font-medium truncate">{label}</span>
        <span className="ml-auto shrink-0 text-[8px] border border-text-inverse/20 rounded px-1 group-hover:bg-text-inverse/10">SOON</span>
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-3 py-2 transition-fast border-l-3",
        isActive 
          ? "border-yellow bg-yellow/10 text-yellow" 
          : "border-transparent text-text-inverse/70 hover:bg-white/5 hover:text-text-inverse"
      )}
    >
      <Icon size={20} className="shrink-0" />
      <span className="text-sm font-medium truncate">{label}</span>
    </NavLink>
  );
};

export const Sidebar: React.FC = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="w-sidebar bg-navy-primary text-text-inverse fixed inset-y-0 left-0 flex flex-col z-20">
      {/* Logo Area */}
      <div className="p-4 mb-4 flex items-center justify-center">
        <NavLink to="/rfp" className="block pt-2">
          <img src="/halo-wordmark.svg" alt="HALO" className="h-[22px] w-auto" />
        </NavLink>
      </div>

      {/* Nav Section */}
      <div className="flex-1 overflow-y-auto pt-4">
        <div className="px-3 mb-2">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.08em]">
              Tools
            </p>
          </motion.div>
        </div>
        
        <nav className="space-y-1">
          <NavItem to="/rfp" icon={FileText} label="RFP Analysis" />
        </nav>

        <div className="px-3 mt-6 mb-2">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.08em]">
              Coming Soon
            </p>
          </motion.div>
        </div>
        
        <nav className="space-y-1">
          <NavItem to="/recommendation" icon={ThumbsUp} label="Recommendation" disabled />
          <NavItem to="/rfi" icon={PlusCircle} label="RFI Analysis" disabled />
          <NavItem to="/custom-extraction" icon={Database} label="Custom Document Extraction" disabled />
        </nav>
      </div>

      <div className="mt-auto border-t border-white/10 p-4">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-text-inverse/50 hover:text-yellow hover:bg-white/5 transition-fast rounded-md"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Log out</span>
        </button>
      </div>

    </aside>
  );
};
