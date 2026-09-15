import React from 'react';
import { Bell, Calendar, Tag, UserCheck, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Announcements() {
  const { announcements } = useApp();

  return (
    <div className="min-h-screen bg-background pt-20 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Official Broadcasts
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground mt-1">
            Platform Notices & Announcements
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Stay up to date with new features, community guidelines, and maintenance alerts.
          </p>
        </div>

        {/* List of Announcements */}
        <div className="space-y-6">
          {announcements.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-xl hover:border-primary/40 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  {item.tag}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.date}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-display font-bold text-foreground mb-3">
                {item.title}
              </h2>

              <p className="text-sm text-foreground/90 leading-relaxed mb-4">
                {item.content}
              </p>

              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                <span>Announced by <strong className="text-foreground">{item.author}</strong></span>
                <span className="text-emerald-400 font-semibold">• Active Notice</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
