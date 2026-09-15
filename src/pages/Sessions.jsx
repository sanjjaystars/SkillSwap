import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Video,
  Clock,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
  Plus,
  Star,
  Sparkles,
  Trash2,
  Tv,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import StarRating from '../components/StarRating';

export default function Sessions() {
  const navigate = useNavigate();
  const { sessions, user, completeSession, cancelSession, startInstantMeet, peers, dataLoading } = useApp();
  const [activeTab, setActiveTab] = useState('all');
  const [reviewModalSession, setReviewModalSession] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const filteredSessions = sessions.filter((s) => {
    if (activeTab === 'upcoming') return s.status === 'upcoming';
    if (activeTab === 'completed') return s.status === 'completed';
    return true;
  });

  const handleStartInstantCall = async () => {
    const targetPeer = peers[0] || { id: 'peer-instant', name: 'Study Peer' };
    const skillName = user?.skillsToTeach?.[0] || 'Skill Exchange';
    try {
      const sess = await startInstantMeet(targetPeer.id, `Instant 1:1 Exchange: ${skillName}`);
      if (sess?.meetUrl) {
        setToastMsg(`Instant Google Meet generated for ${targetPeer.name}!`);
        window.open(sess.meetUrl, '_blank');
        setTimeout(() => {
          navigate(`/room/${sess.id}`);
        }, 800);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    if (!reviewModalSession) return;
    setActionLoading(true);
    try {
      await completeSession(reviewModalSession.id, reviewRating, reviewFeedback);
      setToastMsg(`Session completed! +150 XP gained & streak updated.`);
      setReviewModalSession(null);
      setReviewFeedback('');
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async (sessionId) => {
    try {
      await cancelSession(sessionId);
      setToastMsg('Session cancelled.');
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-20 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Toast */}
        {toastMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-semibold flex items-center justify-between shadow-lg">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {toastMsg}
            </span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Peer Learning Hub
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground mt-1">
              My Skill Sessions & Meetings
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Connect via Google Meet or our integrated interactive virtual classroom.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={handleStartInstantCall}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 transition-all shadow-md shadow-emerald-600/20"
            >
              <Video className="w-4 h-4" />
              <span>Instant Google Meet</span>
            </button>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Exchange</span>
            </Link>
          </div>
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
                className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 transition-all hover:border-primary/40 hover:shadow-xl"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Peer info */}
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
                          {isUpcoming ? 'Scheduled' : 'Completed'}
                        </span>
                      </div>
                      <h3 className="text-base font-display font-bold text-foreground">
                        {session.topic}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Exchanged for: <strong className="text-foreground">{session.skillExchanged}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Right: Date & Launch Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-border/50">
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

                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        to={`/chat/${session.peerId}`}
                        className="p-2.5 rounded-xl border border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        title="Chat"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Link>

                      {isUpcoming ? (
                        <>
                          {/* Enter Virtual Classroom */}
                          <Link
                            to={`/room/${session.id}`}
                            className="px-3.5 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-md shadow-primary/20"
                          >
                            <Tv className="w-3.5 h-3.5" />
                            <span>Virtual Classroom</span>
                          </Link>

                          {/* Open Google Meet Window */}
                          <a
                            href={session.meetUrl || 'https://meet.google.com/new'}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-2 rounded-xl bg-emerald-600/15 border border-emerald-500/30 text-emerald-400 font-semibold text-xs hover:bg-emerald-600/25 transition-all flex items-center gap-1.5"
                            title="Launch in Google Meet"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Google Meet</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>

                          {/* Mark Complete */}
                          <button
                            onClick={() => setReviewModalSession(session)}
                            className="p-2 rounded-xl border border-border hover:bg-secondary text-xs text-muted-foreground hover:text-emerald-400 transition-colors"
                            title="Mark as Complete"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>

                          {/* Cancel */}
                          <button
                            onClick={() => handleCancel(session.id)}
                            className="p-2 rounded-xl border border-border hover:bg-red-500/10 text-xs text-muted-foreground hover:text-red-400 transition-colors"
                            title="Cancel Session"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          {session.rating && <StarRating rating={session.rating} />}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Feedback Review */}
                {session.feedback && (
                  <div className="mt-4 pt-3 border-t border-border/60 text-xs text-muted-foreground bg-secondary/30 rounded-2xl p-3 flex items-start gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-foreground">Peer Feedback Review: </span>
                      &quot;{session.feedback}&quot;
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredSessions.length === 0 && (
            <div className="text-center py-20 rounded-3xl border border-border/80 bg-card p-6">
              <CalendarIcon className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No sessions in this view.</p>
              <button
                onClick={handleStartInstantCall}
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
              >
                Start an instant Google Meet now
              </button>
            </div>
          )}
        </div>

        {/* Review Submission Modal */}
        {reviewModalSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
            <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl relative">
              <h3 className="text-lg font-display font-bold text-foreground mb-1">
                Complete Session & Review
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Leave feedback for <strong className="text-foreground">{reviewModalSession.peerName}</strong> on &quot;{reviewModalSession.topic}&quot;.
              </p>

              <form onSubmit={handleCompleteSubmit} className="space-y-4">
                <div className="flex justify-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1.5 block">
                    Feedback & Comments
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={reviewFeedback}
                    onChange={(e) => setReviewFeedback(e.target.value)}
                    placeholder="Describe what was taught and how the peer exchange helped you..."
                    className="w-full p-3 rounded-xl bg-secondary/50 border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalSession(null)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90"
                  >
                    Confirm & Submit (+150 XP)
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
