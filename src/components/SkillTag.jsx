import React from 'react';
import { cn } from '../lib/utils';

export default function SkillTag({ skill, variant = 'default', size = 'sm', className }) {
  const variants = {
    default: 'bg-secondary text-foreground/90 border-border hover:border-foreground/30',
    teach: 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/15',
    learn: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/15',
    accent: 'bg-accent/15 text-accent border-accent/30',
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium transition-colors',
        variants[variant] || variants.default,
        sizes[size] || sizes.sm,
        className
      )}
    >
      {skill}
    </span>
  );
}
