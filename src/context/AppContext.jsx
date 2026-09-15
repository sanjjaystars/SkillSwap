import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as api from '../lib/supabaseApi';

const AppContext = createContext();

export function AppProvider({ children }) {
  const auth = useAuth();

  // ─── State ───────────────────────────────────────────────
  const [profile, setProfile] = useState(null);
  const [peers, setPeers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState({}); // { peerId: [msg, ...] }
  const [feedPosts, setFeedPosts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [connections, setConnections] = useState([]);
  const [announcements] = useState([
    {
      id: 'ann-1',
      title: '🚀 SkillSwap v2.0 is live!',
      content: 'Full Supabase backend, real-time chat, smart matching, and Google Meet integration.',
      date: 'September 2026',
      type: 'feature',
    },
    {
      id: 'ann-2',
      title: '📢 Community Guidelines',
      content: 'Be respectful, help each other, and share knowledge openly.',
      date: 'September 2026',
      type: 'info',
    },
  ]);
  const [dataLoading, setDataLoading] = useState(false);

  // ─── Build a user-like object from profile + skills ──────
  const [userSkills, setUserSkills] = useState({ teach: [], learn: [] });

  const user = profile
    ? {
        id: profile.id,
        name: profile.name,
        handle: profile.handle,
        email: profile.email,
        avatar: profile.avatar_url,
        title: profile.title || 'SkillSwap Member',
        bio: profile.bio || '',
        skillsToTeach: userSkills.teach,
        skillsToLearn: userSkills.learn,
        rating: profile.rating || 5.0,
        reviewsCount: profile.reviews_count || 0,
        sessionsCompleted: profile.sessions_completed || 0,
        streakDays: profile.streak_days || 1,
        xp: profile.xp || 150,
        level: profile.level || 1,
        referralCode: profile.referral_code || '',
        referralsCount: 0,
        courses: [],
      }
    : null;

  // ─── Load all data when auth changes ──────────────────────
  const loadUserData = useCallback(async (userId) => {
    if (!userId) return;
    setDataLoading(true);
    try {
      // Fetch profile
      const prof = await api.fetchProfile(userId);
      setProfile(prof);

      // Fetch user skills
      const skills = await api.fetchSkills(userId);
      setUserSkills({
        teach: skills.filter((s) => s.type === 'teach').map((s) => s.name),
        learn: skills.filter((s) => s.type === 'learn').map((s) => s.name),
      });

      // Fetch peers with their skills
      const allPeers = await api.fetchAllPeers(userId);
      const peerIds = allPeers.map((p) => p.id);
      const allPeerSkills = peerIds.length > 0 ? await api.fetchAllSkillsForUsers(peerIds) : [];

      const skillsByUser = {};
      allPeerSkills.forEach((skill) => {
        if (!skillsByUser[skill.user_id]) skillsByUser[skill.user_id] = { teach: [], learn: [] };
        skillsByUser[skill.user_id][skill.type].push(skill.name);
      });

      const enrichedPeers = allPeers.map((p) => ({
        id: p.id,
        name: p.name,
        handle: p.handle,
        avatar: p.avatar_url,
        title: p.title || 'SkillSwap Member',
        bio: p.bio || '',
        skillsToTeach: skillsByUser[p.id]?.teach || [],
        skillsToLearn: skillsByUser[p.id]?.learn || [],
        rating: p.rating || 5.0,
        reviewsCount: p.reviews_count || 0,
        sessionsCompleted: p.sessions_completed || 0,
        streakDays: p.streak_days || 1,
        xp: p.xp || 150,
        level: p.level || 1,
      }));
      setPeers(enrichedPeers);

      // Fetch sessions
      const sess = await api.fetchSessions(userId);
      const sessionsWithPeerInfo = sess.map((s) => {
        const peer = enrichedPeers.find(
          (p) => p.id === s.teacher_id || p.id === s.learner_id
        );
        return {
          id: s.id,
          peerId: s.teacher_id === userId ? s.learner_id : s.teacher_id,
          peerName: peer?.name || 'SkillSwap Peer',
          peerAvatar: peer?.avatar || '',
          topic: s.topic,
          skillExchanged: s.skill_exchanged,
          date: s.date_str,
          duration: s.duration,
          status: s.status,
          meetUrl: s.meet_url,
          rating: s.rating,
          feedback: s.feedback,
        };
      });
      setSessions(sessionsWithPeerInfo);

      // Fetch connections
      const conns = await api.fetchConnections(userId);
      setConnections(conns);

      // Fetch feed posts
      const posts = await api.fetchFeedPosts();
      const formattedPosts = posts.map((p) => ({
        id: p.id,
        authorName: p.profiles?.name || 'Anonymous',
        authorAvatar: p.profiles?.avatar_url || '',
        authorTitle: p.profiles?.title || 'Member',
        timeAgo: getTimeAgo(p.created_at),
        content: p.content,
        tags: p.tags || [],
        likes: p.likes || 0,
        isLiked: false,
        comments: [],
      }));
      setFeedPosts(formattedPosts);

      // Fetch leaderboard
      const lb = await api.fetchLeaderboard();
      setLeaderboard(
        lb.map((p, i) => ({
          rank: i + 1,
          name: p.name,
          handle: p.handle,
          avatar: p.avatar_url,
          xp: p.xp,
          level: p.level,
          streak: p.streak_days,
          sessions: p.sessions_completed,
        }))
      );
    } catch (err) {
      console.error('Error loading user data:', err);
    } finally {
      setDataLoading(false);
    }
  }, []);

  // Auto-load on auth change
  useEffect(() => {
    if (auth.user?.id) {
      loadUserData(auth.user.id);
    } else {
      setProfile(null);
      setPeers([]);
      setSessions([]);
      setMessages({});
      setFeedPosts([]);
      setLeaderboard([]);
      setConnections([]);
    }
  }, [auth.user?.id, loadUserData]);

  // Subscribe to realtime messages
  useEffect(() => {
    if (!auth.user?.id) return;

    const channel = api.subscribeToMessages(auth.user.id, (newMsg) => {
      setMessages((prev) => ({
        ...prev,
        [newMsg.sender_id]: [
          ...(prev[newMsg.sender_id] || []),
          {
            id: newMsg.id,
            senderId: newMsg.sender_id,
            text: newMsg.text,
            timestamp: new Date(newMsg.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            meetUrl: newMsg.meet_url,
          },
        ],
      }));
    });

    return () => channel.unsubscribe();
  }, [auth.user?.id]);

  // ─── Actions ─────────────────────────────────────────────

  const recordActivity = useCallback(
    async (xpGained = 50) => {
      if (!auth.user?.id) return;
      const updated = await api.awardXp(auth.user.id, xpGained);
      if (updated) {
        setProfile((prev) => (prev ? { ...prev, xp: updated.xp, level: updated.level } : prev));
      }
    },
    [auth.user?.id]
  );

  const scheduleSession = useCallback(
    async (peerId, topic, skillExchanged, date, duration) => {
      if (!auth.user?.id) return null;
      const meetingCode = `swap-${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 5)}`;
      const meetUrl = `https://meet.google.com/${meetingCode}`;

      const sessionData = {
        teacher_id: auth.user.id,
        learner_id: peerId,
        topic,
        skill_exchanged: skillExchanged,
        date_str: date || 'Tomorrow, 4:00 PM',
        duration: duration || '60 mins',
        status: 'upcoming',
        meet_url: meetUrl,
      };

      const created = await api.createSession(sessionData);
      if (created) {
        const peer = peers.find((p) => p.id === peerId);
        const newSession = {
          id: created.id,
          peerId,
          peerName: peer?.name || 'SkillSwap Peer',
          peerAvatar: peer?.avatar || '',
          topic,
          skillExchanged,
          date: date || 'Tomorrow, 4:00 PM',
          duration: duration || '60 mins',
          status: 'upcoming',
          meetUrl,
        };
        setSessions((prev) => [newSession, ...prev]);

        // Send meet link in chat
        await sendMessage(peerId, `📅 Scheduled exchange: "${topic}" (${date || 'Tomorrow, 4:00 PM'}). Google Meet Link: ${meetUrl}`, meetUrl);
        await recordActivity(100);
        return newSession;
      }
      return null;
    },
    [auth.user?.id, peers, recordActivity]
  );

  const startInstantMeet = useCallback(
    async (peerId, topic = 'Instant 1:1 Skill Exchange') => {
      if (!auth.user?.id) return null;
      const meetingCode = `swap-${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 5)}`;
      const meetUrl = `https://meet.google.com/${meetingCode}`;

      const sessionData = {
        teacher_id: auth.user.id,
        learner_id: peerId,
        topic,
        skill_exchanged: user?.skillsToTeach?.[0] || 'Peer Knowledge',
        date_str: 'Now (Live)',
        duration: '45 mins',
        status: 'upcoming',
        meet_url: meetUrl,
      };

      const created = await api.createSession(sessionData);
      if (created) {
        const peer = peers.find((p) => p.id === peerId);
        const instantSession = {
          id: created.id,
          peerId,
          peerName: peer?.name || 'SkillSwap Peer',
          peerAvatar: peer?.avatar || '',
          topic,
          skillExchanged: user?.skillsToTeach?.[0] || 'Peer Knowledge',
          date: 'Now (Live)',
          duration: '45 mins',
          status: 'upcoming',
          meetUrl,
        };
        setSessions((prev) => [instantSession, ...prev]);

        await sendMessage(peerId, `🚀 Live Google Meet Call Started! Click to join: ${meetUrl}`, meetUrl);
        await recordActivity(80);
        return instantSession;
      }
      return null;
    },
    [auth.user?.id, peers, user, recordActivity]
  );

  const completeSession = useCallback(
    async (sessionId, rating = 5, feedback = '') => {
      if (!auth.user?.id) return;
      await api.completeSessionInDb(sessionId, rating, feedback);
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId ? { ...s, status: 'completed', rating, feedback } : s
        )
      );
      await api.incrementSessionsCompleted(auth.user.id);
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              sessions_completed: (prev.sessions_completed || 0) + 1,
              streak_days: (prev.streak_days || 0) + 1,
            }
          : prev
      );
      await recordActivity(150);
    },
    [auth.user?.id, recordActivity]
  );

  const cancelSession = useCallback(async (sessionId) => {
    await api.cancelSessionInDb(sessionId);
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  }, []);

  const sendMessage = useCallback(
    async (peerId, text, customMeetUrl = null) => {
      if (!text.trim() || !auth.user?.id) return;
      const sent = await api.sendMessageToDb(auth.user.id, peerId, text, customMeetUrl);
      if (sent) {
        const timeStr = new Date(sent.created_at).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        const newMsg = {
          id: sent.id,
          senderId: auth.user.id,
          text: sent.text,
          timestamp: timeStr,
          meetUrl: sent.meet_url,
        };
        setMessages((prev) => ({
          ...prev,
          [peerId]: [...(prev[peerId] || []), newMsg],
        }));
      }
    },
    [auth.user?.id]
  );

  const loadChatHistory = useCallback(
    async (peerId) => {
      if (!auth.user?.id) return;
      const msgs = await api.fetchMessages(auth.user.id, peerId);
      const formatted = msgs.map((m) => ({
        id: m.id,
        senderId: m.sender_id,
        text: m.text,
        timestamp: new Date(m.created_at).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        meetUrl: m.meet_url,
      }));
      setMessages((prev) => ({ ...prev, [peerId]: formatted }));
    },
    [auth.user?.id]
  );

  const createFeedPost = useCallback(
    async (content, tags = []) => {
      if (!auth.user?.id) return;
      const created = await api.createFeedPost(auth.user.id, content, tags);
      if (created) {
        const newPost = {
          id: created.id,
          authorName: created.profiles?.name || user?.name || 'You',
          authorAvatar: created.profiles?.avatar_url || user?.avatar || '',
          authorTitle: created.profiles?.title || user?.title || 'Member',
          timeAgo: 'Just now',
          content: created.content,
          tags: created.tags || [],
          likes: 0,
          isLiked: false,
          comments: [],
        };
        setFeedPosts((prev) => [newPost, ...prev]);
        await recordActivity(30);
      }
    },
    [auth.user?.id, user, recordActivity]
  );

  const toggleLikePost = useCallback(async (postId) => {
    setFeedPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const newLiked = !post.isLiked;
          const newLikes = newLiked ? post.likes + 1 : post.likes - 1;
          api.toggleLikePost(postId, post.likes, post.isLiked); // fire-and-forget
          return { ...post, likes: newLikes, isLiked: newLiked };
        }
        return post;
      })
    );
  }, []);

  const updateProfile = useCallback(
    async (updates) => {
      if (!auth.user?.id) return;
      // Separate skills from profile fields
      const { skillsToTeach, skillsToLearn, avatar, ...profileUpdates } = updates;

      if (avatar !== undefined) {
        profileUpdates.avatar_url = avatar;
      }

      if (Object.keys(profileUpdates).length > 0) {
        const updated = await api.updateProfile(auth.user.id, profileUpdates);
        if (updated) setProfile(updated);
      }

      if (skillsToTeach || skillsToLearn) {
        const teach = skillsToTeach || userSkills.teach;
        const learn = skillsToLearn || userSkills.learn;
        await api.upsertSkills(auth.user.id, teach, learn);
        setUserSkills({ teach, learn });
      }

      await recordActivity(20);
    },
    [auth.user?.id, userSkills, recordActivity]
  );

  const sendConnectionRequest = useCallback(
    async (receiverId) => {
      if (!auth.user?.id) return;
      const conn = await api.sendConnectionRequest(auth.user.id, receiverId);
      if (conn) setConnections((prev) => [conn, ...prev]);
    },
    [auth.user?.id]
  );

  const updateConnectionStatus = useCallback(async (connectionId, status) => {
    const updated = await api.updateConnectionStatus(connectionId, status);
    if (updated) {
      setConnections((prev) =>
        prev.map((c) => (c.id === connectionId ? { ...c, status } : c))
      );
    }
  }, []);

  // Login/signup actions (delegate to auth hook)
  const loginUser = useCallback(
    async (email, password) => {
      const result = await auth.signIn({ email, password });
      return result;
    },
    [auth]
  );

  const signUpUser = useCallback(
    async ({ name, email, password, skillsToTeach, skillsToLearn }) => {
      const result = await auth.signUp({ email, password, name, skillsToTeach, skillsToLearn });
      return result;
    },
    [auth]
  );

  const signInWithGoogle = useCallback(async () => {
    return auth.signInWithGoogle();
  }, [auth]);

  const signOut = useCallback(async () => {
    await auth.signOut();
    localStorage.removeItem('skillswap_user');
    localStorage.removeItem('skillswap_peers');
    localStorage.removeItem('skillswap_sessions');
    localStorage.removeItem('skillswap_messages');
    localStorage.removeItem('skillswap_feed');
  }, [auth]);

  return (
    <AppContext.Provider
      value={{
        // User & Auth
        user,
        profile,
        isAuthenticated: auth.isAuthenticated,
        authLoading: auth.loading,
        authError: auth.error,
        loginUser,
        signUpUser,
        signInWithGoogle,
        signOut,
        resetPassword: auth.resetPassword,
        updatePassword: auth.updatePassword,

        // Peers & Matching
        peers,

        // Sessions
        sessions,
        scheduleSession,
        startInstantMeet,
        completeSession,
        cancelSession,

        // Messages
        messages,
        sendMessage,
        loadChatHistory,

        // Feed
        feedPosts,
        createFeedPost,
        toggleLikePost,

        // Connections
        connections,
        sendConnectionRequest,
        updateConnectionStatus,

        // Leaderboard & Misc
        leaderboard,
        announcements,
        dataLoading,
        updateProfile,
        recordActivity,

        // Reload data
        reloadData: () => auth.user?.id && loadUserData(auth.user.id),
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

// Helper
function getTimeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString();
}
