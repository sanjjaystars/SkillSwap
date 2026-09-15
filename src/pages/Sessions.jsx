import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Video,
  Clock,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
  Plus,
  Star,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import StarRating from '../components/StarRating';

export default function Sessions() {
  const { sessions, user } = useApp();
  const [activeTab, setActiveTab] = useState('all');

  const filteredSessions = sessions.filter((s) => {
    if (activeTab === 'upcoming') return s.status === 'upcoming';
    if (activeTab === 'completed') return s.status === 'completed';
    return true;
  });

  return (
    <div className="min-h-screen bg-background pt-20 pb-20 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Peer Learning Hub
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground mt-1">
              My Skill Sessions
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Coordinate and track your reciprocal 1:1 learning appointments.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Exchange</span>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-border/80 pb-3 mb-8">
          {[
            { id: 'all', label: `All Sessions (${sessions.length})` },
            { id: 'upcoming', label: `Upcoming (${sessions.filter((s) => s.status === 'upcoming').length})` },
            { id: 'completed', label: `Completed (${sessions.filter((s) => s.status === 'completed').length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-secondary text-foreground border border-border'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          {filteredSessions.map((session) => {
            const isUpcoming = session.status === 'upcoming';
            return (
              <div
                key={session.id}
                className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 transition-all hover:border-primary/40 hover:shadow-lg"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left Peer & Topic Info */}
                  <div className="flex items-start gap-4">
                    <img
                      src={session.peerAvatar}
                      alt={session.peerName}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-border shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-muted-foreground">With</span>
                        <span className="text-sm font-bold text-foreground">{session.peerName}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            isUpcoming
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}
                        >
                          {isUpcoming ? 'Upcoming' : 'Completed'}
                        </span>
                      </div>
                      <h3 className="text-base font-display font-bold text-foreground">
                        {session.topic}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Skill exchanged: <strong className="text-foreground">{session.skillExchanged}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Right Timing & Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-border/50">
                    <div className="text-xs text-muted-foreground space-y-1 md:text-right mr-2">
                      <div className="flex items-center md:justify-end gap-1.5 font-medium text-foreground">
                        <CalendarIcon className="w-3.5 h-3.5 text-primary" />
                        <span>{session.date}</span>
                      </div>
                      <div className="flex items-center md:justify-end gap-1 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{session.duration}</span>
                      </div>
                    </div>

                    <Link
                      to={`/chat/${session.peerId}`}
                      className="p-2.5 rounded-xl border border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      title="Open Chat"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Link>

                    {isUpcoming ? (
                      <a
                        href={session.meetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-500 transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Call</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    ) : (
                      <div className="flex items-center gap-2">
                        {session.rating && <StarRating rating={session.rating} />}
                      </div>
                    )}
                  </div>
                </div>

                {/* Completed feedback review if present */}
                {session.feedback && (
                  <div className="mt-4 pt-3 border-t border-border/60 text-xs text-muted-foreground bg-secondary/30 rounded-xl p-3">
                    <span className="font-semibold text-foreground">Peer Feedback: </span>
                    &quot;{session.feedback}&quot;
                  </div>
                )}
              </div>
            );
          })}

          {filteredSessions.length === 0 && (
            <div className="text-center py-16 rounded-2xl border border-border/80 bg-card p-6">
              <CalendarIcon className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No sessions in this category yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
