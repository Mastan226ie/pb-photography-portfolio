import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  User as UserIcon,
  Phone,
  MessageSquare,
  Calendar,
  AlertCircle,
  X,
  ChevronDown,
  Loader2,
  Inbox
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [selectedContact, setSelectedContact] = useState(null);

  const fetchContacts = async () => {
    try {
      const { data } = await api.get('/contacts');
      setContacts(data);
    } catch (error) {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/contacts/${id}/read`);
      toast.success('Marked as read');
      fetchContacts();
      if (selectedContact?._id === id) setSelectedContact({...selectedContact, read: true});
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await api.delete(`/contacts/${id}`);
      toast.success('Inquiry removed');
      fetchContacts();
      if (selectedContact?._id === id) setSelectedContact(null);
    } catch (error) {
      toast.error('Deletion failed');
    }
  };

  const filteredContacts = contacts.filter(c => {
    if (filter === 'unread') return !c.read;
    if (filter === 'read') return c.read;
    return true;
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-2">
            Client <span className="text-amber-500">Inquiries</span>
          </h1>
          <p className="text-gray-400 text-sm">Review lead submissions, event details, and manage follow-ups.</p>
        </div>

        <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl">
            {['all', 'unread', 'read'].map((f) => (
                <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-6 py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all ${filter === f ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-gray-500 hover:text-white'}`}
                >
                    {f}
                </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Inquiry List */}
        <section className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Latest Submissions</span>
                <span className="text-[10px] text-amber-500/60 font-mono italic">{filteredContacts.length} results</span>
            </div>
            
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                {filteredContacts.map((c) => (
                    <motion.div
                        key={c._id}
                        onClick={() => setSelectedContact(c)}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 group ${selectedContact?._id === c._id ? 'bg-amber-500/10 border-amber-500/50' : 'bg-white/[0.02] border-white/5 hover:bg-white/5'}`}
                    >
                        <div className="flex items-start justify-between mb-2">
                            <h3 className={`text-sm font-bold truncate pr-4 ${selectedContact?._id === c._id ? 'text-amber-500' : (c.read ? 'text-gray-400' : 'text-white')}`}>
                                {c.name}
                            </h3>
                            {!c.read && (
                                <div className="w-2 h-2 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50 shrink-0 mt-1" />
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest truncate">{c.eventType}</span>
                            <span className="text-[9px] text-gray-600 font-mono">
                                {new Date(c.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
                        </div>
                    </motion.div>
                ))}

                {filteredContacts.length === 0 && (
                    <div className="py-20 text-center flex flex-col items-center gap-4 bg-white/[0.02] rounded-3xl border border-dashed border-white/5">
                        <Inbox className="w-10 h-10 text-white/5" />
                        <p className="text-gray-600 text-[10px] uppercase tracking-widest font-bold">No {filter} items found</p>
                    </div>
                )}
            </div>
        </section>

        {/* Detail View */}
        <section className="lg:col-span-8">
            <AnimatePresence mode="wait">
                {selectedContact ? (
                    <motion.div
                        key={selectedContact._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="glass-card rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden flex flex-col min-h-[500px]"
                    >
                        {/* Detail Header */}
                        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-amber-500/5 to-transparent">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-black text-2xl font-bold shadow-xl shadow-amber-500/20">
                                    {selectedContact.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-playfair font-bold text-white mb-1">{selectedContact.name}</h2>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[9px] uppercase tracking-[0.2em] font-bold px-2 py-0.5 rounded ${selectedContact.read ? 'text-gray-500 bg-white/5' : 'text-amber-500 bg-amber-500/10'}`}>
                                            {selectedContact.read ? 'Review Completed' : 'Pending Review'}
                                        </span>
                                        <span className="text-white/20 text-xs">|</span>
                                        <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1.5">
                                            <Calendar className="w-3 h-3 text-amber-500/50" />
                                            {new Date(selectedContact.createdAt).toLocaleString([], { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                                {!selectedContact.read && (
                                    <button 
                                        onClick={() => handleMarkAsRead(selectedContact._id)}
                                        className="h-12 px-6 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-[11px] uppercase tracking-widest font-bold flex items-center gap-2"
                                    >
                                        <CheckCircle2 className="w-4 h-4" /> Mark Read
                                    </button>
                                )}
                                <button 
                                    onClick={() => handleDelete(selectedContact._id)}
                                    className="h-12 px-5 rounded-xl bg-red-500/10 text-red-500/60 hover:text-red-500 hover:bg-red-500 transition-all group"
                                >
                                    <Trash2 className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* Detail Content */}
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold border-l-2 border-amber-500/30 pl-3">Contact Details</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm text-white group">
                                            <Mail className="w-4 h-4 text-amber-500/50 group-hover:text-amber-500 transition-colors" />
                                            <span className="font-medium">{selectedContact.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-white group">
                                            <Phone className="w-4 h-4 text-amber-500/50 group-hover:text-amber-500 transition-colors" />
                                            <span className="font-medium">{selectedContact.phone || 'Not provided'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold border-l-2 border-amber-500/30 pl-3">Event Overview</h4>
                                    <div className="p-4 rounded-xl bg-black/40 border border-white/5 shadow-inner">
                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 font-semibold">Requirement</div>
                                        <div className="text-amber-500 font-playfair text-xl font-bold">{selectedContact.eventType}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 flex flex-col">
                                <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold border-l-2 border-amber-500/30 pl-3">Client Message</h4>
                                <div className="flex-1 p-6 rounded-2xl bg-white/[0.03] border border-white/5 relative">
                                    <MessageSquare className="absolute top-4 right-4 w-10 h-10 text-white/[0.02] pointer-events-none" />
                                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap italic">
                                        "{selectedContact.message}"
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Status Footer */}
                        <div className="mt-auto p-4 bg-black/40 border-t border-white/5 flex items-center justify-center gap-2">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-500/40" />
                            <span className="text-[9px] text-gray-600 uppercase tracking-widest font-bold">Inquiry ID: {selectedContact._id.toUpperCase()}</span>
                        </div>
                    </motion.div>
                ) : (
                    <div className="glass-card rounded-3xl border border-dashed border-white/10 h-[500px] flex flex-col items-center justify-center text-center p-10 opacity-50">
                        <div className="w-20 h-20 rounded-full border border-white/5 flex items-center justify-center mb-6">
                            <Search className="w-10 h-10 text-gray-800" />
                        </div>
                        <h4 className="text-2xl font-playfair font-bold text-white mb-2">Select an Inquiry</h4>
                        <p className="text-gray-500 text-sm max-w-xs uppercase tracking-widest leading-loose">Choose a lead from the list to view full communication details</p>
                    </div>
                )}
            </AnimatePresence>
        </section>

      </div>
    </div>
  );
};

export default Contacts;
