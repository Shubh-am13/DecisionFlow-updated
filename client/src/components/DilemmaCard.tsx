import React, { useState } from 'react';
import VotingPills, { VotingOption } from './VotingPills';
import AIConsensus, { AIInsight } from './AIConsensus';
import CommunityPerspectives, { PerspectiveComment } from './CommunityPerspectives';

export interface DilemmaData {
  id: string;
  author: {
    name: string;
    handle: string;
    avatarUrl: string;
    timeAgo: string;
  };
  category: string;
  title: string;
  description: string;
  options: VotingOption[];
  pollClosesIn: string;
  aiConfidence: string;
  aiInsights: AIInsight[];
  comments: PerspectiveComment[];
}

interface DilemmaCardProps {
  dilemma?: DilemmaData;
  onVote?: (optionId: string | null) => void;
  onAddComment?: (text: string) => void;
  onRegenerateAI?: () => void;
  isRegeneratingAI?: boolean;
}

const defaultDilemma: DilemmaData = {
  id: 'dilemma-1',
  author: {
    name: 'Sarah Jenkins',
    handle: '@sarah_j',
    avatarUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    timeAgo: '3 hours ago',
  },
  category: 'Career & Life',
  title: 'Should I take the job in Chicago or stay near family?',
  description:
    'Offered an associate product design role ($78k + relocation) in Chicago. Torn between building my career independence and missing weekly family dinners back home in Michigan.',
  options: [
    { id: 'A', label: 'Move to Chicago', votes: 1420 },
    { id: 'B', label: 'Stay near family', votes: 668 },
  ],
  pollClosesIn: '2 days',
  aiConfidence: '94% Confidence',
  aiInsights: [
    {
      icon: 'trending_up',
      iconColorClass: 'text-ai-iridescent-blue',
      topic: 'Career momentum:',
      summary:
        'Voters overwhelmingly note that relocating in your 20s accelerates long-term growth and confidence, with home only a short train ride away.',
    },
    {
      icon: 'calendar_month',
      iconColorClass: 'text-ai-iridescent-purple',
      topic: 'Transition timeline:',
      summary:
        'Several alumni recommend a 1-year personal commitment test to build financial savings before deciding whether to stay permanent.',
    },
  ],
  comments: [
    {
      id: 'c1',
      authorName: 'Marcus Vance',
      roleTag: 'Lead Designer @ Stripe',
      avatarUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      timeAgo: '2h ago',
      text: 'Made this exact move from Grand Rapids to River North 4 years ago. Chicago is practically neighborly to MI. An Amtrak Wolverine ticket gets you home in under four hours anytime you crave home-cooked food. Go for it!',
      likes: 184,
      hasLiked: false,
    },
    {
      id: 'c2',
      authorName: 'Elena Rostova',
      roleTag: 'Alumni Advisor',
      avatarUrl:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      timeAgo: '1h ago',
      text: "Frame it as an experiment rather than a final verdict. Agree with your family upfront on designated holiday and weekend visits so nobody feels neglected. You will regret the risks you didn't take.",
      likes: 92,
      hasLiked: false,
    },
  ],
};

export const DilemmaCard: React.FC<DilemmaCardProps> = ({
  dilemma = defaultDilemma,
  onVote,
  onAddComment,
  onRegenerateAI,
  isRegeneratingAI,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  return (
    <article className="w-full max-w-[820px] bg-surface-card rounded-dilemma p-8 md:p-12 shadow-dilemma-card border border-black/[0.03] transition-all">
      {/* 1. Header: Author Meta & Controls */}
      <header className="flex items-start justify-between gap-space-md mb-space-xl">
        <div className="flex items-center gap-space-md min-w-0">
          <div className="relative flex-shrink-0">
            <img
              src={dilemma.author.avatarUrl}
              alt={dilemma.author.name}
              className="w-14 h-14 rounded-full object-cover shadow-sm ring-2 ring-white"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-primary-container rounded-full flex items-center justify-center text-white">
              <span
                className="material-symbols-outlined text-[11px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check
              </span>
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-[20px] font-semibold text-text-primary tracking-tight truncate">
                {dilemma.author.name}
              </h2>
              <span className="text-[14px] text-text-secondary">
                {dilemma.author.handle}
              </span>
              <span className="text-text-secondary text-[12px]">•</span>
              <span className="text-[14px] text-text-secondary">
                {dilemma.author.timeAgo}
              </span>
            </div>
            <div className="mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-surface-container-low text-[12px] text-text-secondary font-medium">
                {dilemma.category}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons (Bookmark & Share) */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            aria-label="Bookmark dilemma"
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              isBookmarked
                ? 'bg-primary-container/10 text-primary-container'
                : 'bg-surface-container-low hover:bg-surface-container text-text-secondary hover:text-text-primary'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{
                fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              bookmark
            </span>
          </button>

          <button
            aria-label="Share dilemma"
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-text-secondary hover:text-text-primary transition-all active:scale-95 relative"
          >
            <span className="material-symbols-outlined text-[20px]">
              {shareCopied ? 'check' : 'ios_share'}
            </span>
            {shareCopied && (
              <span className="absolute -top-8 px-2 py-0.5 bg-black text-white text-[11px] rounded-md shadow whitespace-nowrap">
                Copied!
              </span>
            )}
          </button>
        </div>
      </header>

      {/* 2. Question & Context */}
      <section className="mb-space-xl">
        <h1 className="text-[34px] md:text-[40px] font-semibold tracking-tight text-text-primary leading-[1.18] mb-space-md">
          {dilemma.title}
        </h1>
        <p className="text-[17px] md:text-[19px] text-on-surface-variant leading-relaxed max-w-2xl font-normal">
          {dilemma.description}
        </p>
      </section>

      {/* 3. Clean A/B Voting Poll */}
      <VotingPills
        key={`poll-${dilemma.id}`}
        initialOptions={dilemma.options}
        pollClosesIn={dilemma.pollClosesIn}
        onVoteChange={onVote}
      />

      {/* 4. Magical Apple Intelligence 'AI Consensus' Card */}
      <AIConsensus
        key={`ai-${dilemma.id}`}
        confidence={dilemma.aiConfidence}
        insights={dilemma.aiInsights}
        onRegenerateAI={onRegenerateAI}
        isRegenerating={isRegeneratingAI}
      />

      {/* 5. Community Perspectives Threaded Discussion */}
      <CommunityPerspectives
        key={`perspectives-${dilemma.id}`}
        initialComments={dilemma.comments}
        dilemmaAuthorFirstName={dilemma.author.name.split(' ')[0]}
        onAddComment={onAddComment}
      />
    </article>
  );
};
export default DilemmaCard;
