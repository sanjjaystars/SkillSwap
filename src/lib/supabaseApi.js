import { supabase } from './supabase';

// ─── PROFILES ──────────────────────────────────────────────

export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) console.error('fetchProfile error:', error);
  return data;
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  if (error) console.error('updateProfile error:', error);
  return data;
}

export async function fetchAllPeers(currentUserId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .neq('id', currentUserId)
    .order('xp', { ascending: false });
  if (error) console.error('fetchAllPeers error:', error);
  return data || [];
}

// ─── SKILLS ──────────────────────────────────────────────

export async function fetchSkills(userId) {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('user_id', userId);
  if (error) console.error('fetchSkills error:', error);
  return data || [];
}

export async function fetchAllSkillsForUsers(userIds) {
  if (!userIds.length) return [];
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .in('user_id', userIds);
  if (error) console.error('fetchAllSkillsForUsers error:', error);
  return data || [];
}

export async function upsertSkills(userId, teachSkills, learnSkills) {
  // Delete old skills for this user
  await supabase.from('skills').delete().eq('user_id', userId);

  const rows = [
    ...teachSkills.map((name) => ({
      user_id: userId,
      name: name.trim(),
      type: 'teach',
      proficiency: 'Intermediate',
    })),
    ...learnSkills.map((name) => ({
      user_id: userId,
      name: name.trim(),
      type: 'learn',
      proficiency: 'Beginner',
    })),
  ].filter((r) => r.name);

  if (rows.length === 0) return [];

  const { data, error } = await supabase.from('skills').insert(rows).select();
  if (error) console.error('upsertSkills error:', error);
  return data || [];
}

// ─── SESSIONS ──────────────────────────────────────────────

export async function fetchSessions(userId) {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .or(`teacher_id.eq.${userId},learner_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  if (error) console.error('fetchSessions error:', error);
  return data || [];
}

export async function createSession(sessionData) {
  const { data, error } = await supabase
    .from('sessions')
    .insert(sessionData)
    .select()
    .single();
  if (error) console.error('createSession error:', error);
  return data;
}

export async function completeSessionInDb(sessionId, rating, feedback) {
  const { data, error } = await supabase
    .from('sessions')
    .update({
      status: 'completed',
      rating,
      feedback: feedback || 'Great session! Knowledge exchange was clear and insightful.',
    })
    .eq('id', sessionId)
    .select()
    .single();
  if (error) console.error('completeSession error:', error);
  return data;
}

export async function cancelSessionInDb(sessionId) {
  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', sessionId);
  if (error) console.error('cancelSession error:', error);
}

// ─── MESSAGES ──────────────────────────────────────────────

export async function fetchMessages(userId1, userId2) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(
      `and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`
    )
    .order('created_at', { ascending: true });
  if (error) console.error('fetchMessages error:', error);
  return data || [];
}

export async function sendMessageToDb(senderID, receiverID, text, meetUrl = null) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: senderID,
      receiver_id: receiverID,
      text,
      meet_url: meetUrl,
    })
    .select()
    .single();
  if (error) console.error('sendMessage error:', error);
  return data;
}

/**
 * Subscribe to new messages for a specific conversation.
 * Returns the channel subscription (call .unsubscribe() to clean up).
 */
export function subscribeToMessages(userId, callback) {
  const channel = supabase
    .channel('messages-realtime')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return channel;
}

// ─── CONNECTIONS ──────────────────────────────────────────────

export async function fetchConnections(userId) {
  const { data, error } = await supabase
    .from('connections')
    .select('*')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  if (error) console.error('fetchConnections error:', error);
  return data || [];
}

export async function sendConnectionRequest(senderId, receiverId) {
  const { data, error } = await supabase
    .from('connections')
    .insert({ sender_id: senderId, receiver_id: receiverId, status: 'pending' })
    .select()
    .single();
  if (error) console.error('sendConnectionRequest error:', error);
  return data;
}

export async function updateConnectionStatus(connectionId, status) {
  const { data, error } = await supabase
    .from('connections')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', connectionId)
    .select()
    .single();
  if (error) console.error('updateConnectionStatus error:', error);
  return data;
}

// ─── FEED POSTS ──────────────────────────────────────────────

export async function fetchFeedPosts() {
  const { data, error } = await supabase
    .from('feed_posts')
    .select('*, profiles:author_id(name, avatar_url, title)')
    .order('created_at', { ascending: false });
  if (error) console.error('fetchFeedPosts error:', error);
  return data || [];
}

export async function createFeedPost(authorId, content, tags = []) {
  const { data, error } = await supabase
    .from('feed_posts')
    .insert({
      author_id: authorId,
      content,
      tags: tags.length ? tags : ['#SkillSwap', '#LearnByTeaching'],
    })
    .select('*, profiles:author_id(name, avatar_url, title)')
    .single();
  if (error) console.error('createFeedPost error:', error);
  return data;
}

export async function toggleLikePost(postId, currentLikes, isLiked) {
  const { data, error } = await supabase
    .from('feed_posts')
    .update({ likes: isLiked ? currentLikes - 1 : currentLikes + 1 })
    .eq('id', postId)
    .select()
    .single();
  if (error) console.error('toggleLikePost error:', error);
  return data;
}

// ─── LEADERBOARD ──────────────────────────────────────────────

export async function fetchLeaderboard() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, handle, avatar_url, xp, level, streak_days, sessions_completed')
    .order('xp', { ascending: false })
    .limit(50);
  if (error) console.error('fetchLeaderboard error:', error);
  return data || [];
}

// ─── SMART MATCHING ──────────────────────────────────────────────

export async function findSkillMatches(userId) {
  // 1. Get current user's skills
  const userSkills = await fetchSkills(userId);
  const myTeach = userSkills.filter((s) => s.type === 'teach').map((s) => s.name.toLowerCase());
  const myLearn = userSkills.filter((s) => s.type === 'learn').map((s) => s.name.toLowerCase());

  if (myTeach.length === 0 && myLearn.length === 0) return [];

  // 2. Get all other users with their skills
  const peers = await fetchAllPeers(userId);
  if (peers.length === 0) return [];

  const peerIds = peers.map((p) => p.id);
  const allSkills = await fetchAllSkillsForUsers(peerIds);

  // 3. Group skills by user
  const skillsByUser = {};
  allSkills.forEach((skill) => {
    if (!skillsByUser[skill.user_id]) {
      skillsByUser[skill.user_id] = { teach: [], learn: [] };
    }
    skillsByUser[skill.user_id][skill.type].push(skill.name.toLowerCase());
  });

  // 4. Score each peer
  const matches = peers
    .map((peer) => {
      const peerSkills = skillsByUser[peer.id] || { teach: [], learn: [] };

      // They teach what I want to learn
      const theyTeachILearn = peerSkills.teach.filter((s) => myLearn.includes(s));
      // I teach what they want to learn
      const iTeachTheyLearn = myTeach.filter((s) => peerSkills.learn.includes(s));

      const matchScore = theyTeachILearn.length + iTeachTheyLearn.length;
      const isReciprocal = theyTeachILearn.length > 0 && iTeachTheyLearn.length > 0;

      return {
        ...peer,
        skillsToTeach: peerSkills.teach,
        skillsToLearn: peerSkills.learn,
        theyTeachILearn,
        iTeachTheyLearn,
        matchScore,
        isReciprocal,
        matchPercent: Math.min(
          100,
          Math.round(
            (matchScore / Math.max(1, myTeach.length + myLearn.length)) * 100
          )
        ),
      };
    })
    .filter((m) => m.matchScore > 0)
    .sort((a, b) => {
      // Reciprocal matches first, then by score
      if (a.isReciprocal && !b.isReciprocal) return -1;
      if (!a.isReciprocal && b.isReciprocal) return 1;
      return b.matchScore - a.matchScore;
    });

  return matches;
}

// ─── GAMIFICATION ──────────────────────────────────────────────

export async function awardXp(userId, xpGained) {
  const profile = await fetchProfile(userId);
  if (!profile) return null;

  const newXp = (profile.xp || 0) + xpGained;
  const newLevel = Math.floor(newXp / 500) + 1;

  return updateProfile(userId, { xp: newXp, level: newLevel });
}

export async function incrementSessionsCompleted(userId) {
  const profile = await fetchProfile(userId);
  if (!profile) return null;

  return updateProfile(userId, {
    sessions_completed: (profile.sessions_completed || 0) + 1,
    streak_days: (profile.streak_days || 0) + 1,
  });
}
