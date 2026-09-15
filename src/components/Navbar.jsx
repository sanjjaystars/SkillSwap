import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeftRight,
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Sparkles,
  Trophy,
  Share2,
  Bell,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import StreakIndicator from './StreakIndicator';
import { cn } from '../lib/utils';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/matches', label: 'Matches', icon: Sparkles },
    { to: '/sessions', label: 'Sessions', icon: Calendar },
    { to: '/chat', label: 'Chat', icon: MessageSquare },
    { to: '/feed', label: 'Feed', icon: Sparkles },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { to: '/referrals', label: 'Referrals', icon: Share2 },
    { to: '/announcements', label: 'Notices', icon: Bell },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error(err);
    }
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl transition-all">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-400 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-background rounded-[10px] flex items-center justify-center">
              <ArrowLeftRight className="w-4 h-4 text-blue-400 group-hover:rotate-180 transition-transform duration-500" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold tracking-tight text-foreground flex items-center gap-1">
              SkillSwap
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                PRO
              </span>
            </span>
            <span className="text-[10px] text-muted-foreground -mt-0.5 hidden sm:block">
              Connect globally • Teach what you know
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-secondary text-foreground font-semibold shadow-sm border border-border/80'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-primary' : 'text-muted-foreground')} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated && user ? (
            <>
              <StreakIndicator streak={user.streakDays || 1} xp={user.xp || 150} className="hidden sm:inline-flex" />

              <Link
                to="/profile"
                className={cn(
                  'flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-full border border-border/80 bg-secondary/50 hover:bg-secondary transition-colors',
                  location.pathname === '/profile' && 'ring-2 ring-primary/50'
                )}
                title="Your Profile"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={user.name || 'User'}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-border"
                />
                <span className="text-xs font-semibold hidden sm:inline text-foreground">
                  {user.name}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors hidden sm:inline-flex"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/login?tab=signup"
                className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
              >
                Join Free
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border bg-background/95 backdrop-blur-xl px-4 py-4 space-y-1">
          {user && (
            <div className="pb-3 mb-2 border-b border-border/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.handle}</p>
                </div>
              </div>
              <StreakIndicator streak={user.streakDays || 1} xp={user.xp || 150} />
            </div>
          )}

          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                location.pathname === to
                  ? 'bg-secondary text-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              )}
            >
              <Icon className="w-4 h-4 text-primary" />
              <span>{label}</span>
            </Link>
          ))}

          <Link
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          >
            <User className="w-4 h-4 text-primary" />
            <span>Profile & Settings</span>
          </Link>
        </div>
      )}
    </header>
  );
}
