import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftRight, Heart, Github, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/40 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                <ArrowLeftRight className="w-4 h-4 text-blue-400" />
              </div>
              <span className="font-display text-lg font-bold text-foreground">SkillSwap</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              SkillSwap is a peer-to-peer knowledge exchange ecosystem. Teach what you know, learn what you need, and grow collaboratively through reciprocity.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-muted-foreground">
              <span>Platform by <strong className="text-foreground">Sanjjay</strong></span>
              <span>•</span>
              <a
                href="https://github.com/sanjjaystars/SkillSwap"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 hover:text-foreground text-primary"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Repository</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-foreground mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Matching Engine</Link></li>
              <li><Link to="/sessions" className="hover:text-foreground transition-colors">Peer Sessions</Link></li>
              <li><Link to="/chat" className="hover:text-foreground transition-colors">1:1 Direct Chat</Link></li>
              <li><Link to="/leaderboard" className="hover:text-foreground transition-colors">Gamified Leaderboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-foreground mb-3">Community</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/feed" className="hover:text-foreground transition-colors">Activity Feed</Link></li>
              <li><Link to="/referrals" className="hover:text-foreground transition-colors">Invite Friends</Link></li>
              <li><Link to="/announcements" className="hover:text-foreground transition-colors">Notices & Updates</Link></li>
              <li><Link to="/profile" className="hover:text-foreground transition-colors">Skill Portfolio</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} SkillSwap • Learn by Teaching. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with precision by</span>
            <span className="font-semibold text-foreground">Sanjjay</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500 ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
}
