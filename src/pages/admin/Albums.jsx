import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  ImageIcon, 
  Trash2, 
  Edit3, 
  ExternalLink,
  Loader2,
  FolderOpen,
  ArrowRight
} from 'lucide-react';
import api, { BASE_URL } from '../../api/axios';
import toast from 'react-hot-toast';

const Albums = () => {
    // Helper to get image URL
    const getImgUrl = (path) => {
        if (!path) return '';
        return path.startsWith('http') ? path : `${BASE_URL}${path}`;
    };
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newAlbum, setNewAlbum] = useState({ title: '', description: '', coverImage: '' });

  const fetchAlbums = async () => {
    try {
      const { data } = await api.get('/albums');
      setAlbums(data);
    } catch (error) {
      toast.error('Failed to load albums');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleAddAlbum = async (e) => {
    e.preventDefault();
    try {
      await api.post('/albums', newAlbum);
      toast.success('Album created successfully');
      setNewAlbum({ title: '', description: '', coverImage: '' });
      setIsAdding(false);
      fetchAlbums();
    } catch (error) {
      toast.error('Failed to create album');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this album?')) return;
    try {
      await api.delete(`/albums/${id}`);
      toast.success('Album deleted');
      fetchAlbums();
    } catch (error) {
      toast.error('Failed to delete album');
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    
    toast.loading('Uploading cover photo...', { id: 'cover-upload' });
    try {
      const { data } = await api.post(`/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setNewAlbum({...newAlbum, coverImage: data.url});
      toast.success('Cover photo uploaded!', { id: 'cover-upload' });
    } catch (error) {
      toast.error('Upload failed.', { id: 'cover-upload' });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
        <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">Initialising Gallery...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-2">
            Portfolio <span className="text-amber-500">Albums</span>
          </h1>
          <p className="text-gray-400 text-sm">Manage your collections, cover photos, and story descriptions.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-3.5 px-6 rounded-xl flex items-center gap-3 transition-all duration-300 shadow-xl shadow-amber-500/20 text-sm group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Create New Album
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {albums.map((album, idx) => (
            <motion.div
              key={album._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card rounded-2xl border border-white/5 bg-white/[0.02] group relative flex flex-col overflow-hidden transition-all duration-500 hover:border-amber-500/30"
            >
              {/* Cover Preview */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={getImgUrl(album.coverImage)} 
                  alt={album.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                
                {/* ID Badge */}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md border border-white/10 px-2 py-1 rounded-md text-[9px] font-mono text-gray-400">
                    ID: {album._id.slice(-6).toUpperCase()}
                </div>

                <Link 
                    to={`/admin/albums/${album._id}`}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
                >
                    <div className="bg-amber-500 text-black p-4 rounded-full shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-500">
                        <FolderOpen className="w-6 h-6" />
                    </div>
                </Link>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-playfair font-bold text-white mb-2 group-hover:text-amber-500 transition-colors uppercase tracking-tight">
                    {album.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-6 line-clamp-2 italic">
                  "{album.description}"
                </p>

                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-1">Items</span>
                            <span className="text-white text-sm font-bold flex items-center gap-1.5">
                                <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                                {album.photos?.length || 0}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Link 
                          to={`/admin/albums/${album._id}`}
                          className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
                          title="Edit Photos"
                        >
                            <Edit3 className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(album._id)}
                          className="p-2.5 rounded-xl bg-red-500/5 text-red-400/50 hover:text-red-400 hover:bg-red-400/10 transition-all border border-transparent hover:border-red-400/10"
                          title="Delete Album"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Modal Placeholder */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl"
            >
              <h2 className="text-3xl font-playfair font-bold text-white mb-2">Create <span className="text-amber-500">New Album</span></h2>
              <p className="text-gray-500 text-sm mb-8">Setup a new collection for your portfolio.</p>

              <form onSubmit={handleAddAlbum} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Album Title</label>
                  <input 
                    type="text" 
                    required
                    value={newAlbum.title}
                    onChange={(e) => setNewAlbum({...newAlbum, title: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-amber-500 transition-colors"
                    placeholder="e.g. Summer Weddings 2025"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Cover Image</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="url" 
                      required
                      value={newAlbum.coverImage}
                      onChange={(e) => setNewAlbum({...newAlbum, coverImage: e.target.value})}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-amber-500 transition-colors"
                      placeholder="Image URL"
                    />
                    <label className="bg-white/10 hover:bg-white/20 text-white px-4 py-3.5 rounded-xl cursor-pointer transition-colors text-sm font-bold flex items-center justify-center shrink-0 h-full">
                      <ImageIcon className="w-4 h-4 mr-2" /> Upload
                      <input type="file" className="hidden" onChange={handleCoverUpload} accept="image/*" />
                    </label>
                  </div>
                  {newAlbum.coverImage && (
                    <div className="mt-4 relative rounded-xl overflow-hidden aspect-[4/5] border border-white/10 w-32 h-40">
                      <img src={getImgUrl(newAlbum.coverImage)} className="w-full h-full object-cover" alt="Cover Preview" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Short Description</label>
                  <textarea 
                    required
                    value={newAlbum.description}
                    onChange={(e) => setNewAlbum({...newAlbum, description: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-amber-500 transition-colors h-24 resize-none"
                    placeholder="Tell the story of this collection..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 py-4 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-4 rounded-xl bg-amber-500 text-black font-bold uppercase tracking-widest text-sm hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20"
                  >
                    Confirm & Initialize
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

export default Albums;
