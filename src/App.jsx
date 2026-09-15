import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Sessions from './pages/Sessions';
import Classroom from './pages/Classroom';
import Chat from './pages/Chat';
import Feed from './pages/Feed';
import Leaderboard from './pages/Leaderboard';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import Referrals from './pages/Referrals';
import Announcements from './pages/Announcements';
import MatchEngine from './pages/MatchEngine';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

export default function App() {
  const location = useLocation();

  // Hide nav & footer on auth screens and full-screen classroom
  const isAuthPage = ['/login', '/forgot-password', '/reset-password'].includes(location.pathname);
  const isClassroom = location.pathname.startsWith('/room');

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground">
      {!isAuthPage && <Navbar />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/sessions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />
          <Route path="/room" element={<ProtectedRoute><Classroom /></ProtectedRoute>} />
          <Route path="/room/:sessionId" element={<ProtectedRoute><Classroom /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/chat/:userId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/referrals" element={<ProtectedRoute><Referrals /></ProtectedRoute>} />
          <Route path="/announcements" element={<ProtectedRoute><Announcements /></ProtectedRoute>} />
          <Route path="/matches" element={<ProtectedRoute><MatchEngine /></ProtectedRoute>} />
          <Route path="/admin/notices" element={<ProtectedRoute><Announcements /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </main>

      {!isAuthPage && !isClassroom && <Footer />}
    </div>
  );
}
