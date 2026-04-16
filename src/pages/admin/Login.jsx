import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Camera, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin/dashboard';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please fill in all fields');
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back, Admin!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden font-poppins">
      {/* Background ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-600/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden bg-[#0a0a0a]/40 backdrop-blur-3xl">
          {/* Logo Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-4">
              <Camera className="w-8 h-8 text-amber-500" />
            </div>
            <h1 className="text-2xl md:text-3xl font-playfair font-bold text-white mb-2">
              Admin <span className="text-amber-500">Access</span>
            </h1>
            <p className="text-gray-400 text-xs tracking-widest uppercase">PB Photography Portfolio</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-amber-500 text-gray-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-amber-500 focus:bg-white/[0.08] lg:hover:bg-white/[0.08] rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-white/20 outline-none transition-all duration-300 text-sm font-poppins"
                  placeholder="admin@pbvideography.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold">Password</label>
                <Link 
                  to="/admin/forgot-password" 
                  className="text-[10px] text-amber-500/60 hover:text-amber-500 transition-colors uppercase tracking-widest"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-amber-500 text-gray-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-amber-500 focus:bg-white/[0.08] lg:hover:bg-white/[0.08] rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-white/20 outline-none transition-all duration-300 text-sm font-poppins"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-amber-600 to-amber-500 lg:hover:from-amber-500 lg:hover:to-amber-400 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 transform lg:active:scale-[0.98] shadow-lg shadow-amber-500/20 disabled:opacity-70 disabled:cursor-not-allowed group text-sm font-poppins"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Sign In to Dashboard
                </>
              )}
            </button>
          </form>

          {/* Footer Card Info */}
          <div className="mt-10 pt-6 border-t border-white/5 flex items-center gap-2 justify-center text-[10px] text-gray-500 uppercase tracking-widest">
            <AlertCircle className="w-3 h-3 text-amber-500/50" />
            Authorised Access Only
          </div>
        </div>
        
        <p className="text-center mt-8 text-gray-600 text-xs tracking-wide">
          © {new Date().getFullYear()} PB Photography. Developed by SramanLabs.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
