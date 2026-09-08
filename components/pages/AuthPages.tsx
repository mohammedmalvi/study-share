"use client";

import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, CheckCircle, BookOpen, ArrowLeft, ArrowRight } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { signIn, signUp, resetPassword, signInWithGoogle } from "@/lib/supabase/auth";

export function LoginPage() {
  const { navigateTo, showToast } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { showToast("Please fill in all fields", "error"); return; }
    setLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      showToast(error.message, "error");
      setLoading(false);
      return;
    }
    
    showToast("Login successful!");
    navigateTo("/dashboard");
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      showToast(error.message, "error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md">
        <button onClick={() => navigateTo("/")} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-700 mb-8 font-medium"><ArrowLeft size={16} /> Back to Home</button>
        <div className="bg-white rounded-3xl border border-blue-50 shadow-xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-md"><BookOpen size={20} className="text-white" /></div>
            <div className="leading-none"><div className="font-extrabold text-blue-700 text-lg heading-font">StudyShare</div><div className="text-[10px] text-blue-400 tracking-widest uppercase">Learn. Share. Grow.</div></div>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 heading-font mb-1">Welcome Back</h1>
          <p className="text-sm text-slate-500 mb-6">Log in to access your study materials</p>
          
          <button onClick={handleGoogleSignIn} disabled={loading} className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-all mb-4 disabled:opacity-60">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Sign in with Google
          </button>
          
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-slate-500">Or continue with email</span></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Email Address</label><div className="relative"><Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all text-slate-700" /></div></div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label><div className="relative"><Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all text-slate-700" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div>
            <div className="flex items-center justify-between"><label className="flex items-center gap-2 text-xs text-slate-600"><input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600" />Remember me</label><button type="button" onClick={() => navigateTo("/forgot-password")} className="text-xs text-blue-600 hover:text-blue-800 font-semibold">Forgot password?</button></div>
            <button type="submit" disabled={loading} className="w-full btn-primary py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60">{loading ? "Logging in..." : <><span>Log In</span><ArrowRight size={16} /></>}</button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">Don{"'"}t have an account? <button onClick={() => navigateTo("/signup")} className="text-blue-600 font-semibold hover:text-blue-800">Sign Up</button></p>
        </div>
      </div>
    </div>
  );
}

export function SignUpPage() {
  const { navigateTo, showToast } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !course || !semester) { showToast("Please fill all required fields", "error"); return; }
    if (password !== confirmPassword) { showToast("Passwords do not match", "error"); return; }
    if (password.length < 6) { showToast("Password must be at least 6 characters", "error"); return; }
    
    setLoading(true);
    
    const { error } = await signUp(email, password, {
      name,
      course,
      semester,
    });
    
    if (error) {
      showToast(error.message, "error");
      setLoading(false);
      return;
    }
    
    showToast("Account created successfully! Welcome to StudyShare.");
    navigateTo("/dashboard");
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      showToast(error.message, "error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md">
        <button onClick={() => navigateTo("/")} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-700 mb-8 font-medium"><ArrowLeft size={16} /> Back to Home</button>
        <div className="bg-white rounded-3xl border border-blue-50 shadow-xl p-8">
          <h1 className="text-2xl font-extrabold text-slate-900 heading-font mb-1">Create Account</h1>
          <p className="text-sm text-slate-500 mb-6">Join StudyShare and start learning</p>
          
          <button onClick={handleGoogleSignIn} disabled={loading} className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-all mb-4 disabled:opacity-60">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Sign up with Google
          </button>
          
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-slate-500">Or sign up with email</span></div>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name *</label><div className="relative"><User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="Priya Sharma" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all text-slate-700" /></div></div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Email *</label><div className="relative"><Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all text-slate-700" /></div></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Course *</label><select value={course} onChange={(e) => setCourse(e.target.value)} className="w-full px-3 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-700"><option value="">Select</option><option>BCA</option><option>MCA</option><option>BSc CS</option><option>BTech</option></select></div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Semester *</label><select value={semester} onChange={(e) => setSemester(e.target.value)} className="w-full px-3 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-700"><option value="">Select</option>{["1st","2nd","3rd","4th","5th","6th"].map(s => <option key={s}>{s} Semester</option>)}</select></div>
            </div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Password *</label><div className="relative"><Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type={showPassword ? "text" : "password"} placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-700" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Confirm Password *</label><div className="relative"><Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="password" placeholder="Repeat password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-700" /></div></div>
            <button type="submit" disabled={loading} className="w-full btn-primary py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60">{loading ? "Creating account..." : <><span>Create Account</span><ArrowRight size={16} /></>}</button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">Already have an account? <button onClick={() => navigateTo("/login")} className="text-blue-600 font-semibold hover:text-blue-800">Log In</button></p>
        </div>
      </div>
    </div>
  );
}

export function ForgotPasswordPage() {
  const { navigateTo, showToast } = useApp();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { showToast("Please enter your email", "error"); return; }
    setLoading(true);
    
    const { error } = await resetPassword(email);
    
    if (error) {
       showToast(error.message, "error");
       setLoading(false);
       return;
    }
    
    setLoading(false); 
    setSent(true); 
    showToast("Reset link sent to your email!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md">
        <button onClick={() => navigateTo("/login")} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-700 mb-8 font-medium"><ArrowLeft size={16} /> Back to Login</button>
        <div className="bg-white rounded-3xl border border-blue-50 shadow-xl p-8">
          <h1 className="text-2xl font-extrabold text-slate-900 heading-font mb-1">Forgot Password</h1>
          <p className="text-sm text-slate-500 mb-6">Enter your email and we will send you a reset link</p>
          {sent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle size={28} className="text-emerald-500" /></div>
              <h3 className="text-lg font-bold text-slate-800 heading-font mb-2">Check Your Email</h3>
              <p className="text-sm text-slate-500 mb-4">We sent a password reset link to <strong>{email}</strong></p>
              <button onClick={() => navigateTo("/login")} className="text-blue-600 font-semibold text-sm">Back to Login</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Email Address</label><div className="relative"><Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-700" /></div></div>
              <button type="submit" disabled={loading} className="w-full btn-primary py-3 rounded-xl font-semibold disabled:opacity-60">{loading ? "Sending..." : "Send Reset Link"}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
