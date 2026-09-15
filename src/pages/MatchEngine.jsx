import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeftRight,
  MessageSquare,
  Calendar,
  Video,
  Star,
  Loader2,
  RefreshCw,
  Zap,
  Target,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { findSkillMatches } from '../lib/supabaseApi';
import SkillTag from '../components/SkillTag';

export default function MatchEngine() {
  const navigate = useNavigate();
  const { user, scheduleSession, sendConnectionRequest } = useApp();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const loadMatches = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const results = await findSkillMatches(user.id);
      setMatches(results);
    } catch (err) {
      console.error('Error finding matches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, [user?.id]);

  const handleConnect = async (peerId) => {
    await sendConnectionRequest(peerId);
    setToast('Connection request sent! 🤝');
    setTimeout(() => setToast(''), 3000);
  };

  const handleSchedule = async (peer) => {
    const topic = `Skill Exchange: ${peer.iTeachTheyLearn?.[0] || 'Skills'} ↔ ${peer.theyTeachILearn?.[0] || 'Skills'}`;
    const session = await scheduleSession(
      peer.id,
      topic,
      peer.theyTeachILearn?.[0] || 'Knowledge',
      'Tomorrow, 4:00 PM',
      '60 mins'
    );
    if (session) {
      setToast(`Session scheduled with ${peer.name}! 📅`);
      setTimeout(() => navigate('/sessions'), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-extrabold text-foreground">
                Smart Skill Matching
              </h1>
              <p className="text-xs text-muted-foreground">
                AI-powered matches based on reciprocal skill exchange
              </p>
            </div>
          </div>

          {/* Your Skills Summary */}
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-emerald-500/5 p-4 mt-4">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-primary tracking-wider">You Teach</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {user?.skillsToTeach?.map((s) => (
                    <SkillTag key={s} label={s} variant="teach" />
                  )) || <span className="text-xs text-muted-foreground">No teaching skills set</span>}
                </div>
              </div>
              <ArrowLeftRight className="w-5 h-5 text-primary/50" />
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">You Want to Learn</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {user?.skillsToLearn?.map((s) => (
                    <SkillTag key={s} label={s} variant="learn" />
                  )) || <span className="text-xs text-muted-foreground">No learning goals set</span>}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={loadMatches}
            disabled={loading}
            className="mt-4 px-4 py-2 rounded-xl border border-border bg-secondary/50 text-foreground text-xs font-semibold hover:bg-secondary transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Matches
          </button>
        </div>

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-600 text-white text-sm font-semibold shadow-xl animate-pulse">
            {toast}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
            <p className="text-sm text-muted-foreground">Finding your perfect skill matches...</p>
          </div>
        )}

        {/* No Matches */}
        {!loading && matches.length === 0 && (
          <div className="rounded-3xl border border-border/80 bg-card p-12 text-center">
            <Target className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">No matches yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Update your skills or wait for more users to join. Matches are based on reciprocal skill overlap.
            </p>
            <button
              onClick={() => navigate('/profile')}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all"
            >
              Update Your Skills
            </button>
          </div>
        )}

        {/* Match Results */}
        {!loading && matches.length > 0 && (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Found <strong className="text-foreground">{matches.length}</strong> skill matches
            </p>

            {matches.map((match) => (
              <div
                key={match.id}
                className={`rounded-2xl border bg-card p-5 shadow-lg transition-all hover:shadow-xl ${
                  match.isReciprocal
                    ? 'border-emerald-500/40 ring-1 ring-emerald-500/10'
                    : 'border-border/80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Avatar & Info */}
                  <div className="flex items-start gap-3 flex-1">
                    <div className="relative">
                      <img
                        src={match.avatar_url || match.avatar}
                        alt={match.name}
                        className="w-14 h-14 rounded-xl object-cover ring-1 ring-border"
                      />
                      {match.isReciprocal && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Zap className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-foreground">{match.name}</h3>
                        <span className="text-[10px] text-muted-foreground">{match.handle}</span>
                        {match.isReciprocal && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">
                            ⚡ Perfect Match
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                          {match.matchPercent}% match
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{match.title || 'SkillSwap Member'}</p>

                      {/* Skill Overlap */}
                      <div className="mt-3 space-y-2">
                        {match.theyTeachILearn.length > 0 && (
                          <div>
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">They can teach you</span>
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {match.theyTeachILearn.map((s) => (
                                <span key={s} className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {match.iTeachTheyLearn.length > 0 && (
                          <div>
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">You can teach them</span>
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {match.iTeachTheyLearn.map((s) => (
                                <span key={s} className="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-400 text-[10px] font-semibold border border-blue-500/20">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2">
                    <button
                      onClick={() => handleSchedule(match)}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Schedule
                    </button>
                    <button
                      onClick={() => navigate(`/chat/${match.id}`)}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-border bg-secondary/50 text-foreground text-xs font-semibold hover:bg-secondary transition-all flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Message
                    </button>
                    <button
                      onClick={() => handleConnect(match.id)}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
