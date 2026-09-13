import React, { useState } from 'react';
import { DilemmaData } from './DilemmaCard';

interface NewDilemmaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newDilemma: DilemmaData) => void;
}

export const NewDilemmaModal: React.FC<NewDilemmaModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Career & Life');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const created: DilemmaData = {
      id: `dilemma-${Date.now()}`,
      author: {
        name: 'You',
        handle: '@you',
        avatarUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        timeAgo: 'Just now',
      },
      category: category || 'General',
      title: title.trim(),
      description: description.trim(),
      options: [
        { id: 'A', label: optionA.trim() || 'Option A', votes: 1 },
        { id: 'B', label: optionB.trim() || 'Option B', votes: 0 },
      ],
      pollClosesIn: '3 days',
      aiConfidence: '88% Confidence',
      aiInsights: [
        {
          icon: 'trending_up',
          iconColorClass: 'text-ai-iridescent-blue',
          topic: 'Initial outlook:',
          summary: 'Community consensus indicates strong long-term upside based on similar deliberation threads.',
        },
      ],
      comments: [],
    };

    onSubmit(created);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-surface-card rounded-[28px] p-6 md:p-8 shadow-2xl border border-black/[0.04] relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 w-8 h-8 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-primary-container text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-[16px]">add</span>
          </div>
          <h2 className="text-[20px] font-semibold text-text-primary tracking-tight">
            Create a New Dilemma
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1">
              Dilemma Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Should I accept the startup offer or FAANG?"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-text-primary text-[14px] placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-container/40"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1">
              Context & Details *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your situation, trade-offs, and key decision factors..."
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-text-primary text-[14px] placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-container/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1">
                Option A
              </label>
              <input
                type="text"
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
                placeholder="e.g. Join Early Startup"
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-text-primary text-[13px] placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-container/40"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1">
                Option B
              </label>
              <input
                type="text"
                value={optionB}
                onChange={(e) => setOptionB(e.target.value)}
                placeholder="e.g. Take FAANG Role"
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-text-primary text-[13px] placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-container/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-surface-container-low text-text-primary text-[14px] focus:outline-none focus:ring-2 focus:ring-primary-container/40"
            >
              <option value="Career & Life">Career & Life</option>
              <option value="Engineering & Architecture">Engineering & Architecture</option>
              <option value="Finance & Relocation">Finance & Relocation</option>
              <option value="Product Strategy">Product Strategy</option>
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-[14px] text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-primary-container text-white text-[14px] font-medium hover:brightness-105 active:scale-95 transition-all shadow-btn-primary"
            >
              Publish Dilemma
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default NewDilemmaModal;
