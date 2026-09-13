import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DilemmaCard, { DilemmaData } from './components/DilemmaCard';
import ExploreView from './components/ExploreView';
import CategoriesView from './components/CategoriesView';
import MyDilemmasView from './components/MyDilemmasView';
import NewDilemmaModal from './components/NewDilemmaModal';
import ProfileModal from './components/ProfileModal';
import { api, getSavedUser, UserProfile } from './services/api';

const fallbackDilemma: DilemmaData = {
  id: 'dilemma-chicago',
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

export const App: React.FC = () => {
  const [dilemmas, setDilemmas] = useState<DilemmaData[]>([fallbackDilemma]);
  const [currentDilemmaId, setCurrentDilemmaId] = useState<string>(fallbackDilemma.id);
  const [activeNav, setActiveNav] = useState<'explore' | 'categories' | 'my-dilemmas' | 'dilemma-detail'>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(getSavedUser());
  const [isRegeneratingAI, setIsRegeneratingAI] = useState(false);

  // Load dilemmas from backend MongoDB on startup
  useEffect(() => {
    loadDilemmas();
  }, []);

  const loadDilemmas = async () => {
    try {
      const res = await api.getDilemmas();
      if (res.success && Array.isArray(res.dilemmas) && res.dilemmas.length > 0) {
        const mapped: DilemmaData[] = res.dilemmas.map((doc: any) => ({
          id: doc._id,
          author: {
            name: doc.author?.name || 'Anonymous Member',
            handle: `@${(doc.author?.name || 'user').toLowerCase().replace(/\s+/g, '_')}`,
            avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
            timeAgo: 'Recently',
          },
          category: doc.category || 'Career & Life',
          title: doc.title,
          description: doc.description,
          options: Array.isArray(doc.options) && doc.options.length > 0 ? doc.options : [
            { id: 'A', label: 'Option A', votes: 0 },
            { id: 'B', label: 'Option B', votes: 0 },
          ],
          pollClosesIn: '3 days',
          aiConfidence: doc.aiConfidence || '92% Confidence',
          aiInsights: Array.isArray(doc.aiInsights) && doc.aiInsights.length > 0 ? doc.aiInsights : [
            {
              icon: 'trending_up',
              iconColorClass: 'text-ai-iridescent-blue',
              topic: 'Initial outlook:',
              summary: 'Community deliberations are synthesizing consensus signals.',
            },
          ],
          comments: Array.isArray(doc.comments) ? doc.comments.map((c: any) => ({
            id: c._id || `c-${Math.random()}`,
            authorName: c.userName || 'Community Member',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
            timeAgo: 'Recently',
            text: c.text,
            likes: 0,
            hasLiked: false,
          })) : [],
        }));

        setDilemmas(mapped);
        if (!mapped.some((d) => d.id === currentDilemmaId)) {
          setCurrentDilemmaId(mapped[0].id);
        }
      }
    } catch (err) {
      console.warn('Could not fetch from backend, using fallback data:', err);
    }
  };

  const currentDilemma =
    dilemmas.find((d) => d.id === currentDilemmaId) || dilemmas[0] || fallbackDilemma;

  // Search auto-focuses matching dilemma
  useEffect(() => {
    if (searchQuery.trim()) {
      const match = dilemmas.find(
        (d) =>
          d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (match) {
        setCurrentDilemmaId(match.id);
      }
    }
  }, [searchQuery, dilemmas]);

  const handleSelectDilemma = (dilemma: DilemmaData) => {
    setCurrentDilemmaId(dilemma.id);
    setActiveNav('dilemma-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateDilemma = async (newDilemma: DilemmaData) => {
    try {
      const res = await api.createDilemma({
        title: newDilemma.title,
        description: newDilemma.description,
        category: newDilemma.category,
        options: newDilemma.options,
      });

      if (res.success && res.dilemma) {
        const created: DilemmaData = {
          ...newDilemma,
          id: res.dilemma._id,
          aiConfidence: res.dilemma.aiConfidence || '92% Confidence',
          aiInsights: res.dilemma.aiInsights || newDilemma.aiInsights,
        };
        setDilemmas((prev) => [created, ...prev]);
        setCurrentDilemmaId(created.id);
      } else {
        setDilemmas((prev) => [newDilemma, ...prev]);
        setCurrentDilemmaId(newDilemma.id);
      }
    } catch {
      setDilemmas((prev) => [newDilemma, ...prev]);
      setCurrentDilemmaId(newDilemma.id);
    }

    setActiveNav('dilemma-detail');
  };

  const handleVote = async (optionId: string | null) => {
    if (!optionId) return;
    try {
      await api.voteDilemma(currentDilemma.id, optionId);
    } catch (err) {
      console.warn('Vote could not be sent to backend:', err);
    }
  };

  const handleAddComment = async (text: string) => {
    try {
      await api.addComment(currentDilemma.id, text);
    } catch (err) {
      console.warn('Comment could not be sent to backend:', err);
    }
  };

  const handleRegenerateAI = async () => {
    setIsRegeneratingAI(true);
    try {
      const res = await api.triggerAIConsensus(currentDilemma.id);
      if (res.success && res.aiInsights) {
        setDilemmas((prev) =>
          prev.map((d) =>
            d.id === currentDilemma.id
              ? { ...d, aiConfidence: res.aiConfidence, aiInsights: res.aiInsights }
              : d
          )
        );
      }
    } catch (err) {
      console.error('Error generating AI consensus:', err);
    } finally {
      setIsRegeneratingAI(false);
    }
  };

  return (
    <div className="bg-canvas-bg min-h-screen flex flex-col selection:bg-primary-container/20 selection:text-primary-container">
      {/* 1. Fixed Top Header */}
      <Header
        activeNav={activeNav === 'dilemma-detail' ? 'explore' : activeNav}
        onNavChange={(nav) => {
          setActiveNav(nav);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNewDilemmaClick={() => setIsNewModalOpen(true)}
        onProfileClick={() => setIsProfileModalOpen(true)}
        currentUser={currentUser}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Main Content Area */}
      <main className="w-full pt-24 pb-16 flex-1">
        <div className="max-w-[1024px] mx-auto px-margin">
          {/* VIEW: EXPLORE */}
          {activeNav === 'explore' && (
            <ExploreView
              dilemmas={dilemmas}
              onSelectDilemma={handleSelectDilemma}
              onNewDilemmaClick={() => setIsNewModalOpen(true)}
              searchQuery={searchQuery}
            />
          )}

          {/* VIEW: CATEGORIES */}
          {activeNav === 'categories' && (
            <CategoriesView
              dilemmas={dilemmas}
              onSelectDilemma={handleSelectDilemma}
            />
          )}

          {/* VIEW: MY DILEMMAS */}
          {activeNav === 'my-dilemmas' && (
            <MyDilemmasView
              dilemmas={dilemmas}
              currentUser={currentUser}
              onSelectDilemma={handleSelectDilemma}
              onNewDilemmaClick={() => setIsNewModalOpen(true)}
              onOpenAuth={() => setIsProfileModalOpen(true)}
            />
          )}

          {/* VIEW: DILEMMA DETAIL */}
          {activeNav === 'dilemma-detail' && (
            <div className="flex flex-col w-full items-center">
              {/* Breadcrumb Bar */}
              <div className="w-full max-w-[820px] flex items-center justify-between mb-space-lg">
                <button
                  onClick={() => setActiveNav('explore')}
                  className="inline-flex items-center gap-1.5 text-[14px] text-primary-container hover:opacity-80 transition-opacity font-medium"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back_ios</span>
                  <span>Back to Explore</span>
                </button>

                <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-text-secondary">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live Dilemma</span>
                </div>
              </div>

              {/* Main Central Dilemma Card */}
              <DilemmaCard
                key={currentDilemma.id}
                dilemma={currentDilemma}
                onVote={handleVote}
                onAddComment={handleAddComment}
                onRegenerateAI={handleRegenerateAI}
                isRegeneratingAI={isRegeneratingAI}
              />
            </div>
          )}
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="w-full bg-canvas-bg border-t border-black/[0.04] py-8">
        <div className="max-w-[1024px] mx-auto px-margin flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-text-secondary">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
              CrowdWise
            </span>
            <span>•</span>
            <span>Collective wisdom platform powered by Gemini 3.6 Flash & MongoDB Atlas</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveNav('explore')}
              className="hover:text-text-primary transition-colors"
            >
              Explore
            </button>
            <button
              onClick={() => setActiveNav('categories')}
              className="hover:text-text-primary transition-colors"
            >
              Categories
            </button>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="hover:text-text-primary transition-colors"
            >
              {currentUser ? 'My Account' : 'Sign In'}
            </button>
            <span className="text-text-secondary/60">© 2025 CrowdWise Inc.</span>
          </div>
        </div>
      </footer>

      {/* New Dilemma Modal */}
      <NewDilemmaModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={handleCreateDilemma}
      />

      {/* Profile & JWT Auth Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          loadDilemmas();
        }}
        onLogout={() => setCurrentUser(null)}
        userStats={{
          dilemmasCount: dilemmas.filter((d) => d.author.name === currentUser?.name).length,
          votesCount: 14,
          commentsCount: 6,
        }}
      />
    </div>
  );
};

export default App;
