import React, { useState, useEffect } from 'react';

export interface VotingOption {
  id: string;
  label: string;
  votes: number;
}

interface VotingPillsProps {
  initialOptions?: VotingOption[];
  onVoteChange?: (optionId: string | null) => void;
  pollClosesIn?: string;
}

export const VotingPills: React.FC<VotingPillsProps> = ({
  initialOptions = [
    { id: 'A', label: 'Move to Chicago', votes: 1420 },
    { id: 'B', label: 'Stay near family', votes: 668 },
  ],
  onVoteChange,
  pollClosesIn = '2 days',
}) => {
  const [options, setOptions] = useState<VotingOption[]>(initialOptions);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  useEffect(() => {
    setOptions(initialOptions);
    setSelectedOptionId(null);
  }, [initialOptions]);

  const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0);

  const handleSelectOption = (optId: string) => {
    let nextSelected: string | null = null;
    let nextOptions = [...options];

    if (selectedOptionId === optId) {
      // Toggle off / unvote
      nextSelected = null;
      nextOptions = options.map((opt) =>
        opt.id === optId ? { ...opt, votes: Math.max(0, opt.votes - 1) } : opt
      );
    } else {
      // Change vote or cast new vote
      nextSelected = optId;
      nextOptions = options.map((opt) => {
        if (opt.id === optId) {
          return { ...opt, votes: opt.votes + 1 };
        }
        if (selectedOptionId && opt.id === selectedOptionId) {
          return { ...opt, votes: Math.max(0, opt.votes - 1) };
        }
        return opt;
      });
    }

    setSelectedOptionId(nextSelected);
    setOptions(nextOptions);
    onVoteChange?.(nextSelected);
  };

  return (
    <section className="mb-space-2xl select-none">
      <div className="flex flex-col gap-3.5" id="pollOptionsContainer">
        {options.map((opt, index) => {
          const isSelected = selectedOptionId === opt.id;
          const percentage =
            totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
          const letter = String.fromCharCode(65 + index); // 'A', 'B', etc.

          return (
            <button
              key={opt.id}
              onClick={() => handleSelectOption(opt.id)}
              className={`group relative w-full text-left p-5 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all duration-200 overflow-hidden cursor-pointer ${
                isSelected ? 'ring-2 ring-primary-container/40' : ''
              }`}
              data-option={opt.id}
            >
              {/* Animated Filled Progress Track */}
              <div
                className={`absolute inset-y-0 left-0 rounded-2xl transition-all duration-700 ease-out ${
                  isSelected ? 'bg-primary-container/10' : 'bg-surface-dim/40'
                }`}
                style={{ width: `${percentage}%` }}
              />

              {/* Content Layer */}
              <div className="relative z-10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Option Badge / Checkmark */}
                  {isSelected ? (
                    <span className="w-7 h-7 rounded-full bg-primary-container text-white flex items-center justify-center flex-shrink-0 shadow-sm transition-transform scale-100">
                      <span
                        className="material-symbols-outlined text-[16px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check
                      </span>
                    </span>
                  ) : (
                    <span className="w-7 h-7 rounded-full bg-surface-container-highest text-text-secondary flex items-center justify-center text-[13px] font-semibold flex-shrink-0">
                      {letter}
                    </span>
                  )}

                  <div className="min-w-0">
                    <span className="text-[17px] text-text-primary block font-medium tracking-tight">
                      {opt.label}
                    </span>
                    <span className="text-[13px] text-text-secondary">
                      {opt.votes.toLocaleString()} votes
                    </span>
                  </div>
                </div>

                {/* Percentage Display */}
                <div className="flex items-baseline gap-1 flex-shrink-0">
                  <span
                    className={`text-[22px] font-semibold tracking-tight ${
                      isSelected ? 'text-primary-container' : 'text-text-secondary'
                    }`}
                  >
                    {percentage}%
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Poll Metadata & Status Bar */}
      <div className="mt-4 pt-2 flex flex-wrap items-center justify-between gap-2 text-[14px] text-text-secondary">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">how_to_vote</span>
          <span>{totalVotes.toLocaleString()} total community votes</span>
          <span>•</span>
          <span>Poll closes in {pollClosesIn}</span>
        </div>
        <div className="inline-flex items-center gap-1.5 text-primary-container font-medium">
          <span className="material-symbols-outlined text-[16px]">lock_clock</span>
          <span>Anonymous community voting</span>
        </div>
      </div>
    </section>
  );
};
export default VotingPills;
