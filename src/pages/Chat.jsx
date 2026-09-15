import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Send,
  Video,
  Calendar,
  Search,
  CheckCheck,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import StarRating from '../components/StarRating';

export default function Chat() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { peers, user, messages, sendMessage } = useApp();
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

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(activePeerId, inputText);
    setInputText('');
  };

  const filteredPeers = peers.filter((p) =>
    p.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-2xl h-[calc(100vh-140px)] flex flex-col md:flex-row">
          {/* Left Contacts Sidebar */}
          <div className="w-full md:w-80 border-r border-border/80 flex flex-col bg-card/60">
            <div className="p-4 border-b border-border/60">
              <h2 className="font-display text-base font-bold text-foreground mb-3">
                Peer Conversations
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-secondary/60 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Contacts list */}
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

          {/* Right Active Chat Window */}
          <div className="flex-1 flex flex-col bg-background/50">
            {/* Chat Header */}
            <div className="h-16 px-5 border-b border-border/60 flex items-center justify-between bg-card/80 backdrop-blur-md">
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

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/sessions')}
                  className="px-3 py-1.5 rounded-xl border border-border bg-secondary/50 text-foreground text-xs font-semibold hover:bg-secondary transition-colors flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span className="hidden sm:inline">Sessions</span>
                </button>
              </div>
            </div>

            {/* Chat Thread Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              <div className="text-center py-2">
                <span className="px-3 py-1 rounded-full text-[11px] bg-secondary/80 text-muted-foreground border border-border/60">
                  End-to-end peer encrypted • Direct Knowledge Exchange
                </span>
              </div>

              {thread.map((msg) => {
                const isMe = msg.senderId === user.id;
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

            {/* Message Input Footer */}
            <form
              onSubmit={handleSend}
              className="p-3 sm:p-4 border-t border-border/60 bg-card/80 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={`Message ${activePeer.name}...`}
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
