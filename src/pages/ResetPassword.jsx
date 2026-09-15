import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftRight, Lock, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { updatePassword } = useApp();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const result = await updatePassword(newPassword);
      if (result.error) {
        setError(result.error.message || 'Failed to reset password.');
      } else {
        setSuccess(true);
        setTimeout(() => navigate('/dashboard'), 3000);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
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

        <div className="rounded-3xl border border-border/80 bg-card p-7 sm:p-8 shadow-2xl">
          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-lg font-bold text-foreground mb-2">Password Updated!</h2>
              <p className="text-sm text-muted-foreground">
                Your password has been successfully reset. Redirecting to dashboard...
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-bold text-foreground mb-1">Reset your password</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Enter your new password below.
              </p>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 mb-4 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-300">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1.5 block">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1.5 block">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
