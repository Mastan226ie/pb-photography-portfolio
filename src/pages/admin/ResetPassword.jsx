import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters long');
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      toast.success('Password reset successful! Welcome to your dashboard.');
      navigate('/admin/dashboard', { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password. Link may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-poppins relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card rounded-3xl p-8 md:p-10 border border-white/10 bg-[#0a0a0a]/40 backdrop-blur-3xl shadow-2xl">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-playfair font-bold text-white mb-2">Set New <span className="text-amber-500">Password</span></h1>
            <p className="text-gray-400 text-sm leading-relaxed">Choose a strong, unique password to secure your admin account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold ml-1">New Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-amber-500 transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-amber-500 focus:bg-white/[0.08] lg:hover:bg-white/[0.08] rounded-xl pl-11 pr-12 py-3.5 text-white outline-none transition-all duration-300 text-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-amber-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold ml-1">Confirm New Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-amber-500 transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-amber-500 focus:bg-white/[0.08] lg:hover:bg-white/[0.08] rounded-xl pl-11 pr-4 py-3.5 text-white outline-none transition-all duration-300 text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 lg:hover:from-amber-500 lg:hover:to-amber-400 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-amber-500/20 disabled:opacity-70 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  Update & Sign In
                </>
              )}
            </button>
          </form>

          <Link to="/admin/login" className="flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-amber-500 transition-colors uppercase tracking-[0.2em] mt-8 group">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Cancel Reset
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
