import React, { useState, useEffect } from 'react';

export interface PerspectiveComment {
  id: string;
  authorName: string;
  roleTag?: string;
  avatarUrl: string;
  timeAgo: string;
  text: string;
  likes: number;
  hasLiked?: boolean;
  replies?: PerspectiveComment[];
}

interface CommunityPerspectivesProps {
  initialComments?: PerspectiveComment[];
  dilemmaAuthorFirstName?: string;
  onAddComment?: (text: string) => void;
}

export const CommunityPerspectives: React.FC<CommunityPerspectivesProps> = ({
  initialComments = [
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
  dilemmaAuthorFirstName = 'Sarah',
  onAddComment,
}) => {
  const [comments, setComments] = useState<PerspectiveComment[]>(initialComments);
  const [inputText, setInputText] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    setComments(initialComments);
    setActiveReplyId(null);
  }, [initialComments]);

  const handleShare = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const newComment: PerspectiveComment = {
      id: `comment-${Date.now()}`,
      authorName: 'You',
      roleTag: 'Community Member',
      avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      timeAgo: 'Just now',
      text: trimmed,
      likes: 1,
      hasLiked: true,
    };

    setComments([newComment, ...comments]);
    setInputText('');
    onAddComment?.(trimmed);
  };

  const handleToggleLike = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const hasLiked = !c.hasLiked;
          return {
            ...c,
            hasLiked,
            likes: hasLiked ? c.likes + 1 : Math.max(0, c.likes - 1),
          };
        }
        return c;
      })
    );
  };

  const handlePostReply = (parentCommentId: string) => {
    const trimmed = replyText.trim();
    if (!trimmed) return;

    const reply: PerspectiveComment = {
      id: `reply-${Date.now()}`,
      authorName: 'You',
      roleTag: 'Community Member',
      avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      timeAgo: 'Just now',
      text: trimmed,
      likes: 0,
      hasLiked: false,
    };

    setComments((prev) =>
      prev.map((c) => {
        if (c.id === parentCommentId) {
          return {
            ...c,
            replies: [...(c.replies || []), reply],
          };
        }
        return c;
      })
    );

    setReplyText('');
    setActiveReplyId(null);
  };

  return (
    <section>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-space-lg">
        <div className="flex items-center gap-2">
          <h3 className="text-[20px] font-semibold text-text-primary tracking-tight">
            Community Perspectives
          </h3>
          <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full bg-surface-container-low text-text-secondary">
            {comments.length}
          </span>
        </div>
        <button className="text-[14px] text-primary-container font-medium hover:opacity-80 transition-opacity">
          Top perspectives
        </button>
      </div>

      {/* Clean Minimalist Input Bar */}
      <div className="relative mb-space-xl">
        <div className="flex items-center bg-surface-container-low rounded-full px-5 py-2.5 transition-all focus-within:bg-white focus-within:shadow-[0_0_0_2px_#0071E3]">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleShare();
            }}
            placeholder={`Share your perspective with ${dilemmaAuthorFirstName}...`}
            className="w-full bg-transparent text-[14px] text-text-primary placeholder:text-text-secondary focus:outline-none pr-3"
          />
          <button
            onClick={handleShare}
            disabled={!inputText.trim()}
            className="flex-shrink-0 px-4 py-1.5 rounded-full bg-primary-container text-white text-[14px] font-medium hover:brightness-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-btn-primary"
          >
            Share
          </button>
        </div>
      </div>

      {/* Curated Responses Feed */}
      <div className="flex flex-col gap-space-lg">
        {comments.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-2xl bg-surface-container-low/50 border border-dashed border-surface-container">
            <span className="material-symbols-outlined text-text-secondary text-[36px] mb-2 block">
              chat_bubble_outline
            </span>
            <p className="text-[15px] font-medium text-text-primary">
              No perspectives shared yet
            </p>
            <p className="text-[13px] text-text-secondary mt-1">
              Be the first community member to share your perspective above!
            </p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <React.Fragment key={comment.id}>
              {index > 0 && <div className="w-full h-[1px] bg-surface-container" />}

              <div className="flex items-start gap-3.5 group">
                <img
                  src={comment.avatarUrl}
                  alt={comment.authorName}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0 shadow-sm"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[15px] font-medium text-text-primary">
                        {comment.authorName}
                      </span>
                      {comment.roleTag && (
                        <span className="text-[12px] text-text-secondary font-normal">
                          {comment.roleTag}
                        </span>
                      )}
                    </div>
                    <span className="text-[13px] text-text-secondary">
                      {comment.timeAgo}
                    </span>
                  </div>

                  <p className="text-[15px] text-on-surface-variant leading-relaxed mb-2">
                    {comment.text}
                  </p>

                  {/* Actions: Likes & Reply */}
                  <div className="flex items-center gap-4 text-[13px] text-text-secondary">
                    <button
                      onClick={() => handleToggleLike(comment.id)}
                      className={`flex items-center gap-1 transition-colors ${
                        comment.hasLiked
                          ? 'text-primary-container font-medium'
                          : 'hover:text-text-primary'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-[16px]"
                        style={{
                          fontVariationSettings: comment.hasLiked ? "'FILL' 1" : "'FILL' 0",
                        }}
                      >
                        thumb_up
                      </span>
                      <span>{comment.likes}</span>
                    </button>

                    <button
                      onClick={() =>
                        setActiveReplyId(
                          activeReplyId === comment.id ? null : comment.id
                        )
                      }
                      className="hover:text-text-primary transition-colors font-normal"
                    >
                      {activeReplyId === comment.id ? 'Cancel' : 'Reply'}
                    </button>
                  </div>

                  {/* Inline Reply Input */}
                  {activeReplyId === comment.id && (
                    <div className="mt-3 flex items-center gap-2 bg-surface-container-low rounded-full px-4 py-1.5">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handlePostReply(comment.id);
                        }}
                        placeholder={`Reply to ${comment.authorName}...`}
                        className="flex-1 bg-transparent text-[13px] text-text-primary placeholder:text-text-secondary focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handlePostReply(comment.id)}
                        className="px-3 py-1 bg-primary-container text-white rounded-full text-[12px] font-medium hover:brightness-105"
                      >
                        Send
                      </button>
                    </div>
                  )}

                  {/* Nested Threaded Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3.5 space-y-3 pl-4 border-l-2 border-surface-container">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start gap-2.5">
                          <img
                            src={reply.avatarUrl}
                            alt={reply.authorName}
                            className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-medium text-text-primary">
                                {reply.authorName}
                              </span>
                              <span className="text-[11px] text-text-secondary">
                                {reply.timeAgo}
                              </span>
                            </div>
                            <p className="text-[13px] text-on-surface-variant leading-relaxed">
                              {reply.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </React.Fragment>
          ))
        )}
      </div>

      {/* Load More Button */}
      {comments.length > 2 && (
        <div className="mt-space-lg text-center">
          <button className="px-6 py-2 rounded-full bg-surface-container-low hover:bg-surface-container text-text-primary text-[14px] font-medium transition-all duration-200">
            View all {comments.length} perspectives
          </button>
        </div>
      )}
    </section>
  );
};
export default CommunityPerspectives;
