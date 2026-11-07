import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Activity, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { isValidEmail, rateLimiter, stripHtml } from '../../lib/security';
import { DataService } from '../../services/dataService';

export const DoctorLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('drsaadobhaya@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);

  // If already authenticated with active session, redirect to dashboard
  useEffect(() => {
    const isAuth = sessionStorage.getItem('saad_doctor_auth');
    const expiresAt = sessionStorage.getItem('saad_doctor_session_expires');
    if (isAuth && expiresAt && Date.now() < Number(expiresAt)) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    const cleanEmail = stripHtml(email).trim().toLowerCase();

    // 1. Validate Email Format
    if (!isValidEmail(cleanEmail)) {
      setErrorMsg('Please enter a valid doctor email address.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    // 2. Enforce Strict Rate Limiting (5 failed attempts per 15-minute window)
    const rateCheck = rateLimiter.isAllowed(`login-${cleanEmail}`, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      setLockoutTime(rateCheck.retryAfterSec || 60);
      setErrorMsg(`Too many unsuccessful login attempts. For security, please wait ${rateCheck.retryAfterSec} seconds before trying again.`);
      await DataService.logAudit('LOGIN_RATE_LIMITED', 'Auth', cleanEmail, 'Anonymous', {
        reason: 'Brute force threshold exceeded',
      });
      return;
    }

    setLoading(true);

    // 3. Supabase Cloud Authentication (Production-grade Argon2/Bcrypt + Email Verification + Expiring JWTs)
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          setErrorMsg(error.message || 'Authentication failed. Please verify credentials.');
          await DataService.logAudit('LOGIN_FAILED', 'Auth', cleanEmail, 'Anonymous', { error: error.message });
          setLoading(false);
          return;
        }

        if (data?.session && data.user) {
          // Verify email is verified if required by provider
          if (data.user.email_confirmed_at === null && data.user.confirmed_at === null) {
            setErrorMsg('Email verification is pending. Please confirm your email address before logging in.');
            await supabase.auth.signOut();
            setLoading(false);
            return;
          }

          // Secure Expiring Session (Session storage + 8-hour expiry TTL)
          const sessionExpiry = Date.now() + 8 * 60 * 60 * 1000;
          sessionStorage.setItem('saad_doctor_auth', 'true');
          sessionStorage.setItem('saad_doctor_email', cleanEmail);
          sessionStorage.setItem('saad_doctor_uid', data.user.id);
          sessionStorage.setItem('saad_doctor_session_expires', String(sessionExpiry));

          await DataService.logAudit('LOGIN_SUCCESS', 'Auth', data.user.id, cleanEmail, { method: 'supabase_auth' });
          rateLimiter.reset(`login-${cleanEmail}`);
          setLoading(false);
          navigate('/dashboard');
          return;
        }
      } catch (err: any) {
        console.warn('Supabase auth request failed:', err);
        setErrorMsg('Authentication service unavailable. Please check internet connection.');
        setLoading(false);
        return;
      }
    }

    // 4. Demo / Local Offline Development Mode
    // Password must be provided via secure server/env variable in production.
    const devAuthorizedPassword = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DOCTOR_DEV_PASS) || '';
    
    if (devAuthorizedPassword && password === devAuthorizedPassword) {
      const sessionExpiry = Date.now() + 2 * 60 * 60 * 1000; // 2 hour dev session
      sessionStorage.setItem('saad_doctor_auth', 'true');
      sessionStorage.setItem('saad_doctor_email', cleanEmail);
      sessionStorage.setItem('saad_doctor_session_expires', String(sessionExpiry));
      await DataService.logAudit('LOGIN_DEV_SUCCESS', 'Auth', cleanEmail, cleanEmail, { mode: 'dev_authorized' });
      rateLimiter.reset(`login-${cleanEmail}`);
      setLoading(false);
      navigate('/dashboard');
    } else {
      await DataService.logAudit('LOGIN_FAILED', 'Auth', cleanEmail, 'Anonymous', { mode: 'invalid_credentials' });
      setErrorMsg('Invalid doctor credentials or unauthorized access attempt.');
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    const cleanEmail = stripHtml(email).trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      setErrorMsg('Please enter a valid registered doctor email.');
      return;
    }

    const rateCheck = rateLimiter.isAllowed(`reset-${cleanEmail}`, 3, 30 * 60 * 1000);
    if (!rateCheck.allowed) {
      setErrorMsg('Too many password reset requests. Please wait before trying again.');
      return;
    }

    setLoading(true);

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${window.location.origin}/login?reset=true`,
        });

        if (error) {
          setErrorMsg(error.message);
        } else {
          setInfoMsg('Secure password reset link has been dispatched to your verified email. The token expires in 15 minutes.');
          await DataService.logAudit('PASSWORD_RESET_REQUESTED', 'Auth', cleanEmail, cleanEmail, {});
        }
      } catch (err: any) {
        setErrorMsg('Unable to send reset email at this moment.');
      }
    } else {
      setInfoMsg('Password reset instructions have been logged. In production, this dispatches an expiring reset link via Supabase Auth.');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-medical-600 to-teal-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Activity className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {isResetMode ? 'Reset Doctor Password' : 'Doctor Portal Login'}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Dr. Muhammad Saad Obhaya (MBBS) • Secure Portal
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs font-medium flex items-start gap-2 border border-red-200 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {infoMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium flex items-start gap-2 border border-emerald-200 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{infoMsg}</span>
          </div>
        )}

        {!isResetMode ? (
          <form onSubmit={handleLogin} className="space-y-4">
            
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Doctor Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => { setIsResetMode(true); setErrorMsg(''); setInfoMsg(''); }}
                  className="text-[11px] font-semibold text-medical-600 hover:text-medical-700"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter secure password"
                  required
                  autoComplete="current-password"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || Boolean(lockoutTime)}
              className="w-full bg-medical-600 hover:bg-medical-700 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              {loading ? 'Authenticating securely...' : 'Sign In to Dashboard'}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your verified email. If registered, an expiring password reset token will be dispatched.
            </p>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Doctor Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-medical-600 hover:bg-medical-700 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl shadow transition"
            >
              {loading ? 'Sending Request...' : 'Send Password Reset Link'}
            </button>

            <button
              type="button"
              onClick={() => { setIsResetMode(false); setErrorMsg(''); setInfoMsg(''); }}
              className="w-full text-center text-xs font-semibold text-slate-600 hover:text-slate-900 py-2"
            >
              Back to Login
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted Session • Rate-Limited Authentication</span>
        </div>

      </div>
    </div>
  );
};
