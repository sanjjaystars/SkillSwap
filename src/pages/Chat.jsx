import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Send,
  Video,
  Calendar,
  Search,
  CheckCheck,
  ExternalLink,
  Tv,
  Sparkles,
  Phone,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import StarRating from '../components/StarRating';

export default function Chat() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { peers, user, messages, sendMessage, startInstantMeet } = useApp();
  const [activePeerId, setActivePeerId] = useState(userId || 'peer-prince');
  const [inputText, setInputText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const messagesEndRef = useRef(null);

  // Sync route param
  useEffect(() => {
    if (userId && peers.some((p) => p.id === userId)) {
      setActivePeerId(userId);
    }
  }, [userId, peers]);

  const activePeer = peers.find((p) => p.id === activePeerId) || peers[0];
  const thread = messages[activePeerId] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(activePeerId, inputText);
    setInputText('');
  };

  const handleStartGoogleMeet = () => {
    const session = startInstantMeet(
      activePeerId,
      `Live Exchange: ${user.skillsToTeach[0]} ↔ ${activePeer.skillsToTeach[0]}`
    );
    // Open the new Google Meet window in a new tab
    window.open(session.meetUrl, '_blank');
  };

  const filteredPeers = peers.filter((p) =>
    p.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-2xl h-[calc(100vh-140px)] flex flex-col md:flex-row">
          {/* Contacts Sidebar */}
          <div className="w-full md:w-80 border-r border-border/80 flex flex-col bg-card/60">
            <div className="p-4 border-b border-border/60">
              <h2 className="font-display text-base font-bold text-foreground mb-3">
                Peer Conversations
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search peers..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-secondary/60 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-border/40">
              {filteredPeers.map((peer) => {
                const isActive = peer.id === activePeerId;
                const peerMessages = messages[peer.id] || [];
                const lastMsg = peerMessages[peerMessages.length - 1];

                return (
                  <button
                    key={peer.id}
                    onClick={() => {
                      setActivePeerId(peer.id);
                      navigate(`/chat/${peer.id}`);
                    }}
                    className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors ${
                      isActive
                        ? 'bg-secondary border-l-2 border-primary'
                        : 'hover:bg-secondary/40'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={peer.avatar}
                        alt={peer.name}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-border"
                      />
                      {peer.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-foreground truncate">{peer.name}</p>
                        <span className="text-[10px] text-muted-foreground">
                          {lastMsg ? lastMsg.timestamp : ''}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                        {lastMsg ? lastMsg.text : `${peer.title}`}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Chat Window */}
          <div className="flex-1 flex flex-col bg-background/50">
            {/* Header */}
            <div className="h-16 px-4 sm:px-6 border-b border-border/60 flex items-center justify-between bg-card/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={activePeer.avatar}
                    alt={activePeer.name}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-border"
                  />
                  {activePeer.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
                  )}
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">
                    {activePeer.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-emerald-400">
                      {activePeer.online ? 'Online now' : 'Away'}
                    </span>
                    <span className="text-muted-foreground/50">•</span>
                    <StarRating rating={activePeer.rating} size="xs" />
                  </div>
                </div>
              </div>

              {/* Working Call Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleStartGoogleMeet}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-500 transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-600/20"
                  title="Launch instant Google Meet with peer"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Start Google Meet</span>
                </button>

                <Link
                  to="/sessions"
                  className="p-2 rounded-xl border border-border bg-secondary/50 text-foreground hover:bg-secondary transition-colors"
                  title="View Scheduled Sessions"
                >
                  <Calendar className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Thread */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              <div className="text-center py-2">
                <span className="px-3 py-1 rounded-full text-[11px] bg-secondary/80 text-muted-foreground border border-border/60">
                  Direct peer exchange • Click &quot;Start Google Meet&quot; to connect live
                </span>
              </div>

              {thread.map((msg) => {
                const isMe = msg.senderId === user.id;
                const hasMeetLink = msg.meetUrl || (msg.text && msg.text.includes('meet.google.com'));
                const meetUrl = msg.meetUrl || (msg.text.match(/https:\/\/meet\.google\.com\/[a-zA-Z0-9-]+/) || [])[0];

                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMe && (
                      <img
                        src={activePeer.avatar}
                        alt={activePeer.name}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-border mb-1"
                      />
                    )}

                    <div
                      className={`max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isMe
                          ? 'bg-primary text-primary-foreground rounded-br-none shadow-md shadow-primary/20'
                          : 'bg-card border border-border/80 text-foreground rounded-bl-none'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {/* Prominent Google Meet Join Card if message contains link */}
                      {hasMeetLink && meetUrl && (
                        <div className="mt-3 p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-xs">
                            <Video className="w-4 h-4 text-emerald-400" />
                            <span className="font-semibold text-white">Google Meet Call</span>
                          </div>
                          <a
                            href={meetUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1 rounded-lg bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 flex items-center gap-1 shadow-sm"
                          >
                            <span>Join Meet</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}

                      <span
                        className={`text-[10px] mt-1 block ${
                          isMe ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground text-left'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSend}
              className="p-3 sm:p-4 border-t border-border/60 bg-card/80 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={`Ask ${activePeer.name} about lessons, or propose a course exchange...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-secondary/60 border border-border text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
