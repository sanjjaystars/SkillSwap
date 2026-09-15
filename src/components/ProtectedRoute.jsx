import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeftRight } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useApp();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-400 p-0.5 animate-pulse">
          <div className="w-full h-full bg-background rounded-[10px] flex items-center justify-center">
            <ArrowLeftRight className="w-6 h-6 text-blue-400 animate-spin" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">Loading SkillSwap...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
