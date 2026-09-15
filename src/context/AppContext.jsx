import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  currentUser as defaultUser,
  initialPeers,
  initialSessions,
  initialMessages,
  initialFeedPosts,
  initialLeaderboard,
  initialAnnouncements,
} from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Load state from localStorage or use defaults
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('skillswap_user');
    return saved ? JSON.parse(saved) : defaultUser;
  });

  const [peers, setPeers] = useState(() => {
    const saved = localStorage.getItem('skillswap_peers');
    return saved ? JSON.parse(saved) : initialPeers;
  });

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('skillswap_sessions');
    return saved ? JSON.parse(saved) : initialSessions;
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('skillswap_messages');
    return saved ? JSON.parse(saved) : initialMessages;
  });

  const [feedPosts, setFeedPosts] = useState(() => {
    const saved = localStorage.getItem('skillswap_feed');
    return saved ? JSON.parse(saved) : initialFeedPosts;
  });

  const [announcements] = useState(initialAnnouncements);
  const [leaderboard] = useState(initialLeaderboard);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('skillswap_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('skillswap_peers', JSON.stringify(peers));
  }, [peers]);

  useEffect(() => {
    localStorage.setItem('skillswap_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('skillswap_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('skillswap_feed', JSON.stringify(feedPosts));
  }, [feedPosts]);

  // Gamification activity recorder
  const recordActivity = (xpGained = 50, note = 'Activity recorded') => {
    setUser((prev) => {
      const newXp = prev.xp + xpGained;
      const newLevel = Math.floor(newXp / 500) + 1;
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
      };
    });
  };

  // Schedule a session
  const scheduleSession = (peerId, topic, skillExchanged, date, duration) => {
    const peer = peers.find((p) => p.id === peerId);
    const newSession = {
      id: `sess-${Date.now()}`,
      peerId,
      peerName: peer ? peer.name : 'SkillSwap Peer',
      peerAvatar: peer ? peer.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      topic,
      skillExchanged,
      date,
      duration: duration || '60 mins',
      status: 'upcoming',
      meetUrl: `https://meet.google.com/swap-${Math.random().toString(36).substring(2, 7)}`,
      notes: 'Coordinated via SkillSwap platform',
    };
    setSessions((prev) => [newSession, ...prev]);
    recordActivity(100, 'Scheduled peer session');
    return newSession;
  };

  // Send message
  const sendMessage = (peerId, text) => {
    if (!text.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      text,
      timestamp: timeStr,
    };
    setMessages((prev) => ({
      ...prev,
      [peerId]: [...(prev[peerId] || []), newMsg],
    }));

    // Simulate smart auto-reply from peer after 1.5s
    setTimeout(() => {
      const replyMsg = {
        id: `reply-${Date.now()}`,
        senderId: peerId,
        text: `Got it, thanks for the message! Let's make our next learning exchange super productive.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => ({
        ...prev,
        [peerId]: [...(prev[peerId] || []), replyMsg],
      }));
    }, 1500);

    recordActivity(10, 'Sent chat message');
  };

  // Post to feed
  const createFeedPost = (content, tags = []) => {
    const newPost = {
      id: `post-${Date.now()}`,
      authorName: user.name,
      authorAvatar: user.avatar,
      authorTitle: user.title,
      timeAgo: 'Just now',
      content,
      tags: tags.length ? tags : ['#SkillSwap', '#LearnByTeaching'],
      likes: 1,
      isLiked: true,
      comments: [],
    };
    setFeedPosts((prev) => [newPost, ...prev]);
    recordActivity(30, 'Published community post');
  };

  // Like feed post
  const toggleLikePost = (postId) => {
    setFeedPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked,
          };
        }
        return post;
      })
    );
  };

  // Update profile
  const updateProfile = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
    recordActivity(20, 'Updated profile details');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        peers,
        sessions,
        messages,
        feedPosts,
        leaderboard,
        announcements,
        isAuthenticated,
        setIsAuthenticated,
        scheduleSession,
        sendMessage,
        createFeedPost,
        toggleLikePost,
        updateProfile,
        recordActivity,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
