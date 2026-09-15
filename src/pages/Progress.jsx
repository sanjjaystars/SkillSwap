import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Clock,
  Award,
  Flame,
  CheckCircle,
  Calendar,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Progress() {
  const { user } = useApp();

  const currentUser = user || {
    level: 1,
    xp: 150,
    streakDays: 1,
    sessionsCompleted: 0,
  };

  const milestones = [
    { title: 'First Exchange Complete', date: 'Aug 15, 2026', xp: '+100 XP', achieved: true },
    { title: '7-Day Learning Streak', date: 'Aug 22, 2026', xp: '+250 XP', achieved: true },
    { title: 'Top Rated Peer (5.0 Stars)', date: 'Sep 01, 2026', xp: '+500 XP', achieved: true },
    { title: '14-Day Consistent Streak', date: 'Sep 14, 2026', xp: '+400 XP', achieved: true },
    { title: '30 Completed Sessions', date: 'In progress (28/30)', xp: '+1,000 XP', achieved: false },
    { title: 'Master Mentor Level 10', date: 'In progress', xp: '+2,500 XP', achieved: false },
  ];

  const weeklyHours = [
    { day: 'Mon', hours: 2.5, percent: 60 },
    { day: 'Tue', hours: 3.0, percent: 75 },
    { day: 'Wed', hours: 1.5, percent: 40 },
    { day: 'Thu', hours: 4.0, percent: 95 },
    { day: 'Fri', hours: 3.5, percent: 85 },
    { day: 'Sat', hours: 5.0, percent: 100 },
    { day: 'Sun', hours: 2.0, percent: 50 },
  ];

  const currentLevelMinXp = (currentUser.level - 1) * 500;
  const currentLevelMaxXp = currentUser.level * 500;
  const progressInLevel = currentUser.xp - currentLevelMinXp;
  const levelPercentage = Math.min(100, Math.round((progressInLevel / 500) * 100));

  return (
    <div className="min-h-screen bg-background pt-20 pb-20 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Learning Analytics
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground mt-1">
            Growth & Progress
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your hours taught, knowledge gained, and skill milestones.
          </p>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="rounded-2xl border border-border/80 bg-card p-5">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium">Total Learning Hours</span>
              <Clock className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-display font-extrabold text-foreground">48.5 hrs</p>
            <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
              +6.5 hrs this week
            </span>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-5">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium">Sessions Exchanged</span>
              <BookOpen className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-display font-extrabold text-foreground">
              {currentUser.sessionsCompleted}
            </p>
            <span className="text-[11px] text-muted-foreground mt-1 block">
              100% reciprocal fulfillment
            </span>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-5">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium">Active Learning Streak</span>
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <p className="text-2xl font-display font-extrabold text-amber-400">
              {currentUser.streakDays} Days
            </p>
            <span className="text-[11px] text-muted-foreground mt-1 block">
              Personal record: 21 days
            </span>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-5">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium">Total Experience</span>
              <Award className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-2xl font-display font-extrabold text-foreground">
              {(currentUser.xp || 0).toLocaleString()} XP
            </p>
            <span className="text-[11px] text-primary font-semibold mt-1 block">
              Rank #1 Global Leaderboard
            </span>
          </div>
        </div>

        {/* Level Progression Banner */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 mb-8 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Current Standing
              </span>
              <h3 className="font-display text-xl font-bold text-foreground mt-0.5">
                Level {currentUser.level} Master Mentor
              </h3>
            </div>
            <span className="text-xs font-bold text-muted-foreground">
              {progressInLevel} / 500 XP to Level {currentUser.level + 1}
            </span>
          </div>

          <div className="w-full bg-secondary h-3 rounded-full overflow-hidden mb-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${levelPercentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Complete 2 more peer exchanges this week to level up and unlock the &quot;Grandmaster Tutor&quot; flair.
          </p>
        </div>

        {/* Activity Breakdown & Weekly Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Hours Bar Chart */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7">
            <h3 className="font-display text-base font-bold text-foreground mb-1">
              Weekly Learning Hours
            </h3>
            <p className="text-xs text-muted-foreground mb-6">
              Hours spent in video sessions & collaborative pair programming
            </p>

            <div className="flex items-end justify-between h-44 pt-6 gap-2">
              {weeklyHours.map((item) => (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    {item.hours}h
                  </span>
                  <div
                    className="w-full max-w-[36px] bg-primary/20 rounded-t-xl hover:bg-primary/50 transition-all relative group"
                    style={{ height: `${item.percent}%` }}
                  >
                    <div
                      className="absolute inset-0 bg-primary rounded-t-xl opacity-80 group-hover:opacity-100"
                      style={{ height: `${item.percent}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones List */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7">
            <h3 className="font-display text-base font-bold text-foreground mb-1">
              Milestones & Achievements
            </h3>
            <p className="text-xs text-muted-foreground mb-5">
              Badges earned through consistent peer exchange
            </p>

            <div className="space-y-3">
              {milestones.map((m) => (
                <div
                  key={m.title}
                  className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                    m.achieved
                      ? 'bg-secondary/40 border-border text-foreground'
                      : 'bg-card/40 border-border/40 text-muted-foreground opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle
                      className={`w-4 h-4 ${
                        m.achieved ? 'text-emerald-400' : 'text-muted-foreground'
                      }`}
                    />
                    <div>
                      <p className="font-semibold text-foreground">{m.title}</p>
                      <p className="text-[10px] text-muted-foreground">{m.date}</p>
                    </div>
                  </div>
                  <span className="font-bold text-primary">{m.xp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
