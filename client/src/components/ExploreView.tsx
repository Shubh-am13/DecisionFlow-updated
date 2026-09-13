import React, { useState } from 'react';
import { DilemmaData } from './DilemmaCard';

interface ExploreViewProps {
  dilemmas: DilemmaData[];
  onSelectDilemma: (dilemma: DilemmaData) => void;
  onNewDilemmaClick: () => void;
  searchQuery: string;
}

const CATEGORIES = ['All', 'Career & Life', 'Engineering & Architecture', 'Finance & Relocation', 'Product Strategy'];

export const ExploreView: React.FC<ExploreViewProps> = ({
  dilemmas,
  onSelectDilemma,
  onNewDilemmaClick,
  searchQuery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered = dilemmas.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || d.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="w-full max-w-[820px] mx-auto animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[28px] md:text-[32px] font-semibold text-text-primary tracking-tight">
            Explore Dilemmas
          </h1>
          <p className="text-[14px] text-text-secondary mt-0.5">
            Discover community deliberations, vote on outcomes, and read AI consensus synthesis.
          </p>
        </div>

        <button
          onClick={onNewDilemmaClick}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary-container text-white text-[14px] font-medium hover:brightness-105 active:scale-95 transition-all shadow-btn-primary self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>New Dilemma</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-text-primary text-white shadow-sm'
                : 'bg-surface-card hover:bg-surface-container-low text-text-secondary hover:text-text-primary border border-black/[0.04]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Dilemmas Feed */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-4 bg-surface-card rounded-dilemma border border-black/[0.03] shadow-sm">
            <span className="material-symbols-outlined text-text-secondary text-[40px] mb-2 block">
              search_off
            </span>
            <h3 className="text-[18px] font-semibold text-text-primary">No dilemmas found</h3>
            <p className="text-[14px] text-text-secondary mt-1">
              Try adjusting your search query or select another category filter.
            </p>
          </div>
        ) : (
          filtered.map((dilemma) => {
            const totalVotes = dilemma.options.reduce((s, o) => s + o.votes, 0);

            return (
              <article
                key={dilemma.id}
                onClick={() => onSelectDilemma(dilemma)}
                className="bg-surface-card rounded-[24px] p-6 md:p-8 shadow-dilemma-card border border-black/[0.03] hover:border-primary-container/30 transition-all cursor-pointer group"
              >
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={dilemma.author.avatarUrl}
                      alt={dilemma.author.name}
                      className="w-8 h-8 rounded-full object-cover shadow-sm"
                    />
                    <span className="text-[14px] font-medium text-text-primary">
                      {dilemma.author.name}
                    </span>
                    <span className="text-text-secondary text-[12px]">•</span>
                    <span className="text-[12px] text-text-secondary">
                      {dilemma.author.timeAgo}
                    </span>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container-low text-[11px] font-medium text-text-secondary">
                    {dilemma.category}
                  </span>
                </div>

                {/* Title & Description */}
                <h2 className="text-[20px] md:text-[22px] font-semibold text-text-primary group-hover:text-primary-container transition-colors tracking-tight leading-snug mb-2">
                  {dilemma.title}
                </h2>
                <p className="text-[15px] text-on-surface-variant leading-relaxed line-clamp-2 mb-4 font-normal">
                  {dilemma.description}
                </p>

                {/* Voting Preview Bar */}
                <div className="grid grid-cols-2 gap-2.5 mb-4">
                  {dilemma.options.slice(0, 2).map((opt) => {
                    const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                    return (
                      <div
                        key={opt.id}
                        className="relative p-2.5 rounded-xl bg-surface-container-low overflow-hidden"
                      >
                        <div
                          className="absolute inset-y-0 left-0 bg-primary-container/10 rounded-xl"
                          style={{ width: `${pct}%` }}
                        />
                        <div className="relative z-10 flex items-center justify-between text-[13px]">
                          <span className="font-medium text-text-primary truncate mr-2">
                            {opt.label}
                          </span>
                          <span className="font-semibold text-primary-container">
                            {pct}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Metrics */}
                <div className="flex items-center justify-between text-[13px] text-text-secondary pt-2 border-t border-surface-container">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">how_to_vote</span>
                      {totalVotes.toLocaleString()} votes
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">chat_bubble_outline</span>
                      {dilemma.comments.length} perspectives
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-primary-container font-medium group-hover:translate-x-0.5 transition-transform">
                    <span>Deliberate</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </span>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
export default ExploreView;
