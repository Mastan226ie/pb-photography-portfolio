import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Upload, 
  Trash2, 
  Plus, 
  Image as ImageIcon,
  Save,
  Loader2,
  AlertCircle,
  X,
  Star
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AlbumDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', coverImage: '' });

  const fetchAlbum = async () => {
    try {
      const { data } = await api.get(`/albums/${id}`);
      setAlbum(data);
      setForm({ title: data.title, description: data.description, coverImage: data.coverImage });
    } catch (error) {
      toast.error('Album not found');
      navigate('/admin/albums');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbum();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/albums/${id}`, form);
      toast.success('Album details updated');
      setEditing(false);
      fetchAlbum();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      await api.post(`/albums/${id}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Photo uploaded!');
      fetchAlbum();
    } catch (error) {
      toast.error('Upload failed. Images only (jpg, png, webp).');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoUrl) => {
    // Current logic: remove from list and update album. 
    // In a full system, you'd delete the actual file from server.
    const updatedPhotos = album.photos.filter(p => p !== photoUrl);
    try {
      await api.put(`/albums/${id}`, { photos: updatedPhotos });
      toast.success('Photo removed');
      fetchAlbum();
    } catch (error) {
      toast.error('Failed to remove photo');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* ── Header Area ────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <Link to="/admin/albums" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-500 hover:text-amber-500 transition-colors font-bold group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Albums
          </Link>
          <h1 className="text-3xl md:text-5xl font-playfair font-bold text-white uppercase tracking-tight">
            {editing ? 'Editing' : ''} <span className="text-amber-500">{album.title}</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
            <button 
                onClick={() => setEditing(!editing)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${editing ? 'bg-white/10 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
            >
                {editing ? <><X className="w-4 h-4" /> Cancel</> : <><Save className="w-4 h-4" /> Edit Details</>}
            </button>
            <label className="cursor-pointer bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center gap-3 transition-all shadow-xl shadow-amber-500/20">
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                {uploading ? 'Processing...' : 'Upload Photo'}
                <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* ── Left Sidebar: Details ─────────────── */}
        <aside className="lg:col-span-1 space-y-8">
            <div className={`glass-card rounded-2xl p-8 border transition-all duration-500 ${editing ? 'border-amber-500/30' : 'border-white/5'}`}>
                {editing ? (
                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Album Title</label>
                           <input 
                             value={form.title} 
                             onChange={e => setForm({...form, title: e.target.value})}
                             className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none transition-colors"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Description</label>
                           <textarea 
                             value={form.description} 
                             onChange={e => setForm({...form, description: e.target.value})}
                             className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none transition-colors h-32 resize-none"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Cover Image URL</label>
                           <input 
                             value={form.coverImage} 
                             onChange={e => setForm({...form, coverImage: e.target.value})}
                             className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none transition-colors"
                           />
                        </div>
                        <button type="submit" className="w-full bg-amber-500 text-black py-4 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-amber-500/10">
                            Save Changes
                        </button>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <div className="relative rounded-xl overflow-hidden aspect-[4/5] border border-white/10">
                            <img src={album.coverImage} className="w-full h-full object-cover" alt="Cover" />
                            <div className="absolute top-4 left-4 bg-amber-500 text-black px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                                <Star className="w-2.5 h-2.5 fill-black" /> Cover Photo
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-amber-500 font-bold mb-3">Narrative</p>
                            <p className="text-gray-400 text-sm leading-relaxed italic">"{album.description}"</p>
                        </div>
                        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">In Collection</span>
                            <span className="text-white font-mono text-xs">{album.photos?.length || 0} Files</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Info Card */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-amber-500/40 shrink-0 mt-0.5" />
                <p className="text-gray-500 text-[11px] leading-relaxed">
                    Changes made here reflect immediately on the world-facing portfolio. Deleting photos is permanent.
                </p>
            </div>
        </aside>

        {/* ── Main Area: Photo Gallery ────────── */}
        <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-playfair font-bold text-white flex items-center gap-3">
                    <ImageIcon className="w-5 h-5 text-amber-500" />
                    Gallery <span className="text-xs text-gray-500 font-mono">({album.photos?.length || 0})</span>
                </h3>
            </div>

            {album.photos?.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {album.photos.map((photo, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.03 }}
                                className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 bg-white/[0.02] hover:border-amber-500/30 transition-all duration-500"
                            >
                                <img src={photo} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={`Album ${index}`} />
                                <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-500" />
                                
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-[-10px] group-hover:translate-y-0">
                                    <button 
                                        onClick={() => handleDeletePhoto(photo)}
                                        className="p-2.5 rounded-xl bg-red-500 text-white shadow-xl hover:bg-black transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-[10px] group-hover:translate-y-0">
                                    <p className="text-[9px] text-amber-500 uppercase tracking-widest font-bold">Image {index + 1}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Upload Placeholder Tile */}
                    <label className="cursor-pointer aspect-[3/4] rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3 text-gray-500 hover:text-amber-500 hover:border-amber-500 hover:bg-amber-500/5 transition-all">
                        <Plus className="w-8 h-8" />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Add Photo</span>
                        <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
                    </label>
                </div>
            ) : (
                <div className="py-24 glass-card rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                        <ImageIcon className="w-10 h-10 text-gray-700" />
                    </div>
                    <h4 className="text-xl font-playfair font-bold text-white mb-2">Empty Gallery</h4>
                    <p className="text-gray-500 text-sm max-w-xs mb-8">This album doesn't have any story photos yet. Start by uploading some.</p>
                    <label className="cursor-pointer bg-white text-black px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-amber-500 transition-all outline-none">
                        Initial Upload
                        <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
                    </label>
                </div>
            )}
        </section>

      </div>
    </div>
  );
};

export default AlbumDetail;
