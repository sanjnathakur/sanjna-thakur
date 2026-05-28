import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './service/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'sonner';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      const displayName = user.displayName || email.split('@')[0];
      
      // Generate standard Dicebear initials avatar URL based on the displayName
      const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=0284c7,3b82f6,6366f1`;

      // Save user to localStorage
      const userProfile = {
        email: user.email,
        name: displayName,
        picture: avatarUrl,
        uid: user.uid
      };

      localStorage.setItem('user', JSON.stringify(userProfile));
      
      toast.success(`Welcome back, ${displayName}!`);

      setTimeout(() => {
        navigate('/create-trip');
        // Force header update
        window.dispatchEvent(new Event('storage'));
      }, 1000);

    } catch (error) {
      console.error("Login Error:", error);
      let errorMessage = error.message || 'Invalid email or password. Please try again.';
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email address or password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Email/Password Authentication is not enabled in your Firebase Console. Please enable it in "Firebase Console > Authentication > Sign-in method".';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-70px)] flex items-center justify-center bg-gradient-to-tr from-slate-50 via-blue-50/30 to-indigo-50/40 px-4 py-12 relative overflow-hidden">
      
      {/* Decorative Blur Background Circles */}
      <div className="absolute top-1/4 left-1/10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '6s' }}></div>
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '8s' }}></div>

      {/* Main Login Card */}
      <div className="w-full max-w-md p-8 sm:p-10 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl shadow-blue-900/5 border border-slate-100/50 hover:shadow-blue-900/10 transition-all duration-500">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full">
            Travel Planning Redefined
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Sign In</h1>
          <p className="text-slate-500 mt-2 text-sm">Access your personalized itineraries</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 px-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <FiMail className="h-5 w-5" />
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition duration-200 bg-white/50 text-slate-800 placeholder-slate-400 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 px-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <FiLock className="h-5 w-5" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition duration-200 bg-white/50 text-slate-800 placeholder-slate-400 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 px-4 text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] transition-all duration-150 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
            ) : (
              <>
                <span>Sign In Securely</span>
                <FiArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Bypass Auth / Demo Mode Button */}
          <button
            type="button"
            onClick={() => {
              const demoUser = {
                email: "demo@weave.com",
                name: "Demo Traveler",
                picture: "https://api.dicebear.com/7.x/initials/svg?seed=Demo%20Traveler&backgroundColor=0284c7,3b82f6,6366f1",
                uid: "demo-user-id",
              };
              localStorage.setItem('user', JSON.stringify(demoUser));
              toast.info("Logged in under Demo Mode!");
              setTimeout(() => {
                navigate('/create-trip');
                window.dispatchEvent(new Event('storage'));
              }, 500);
            }}
            className="w-full mt-3 py-3 px-4 text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] transition-all duration-150 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer border border-slate-200/50 shadow-sm text-sm"
          >
            <span>Bypass Auth (Demo Mode)</span>
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition bg-transparent border-none cursor-pointer p-0"
          >
            Create one
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default Login;
