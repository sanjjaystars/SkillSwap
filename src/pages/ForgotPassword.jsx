import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftRight, Mail, ArrowLeft, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ForgotPassword() {
  const { resetPassword } = useApp();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await resetPassword(email);
      if (result.error) {
        setError(result.error.message || 'Failed to send reset email.');
      } else {
        setSent(true);
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
          {sent ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-lg font-bold text-foreground mb-2">Check your email</h2>
              <p className="text-sm text-muted-foreground mb-6">
                We've sent a password reset link to <strong className="text-foreground">{email}</strong>.
                Click the link in the email to reset your password.
              </p>
              <Link
                to="/login"
                className="text-sm text-primary hover:underline flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-bold text-foreground mb-1">Forgot your password?</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Enter your email and we'll send you a link to reset your password.
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Send Reset Link</span>
                  )}
                </button>
              </form>

              <div className="mt-5 text-center">
                <Link
                  to="/login"
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
