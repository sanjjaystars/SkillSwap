import React from 'react';
import { Flame, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';

export default function StreakIndicator({ streak = 14, xp = 4250, className }) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 border border-border/80 text-xs font-medium hover:border-amber-500/40 transition-colors',
        className
      )}
      title={`${streak} Day Learning Streak • ${xp.toLocaleString()} XP`}
    >
      <span className="flex items-center gap-1 text-amber-400 font-semibold">
        <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-500 animate-pulse" />
        <span>{streak}d streak</span>
      </span>
      <span className="text-border">|</span>
      <span className="flex items-center gap-1 text-primary-foreground/80">
        <Trophy className="w-3 h-3 text-sky-400" />
        <span>{xp.toLocaleString()} XP</span>
      </span>
    </div>
  );
}
