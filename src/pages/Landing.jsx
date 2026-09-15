import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftRight,
  Sparkles,
  Zap,
  Users,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import SkillTag from '../components/SkillTag';
import StarRating from '../components/StarRating';

export default function Landing() {
  const steps = [
    {
      num: '01',
      title: 'Create Your Profile',
      desc: 'List skills you are confident teaching and skills you are excited to learn.',
    },
    {
      num: '02',
      title: 'Discover Matches',
      desc: 'Our intelligent matching engine pairs you with peers offering complementary knowledge.',
    },
    {
      num: '03',
      title: 'Connect & Coordinate',
      desc: 'Chat directly in 1:1 messaging and schedule video learning sessions at mutually convenient times.',
    },
    {
      num: '04',
      title: 'Exchange & Level Up',
      desc: 'Teach, learn, share authentic feedback, and earn XP streaks on the global leaderboard.',
    },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Smart Matching Engine',
      desc: 'Instant algorithm matching your requested skills with peers seeking your teaching strengths.',
    },
    {
      icon: MessageSquare,
      title: 'Built-in 1:1 Chat',
      desc: 'Seamless peer messaging to discuss goals, share study resources, and set expectations.',
    },
    {
      icon: Calendar,
      title: 'Session Scheduler',
      desc: 'Easily book, track, and join video learning exchanges with calendar integration.',
    },
    {
      icon: ShieldCheck,
      title: 'Trust & Peer Reviews',
      desc: 'Community rating system ensures reliable, respectful, and high-quality learning sessions.',
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden pt-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4">
        {/* Glow blobs */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-40 right-10 w-[300px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/80 border border-border text-xs sm:text-sm text-muted-foreground shadow-sm">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <span>Real-time peer skill exchange</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-[1.15]">
                Match with people who can{' '}
                <span className="text-gradient">teach you what you need</span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
                SkillSwap turns knowledge sharing into a collaborative learning experience.
                Teach what you know, learn what you want, and grow together without expensive course subscriptions.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:gap-3"
                >
                  <span>Start Matching</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-secondary/40 hover:bg-secondary text-foreground font-medium text-sm transition-colors"
                >
                  Join Community Free
                </Link>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 pt-3">
                {['Reciprocal Learning', 'Matching Engine', '1:1 Live Chat', 'Gamified Streaks'].map(
                  (badge) => (
                    <span
                      key={badge}
                      className="px-3 py-1 rounded-full text-xs font-medium border border-border/80 bg-card text-muted-foreground"
                    >
                      {badge}
                    </span>
                  )
                )}
              </div>
            </motion.div>

            {/* Right Card: Live Matching Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative"
            >
              <div className="rounded-3xl border border-border/80 bg-card/90 p-6 sm:p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-5 border-b border-border/60">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Top Recommended Match
                    </span>
                    <h3 className="font-display text-xl font-bold flex items-center gap-2 text-foreground mt-0.5">
                      Sanjjay <ArrowLeftRight className="w-4 h-4 text-primary" /> Prince
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                    75% Match
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 py-5 border-b border-border/60">
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-muted-foreground">You teach:</p>
                    <div className="flex flex-wrap gap-1.5">
                      <SkillTag skill="Python" variant="teach" />
                      <SkillTag skill="Web Basics" variant="teach" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground pt-1">You want:</p>
                    <div className="flex flex-wrap gap-1.5">
                      <SkillTag skill="UI/UX Design" variant="learn" />
                      <SkillTag skill="Figma" variant="learn" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-medium text-muted-foreground">Prince teaches:</p>
                    <div className="flex flex-wrap gap-1.5">
                      <SkillTag skill="UI/UX Design" variant="teach" />
                      <SkillTag skill="Figma" variant="teach" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground pt-1">Prince wants:</p>
                    <div className="flex flex-wrap gap-1.5">
                      <SkillTag skill="Python" variant="learn" />
                      <SkillTag skill="Backend" variant="learn" />
                    </div>
                  </div>
                </div>

                <div className="pt-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StarRating rating={4.9} />
                    <span className="text-xs text-muted-foreground">• 22 peer reviews</span>
                  </div>
                  <Link
                    to="/chat"
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-md shadow-primary/20"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Connect & Chat</span>
                  </Link>
                </div>
              </div>

              {/* Subtle stats pill floating */}
              <div className="absolute -bottom-5 -left-4 bg-background/95 border border-border/90 rounded-2xl p-3.5 shadow-xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">1,240+ Sessions</p>
                  <p className="text-[11px] text-muted-foreground">Exchanged this month</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-card/30 border-y border-border/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Simple & Reciprocal</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-2">
              How SkillSwap Works
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-3">
              A streamlined 4-step journey designed around mutual benefit and active knowledge retention.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div
                key={step.num}
                className="rounded-2xl border border-border/70 bg-card p-6 relative hover:border-primary/40 transition-colors group"
              >
                <span className="text-3xl font-display font-extrabold text-primary/30 group-hover:text-primary transition-colors">
                  {step.num}
                </span>
                <h3 className="font-display font-bold text-lg text-foreground mt-3 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Features</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-2">
              Everything You Need to Learn & Teach
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-3">
              Designed from the ground up for authentic peer-to-peer collaboration and real skill mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="rounded-2xl border border-border/70 bg-card p-6 sm:p-8 flex items-start gap-4 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-foreground mb-1.5">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-3xl border border-border/80 bg-gradient-to-b from-card to-secondary/30 p-8 sm:p-14 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-foreground tracking-tight">
              Ready to exchange knowledge?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto mt-4 mb-8 leading-relaxed">
              Join our growing global network of creators, engineers, and designers who learn by teaching.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/dashboard"
                className="px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-xl shadow-primary/25"
              >
                Get Started Now
              </Link>
              <Link
                to="/feed"
                className="px-6 py-3.5 rounded-xl border border-border bg-card hover:bg-secondary text-foreground font-medium text-sm transition-colors"
              >
                Explore Community Feed
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
