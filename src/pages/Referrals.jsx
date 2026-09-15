import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  Users,
  Trophy,
  Gift,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Referrals() {
  const { user } = useApp();
  const [copied, setCopied] = useState(false);

  const referralCode = user?.referralCode || 'SKILL2026';
  const referralUrl = `https://skillswap.io/join?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const perks = [
    { title: 'Invite 1 Friend', reward: '+250 XP & "Networker" Badge', unlocked: true },
    { title: 'Invite 5 Friends', reward: '+1,000 XP & Verified Reciprocal Mentor Flair', unlocked: true },
    { title: 'Invite 10 Friends', reward: '+2,500 XP & Top Priority Matching Engine Slot', unlocked: false },
  ];

  return (
    <div className="min-h-screen bg-background pt-20 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <Gift className="w-3.5 h-3.5" />
            <span>Community Invitation Program</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-foreground">
            Invite Peers, Grow Together
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Share your custom referral link with developers and designers. Earn XP and unlock priority matching.
          </p>
        </div>

        {/* Link Share Box */}
        <div className="rounded-3xl border border-border/80 bg-gradient-to-b from-card to-secondary/30 p-6 sm:p-8 mb-8 shadow-xl">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Your Unique Referral Link
          </h3>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4">
            <div className="flex-1 bg-secondary/80 border border-border rounded-xl px-4 py-3 text-xs sm:text-sm font-mono text-foreground truncate">
              {referralUrl}
            </div>
            <button
              onClick={handleCopy}
              className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/20"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Referral Code:</span>
            <span className="font-mono font-bold text-foreground bg-secondary px-2.5 py-0.5 rounded border border-border">
              {user.referralCode}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <div className="rounded-2xl border border-border/80 bg-card p-5">
            <span className="text-xs text-muted-foreground">Friends Joined</span>
            <p className="text-2xl font-display font-extrabold text-foreground mt-1">
              {user?.referralsCount || 0}
            </p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-card p-5">
            <span className="text-xs text-muted-foreground">XP Earned from Invites</span>
            <p className="text-2xl font-display font-extrabold text-primary mt-1">
              +1,500 XP
            </p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-card p-5">
            <span className="text-xs text-muted-foreground">Reward Status</span>
            <p className="text-2xl font-display font-extrabold text-emerald-400 mt-1">
              Tier 2 Active
            </p>
          </div>
        </div>

        {/* Reward Tiers */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-xl">
          <h3 className="font-display text-base font-bold text-foreground mb-4">
            Referral Milestone Milestones
          </h3>
          <div className="space-y-4">
            {perks.map((p) => (
              <div
                key={p.title}
                className={`p-4 rounded-2xl border flex items-center justify-between text-xs sm:text-sm ${
                  p.unlocked
                    ? 'bg-secondary/40 border-border text-foreground'
                    : 'bg-card/40 border-border/40 text-muted-foreground opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      p.unlocked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {p.unlocked ? <Check className="w-3.5 h-3.5" /> : '•'}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.reward}</p>
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    p.unlocked
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {p.unlocked ? 'Unlocked' : 'In progress'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
