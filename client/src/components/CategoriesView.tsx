import React, { useState } from 'react';
import { DilemmaData } from './DilemmaCard';

interface CategoriesViewProps {
  dilemmas: DilemmaData[];
  onSelectDilemma: (dilemma: DilemmaData) => void;
}

const CATEGORY_META: Record<string, { icon: string; description: string; color: string }> = {
  'Career & Life': {
    icon: 'work',
    description: 'Deliberations on career jumps, cross-country moves, offers, and work-life dilemmas.',
    color: 'from-blue-500/10 to-indigo-500/10 text-blue-600',
  },
  'Engineering & Architecture': {
    icon: 'terminal',
    description: 'Technical stack decisions, architectural migrations, microservices vs monolith, and tooling.',
    color: 'from-purple-500/10 to-pink-500/10 text-purple-600',
  },
  'Finance & Relocation': {
    icon: 'account_balance',
    description: 'Real estate, equity compensation, cost of living optimization, and investment paths.',
    color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600',
  },
  'Product Strategy': {
    icon: 'lightbulb',
    description: 'Product launches, monetization trade-offs, roadmap prioritization, and growth loops.',
    color: 'from-amber-500/10 to-orange-500/10 text-amber-600',
  },
};

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  dilemmas,
  onSelectDilemma,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('Career & Life');

  const filteredDilemmas = dilemmas.filter(
    (d) => d.category === activeCategory || (!CATEGORY_META[d.category] && activeCategory === 'Career & Life')
  );

  return (
    <div className="w-full max-w-[820px] mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-[28px] md:text-[32px] font-semibold text-text-primary tracking-tight">
          Browse by Category
        </h1>
        <p className="text-[14px] text-text-secondary mt-1">
          Explore focused deliberation threads across engineering, career, finance, and product strategy.
        </p>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {Object.entries(CATEGORY_META).map(([name, meta]) => {
          const isSelected = activeCategory === name;
          const count = dilemmas.filter((d) => d.category === name).length;

          return (
            <button
              key={name}
              onClick={() => setActiveCategory(name)}
              className={`p-5 rounded-[22px] text-left transition-all border ${
                isSelected
                  ? 'bg-surface-card border-primary-container shadow-md ring-2 ring-primary-container/20'
                  : 'bg-surface-card/60 hover:bg-surface-card border-black/[0.04] shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${meta.color} flex items-center justify-center`}>
                  <span className="material-symbols-outlined text-[20px]">{meta.icon}</span>
                </span>
                <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full bg-surface-container-low text-text-secondary">
                  {count} {count === 1 ? 'dilemma' : 'dilemmas'}
                </span>
              </div>
              <h3 className="text-[16px] font-semibold text-text-primary mb-1">{name}</h3>
              <p className="text-[13px] text-text-secondary leading-relaxed line-clamp-2">
                {meta.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Category Heading */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[20px] font-semibold text-text-primary tracking-tight">
          {activeCategory} Dilemmas
        </h2>
        <span className="text-[13px] text-text-secondary font-medium">
          {filteredDilemmas.length} Active {filteredDilemmas.length === 1 ? 'Discussion' : 'Discussions'}
        </span>
      </div>

      {/* Dilemmas list */}
      <div className="space-y-4">
        {filteredDilemmas.length === 0 ? (
          <div className="text-center py-12 px-4 bg-surface-card rounded-[24px] border border-black/[0.03]">
            <p className="text-[15px] font-medium text-text-primary">
              No dilemmas published in {activeCategory} yet.
            </p>
            <p className="text-[13px] text-text-secondary mt-1">
              Be the first to publish a dilemma in this domain!
            </p>
          </div>
        ) : (
          filteredDilemmas.map((d) => (
            <div
              key={d.id}
              onClick={() => onSelectDilemma(d)}
              className="p-5 md:p-6 rounded-[22px] bg-surface-card hover:bg-surface-container-low/40 border border-black/[0.03] shadow-sm hover:shadow transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-[12px] text-text-secondary mb-1">
                  <span>{d.author.name}</span>
                  <span>•</span>
                  <span>{d.author.timeAgo}</span>
                </div>
                <h3 className="text-[17px] font-semibold text-text-primary group-hover:text-primary-container transition-colors tracking-tight">
                  {d.title}
                </h3>
                <p className="text-[14px] text-on-surface-variant line-clamp-1 mt-0.5">
                  {d.description}
                </p>
              </div>

              <div className="flex items-center gap-4 text-[13px] text-text-secondary flex-shrink-0">
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">how_to_vote</span>
                  {d.options.reduce((s, o) => s + o.votes, 0).toLocaleString()}
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">chat_bubble_outline</span>
                  {d.comments.length}
                </span>
                <span className="material-symbols-outlined text-[18px] text-primary-container group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default CategoriesView;
