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

export const demoAccounts = [
  {
    id: 'user-sanjjay',
    name: 'Sanjjay',
    handle: '@sanjjaystars',
    email: 'sanjjay.stars@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    title: 'Full Stack & AI Engineer',
    bio: 'Passionate developer and mentor. Love teaching Python, Web Development, and AI logic, while actively learning advanced UI/UX Design.',
    skillsToTeach: ['Python', 'Web Basics', 'React.js', 'Next.js', 'AI Agents', 'REST APIs'],
    skillsToLearn: ['UI/UX Design', 'Figma Prototyping', 'Kubernetes', 'Motion Design'],
    rating: 4.95,
    reviewsCount: 34,
    sessionsCompleted: 28,
    streakDays: 14,
    xp: 4250,
    level: 8,
    referralCode: 'SANJJAY-SWAP-2026',
    referralsCount: 6,
    courses: [
      { id: 'c-1', title: 'Python Automation & Scripting', lessons: ['Variables & Loops', 'File Handling & Web Requests', 'Building an Automation Bot'] },
      { id: 'c-2', title: 'Modern React & Component Patterns', lessons: ['Hooks & State', 'Custom Hooks & Context', 'API Integration'] },
    ],
  },
  {
    id: 'peer-prince',
    name: 'Prince',
    handle: '@prince_design',
    email: 'prince.design@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    title: 'Senior Product Designer',
    bio: 'Visual designer with 4 years creating consumer mobile apps. Looking to master Python automation and web fundamentals.',
    skillsToTeach: ['UI/UX Design', 'Figma Prototyping', 'Brand Identity', 'Design Systems'],
    skillsToLearn: ['Python', 'Web Basics', 'Backend Development'],
    rating: 4.9,
    reviewsCount: 22,
    sessionsCompleted: 20,
    streakDays: 9,
    xp: 3420,
    level: 6,
    referralCode: 'PRINCE-SWAP-2026',
    referralsCount: 4,
    courses: [
      { id: 'c-3', title: 'Figma Auto-Layout & Design Tokens', lessons: ['Auto-Layout Mastery', 'Design System Components', 'Interactive Prototyping'] },
    ],
  },
  {
    id: 'peer-priya',
    name: 'Priya Sharma',
    handle: '@priyacodes',
    email: 'priya.sharma@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    title: 'Frontend Specialist',
    bio: 'Frontend enthusiast building accessible web apps. Excited to exchange modern frontend tricks for machine learning basics.',
    skillsToTeach: ['React.js', 'TypeScript', 'Tailwind CSS', 'Next.js'],
    skillsToLearn: ['Machine Learning', 'Data Science', 'Python'],
    rating: 4.9,
    reviewsCount: 31,
    sessionsCompleted: 24,
    streakDays: 12,
    xp: 3890,
    level: 7,
    referralCode: 'PRIYA-SWAP-2026',
    referralsCount: 8,
    courses: [
      { id: 'c-4', title: 'TypeScript with React Deep Dive', lessons: ['Props & State Typing', 'Generics & Utility Types', 'Strict Typing Forms'] },
    ],
  },
];

export function AppProvider({ children }) {
  // Current active user
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('skillswap_user');
    return saved ? JSON.parse(saved) : demoAccounts[0];
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
  const [leaderboard, setLeaderboard] = useState(initialLeaderboard);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Sync state to localStorage
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

  // Gamification recorder
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
    // Also update leaderboard for this user
    setLeaderboard((prev) =>
      prev.map((item) =>
        item.handle === user.handle
          ? { ...item, xp: item.xp + xpGained, streak: user.streakDays }
          : item
      )
    );
  };

  // Switch between demo accounts
  const switchUser = (userId) => {
    const account = demoAccounts.find((a) => a.id === userId);
    if (account) {
      setUser(account);
      setIsAuthenticated(true);
    }
  };

  // Login user
  const loginUser = (email, password) => {
    const found = demoAccounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUser(found);
    } else {
      const newUser = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        handle: `@${email.split('@')[0]}`,
        email,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        title: 'Community Learner & Mentor',
        bio: 'Excited to exchange knowledge and learn through peer teaching on SkillSwap.',
        skillsToTeach: ['Python Basics', 'Web Fundamentals'],
        skillsToLearn: ['UI/UX Design', 'React'],
        rating: 5.0,
        reviewsCount: 1,
        sessionsCompleted: 0,
        streakDays: 1,
        xp: 150,
        level: 1,
        referralCode: `SWAP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        referralsCount: 0,
        courses: [],
      };
      setUser(newUser);
    }
    setIsAuthenticated(true);
    return true;
  };

  // Sign up user
  const signUpUser = ({ name, email, password, skillsToTeach, skillsToLearn }) => {
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      handle: `@${name.toLowerCase().replace(/\s+/g, '')}`,
      email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      title: 'SkillSwap Mentor & Learner',
      bio: 'Ready to teach and learn collaboratively.',
      skillsToTeach: skillsToTeach?.length ? skillsToTeach : ['Web Basics', 'Problem Solving'],
      skillsToLearn: skillsToLearn?.length ? skillsToLearn : ['UI/UX Design', 'System Architecture'],
      rating: 5.0,
      reviewsCount: 0,
      sessionsCompleted: 0,
      streakDays: 1,
      xp: 200,
      level: 1,
      referralCode: `SWAP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      referralsCount: 0,
      courses: [],
    };
    setUser(newUser);
    setIsAuthenticated(true);
    return newUser;
  };

  // Schedule a session with real Google Meet link
  const scheduleSession = (peerId, topic, skillExchanged, date, duration, courseId = null) => {
    const peer = peers.find((p) => p.id === peerId);
    const meetingCode = `swap-${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 5)}`;
    const meetUrl = `https://meet.google.com/${meetingCode}`;

    const newSession = {
      id: `sess-${Date.now()}`,
      peerId,
      peerName: peer ? peer.name : 'SkillSwap Peer',
      peerAvatar: peer ? peer.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      topic,
      skillExchanged,
      date: date || 'Tomorrow, 4:00 PM',
      duration: duration || '60 mins',
      status: 'upcoming',
      meetUrl,
      courseId,
      notes: `Reciprocal exchange scheduled between ${user.name} and ${peer?.name || 'Peer'}.`,
    };

    setSessions((prev) => [newSession, ...prev]);

    // Send automated notification in chat thread
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const chatMsg = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      text: `📅 Scheduled exchange: "${topic}" (${date || 'Tomorrow, 4:00 PM'}). Google Meet Link: ${meetUrl}`,
      timestamp: timeStr,
      meetUrl,
    };
    setMessages((prev) => ({
      ...prev,
      [peerId]: [...(prev[peerId] || []), chatMsg],
    }));

    recordActivity(100, 'Scheduled peer session');
    return newSession;
  };

  // Instant Google Meet launcher from Chat or Dashboard
  const startInstantMeet = (peerId, topic = 'Instant 1:1 Skill Exchange') => {
    const peer = peers.find((p) => p.id === peerId);
    const meetingCode = `swap-${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 5)}`;
    const meetUrl = `https://meet.google.com/${meetingCode}`;

    const instantSession = {
      id: `sess-${Date.now()}`,
      peerId,
      peerName: peer ? peer.name : 'SkillSwap Peer',
      peerAvatar: peer ? peer.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      topic,
      skillExchanged: user.skillsToTeach[0] || 'Peer Knowledge',
      date: 'Now (Live)',
      duration: '45 mins',
      status: 'upcoming',
      meetUrl,
      notes: 'Live instant Google Meet learning call',
    };

    setSessions((prev) => [instantSession, ...prev]);

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const chatMsg = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      text: `🚀 Live Google Meet Call Started! Click to join: ${meetUrl}`,
      timestamp: timeStr,
      meetUrl,
      isLiveCall: true,
      sessionId: instantSession.id,
    };
    setMessages((prev) => ({
      ...prev,
      [peerId]: [...(prev[peerId] || []), chatMsg],
    }));

    recordActivity(80, 'Started live Google Meet session');
    return instantSession;
  };

  // Complete a session with rating and review
  const completeSession = (sessionId, rating = 5, feedback = '') => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          return {
            ...s,
            status: 'completed',
            rating,
            feedback: feedback || 'Great interactive session! Knowledge exchange was clear and insightful.',
          };
        }
        return s;
      })
    );

    // Increment sessions count and award XP
    setUser((prev) => ({
      ...prev,
      sessionsCompleted: prev.sessionsCompleted + 1,
      streakDays: prev.streakDays + 1,
    }));

    recordActivity(150, 'Completed peer session');
  };

  // Cancel session
  const cancelSession = (sessionId) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  // Send message with dynamic responses
  const sendMessage = (peerId, text, customMeetUrl = null) => {
    if (!text.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      text,
      timestamp: timeStr,
      meetUrl: customMeetUrl,
    };
    setMessages((prev) => ({
      ...prev,
      [peerId]: [...(prev[peerId] || []), newMsg],
    }));

    // Realistic contextual peer responses
    setTimeout(() => {
      let replyText = `Sounds great, ${user.name}! I am looking forward to our session. Let's make sure we walk through practical examples.`;
      if (text.toLowerCase().includes('meet') || text.toLowerCase().includes('google') || text.toLowerCase().includes('call')) {
        replyText = `Awesome! I have got the Google Meet link open. Ready to connect and exchange knowledge whenever you are!`;
      } else if (text.toLowerCase().includes('python')) {
        replyText = `Perfect! I have got my IDE ready for the Python walkthrough. Can't wait!`;
      } else if (text.toLowerCase().includes('figma') || text.toLowerCase().includes('design')) {
        replyText = `Great! I've prepped our Figma component files so you can copy and inspect the auto-layout system.`;
      }

      const replyMsg = {
        id: `reply-${Date.now()}`,
        senderId: peerId,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => ({
        ...prev,
        [peerId]: [...(prev[peerId] || []), replyMsg],
      }));
    }, 1200);

    recordActivity(10, 'Sent chat message');
  };

  // Post to community feed
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
    recordActivity(20, 'Updated profile');
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
        switchUser,
        loginUser,
        signUpUser,
        scheduleSession,
        startInstantMeet,
        completeSession,
        cancelSession,
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
