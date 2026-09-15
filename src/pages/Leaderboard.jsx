import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Medal,
  Crown,
  Sparkles,
  Zap,
  ArrowUpRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Leaderboard() {
  const { leaderboard, user } = useApp();
  const [filter, setFilter] = useState('xp');

  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    if (filter === 'streak') return b.streak - a.streak;
    if (filter === 'sessions') return b.sessions - a.sessions;
    return b.xp - a.xp;
  });

  return (
    <div className="min-h-screen bg-background pt-20 pb-20 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3">
            <Trophy className="w-3.5 h-3.5" />
            <span>Peer Learning Leaderboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-foreground">
            Top Mentors & Learners
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Earn XP, maintain daily study streaks, and rank among the most dedicated collaborators worldwide.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {[
            { id: 'xp', label: 'Highest XP' },
            { id: 'streak', label: 'Longest Streaks' },
            { id: 'sessions', label: 'Most Sessions' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
                filter === tab.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:bg-secondary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Top 3 Podium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {sortedLeaderboard.slice(0, 3).map((item, idx) => {
            const podiumOrder = [
              { place: 1, color: 'from-amber-500/20 to-amber-600/5', border: 'border-amber-500/40', iconColor: 'text-amber-400', crown: true },
              { place: 2, color: 'from-slate-400/20 to-slate-500/5', border: 'border-slate-400/40', iconColor: 'text-slate-300', crown: false },
              { place: 3, color: 'from-amber-700/20 to-amber-800/5', border: 'border-amber-700/40', iconColor: 'text-amber-600', crown: false },
            ][idx];

            return (
              <div
                key={item.handle}
                className={`rounded-3xl border ${podiumOrder.border} bg-gradient-to-b ${podiumOrder.color} bg-card p-6 text-center relative shadow-xl`}
              >
                {podiumOrder.crown && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    <span>#1 Top Mentor</span>
                  </div>
                )}

                <div className="w-16 h-16 rounded-full mx-auto mb-3 bg-secondary p-1 ring-2 ring-border relative">
                  <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center font-display text-xl font-bold text-foreground">
                    {item.name.charAt(0)}
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-card border border-border text-[11px] font-bold flex items-center justify-center text-foreground">
                    #{idx + 1}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-foreground">{item.name}</h3>
                <p className="text-xs text-muted-foreground">{item.handle}</p>

                <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-around text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">XP</span>
                    <strong className="text-foreground font-display font-bold">{item.xp.toLocaleString()}</strong>
                  </div>
                  <div className="text-border">|</div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Streak</span>
                    <strong className="text-amber-400 font-semibold flex items-center gap-0.5">
                      <Flame className="w-3 h-3 fill-amber-400" />
                      {item.streak}d
                    </strong>
                  </div>
                  <div className="text-border">|</div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Level</span>
                    <strong className="text-primary font-bold">Lvl {item.level}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full Table */}
        <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-xl">
          <div className="p-4 sm:p-5 border-b border-border/60 flex items-center justify-between">
            <h2 className="font-display text-sm font-bold text-foreground">Complete Global Standings</h2>
            <span className="text-xs text-muted-foreground">Updated hourly</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-secondary/40 text-muted-foreground font-semibold border-b border-border/60">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Rank</th>
                  <th className="py-3.5 px-4">Member</th>
                  <th className="py-3.5 px-4">Badge</th>
                  <th className="py-3.5 px-4 text-right">Streak</th>
                  <th className="py-3.5 px-4 text-right">Sessions</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Total XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {sortedLeaderboard.map((item, index) => {
                  const isCurrentUser = item.handle === user.handle;
                  return (
                    <tr
                      key={item.handle}
                      className={`hover:bg-secondary/40 transition-colors ${
                        isCurrentUser ? 'bg-primary/5 font-medium' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-foreground">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground">
                            {item.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-semibold text-foreground block">{item.name}</span>
                            <span className="text-[11px] text-muted-foreground">{item.handle}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-secondary border border-border text-foreground">
                          {item.badge}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-amber-400 font-semibold text-xs">
                          <Flame className="w-3 h-3 fill-amber-400" />
                          {item.streak} days
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-foreground">
                        {item.sessions}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right font-bold font-display text-primary">
                        {item.xp.toLocaleString()} XP
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
