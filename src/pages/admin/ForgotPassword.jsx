import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');

    setLoading(true);
    try {
      await forgotPassword(email);
      setSubmitted(true);
      toast.success('Reset link sent!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-poppins relative">
      {/* Background ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card rounded-3xl p-8 md:p-10 border border-white/10 bg-[#0a0a0a]/40 backdrop-blur-3xl shadow-2xl">
          <Link to="/admin/login" className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-amber-500 transition-colors uppercase tracking-widest mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Link>

          {!submitted ? (
            <>
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-playfair font-bold text-white mb-2">Forgot <span className="text-amber-500">Password?</span></h1>
                <p className="text-gray-400 text-sm leading-relaxed">Enter your registered email address and we will send you a link to reset your password.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold ml-1">Work Email</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-amber-500 transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-500 focus:bg-white/[0.08] lg:hover:bg-white/[0.08] rounded-xl pl-11 pr-4 py-3.5 text-white outline-none transition-all duration-300 text-sm"
                      placeholder="admin@pbvideography.com"
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
                      <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      Send Reset Instructions
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                <CheckCircle2 className="w-10 h-10 text-amber-500" />
              </div>
              <h2 className="text-2xl font-playfair font-bold text-white mb-3">Check Your <span className="text-amber-500">Inbox</span></h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                We've sent a password reset link to <strong className="text-white">{email}</strong>. The link will expire in 15 minutes.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-amber-500 text-xs uppercase tracking-[0.2em] font-bold hover:text-amber-400 transition-colors"
                >
                Try a different email
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
