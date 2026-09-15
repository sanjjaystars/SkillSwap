import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-16 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-3xl border border-border/80 bg-card p-7 sm:p-8 shadow-2xl">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Link>

          {submitted ? (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-display font-bold text-foreground">
                Reset Link Sent
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We sent instructions to <strong className="text-foreground">{email}</strong>. Please check your inbox and spam folder.
              </p>
              <Link
                to="/login"
                className="inline-block mt-4 text-xs font-semibold text-primary hover:underline"
              >
                Return to Sign In
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-display font-bold text-foreground mb-1">
                Forgot Password?
              </h2>
              <p className="text-xs text-muted-foreground mb-6">
                Enter your account email to receive a secure password reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1.5 block">
                    Your Email
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
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                >
                  Send Reset Link
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
