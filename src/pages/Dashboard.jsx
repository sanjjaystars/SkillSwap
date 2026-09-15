import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  ArrowLeftRight,
  Calendar,
  MessageSquare,
  Sparkles,
  CheckCircle,
  X,
  Clock,
  Video,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import SkillTag from '../components/SkillTag';
import StarRating from '../components/StarRating';
import StreakIndicator from '../components/StreakIndicator';

export default function Dashboard() {
  const { user, peers, scheduleSession } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalPeer, setModalPeer] = useState(null);
  const [sessionTopic, setSessionTopic] = useState('');
  const [skillOffered, setSkillOffered] = useState(user.skillsToTeach[0] || 'Python');
  const [sessionDate, setSessionDate] = useState('Tomorrow, 4:00 PM');
  const [sessionDuration, setSessionDuration] = useState('60 mins');
  const [successToast, setSuccessToast] = useState('');

  const categories = ['All', 'Python & AI', 'Frontend & React', 'UI/UX Design', 'DevOps & Cloud'];

  // Filter peers based on search query and category
  const filteredPeers = peers.filter((peer) => {
    const matchesSearch =
      peer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      peer.skillsToTeach.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      peer.skillsToLearn.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Python & AI') {
      return (
        peer.skillsToTeach.some((s) => /python|ai|data|machine/i.test(s)) ||
        peer.skillsToLearn.some((s) => /python|ai|data|machine/i.test(s))
      );
    }
    if (selectedCategory === 'Frontend & React') {
      return (
        peer.skillsToTeach.some((s) => /react|frontend|web|next/i.test(s)) ||
        peer.skillsToLearn.some((s) => /react|frontend|web|next/i.test(s))
      );
    }
    if (selectedCategory === 'UI/UX Design') {
      return (
        peer.skillsToTeach.some((s) => /design|figma|ui|ux/i.test(s)) ||
        peer.skillsToLearn.some((s) => /design|figma|ui|ux/i.test(s))
      );
    }
    if (selectedCategory === 'DevOps & Cloud') {
      return (
        peer.skillsToTeach.some((s) => /docker|cloud|devops|aws|kubernetes/i.test(s)) ||
        peer.skillsToLearn.some((s) => /docker|cloud|devops|aws|kubernetes/i.test(s))
      );
    }
    return true;
  });

  const handleBookSession = (e) => {
    e.preventDefault();
    if (!modalPeer || !sessionTopic.trim()) return;

    scheduleSession(
      modalPeer.id,
      sessionTopic,
      skillOffered,
      sessionDate,
      sessionDuration
    );

    setSuccessToast(`Session with ${modalPeer.name} scheduled! +100 XP gained.`);
    setModalPeer(null);
    setSessionTopic('');
    setTimeout(() => setSuccessToast(''), 4000);
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Success Toast */}
        {successToast && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium flex items-center justify-between shadow-lg">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {successToast}
            </span>
            <button onClick={() => setSuccessToast('')} className="p-1 hover:text-emerald-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header Greeting Banner */}
        <div className="rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card to-secondary/30 p-6 sm:p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Level {user.level} Mentor
              </span>
              <span className="text-xs text-muted-foreground">• Matching Engine Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              You are currently offering to teach <strong className="text-foreground">{user.skillsToTeach.slice(0, 3).join(', ')}</strong>.
              Here are peers ready for reciprocal skill exchange today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <StreakIndicator streak={user.streakDays} xp={user.xp} />
            <Link
              to="/sessions"
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-all flex items-center gap-2 shadow-md shadow-primary/20"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>View Sessions</span>
            </Link>
          </div>
        </div>

        {/* Search & Categories Bar */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by peer name, skill offered, or skill desired (e.g. Python, Figma, React)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border/80 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-muted-foreground border-border hover:text-foreground hover:bg-secondary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Peers Matching Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPeers.map((peer) => (
            <div
              key={peer.id}
              className="rounded-2xl border border-border/80 bg-card p-6 flex flex-col justify-between hover:border-primary/40 transition-all hover:shadow-xl hover:shadow-primary/5 group"
            >
              <div>
                {/* Peer Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={peer.avatar}
                        alt={peer.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-border"
                      />
                      {peer.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-card" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-foreground group-hover:text-primary transition-colors">
                        {peer.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{peer.title}</p>
                      <p className="text-[11px] text-muted-foreground/70">{peer.location}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                    {peer.matchPercentage}% Match
                  </span>
                </div>

                <p className="text-xs text-muted-foreground/90 line-clamp-2 mb-4 leading-relaxed">
                  {peer.bio}
                </p>

                {/* Skills Teaches */}
                <div className="space-y-2 mb-3">
                  <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider block">
                    Offers to teach:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {peer.skillsToTeach.map((skill) => (
                      <SkillTag key={skill} skill={skill} variant="teach" size="xs" />
                    ))}
                  </div>
                </div>

                {/* Skills Wants */}
                <div className="space-y-2 mb-4">
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
                    Wants to learn:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {peer.skillsToLearn.map((skill) => (
                      <SkillTag key={skill} skill={skill} variant="learn" size="xs" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                <StarRating rating={peer.rating} />

                <div className="flex items-center gap-2">
                  <Link
                    to={`/chat/${peer.id}`}
                    className="p-2 rounded-xl border border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    title="Send Message"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => {
                      setModalPeer(peer);
                      setSessionTopic(`Reciprocal Exchange: ${peer.skillsToTeach[0]} ↔ ${user.skillsToTeach[0]}`);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Swap</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPeers.length === 0 && (
          <div className="text-center py-20 rounded-3xl border border-border/80 bg-card/40">
            <p className="text-muted-foreground text-sm">No peers found matching &quot;{searchQuery}&quot;.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-3 text-xs text-primary font-semibold hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Schedule Session Modal */}
        {modalPeer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl relative">
              <button
                onClick={() => setModalPeer(null)}
                className="absolute top-6 right-6 p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <ArrowLeftRight className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-foreground">
                    Schedule Skill Exchange
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Coordinating with <strong className="text-foreground">{modalPeer.name}</strong>
                  </p>
                </div>
              </div>

              <form onSubmit={handleBookSession} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1.5 block">
                    Session Topic
                  </label>
                  <input
                    type="text"
                    required
                    value={sessionTopic}
                    onChange={(e) => setSessionTopic(e.target.value)}
                    placeholder="e.g. Python Automation & Scripting Walkthrough"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block">
                      Skill You Offer
                    </label>
                    <select
                      value={skillOffered}
                      onChange={(e) => setSkillOffered(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      {user.skillsToTeach.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block">
                      Duration
                    </label>
                    <select
                      value={sessionDuration}
                      onChange={(e) => setSessionDuration(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      <option value="30 mins">30 mins</option>
                      <option value="45 mins">45 mins</option>
                      <option value="60 mins">60 mins</option>
                      <option value="90 mins">90 mins</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1.5 block">
                    Proposed Date & Time
                  </label>
                  <input
                    type="text"
                    required
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    placeholder="e.g. Tomorrow, 4:00 PM"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalPeer(null)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Confirm Session</span>
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
