import React from 'react';

export interface AIInsight {
  id?: string;
  icon: string;
  iconColorClass: string;
  topic: string;
  summary: string;
}

interface AIConsensusProps {
  confidence?: string;
  insights?: AIInsight[];
  onRegenerateAI?: () => void;
  isRegenerating?: boolean;
}

export const AIConsensus: React.FC<AIConsensusProps> = ({
  confidence = '94% Confidence',
  insights = [
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
  onRegenerateAI,
  isRegenerating = false,
}) => {
  return (
    <section className="mb-space-2xl relative p-6 md:p-8 rounded-ai bg-gradient-to-b from-white/90 to-surface-container-low/70 backdrop-blur-xl shadow-ai-consensus border border-white/60">
      {/* Subtle Iridescent Glow Rim */}
      <div
        className="absolute -inset-[1.5px] rounded-ai-rim pointer-events-none bg-gradient-to-r from-ai-iridescent-blue/30 via-ai-iridescent-purple/20 to-ai-iridescent-blue/25 -z-10 opacity-75"
        aria-hidden="true"
      />

      {/* Card Header: Sparkle + Badge & Gemini CTA */}
      <div className="flex items-center justify-between gap-space-md mb-space-md flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-ai-iridescent-blue/20 to-ai-iridescent-purple/20 flex items-center justify-center text-ai-iridescent-blue shadow-sm">
            <span
              className={`material-symbols-outlined text-[18px] ${isRegenerating ? 'animate-spin' : ''}`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
          </span>
          <div>
            <span className="text-[20px] font-semibold text-text-primary tracking-tight block">
              AI Consensus
            </span>
            <span className="text-[11px] text-text-secondary font-medium -mt-1 block">
              Powered by Google Gemini 3.6 Flash
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onRegenerateAI && (
            <button
              onClick={onRegenerateAI}
              disabled={isRegenerating}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-card hover:bg-white text-[12px] font-medium text-primary-container border border-primary-container/20 shadow-sm hover:shadow transition-all disabled:opacity-50"
              title="Run live Gemini AI Consensus on latest community votes & comments"
            >
              <span className={`material-symbols-outlined text-[14px] ${isRegenerating ? 'animate-spin' : ''}`}>
                sync
              </span>
              <span>{isRegenerating ? 'Synthesizing...' : 'Gemini Refresh'}</span>
            </button>
          )}

          <span className="px-3 py-1 rounded-full bg-surface-container text-[11px] text-text-secondary font-semibold tracking-wider uppercase">
            {confidence}
          </span>
        </div>
      </div>

      {/* Synthesis Insights */}
      <div className="space-y-4 text-[16px] text-on-surface-variant leading-relaxed">
        {insights.map((insight, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <span
              className={`material-symbols-outlined text-[20px] flex-shrink-0 mt-0.5 ${insight.iconColorClass}`}
            >
              {insight.icon}
            </span>
            <p>
              <strong className="text-text-primary font-medium mr-1.5">
                {insight.topic}
              </strong>
              {insight.summary}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
export default AIConsensus;
