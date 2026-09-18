import React, { useState } from 'react';
import { Zap, Lock, Mail, User, ShieldCheck, ArrowRight, Building2, Eye, EyeOff, CheckCircle2, Store } from 'lucide-react';
import { UserSession } from '../types';

interface AuthPageProps {
  onLogin: (session: UserSession) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Franchise Owner & Operations Manager');
  const [brand, setBrand] = useState("Domino's Pizza, McDonald's & KFC Stores");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const displayName = mode === 'signup' && name.trim() ? name.trim() : email.split('@')[0];
      const initials = displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'JD';

      const session: UserSession = {
        name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
        email: email,
        role: role,
        franchiseBrand: brand,
        avatarInitials: initials,
      };

      setIsLoading(false);
      onLogin(session);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      
      {/* Background Soft Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-5xl bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* Left Side: Brand Showcase & Franchise Highlights */}
        <div className="lg:col-span-5 bg-slate-900 p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 text-white">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20">
                <Zap className="w-6 h-6 fill-slate-950" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Fran<span className="text-emerald-400">AI</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white mt-8 leading-tight">
              Multi-Unit Franchise Intelligence Platform
            </h2>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">
              Real-time sales, inventory tracking, staff schedules & store health audits across your entire QSR network.
            </p>

            {/* Application Description */}
            <div className="mt-8 space-y-4">
              <div className="p-4 bg-slate-800/80 border border-slate-700/80 rounded-2xl space-y-3 text-xs text-slate-300">
                <p className="font-semibold text-slate-200 leading-relaxed">
                  FranAI is a centralized operations platform designed for multi-unit franchise owners and store managers to streamline daily restaurant operations.
                </p>
                <div className="space-y-2.5 pt-2 border-t border-slate-700/60">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong className="text-white">Live Outlet Telemetry:</strong> Track real-time sales, peak hours, and revenue targets across all store locations.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong className="text-white">Inventory & Staff Controls:</strong> Receive low stock alerts, manage shift rosters, and optimize delivery times.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong className="text-white">AI Health Diagnostics:</strong> Automated store audit scoring, hygiene compliance tracking, and growth recommendations.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer badge */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Enterprise-Grade Encrypted Session</span>
          </div>
        </div>

        {/* Right Side: Auth Form (Clean White Theme) */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-white">
          
          {/* Mode Switcher Header */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {mode === 'login' ? 'Welcome Back!' : 'Create Franchise Account'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {mode === 'login'
                  ? 'Enter your credentials to access your store metrics'
                  : 'Register your franchise or manager credentials'}
              </p>
            </div>

            <div className="bg-slate-100 p-1 rounded-2xl flex items-center border border-slate-200">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  mode === 'login'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  mode === 'signup'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name field on Sign Up */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Davis"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. manager@dominos-mcd.com"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role & Franchise Group on Sign Up */}
            {mode === 'signup' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Role / Position
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none"
                  >
                    <option value="Franchise Owner & Operations Manager">Franchise Owner</option>
                    <option value="District General Manager">District General Manager</option>
                    <option value="Store Outlet Manager">Store Outlet Manager</option>
                    <option value="Financial & Audit Director">Financial & Audit Director</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Assigned Brand
                  </label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none"
                  >
                    <option value="All Brands (Domino's, McDonald's & KFC)">All Brands</option>
                    <option value="Domino's Pizza Outlets">Domino's Pizza</option>
                    <option value="McDonald's Corporation Stores">McDonald's</option>
                    <option value="KFC Fried Chicken Outlets">KFC</option>
                  </select>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In to Dashboard' : 'Complete Registration'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle mode text link */}
          <div className="mt-6 text-center text-xs text-slate-500">
            {mode === 'login' ? (
              <span>
                Don't have a franchise account?{' '}
                <button
                  onClick={() => { setMode('signup'); setError(''); }}
                  className="text-emerald-700 hover:underline font-bold"
                >
                  Create one now
                </button>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button
                  onClick={() => { setMode('login'); setError(''); }}
                  className="text-emerald-700 hover:underline font-bold"
                >
                  Log in to your account
                </button>
              </span>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
