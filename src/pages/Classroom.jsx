import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Share2,
  PhoneOff,
  ExternalLink,
  MessageSquare,
  BookOpen,
  Code2,
  CheckCircle2,
  Star,
  Sparkles,
  Send,
  Clock,
  Play,
  Copy,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import StarRating from '../components/StarRating';

export default function Classroom() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { sessions, user, completeSession } = useApp();

  const currentUser = user || {
    name: 'You',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  };

  const session = sessions.find((s) => s.id === sessionId) || sessions[0] || {
    id: 'demo-session',
    peerName: 'Prince',
    peerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    topic: 'Python Automation & Scripting Walkthrough',
    skillExchanged: 'UI/UX Design Systems',
    meetUrl: 'https://meet.google.com/new',
    status: 'upcoming',
  };

  // Video and audio toggles
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(140); // 2 mins in

  // Notes & Code tab
  const [activeTab, setActiveTab] = useState('code');
  const [codeContent, setCodeContent] = useState(
`# SkillSwap Collaborative Teaching Scratchpad
# Topic: Python Automation & Web Scraping

import requests
from bs4 import BeautifulSoup

def fetch_exchange_data(topic):
    print(f"Teaching topic: {topic}")
    return {"status": "success", "peer": "${session.peerName}"}

result = fetch_exchange_data("${session.topic}")
print("Session Active:", result)
`
  );
  const [codeOutput, setCodeOutput] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // In-call chat
  const [inCallChat, setInCallChat] = useState([
    { sender: session.peerName, text: "Hey! Can you hear me loud and clear?", time: "Just now" },
    { sender: currentUser.name, text: "Yes! Audio is crystal clear. Let's dive into the code walkthrough.", time: "Just now" },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Course syllabus checklist
  const [lessons, setLessons] = useState([
    { id: 1, title: 'Concept Introduction & Context', done: true },
    { id: 2, title: 'Hands-on Code Walkthrough', done: false },
    { id: 3, title: 'Reciprocal Practice & Feedback', done: false },
    { id: 4, title: 'Q&A and Next Steps', done: false },
  ]);

  // Review modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewFeedback, setReviewFeedback] = useState('');

  // Timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setInCallChat((prev) => [
      ...prev,
      { sender: currentUser.name, text: chatInput, time: 'Just now' },
    ]);
    setChatInput('');
  };

  const toggleLesson = (id) => {
    setLessons((prev) =>
      prev.map((l) => (l.id === id ? { ...l, done: !l.done } : l))
    );
  };

  const handleRunCode = () => {
    setCodeOutput(
      `> Executing Python script...\nTeaching topic: ${session.topic}\nSession Active: {'status': 'success', 'peer': '${session.peerName}'}\n\n[Done in 0.24s - Zero Errors]`
    );
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeContent);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSubmitReview = async () => {
    try {
      await completeSession(session.id, rating, reviewFeedback);
    } catch (err) {
      console.error(err);
    }
    setShowReviewModal(false);
    navigate('/sessions');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-16">
      {/* Top Header Bar */}
      <div className="h-16 px-4 sm:px-6 border-b border-border/80 bg-card/90 backdrop-blur-xl flex items-center justify-between z-30">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shrink-0" />
          <div className="truncate">
            <h1 className="font-display text-sm sm:text-base font-bold text-foreground truncate">
              {session.topic}
            </h1>
            <p className="text-[11px] text-muted-foreground">
              Teacher: <strong className="text-foreground">{currentUser.name}</strong> ↔ Learner: <strong className="text-foreground">{session.peerName}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Duration Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/80 border border-border text-xs font-mono text-foreground font-semibold">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </div>

          {/* Direct Google Meet Link */}
          <a
            href={session.meetUrl || 'https://meet.google.com/new'}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-600/25 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Video className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Open in Google Meet</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {/* Finish Session Button */}
          <button
            onClick={() => setShowReviewModal(true)}
            className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Finish & Review</span>
          </button>
        </div>
      </div>

      {/* Main Classroom Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Video + Collaborative Teaching Workspace */}
        <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Video Grid Simulation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Peer Video Screen */}
            <div className="relative rounded-3xl border border-border/80 bg-slate-900 overflow-hidden aspect-video flex flex-col justify-between p-4 shadow-xl">
              <div className="flex items-center justify-between z-10">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {session.peerName} (Learner)
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  HD 1080p
                </span>
              </div>

              {/* Video Simulated Avatar Canvas */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-slate-950 via-slate-900 to-blue-950/40">
                <div className="relative">
                  <img
                    src={session.peerAvatar}
                    alt={session.peerName}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-emerald-500/30 shadow-2xl"
                  />
                  <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-slate-900 flex items-center justify-center text-[10px] text-black font-bold">
                    ✓
                  </span>
                </div>
              </div>

              <div className="z-10 flex items-center justify-between text-xs text-slate-300 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl">
                <span>Microphone Active</span>
                <span className="text-[11px] text-emerald-400">Reciprocal Learning Active</span>
              </div>
            </div>

            {/* My Video Screen */}
            <div className="relative rounded-3xl border border-border/80 bg-slate-900 overflow-hidden aspect-video flex flex-col justify-between p-4 shadow-xl">
              <div className="flex items-center justify-between z-10">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  {currentUser.name} (Teaching)
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold border border-blue-500/30">
                  Host
                </span>
              </div>

              {/* Local Feed */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950/40">
                {isVideoOn ? (
                  <div className="relative">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-blue-500/30 shadow-2xl"
                    />
                    <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-blue-500 ring-2 ring-slate-900 flex items-center justify-center text-[10px] text-white font-bold">
                      ★
                    </span>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground text-xs">
                    <VideoOff className="w-8 h-8 mx-auto mb-1 opacity-50" />
                    <span>Camera is turned off</span>
                  </div>
                )}
              </div>

              <div className="z-10 flex items-center justify-between text-xs text-slate-300 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl">
                <span>{isMicOn ? 'Mic: Enabled' : 'Mic: Muted'}</span>
                <span>{isScreenSharing ? 'Sharing Screen' : 'Webcam'}</span>
              </div>
            </div>
          </div>

          {/* In-Call Media Control Bar */}
          <div className="rounded-2xl border border-border/80 bg-card p-3 flex items-center justify-center gap-3 shadow-lg">
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3 rounded-xl transition-colors ${
                isMicOn
                  ? 'bg-secondary text-foreground hover:bg-secondary/80'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
              title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-3 rounded-xl transition-colors ${
                isVideoOn
                  ? 'bg-secondary text-foreground hover:bg-secondary/80'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
              title={isVideoOn ? 'Turn Off Camera' : 'Turn On Camera'}
            >
              {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`p-3 rounded-xl transition-colors ${
                isScreenSharing
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
              title="Share Screen"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <div className="h-6 w-px bg-border mx-1" />

            <a
              href={session.meetUrl || 'https://meet.google.com/new'}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-500 transition-all flex items-center gap-2 shadow-md shadow-emerald-600/20"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Launch Google Meet Window</span>
            </a>

            <button
              onClick={() => setShowReviewModal(true)}
              className="p-3 rounded-xl bg-red-600 text-white hover:bg-red-500 transition-colors"
              title="End Session"
            >
              <PhoneOff className="w-4 h-4" />
            </button>
          </div>

          {/* Collaborative Course Scratchpad / Code Editor */}
          <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-xl flex-1 flex flex-col min-h-[360px]">
            <div className="px-5 py-3 border-b border-border/60 flex items-center justify-between bg-secondary/40">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeTab === 'code'
                      ? 'bg-card text-foreground border border-border'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5 text-primary" />
                  <span>Live Code Scratchpad</span>
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeTab === 'notes'
                      ? 'bg-card text-foreground border border-border'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Lesson Notes & Resources</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
                {activeTab === 'code' && (
                  <button
                    onClick={handleRunCode}
                    className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 flex items-center gap-1 shadow-sm"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Run Script</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 p-4 bg-slate-950 font-mono text-xs text-slate-200">
              {activeTab === 'code' ? (
                <div className="flex flex-col h-full space-y-3">
                  <textarea
                    value={codeContent}
                    onChange={(e) => setCodeContent(e.target.value)}
                    rows={9}
                    className="w-full bg-transparent text-slate-200 font-mono text-xs focus:outline-none resize-none leading-relaxed"
                  />
                  {codeOutput && (
                    <div className="mt-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 text-[11px] whitespace-pre-wrap">
                      {codeOutput}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 text-slate-300 text-xs font-sans leading-relaxed">
                  <h4 className="font-bold text-foreground">Course Overview: {session.topic}</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Key concept: Reciprocal knowledge transfer with zero commercial friction.</li>
                    <li>Learner goals: Master the fundamentals and apply code to their own projects.</li>
                    <li>Next session: Reciprocal topic - &quot;{session.skillExchanged}&quot;.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Course Syllabus Checklist & In-Call Chat */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-border/80 bg-card/40 flex flex-col h-full">
          {/* Syllabus Checklist */}
          <div className="p-4 sm:p-5 border-b border-border/60">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>Course Module Checklist</span>
              </h3>
              <span className="text-[11px] text-muted-foreground">
                {lessons.filter((l) => l.done).length} / {lessons.length} Done
              </span>
            </div>

            <div className="space-y-2">
              {lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => toggleLesson(lesson.id)}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-colors ${
                    lesson.done
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-foreground'
                      : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className={lesson.done ? 'line-through text-muted-foreground' : 'font-medium'}>
                    {lesson.title}
                  </span>
                  <CheckCircle2
                    className={`w-4 h-4 ${lesson.done ? 'text-emerald-400' : 'text-muted-foreground/40'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* In-Call Chat */}
          <div className="flex-1 flex flex-col min-h-[250px]">
            <div className="p-3 px-5 border-b border-border/60 flex items-center justify-between bg-card">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-primary" />
                <span>In-Call Chat</span>
              </span>
              <span className="text-[10px] text-muted-foreground">Encrypted peer link</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {inCallChat.map((msg, i) => {
                const isMe = msg.sender === currentUser.name;
                return (
                  <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] text-muted-foreground mb-0.5">
                      {msg.sender} • {msg.time}
                    </span>
                    <div
                      className={`px-3 py-2 rounded-xl text-xs max-w-[85%] ${
                        isMe
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary border border-border text-foreground'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="p-3 border-t border-border/60 bg-card flex gap-2">
              <input
                type="text"
                placeholder="Message in call..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl bg-secondary/60 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-primary text-primary-foreground text-xs hover:bg-primary/90"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Finish Session & Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground">
                Session Completed!
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                How was your peer exchange with <strong className="text-foreground">{session.peerName}</strong>?
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">
                  Write Feedback Review
                </label>
                <textarea
                  rows={3}
                  value={reviewFeedback}
                  onChange={(e) => setReviewFeedback(e.target.value)}
                  placeholder="Share how this learning session went and what you learned..."
                  className="w-full p-3 rounded-xl bg-secondary/50 border border-border text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Submitting awards +150 XP & increments your learning streak!</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 shadow-md shadow-primary/20"
                >
                  Submit Review & Claim XP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
