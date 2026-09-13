import React from 'react';
import { UserProfile } from '../services/api';

interface HeaderProps {
  activeNav: 'explore' | 'categories' | 'my-dilemmas';
  onNavChange: (nav: 'explore' | 'categories' | 'my-dilemmas') => void;
  onNewDilemmaClick: () => void;
  onProfileClick: () => void;
  currentUser: UserProfile | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeNav,
  onNavChange,
  onNewDilemmaClick,
  onProfileClick,
  currentUser,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/75 backdrop-blur-2xl shadow-header">
      <div className="h-16 max-w-[1024px] mx-auto px-margin flex items-center justify-between gap-space-lg">
        {/* Brand Logo & Name */}
        <div
          onClick={() => onNavChange('explore')}
          className="flex items-center gap-space-md cursor-pointer select-none group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-container to-ai-iridescent-blue flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              groups
            </span>
          </div>
          <span className="font-semibold text-[20px] tracking-tight text-text-primary">
            CrowdWise
          </span>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-xs relative hidden sm:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search dilemmas, topics..."
            className="w-full bg-surface-container-low pl-9 pr-4 py-1.5 rounded-full text-[14px] text-text-primary placeholder:text-text-secondary focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-container/30 transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary text-[14px]"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-space-lg">
          <button
            onClick={() => onNavChange('explore')}
            className={`text-[14px] transition-colors py-1 relative ${
              activeNav === 'explore'
                ? 'text-primary-container font-semibold'
                : 'text-text-secondary hover:text-text-primary font-normal'
            }`}
          >
            Explore
            {activeNav === 'explore' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-container rounded-full" />
            )}
          </button>
          <button
            onClick={() => onNavChange('categories')}
            className={`text-[14px] transition-colors py-1 relative ${
              activeNav === 'categories'
                ? 'text-primary-container font-semibold'
                : 'text-text-secondary hover:text-text-primary font-normal'
            }`}
          >
            Categories
            {activeNav === 'categories' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-container rounded-full" />
            )}
          </button>
          <button
            onClick={() => onNavChange('my-dilemmas')}
            className={`text-[14px] transition-colors py-1 relative ${
              activeNav === 'my-dilemmas'
                ? 'text-primary-container font-semibold'
                : 'text-text-secondary hover:text-text-primary font-normal'
            }`}
          >
            My Dilemmas
            {activeNav === 'my-dilemmas' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-container rounded-full" />
            )}
          </button>
        </nav>

        {/* Actions: New Dilemma CTA + User Profile */}
        <div className="flex items-center gap-space-md">
          <button
            onClick={onNewDilemmaClick}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary-container text-white text-[14px] font-medium hover:brightness-105 active:scale-95 transition-all shadow-btn-primary"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>New Dilemma</span>
          </button>

          <button
            onClick={onProfileClick}
            aria-label="User profile"
            className="relative flex items-center justify-center p-0.5 rounded-full ring-2 ring-transparent hover:ring-primary-container/40 active:scale-95 transition-all cursor-pointer"
          >
            {currentUser ? (
              <div className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center text-[13px] font-semibold shadow-sm">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover shadow-sm opacity-90 hover:opacity-100"
              />
            )}
            {currentUser && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
export default Header;
