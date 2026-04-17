import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  MessageSquare, 
  Mail, 
  LogOut, 
  ChevronLeft, 
  Menu, 
  X, 
  Camera,
  ExternalLink 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const NavItem = ({ to, icon: Icon, label, isCollapsed, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) => `
      flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative
      ${isActive 
        ? 'bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/20' 
        : 'text-gray-400 hover:bg-white/5 hover:text-white'}
    `}
  >
    <Icon className={`w-5 h-5 transition-transform duration-300 ${!isCollapsed ? 'group-hover:scale-110' : ''}`} />
    {!isCollapsed && (
      <span className="text-sm font-poppins tracking-wide">{label}</span>
    )}
    
    {/* Tooltip for collapsed state */}
    {isCollapsed && (
      <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-[10px] uppercase tracking-widest rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap border border-white/10 shadow-xl pointer-events-none">
        {label}
      </div>
    )}
  </NavLink>
);

const AdminLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const menuItems = [
    { to: '/admin/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/albums',       icon: ImageIcon,      label: 'Albums' },
    { to: '/admin/testimonials', icon: MessageSquare,   label: 'Testimonials' },
    { to: '/admin/contacts',     icon: Mail,            label: 'Contacts' },
  ];

  return (
    <div className="min-h-screen bg-[#070707] flex font-poppins text-white selection:bg-amber-500/30">
      
      {/* ── Sidebar (Desktop) ───────────────────────── */}
      <aside 
        className={`hidden md:flex flex-col bg-black border-r border-white/5 transition-all duration-500 ease-in-out sticky top-0 h-screen z-40 ${isCollapsed ? 'w-20' : 'w-72'}`}
      >
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center transition-all duration-300 group-hover:bg-amber-500 group-hover:text-black">
              <img src="/pbphotography.png" alt="PB Photography Logo" className="w-6 h-6 object-contain" />
            </div>
            {!isCollapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="leading-none">
                <span className="text-lg font-playfair font-bold block">PB Admin</span>
                <span className="text-[10px] text-amber-500 uppercase tracking-widest font-bold">Studio</span>
              </motion.div>
            )}
          </NavLink>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <NavItem key={item.to} {...item} isCollapsed={isCollapsed} />
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300"
          >
            <ChevronLeft className={`w-5 h-5 transition-transform duration-500 ${isCollapsed ? 'rotate-180' : ''}`} />
            {!isCollapsed && <span className="text-xs uppercase tracking-widest font-bold text-gray-500">Collapse</span>}
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 text-red-400/70 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all duration-300 group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {!isCollapsed && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── Mobile Header ───────────────────────────── */}
      <div className="md:hidden fixed top-0 inset-x-0 h-16 bg-black/80 backdrop-blur-xl border-b border-white/5 px-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
            <img src="/pbphotography.png" alt="PB Photography Logo" className="w-6 h-6 object-contain" />
            <span className="font-playfair font-bold text-xl">PB Admin</span>
        </div>
        <button 
            onClick={() => setIsMobileOpen(true)}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"
        >
            <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* ── Mobile Sidebar Overlay ──────────────────── */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-80 bg-black z-[70] p-6 flex flex-col shadow-2xl"
            >
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <img src="/pbphotography.png" alt="PB Photography Logo" className="w-6 h-6 object-contain" />
                        <span className="font-playfair font-bold text-xl">PB Admin</span>
                    </div>
                    <button onClick={() => setIsMobileOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 space-y-2">
                    {menuItems.map((item) => (
                        <NavItem key={item.to} {...item} onClick={() => setIsMobileOpen(false)} />
                    ))}
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 px-4 py-4 text-red-400 bg-red-400/5 rounded-2xl transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-bold uppercase tracking-widest text-xs">Sign Out</span>
                </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content Width Area ─────────────────── */}
      <main className="flex-1 min-h-screen relative flex flex-col w-full md:w-[calc(100%-18rem)]">
        {/* Top Header / Breadcrumbs */}
        <header className="hidden md:flex h-20 items-center justify-between px-8 border-b border-white/5 bg-black/50 sticky top-0 backdrop-blur-md z-30">
            <div className="flex items-center gap-4 text-gray-500 text-xs uppercase tracking-[0.2em] font-bold">
                <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/admin/dashboard')}>Dashboard</span>
                {location.pathname !== '/admin/dashboard' && (
                    <>
                        <span className="text-amber-500/30">/</span>
                        <span className="text-white">{location.pathname.split('/').pop()}</span>
                    </>
                )}
            </div>
            
            <div className="flex items-center gap-6">
                <a 
                    href="/" 
                    target="_blank" 
                    className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-amber-500 flex items-center gap-2 transition-colors border border-white/10 px-3 py-1.5 rounded-full"
                >
                    View Site <ExternalLink className="w-3 h-3" />
                </a>
                <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                    <div className="text-right">
                        <p className="text-xs font-bold text-white leading-none mb-1">{user?.email?.split('@')[0]}</p>
                        <p className="text-[9px] text-amber-500/60 uppercase tracking-widest">Administrator</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black font-bold text-sm shadow-lg shadow-amber-500/10">
                        {user?.email?.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>
        </header>

        {/* Page Content Container */}
        <div className="flex-1 p-6 md:p-10 pt-24 md:pt-10 overflow-x-hidden">
            {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
