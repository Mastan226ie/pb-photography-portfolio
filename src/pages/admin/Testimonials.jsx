import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  Star,
  User as UserIcon,
  CheckCircle2,
  Calendar,
  X,
  PlusCircle,
  Loader2
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    name: '',
    role: '',
    content: '',
    rating: 5,
    date: '',
    visible: true,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
  });

  const fetchTestimonials = async () => {
    try {
      const { data } = await api.get('/testimonials/all');
      setTestimonials(data);
    } catch (error) {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form._id) {
        await api.put(`/testimonials/${form._id}`, form);
        toast.success('Testimonial updated');
      } else {
        await api.post('/testimonials', form);
        toast.success('Testimonial added');
      }
      setIsAdding(false);
      setForm({ name: '', role: '', content: '', rating: 5, date: '', visible: true, image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop' });
      fetchTestimonials();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const toggleVisibility = async (id, current) => {
    try {
      await api.put(`/testimonials/${id}`, { visible: !current });
      toast.success(`Testimonial ${!current ? 'visible' : 'hidden'}`);
      fetchTestimonials();
    } catch (error) {
      toast.error('Failed to toggle visibility');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    try {
      await api.delete(`/testimonials/${id}`);
      toast.success('Testimonial removed');
      fetchTestimonials();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (t) => {
    setForm(t);
    setIsAdding(true);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-2">
            Client <span className="text-amber-500">Kind Words</span>
          </h1>
          <p className="text-gray-400 text-sm">Manage feedback and prune reviews displayed in the public carousel.</p>
        </div>
        <button 
          onClick={() => {
            setForm({ name: '', role: '', content: '', rating: 5, date: '', visible: true, image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop' });
            setIsAdding(true);
          }}
          className="bg-amber-500 hover:bg-amber-400 text-black px-8 py-3.5 rounded-xl flex items-center gap-3 transition-all duration-300 shadow-xl shadow-amber-500/20 font-bold uppercase tracking-widest text-sm"
        >
          <PlusCircle className="w-5 h-5" />
          Add Feedback
        </button>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence>
          {testimonials.map((t, idx) => (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              className={`glass-card p-8 rounded-3xl border transition-all duration-500 flex flex-col ${t.visible ? 'border-white/5 bg-white/[0.02]' : 'border-red-500/20 bg-red-500/[0.02] grayscale-[0.5]'}`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full border border-white/10 overflow-hidden bg-black ring-2 ring-amber-500/20">
                        <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h3 className="text-lg font-playfair font-bold text-white leading-none mb-1">{t.name}</h3>
                        <p className="text-[10px] text-amber-500 uppercase tracking-widest">{t.role}</p>
                    </div>
                </div>
                {!t.visible && (
                    <div className="bg-red-500/10 border border-red-500/20 px-2 py-1 rounded text-[8px] uppercase tracking-widest text-red-400 font-bold">Hidden</div>
                )}
              </div>

              <div className="mb-6 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-700'}`} />
                ))}
              </div>

              <blockquote className="text-gray-400 text-sm leading-relaxed mb-8 flex-1 italic">
                "{t.content}"
              </blockquote>

              <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest">
                    <Calendar className="w-3.5 h-3.5" /> {t.date}
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => toggleVisibility(t._id, t.visible)}
                        className={`p-3 rounded-xl transition-all ${t.visible ? 'bg-white/5 text-gray-400 hover:text-white' : 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'}`}
                        title={t.visible ? 'Hide from public' : 'Show to public'}
                    >
                        {t.visible ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                    <button 
                        onClick={() => handleEdit(t)}
                        className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all"
                        title="Edit testimonial"
                    >
                        <Edit3 className="w-4.5 h-4.5" />
                    </button>
                    <button 
                        onClick={() => handleDelete(t._id)}
                        className="p-3 rounded-xl bg-red-400/5 text-red-400/50 hover:text-red-400 hover:bg-red-400/10 transition-all"
                        title="Delete testimonial"
                    >
                        <Trash2 className="w-4.5 h-4.5" />
                    </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl my-auto"
            >
              <h2 className="text-3xl font-playfair font-bold text-white mb-2">{form._id ? 'Edit' : 'Add'} <span className="text-amber-500">Testimonial</span></h2>
              <p className="text-gray-500 text-sm mb-8">Craft the perfect social proof for your platform.</p>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Client Name</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-amber-500 transition-colors" placeholder="Full Name" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Client Role/Type</label>
                  <input value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-amber-500 transition-colors" placeholder="e.g. Wedding Client" required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Feedback Content</label>
                  <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-amber-500 transition-colors h-32 resize-none" placeholder="What did they say about your work?" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Date Published</label>
                  <input value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-amber-500 transition-colors" placeholder="e.g. June 2025" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Rating (1-5)</label>
                  <select value={form.rating} onChange={e => setForm({...form, rating: parseInt(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-amber-500 transition-colors appearance-none">
                    {[1,2,3,4,5].map(v => <option key={v} value={v} className="bg-black text-white">{v} Stars</option>)}
                  </select>
                </div>

                <div className="md:col-span-2 flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-4 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest">Cancel</button>
                  <button type="submit" className="flex-[2] py-4 rounded-xl bg-amber-500 text-black font-bold uppercase tracking-widest text-xs hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20">
                    {form._id ? 'Update Testimonial' : 'Publish Testimonial'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Testimonials;
