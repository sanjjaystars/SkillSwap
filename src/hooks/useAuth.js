import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Custom hook for Supabase authentication.
 * Handles sign-up, sign-in, Google OAuth, logout,
 * password reset, and auth-state change listening.
 */
export function useAuth() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        setSession(s);
        setUser(s?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Sign up with email + password, then create a profile row
  const signUp = useCallback(async ({ email, password, name, skillsToTeach = [], skillsToLearn = [] }) => {
    setError(null);
    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });
      if (authError) throw authError;

      // Create profile row
      if (data.user) {
        const handle = `@${name.toLowerCase().replace(/\s+/g, '')}`;
        const referralCode = `SWAP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

        const { error: profileError } = await supabase.from('profiles').upsert({
          id: data.user.id,
          name,
          handle,
          email,
          avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=200`,
          title: 'SkillSwap Member',
          bio: 'Excited to exchange knowledge and learn through peer teaching on SkillSwap.',
          referral_code: referralCode,
        }, { onConflict: 'id' });

        if (profileError) console.error('Profile creation error:', profileError);

        // Insert teach skills
        if (skillsToTeach.length > 0) {
          const teachRows = skillsToTeach.map((s) => ({
            user_id: data.user.id,
            name: s.trim(),
            type: 'teach',
            proficiency: 'Intermediate',
          }));
          await supabase.from('skills').insert(teachRows);
        }

        // Insert learn skills
        if (skillsToLearn.length > 0) {
          const learnRows = skillsToLearn.map((s) => ({
            user_id: data.user.id,
            name: s.trim(),
            type: 'learn',
            proficiency: 'Beginner',
          }));
          await supabase.from('skills').insert(learnRows);
        }
      }

      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign in with email + password
  const signIn = useCallback(async ({ email, password }) => {
    setError(null);
    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) throw authError;
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign in with Google OAuth
  const signInWithGoogle = useCallback(async () => {
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (authError) throw authError;
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    setError(null);
    const { error: authError } = await supabase.auth.signOut();
    if (authError) {
      setError(authError.message);
    }
    setSession(null);
    setUser(null);
  }, []);

  // Send password reset email
  const resetPassword = useCallback(async (email) => {
    setError(null);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetError) throw resetError;
      return { error: null };
    } catch (err) {
      setError(err.message);
      return { error: err };
    }
  }, []);

  // Update password (after reset link click)
  const updatePassword = useCallback(async (newPassword) => {
    setError(null);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) throw updateError;
      return { error: null };
    } catch (err) {
      setError(err.message);
      return { error: err };
    }
  }, []);

  return {
    session,
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    isAuthenticated: !!session,
  };
}
