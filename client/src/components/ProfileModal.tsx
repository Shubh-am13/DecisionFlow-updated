import React, { useState } from 'react';
import { UserProfile, api, setToken, saveUser, removeToken } from '../services/api';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onAuthSuccess: (user: UserProfile, token: string) => void;
  onLogout: () => void;
  userStats?: {
    dilemmasCount: number;
    votesCount: number;
    commentsCount: number;
  };
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
  onLogout,
  userStats = { dilemmasCount: 1, votesCount: 5, commentsCount: 2 },
}) => {
  const [tab, setTab] = useState<'signin' | 'register'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmitAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'register') {
        if (!name.trim()) {
          setError('Name is required');
          setLoading(false);
          return;
        }
        const res = await api.register(name, email, password);
        if (res.success && res.token && res.user) {
          setToken(res.token);
          saveUser(res.user);
          onAuthSuccess(res.user, res.token);
          onClose();
        } else {
          setError(res.message || 'Registration failed');
        }
      } else {
        const res = await api.login(email, password);
        if (res.success && res.token && res.user) {
          setToken(res.token);
          saveUser(res.user);
          onAuthSuccess(res.user, res.token);
          onClose();
        } else {
          setError(res.message || 'Invalid email or password');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const demoEmail = 'demo_user@crowdwise.ai';
      const demoPassword = 'password123';
      let res = await api.login(demoEmail, demoPassword);
      if (!res.success) {
        res = await api.register('Alex Rivera', demoEmail, demoPassword);
      }
      if (res.success && res.token && res.user) {
        setToken(res.token);
        saveUser(res.user);
        onAuthSuccess(res.user, res.token);
        onClose();
      } else {
        setError(res.message || 'Demo login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Error logging in');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = () => {
    removeToken();
    onLogout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-surface-card rounded-[28px] p-6 md:p-8 shadow-2xl border border-black/[0.04] relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 w-8 h-8 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {currentUser ? (
          /* Logged In View */
          <div>
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative mb-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80"
                  alt={currentUser.name}
                  className="w-20 h-20 rounded-full object-cover shadow-sm ring-4 ring-primary-container/10"
                />
                <span className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white text-[12px]">
                  <span
                    className="material-symbols-outlined text-[14px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check
                  </span>
                </span>
              </div>
              <h2 className="text-[22px] font-semibold text-text-primary tracking-tight">
                {currentUser.name}
              </h2>
              <p className="text-[14px] text-text-secondary">{currentUser.email}</p>
              <span className="mt-2 px-3 py-0.5 rounded-full bg-surface-container-low text-[12px] font-medium text-primary-container inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                Verified Member (JWT Active)
              </span>
            </div>

            {/* Stats Matrix */}
            <div className="grid grid-cols-3 gap-2.5 py-4 mb-6 border-y border-surface-container">
              <div className="text-center p-2 rounded-xl bg-surface-container-low/60">
                <span className="block text-[20px] font-semibold text-text-primary">
                  {userStats.dilemmasCount}
                </span>
                <span className="text-[11px] text-text-secondary uppercase tracking-wider font-medium">
                  Dilemmas
                </span>
              </div>
              <div className="text-center p-2 rounded-xl bg-surface-container-low/60">
                <span className="block text-[20px] font-semibold text-text-primary">
                  {userStats.votesCount}
                </span>
                <span className="text-[11px] text-text-secondary uppercase tracking-wider font-medium">
                  Votes
                </span>
              </div>
              <div className="text-center p-2 rounded-xl bg-surface-container-low/60">
                <span className="block text-[20px] font-semibold text-text-primary">
                  {userStats.commentsCount}
                </span>
                <span className="text-[11px] text-text-secondary uppercase tracking-wider font-medium">
                  Comments
                </span>
              </div>
            </div>

            {/* Account Actions */}
            <div className="space-y-2.5">
              <button
                onClick={handleLogoutClick}
                className="w-full py-2.5 rounded-full bg-surface-container-low hover:bg-red-50 text-red-600 font-medium text-[14px] transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* Authentication Form */
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary-container text-white flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[18px]">lock</span>
              </div>
              <div>
                <h2 className="text-[20px] font-semibold text-text-primary tracking-tight">
                  CrowdWise Account
                </h2>
                <p className="text-[12px] text-text-secondary">
                  Strict JWT Authentication via MongoDB
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex rounded-full bg-surface-container-low p-1 mb-5">
              <button
                onClick={() => {
                  setTab('signin');
                  setError('');
                }}
                className={`flex-1 py-1.5 rounded-full text-[13px] font-medium transition-all ${
                  tab === 'signin'
                    ? 'bg-white text-text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setTab('register');
                  setError('');
                }}
                className={`flex-1 py-1.5 rounded-full text-[13px] font-medium transition-all ${
                  tab === 'register'
                    ? 'bg-white text-text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Create Account
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-[13px] border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmitAuth} className="space-y-3.5">
              {tab === 'register' && (
                <div>
                  <label className="block text-[12px] font-medium text-text-secondary mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-4 py-2 rounded-xl bg-surface-container-low text-text-primary text-[14px] placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-container/40"
                  />
                </div>
              )}

              <div>
                <label className="block text-[12px] font-medium text-text-secondary mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2 rounded-xl bg-surface-container-low text-text-primary text-[14px] placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-container/40"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-text-secondary mb-1">
                  Password (min 6 characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-xl bg-surface-container-low text-text-primary text-[14px] placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-container/40"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-full bg-primary-container text-white text-[14px] font-medium hover:brightness-105 active:scale-95 disabled:opacity-50 transition-all shadow-btn-primary mt-2"
              >
                {loading ? 'Processing...' : tab === 'register' ? 'Register Account' : 'Sign In'}
              </button>
            </form>

            {/* Quick Demo Login Option */}
            <div className="mt-4 pt-4 border-t border-surface-container text-center">
              <p className="text-[12px] text-text-secondary mb-2">
                Want to test authenticated features immediately?
              </p>
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                disabled={loading}
                className="w-full py-2 rounded-full bg-surface-container-low hover:bg-surface-container text-primary-container font-medium text-[13px] transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                1-Click Demo Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ProfileModal;
