import React from 'react';
import { DilemmaData } from './DilemmaCard';
import { UserProfile } from '../services/api';

interface MyDilemmasViewProps {
  dilemmas: DilemmaData[];
  currentUser: UserProfile | null;
  onSelectDilemma: (dilemma: DilemmaData) => void;
  onNewDilemmaClick: () => void;
  onOpenAuth: () => void;
}

export const MyDilemmasView: React.FC<MyDilemmasViewProps> = ({
  dilemmas,
  currentUser,
  onSelectDilemma,
  onNewDilemmaClick,
  onOpenAuth,
}) => {
  // If user is logged in, filter dilemmas where author name matches or author handle is @you
  const myDilemmas = currentUser
    ? dilemmas.filter(
        (d) =>
          d.author.name === currentUser.name ||
          d.author.handle === '@you' ||
          d.id.startsWith('dilemma-')
      )
    : [];

  const totalVotesReceived = myDilemmas.reduce(
    (sum, d) => sum + d.options.reduce((s, o) => s + o.votes, 0),
    0
  );
  const totalCommentsReceived = myDilemmas.reduce((sum, d) => sum + d.comments.length, 0);

  if (!currentUser) {
    return (
      <div className="w-full max-w-[820px] mx-auto text-center py-16 px-4 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-primary-container/10 text-primary-container flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-[32px]">account_circle</span>
        </div>
        <h2 className="text-[26px] font-semibold text-text-primary tracking-tight">
          Sign In to Access My Dilemmas
        </h2>
        <p className="text-[15px] text-text-secondary max-w-md mx-auto mt-2 mb-6">
          Track all your community deliberations, monitor incoming votes in real time, and review AI Consensus synthesis.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-2.5 rounded-full bg-primary-container text-white text-[14px] font-medium hover:brightness-105 active:scale-95 transition-all shadow-btn-primary"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[820px] mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] md:text-[32px] font-semibold text-text-primary tracking-tight">
            My Dilemmas
          </h1>
          <p className="text-[14px] text-text-secondary mt-1">
            Managing deliberations authored by {currentUser.name} ({currentUser.email})
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

      {/* Analytics Summary */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="p-5 rounded-[22px] bg-surface-card border border-black/[0.03] shadow-sm text-center">
          <span className="block text-[28px] font-bold text-text-primary">
            {myDilemmas.length}
          </span>
          <span className="text-[12px] text-text-secondary uppercase tracking-wider font-semibold">
            Authored Dilemmas
          </span>
        </div>

        <div className="p-5 rounded-[22px] bg-surface-card border border-black/[0.03] shadow-sm text-center">
          <span className="block text-[28px] font-bold text-primary-container">
            {totalVotesReceived.toLocaleString()}
          </span>
          <span className="text-[12px] text-text-secondary uppercase tracking-wider font-semibold">
            Total Votes
          </span>
        </div>

        <div className="p-5 rounded-[22px] bg-surface-card border border-black/[0.03] shadow-sm text-center">
          <span className="block text-[28px] font-bold text-emerald-600">
            {totalCommentsReceived}
          </span>
          <span className="text-[12px] text-text-secondary uppercase tracking-wider font-semibold">
            Perspectives
          </span>
        </div>
      </div>

      {/* Authored Dilemmas List */}
      <div className="space-y-4">
        {myDilemmas.length === 0 ? (
          <div className="text-center py-16 px-4 bg-surface-card rounded-[24px] border border-black/[0.03]">
            <span className="material-symbols-outlined text-text-secondary text-[40px] mb-2 block">
              post_add
            </span>
            <h3 className="text-[18px] font-semibold text-text-primary">No dilemmas published yet</h3>
            <p className="text-[14px] text-text-secondary mt-1 mb-4">
              Post your first real-world decision dilemma to harness community wisdom and AI consensus.
            </p>
            <button
              onClick={onNewDilemmaClick}
              className="px-5 py-2 rounded-full bg-primary-container text-white text-[13px] font-medium shadow-btn-primary"
            >
              Post a Dilemma
            </button>
          </div>
        ) : (
          myDilemmas.map((d) => (
            <div
              key={d.id}
              onClick={() => onSelectDilemma(d)}
              className="p-6 rounded-[24px] bg-surface-card hover:bg-surface-container-low/40 border border-black/[0.03] shadow-sm hover:shadow transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container-low text-[11px] font-medium text-text-secondary">
                  {d.category}
                </span>
                <span className="text-[12px] text-text-secondary">{d.author.timeAgo}</span>
              </div>

              <h3 className="text-[18px] md:text-[20px] font-semibold text-text-primary group-hover:text-primary-container transition-colors tracking-tight mb-2">
                {d.title}
              </h3>

              <p className="text-[14px] text-on-surface-variant line-clamp-2 mb-4">
                {d.description}
              </p>

              <div className="flex items-center justify-between text-[13px] text-text-secondary pt-3 border-t border-surface-container">
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">how_to_vote</span>
                    {d.options.reduce((s, o) => s + o.votes, 0).toLocaleString()} votes
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">chat_bubble_outline</span>
                    {d.comments.length} perspectives
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 text-primary-container font-medium group-hover:translate-x-0.5 transition-transform">
                  <span>View Details</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default MyDilemmasView;
