import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Sessions from './pages/Sessions';
import Chat from './pages/Chat';
import Feed from './pages/Feed';
import Leaderboard from './pages/Leaderboard';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import Referrals from './pages/Referrals';
import Announcements from './pages/Announcements';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

export default function App() {
  const location = useLocation();

  // Hide nav & footer on auth screens
  const isAuthPage = ['/login', '/forgot-password', '/reset-password'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground">
      {!isAuthPage && <Navbar />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:userId" element={<Chat />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/referrals" element={<Referrals />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/admin/notices" element={<Announcements />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
}
