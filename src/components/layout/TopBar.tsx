// src/components/layout/TopBar.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, MessageSquareText, Menu, Search } from 'lucide-react';
import { cn } from '../rfp/ResultPrimitives';
import { useCommentsOptional } from '../../contexts/CommentsContext';

const routeToTitle: Record<string, string> = {
  '/rfp': 'RFP Analysis',
  '/rfp/new': 'New Analysis',
};

interface TopBarProps {
  setMobileMenuOpen: (open: boolean) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ setMobileMenuOpen }) => {
  const location = useLocation();
  const comments = useCommentsOptional();

  let title = routeToTitle[location.pathname] || 'Dashboard';
  if (location.pathname.startsWith('/rfp/')) {
    if (location.pathname.endsWith('/processing')) {
      title = 'Analysis In Progress';
    } else if (location.pathname !== '/rfp/new') {
      title = 'Analysis Results';
    }
  }

  const showComments = comments?.isResultsPage ?? false;
  const openCommentCount = comments?.comments.filter((c) => !c.resolved).length ?? 0;

  return (
    <header className="h-topbar bg-surface-white border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="md:hidden p-1.5 -ml-1.5 text-text-secondary hover:text-navy-primary transition-colors"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu size={22} />
        </button>
        <h1 className="text-lg md:text-xl font-bold text-navy-primary truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="flex items-center gap-3 md:gap-4 text-text-secondary">
          {showComments ? (
            <button
              type="button"
              onClick={comments!.toggleCommentMode}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-bold transition-fast',
                comments!.isModeActive
                  ? 'border-yellow bg-yellow/20 text-navy-primary'
                  : 'border-border bg-white hover:border-navy-mid/30 hover:text-navy-primary',
              )}
              aria-pressed={comments!.isModeActive}
              title={comments!.isModeActive ? 'Close comments' : 'Review and add comments'}
            >
              <MessageSquareText size={18} className="shrink-0" />
              <span>Comments</span>
              {openCommentCount > 0 ? (
                <span className="rounded-full bg-navy-primary px-1.5 py-0.5 text-[9px] font-bold text-yellow">
                  {openCommentCount}
                </span>
              ) : null}
            </button>
          ) : null}
          <button type="button" className="hover:text-navy-primary transition-fast p-1">
            <Search size={18} className="md:w-[20px] md:h-[20px]" />
          </button>
          <button type="button" className="hover:text-navy-primary transition-fast p-1">
            <Bell size={18} className="md:w-[20px] md:h-[20px]" />
          </button>
        </div>
      </div>
    </header>
  );
};
