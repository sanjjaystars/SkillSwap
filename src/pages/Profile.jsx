import React, { useState } from 'react';
import {
  User,
  Star,
  Flame,
  Award,
  BookOpen,
  Plus,
  X,
  Check,
  Save,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import SkillTag from '../components/SkillTag';
import StarRating from '../components/StarRating';
import { Loader2 } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile, dataLoading } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [teachInput, setTeachInput] = useState('');
  const [learnInput, setLearnInput] = useState('');
  const [savedToast, setSavedToast] = useState(false);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (user) {
      setName(user.name || '');
      setTitle(user.title || '');
      setBio(user.bio || '');
    }
  }, [user]);

  if (!user && dataLoading) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-20 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
        <p className="text-sm text-muted-foreground">Loading your profile...</p>
      </div>
    );
  }

  const currentUser = user || {
    id: 'guest',
    name: 'Profile User',
    title: 'SkillSwap Member',
    bio: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    skillsToTeach: [],
    skillsToLearn: [],
    streakDays: 1,
    xp: 150,
    level: 1,
    rating: 5.0,
    sessionsCompleted: 0,
    reviewsCount: 0,
  };

  const handleAddTeachSkill = async (e) => {
    e.preventDefault();
    if (!teachInput.trim()) return;
    const currentTeach = currentUser.skillsToTeach || [];
    if (!currentTeach.includes(teachInput.trim())) {
      await updateProfile({ skillsToTeach: [...currentTeach, teachInput.trim()] });
    }
    setTeachInput('');
  };

  const handleRemoveTeachSkill = async (skill) => {
    const currentTeach = currentUser.skillsToTeach || [];
    await updateProfile({
      skillsToTeach: currentTeach.filter((s) => s !== skill),
    });
  };

  const handleAddLearnSkill = async (e) => {
    e.preventDefault();
    if (!learnInput.trim()) return;
    const currentLearn = currentUser.skillsToLearn || [];
    if (!currentLearn.includes(learnInput.trim())) {
      await updateProfile({ skillsToLearn: [...currentLearn, learnInput.trim()] });
    }
    setLearnInput('');
  };

  const handleRemoveLearnSkill = async (skill) => {
    const currentLearn = currentUser.skillsToLearn || [];
    await updateProfile({
      skillsToLearn: currentLearn.filter((s) => s !== skill),
    });
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile({ name, title, bio });
      setIsEditing(false);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {savedToast && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium flex items-center gap-2 shadow-lg">
            <Check className="w-4 h-4" />
            <span>Profile successfully updated!</span>
          </div>
        )}

        {/* Profile Header Card */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 mb-8 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-border/60">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-2 ring-primary/40 shadow-xl"
                />
                <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-primary text-primary-foreground">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-display font-bold text-foreground">
                    {currentUser.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Verified Mentor
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{currentUser.title}</p>
                <div className="flex items-center gap-2 mt-2">
                  <StarRating rating={currentUser.rating} />
                  <span className="text-xs text-muted-foreground">
                    ({currentUser.reviewsCount} verified reviews)
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (isEditing) handleSaveProfile();
                else setIsEditing(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center gap-2 self-start sm:self-auto"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              ) : (
                <span>Edit Profile</span>
              )}
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-border/60 text-center">
            <div>
              <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
                Completed Exchanges
              </span>
              <p className="text-xl font-display font-extrabold text-foreground mt-1">
                {currentUser.sessionsCompleted}
              </p>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
                Learning Streak
              </span>
              <p className="text-xl font-display font-extrabold text-amber-400 mt-1 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-amber-400" />
                {currentUser.streakDays} Days
              </p>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
                Total XP
              </span>
              <p className="text-xl font-display font-extrabold text-sky-400 mt-1">
                {(currentUser.xp || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
                Platform Level
              </span>
              <p className="text-xl font-display font-extrabold text-foreground mt-1">
                Level {currentUser.level}
              </p>
            </div>
          </div>

          {/* Bio Section */}
          <div className="pt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              About Me
            </h3>
            {isEditing ? (
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            ) : (
              <p className="text-sm text-foreground/90 leading-relaxed">{currentUser.bio || 'No bio yet. Click Edit Profile to add one!'}</p>
            )}
          </div>
        </div>

        {/* Skills Management */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Skills to Teach */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-lg">
            <h3 className="font-display text-base font-bold text-foreground mb-1 flex items-center justify-between">
              <span>Skills I Offer to Teach</span>
              <span className="text-xs text-blue-400 font-semibold">Mentor</span>
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Peers will discover you when seeking these capabilities
            </p>

            <div className="flex flex-wrap gap-2 mb-5 min-h-[50px]">
              {(currentUser.skillsToTeach || []).map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveTeachSkill(skill)}
                    className="p-0.5 hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <form onSubmit={handleAddTeachSkill} className="flex gap-2">
              <input
                type="text"
                placeholder="Add skill (e.g. Next.js, Django)..."
                value={teachInput}
                onChange={(e) => setTeachInput(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl bg-secondary/60 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90"
              >
                Add
              </button>
            </form>
          </div>

          {/* Skills to Learn */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-lg">
            <h3 className="font-display text-base font-bold text-foreground mb-1 flex items-center justify-between">
              <span>Skills I Want to Learn</span>
              <span className="text-xs text-emerald-400 font-semibold">Learner</span>
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Our matching engine pairs you with mentors offering these topics
            </p>

            <div className="flex flex-wrap gap-2 mb-5 min-h-[50px]">
              {(currentUser.skillsToLearn || []).map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveLearnSkill(skill)}
                    className="p-0.5 hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <form onSubmit={handleAddLearnSkill} className="flex gap-2">
              <input
                type="text"
                placeholder="Add skill (e.g. UI Design, Docker)..."
                value={learnInput}
                onChange={(e) => setLearnInput(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl bg-secondary/60 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
