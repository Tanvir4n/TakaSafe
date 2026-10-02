import React, { useState } from 'react';
import { AuthUser, UserRole } from '../../types';
import {
  ShieldCheck,
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  Building2,
  Sparkles,
  Smartphone,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
  onCancel: () => void;
  lang: 'EN' | 'BN';
}

const DEMO_ACCOUNTS: Record<UserRole, AuthUser> = {
  ADMIN: {
    id: 'USR-ADM-01',
    name: 'Sourov Kumar',
    email: 'sourov.kumar@takasafe.upay.bd',
    phone: '+880 1712-401920',
    role: 'ADMIN',
    designation: 'Chief Risk Analyst & AML Supervisor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    permissions: {
      canViewOperatorDashboard: true,
      canFreezeWallets: true,
      canDispatchLiquidity: true,
      canTunePolicyWeights: true,
      canExportAuditLogs: true,
      canPerformInvestigationActions: true,
    },
  },
  USER: {
    id: 'USR-CUST-88',
    name: 'Rafiqul Islam',
    email: 'rafiqul.islam@gmail.com',
    phone: '01711-239481',
    role: 'USER',
    designation: 'Verified Upay MFS Customer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    permissions: {
      canViewOperatorDashboard: false,
      canFreezeWallets: false,
      canDispatchLiquidity: false,
      canTunePolicyWeights: false,
      canExportAuditLogs: false,
      canPerformInvestigationActions: false,
    },
  },
};

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onCancel, lang }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('ADMIN');
  const [email, setEmail] = useState<string>(DEMO_ACCOUNTS.ADMIN.email);
  const [password, setPassword] = useState<string>('••••••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Switch role selection and autofill matching demo credentials
  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(DEMO_ACCOUNTS[role].email);
    setPassword('••••••••••••');
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Please enter your account password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const user = {
        ...DEMO_ACCOUNTS[selectedRole],
        email: email.trim(),
      };
      onLogin(user);
    }, 400);
  };

  const handleGoogleSignIn = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLogin(DEMO_ACCOUNTS[selectedRole]);
    }, 450);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 sm:p-10 relative animate-slide-up card-hover-lift">
        {/* Top Back Navigation */}
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        {/* Header Kicker and Title matching user image reference */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-widest text-[#164E3D] font-bold uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#164E3D]"></span>
            <span>Account Access</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight">
            Sign in
          </h1>
          <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
            Access your TakaSafe dashboard, fraud surveillance controls, and wallet security.
          </p>
        </div>

        {/* Two Options: Admin vs User Role Selector */}
        <div className="mb-6">
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Select Access Role</span>
            <span className="text-[10px] text-indigo-600 font-mono font-normal">2 Account Types</span>
          </div>

          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100/90 rounded-2xl border border-slate-200">
            {/* Admin Option */}
            <button
              type="button"
              onClick={() => handleSelectRole('ADMIN')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedRole === 'ADMIN'
                  ? 'bg-white text-slate-950 shadow-md ring-1 ring-slate-900/10'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${selectedRole === 'ADMIN' ? 'text-[#0054A6]' : 'text-slate-400'}`} />
              <span>Admin</span>
            </button>

            {/* User Option */}
            <button
              type="button"
              onClick={() => handleSelectRole('USER')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedRole === 'USER'
                  ? 'bg-white text-slate-950 shadow-md ring-1 ring-slate-900/10'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className={`w-4 h-4 ${selectedRole === 'USER' ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>User</span>
            </button>
          </div>

          {/* Active Role Quick Description */}
          <div className="mt-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full shrink-0 ${selectedRole === 'ADMIN' ? 'bg-[#0054A6]' : 'bg-emerald-600'}`} />
            <p className="leading-tight">
              {selectedRole === 'ADMIN' ? (
                <span>
                  <strong>Admin Role:</strong> Full access to Operator Cockpit, MuleVision graph, and BFIU AML audit controls.
                </span>
              ) : (
                <span>
                  <strong>User Role:</strong> Access Upay customer app, ScamShield protection, and Send Money transfers.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Continue with Google button matching image reference */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-full text-xs font-semibold text-slate-700 shadow-xs transition-all cursor-pointer hover:shadow-sm"
        >
          {/* Multicolored Google SVG Icon */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* OR Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-[10px] font-mono tracking-widest uppercase">
            <span className="bg-white px-3 text-slate-400 font-semibold">Or</span>
          </div>
        </div>

        {/* Error notification if any */}
        {errorMsg && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#164E3D] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Your Password"
                required
                className="w-full px-3.5 py-2.5 pr-10 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#164E3D] focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-slate-300 text-[#164E3D] focus:ring-[#164E3D]"
              />
              <span className="text-[11px]">Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => setErrorMsg('Password reset link sent to registered email.')}
              className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          <div className="text-[11px] text-slate-500 text-center leading-normal pt-1">
            By signing in, I agree to the{' '}
            <span className="text-slate-700 underline font-medium cursor-pointer">Terms of Service</span> and{' '}
            <span className="text-slate-700 underline font-medium cursor-pointer">Privacy Policy</span>
          </div>

          {/* Primary Sign In Button matching reference */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-[#164E3D] hover:bg-[#113C2F] text-white font-bold rounded-full text-xs shadow-md hover:shadow-lg transition-all transform active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign in as {selectedRole === 'ADMIN' ? 'Admin' : 'User'}</span>
                <ChevronRight className="w-4 h-4 text-emerald-300" />
              </>
            )}
          </button>
        </form>

        {/* Quick 1-Click Demo Profiles Footer for Evaluators */}
        <div className="mt-6 pt-5 border-t border-slate-200/80 text-center">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-2">
            Quick 1-Click Demo Logins
          </span>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                handleSelectRole('ADMIN');
                onLogin(DEMO_ACCOUNTS.ADMIN);
              }}
              className="text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Demo Admin (Sourov Kumar)
            </button>
            <button
              type="button"
              onClick={() => {
                handleSelectRole('USER');
                onLogin(DEMO_ACCOUNTS.USER);
              }}
              className="text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Demo User (Rafiqul Islam)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
