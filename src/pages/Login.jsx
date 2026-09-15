import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeftRight,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useApp, demoAccounts } from '../context/AppContext';

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginUser, signUpUser, switchUser } = useApp();
  const [isSignUp, setIsSignUp] = useState(searchParams.get('tab') === 'signup');
  const [email, setEmail] = useState('sanjjay.stars@gmail.com');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('Sanjjay');
  const [teachSkills, setTeachSkills] = useState('Python, Web Development, AI Agents');
  const [learnSkills, setLearnSkills] = useState('UI/UX Design, Figma Prototyping');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      signUpUser({
        name: fullName,
        email,
        password,
        skillsToTeach: teachSkills.split(',').map((s) => s.trim()).filter(Boolean),
        skillsToLearn: learnSkills.split(',').map((s) => s.trim()).filter(Boolean),
      });
    } else {
      loginUser(email, password);
    }
    navigate('/dashboard');
  };

  const handleQuickSwitch = (accountId) => {
    switchUser(accountId);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-16 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-400 p-0.5 shadow-lg">
            <div className="w-full h-full bg-background rounded-[10px] flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <span className="font-display text-2xl font-extrabold text-foreground">
            SkillSwap
          </span>
        </Link>

        {/* 1-Click Demo Account Switcher Card */}
        <div className="rounded-3xl border border-primary/30 bg-gradient-to-r from-blue-500/10 via-primary/5 to-emerald-500/10 p-5 mb-6 shadow-xl">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Instant Demo Login</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
              Ready
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Quickly switch perspectives to test real reciprocal teaching & learning:
          </p>

          <div className="grid grid-cols-3 gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleQuickSwitch(acc.id)}
                className="p-2.5 rounded-2xl border border-border/80 bg-card hover:border-primary/60 hover:bg-secondary transition-all flex flex-col items-center text-center group"
              >
                <img
                  src={acc.avatar}
                  alt={acc.name}
                  className="w-9 h-9 rounded-full object-cover mb-1.5 ring-1 ring-border group-hover:scale-105 transition-transform"
                />
                <span className="text-xs font-bold text-foreground truncate w-full">
                  {acc.name}
                </span>
                <span className="text-[10px] text-muted-foreground truncate w-full">
                  Lvl {acc.level}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Traditional Credentials Form Card */}
        <div className="rounded-3xl border border-border/80 bg-card p-7 sm:p-8 shadow-2xl">
          {/* Tabs */}
          <div className="flex rounded-xl bg-secondary/60 p-1 mb-6 border border-border/60">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                !isSignUp ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                isSignUp ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1.5 block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Sanjjay"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1.5 block">
                    Skills You Can Teach (comma separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={teachSkills}
                    onChange={(e) => setTeachSkills(e.target.value)}
                    placeholder="e.g. Python, Machine Learning, Web Basics"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1.5 block">
                    Skills You Want to Learn
                  </label>
                  <input
                    type="text"
                    required
                    value={learnSkills}
                    onChange={(e) => setLearnSkills(e.target.value)}
                    placeholder="e.g. Figma, UI/UX Design, Docker"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-foreground">Password</label>
                {!isSignUp && (
                  <Link
                    to="/forgot-password"
                    className="text-[11px] text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 mt-2"
            >
              <span>{isSignUp ? 'Create Reciprocal Account' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-border/60 text-center text-xs text-muted-foreground">
            <p>
              SkillSwap • Learn by Teaching. Authentic peer exchange without paywalls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
